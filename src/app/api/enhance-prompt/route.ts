import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { prompt, brandKit } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    let systemInstruction = `You are an expert AI Prompt Engineer for visual campaign assets with text overlays. Your job is to take a simple user idea and turn it into a highly detailed, professional image generation prompt that will produce an image WITH text rendered on it. Focus on layout, text placement, typography, lighting, composition, aesthetics, and high-end commercial quality. The generated image should look like a ready-to-post social media asset. Output ONLY the new prompt text. IMPORTANT: Keep the SAME LANGUAGE as the user's input — if they write in Turkish, output in Turkish. If they write in Finnish, output in Finnish.`;

    if (brandKit) {
      systemInstruction += `\nInclude these brand guidelines subtly in the aesthetic:
      - Primary Color Hex: ${brandKit.primaryColor}
      - Brand Voice/Vibe: ${brandKit.brandVoice}`;
    }

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `Enhance this idea into a detailed image prompt: "${prompt}"` }] }],
      systemInstruction,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 250,
      }
    });

    const enhancedPrompt = result.response.text();

    return NextResponse.json({ enhancedPrompt });
  } catch (error: any) {
    console.error('Error enhancing prompt:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to enhance prompt' },
      { status: 500 }
    );
  }
}
