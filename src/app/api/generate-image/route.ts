import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Helper: fetch image URL and convert to base64
async function fetchImageAsBase64(url: string): Promise<{ base64: string; mimeType: string } | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mimeType = res.headers.get('content-type') || 'image/png';
    return { base64, mimeType };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, platform, batchCount = 1, brandKit } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Determine dimensions and Gemini aspect ratio string
    let width = 1080;
    let height = 1080;
    let geminiAspectRatio = '1:1';
    let platformLabel = 'square social media post';
    if (platform === 'youtube') { 
      width = 1280; height = 720; 
      geminiAspectRatio = '16:9'; 
      platformLabel = 'YouTube thumbnail (landscape)'; 
    }
    if (platform === 'instagram') { 
      width = 1080; height = 1920; 
      geminiAspectRatio = '9:16'; 
      platformLabel = 'Instagram Story/Reel (portrait/vertical)'; 
    }

    // Fetch actual brand kit from DB if brand kit is enabled
    let brandInfo = '';
    let logoBase64: { base64: string; mimeType: string } | null = null;

    if (brandKit && brandKit.apply) {
      try {
        const { data: brandAsset } = await supabase
          .from('brand_assets')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (brandAsset) {
          brandInfo = `. Use ${brandAsset.primary_color} as the primary accent color, ${brandAsset.secondary_color} as secondary, and ${brandAsset.accent_color} as highlight color. Font style: ${brandAsset.font_family}. Brand voice: ${brandAsset.brand_voice}`;
          
          // Fetch logo if available
          if (brandAsset.logo_url) {
            logoBase64 = await fetchImageAsBase64(brandAsset.logo_url);
          }
        } else {
          brandInfo = `. Use ${brandKit.primaryColor} as accent color. Style: ${brandKit.brandVoice}`;
        }
      } catch {
        brandInfo = `. Use ${brandKit.primaryColor} as accent color. Style: ${brandKit.brandVoice}`;
      }
    }

    // Build final prompt
    let finalPrompt = `${prompt}${brandInfo}. This is a ${platformLabel}. High quality, professional social media post design. Sharp text rendering, modern typography, clean layout.`;
    
    // If we have a logo, instruct the AI to include it
    if (logoBase64) {
      finalPrompt += ` IMPORTANT: Include the provided brand logo in the design. Place the logo prominently but tastefully — typically at the top or bottom of the design. The logo should be clearly visible and well-integrated into the overall layout.`;
    }

    // Use gemini-2.5-flash-image with aspect ratio in generationConfig
    const imageModel = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash-image',
    });

    const images: { url: string }[] = [];

    for (let i = 0; i < batchCount; i++) {
      try {
        // Build content parts - text + optional logo image
        const parts: any[] = [{ text: finalPrompt }];
        
        if (logoBase64) {
          parts.push({
            inlineData: {
              mimeType: logoBase64.mimeType,
              data: logoBase64.base64,
            }
          });
        }

        const result = await imageModel.generateContent({
          contents: [{ role: 'user', parts }],
          generationConfig: {
            // @ts-ignore
            responseModalities: ['IMAGE', 'TEXT'],
            // @ts-ignore
            aspectRatio: geminiAspectRatio,
          } as any,
        });
        
        const response = result.response;
        let imageFound = false;

        for (const candidate of response.candidates || []) {
          for (const part of candidate.content?.parts || []) {
            if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
              const dataUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
              images.push({ url: dataUrl });
              imageFound = true;
              break;
            }
          }
          if (imageFound) break;
        }

        if (!imageFound) {
          console.log('No image in Gemini response, using placeholder.');
          images.push({
            url: `https://picsum.photos/seed/${Date.now() + i}/${width}/${height}`,
          });
        }
      } catch (genError: any) {
        console.error(`Generation ${i} error:`, genError.message || genError);
        images.push({
          url: `https://picsum.photos/seed/${Date.now() + i}/${width}/${height}`,
        });
      }
    }

    // Save to DB
    try {
      const insertData = images.map(img => ({
        user_id: user.id,
        prompt: finalPrompt,
        image_url: img.url.startsWith('data:') ? 'gemini-generated' : img.url,
        platform,
        width,
        height,
      }));
      await supabase.from('generations').insert(insertData);
    } catch (dbErr) {
      console.error('DB insert error:', dbErr);
    }

    return NextResponse.json({ success: true, images, finalPrompt });

  } catch (error: any) {
    console.error('Generation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}
