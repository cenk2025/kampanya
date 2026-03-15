'use client';

import { useState } from 'react';
import { Palette, Play } from 'lucide-react';
import PromptInput from '@/components/studio/PromptInput';
import PlatformSelector, { PlatformType } from '@/components/studio/PlatformSelector';
import BatchSelector from '@/components/studio/BatchSelector';
import TextPlacementGrid, { TextPlacement } from '@/components/studio/TextPlacementGrid';
import GenerationPreview, { GeneratedImage } from '@/components/studio/GenerationPreview';

export default function CreatePage() {
  const [prompt, setPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [platform, setPlatform] = useState<PlatformType>('instagram');
  const [batchCount, setBatchCount] = useState(1);
  const [textPlacement, setTextPlacement] = useState<TextPlacement>('center');
  const [applyBrandKit, setApplyBrandKit] = useState(true);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

  const handleEnhance = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, platform, brandKit: applyBrandKit ? { primaryColor: '#2563eb', brandVoice: 'Modern, professional' } : undefined }),
      });
      const data = await res.json();
      if (data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
      } else if (data.error) {
        alert('Enhance failed: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Could not reach the enhance API.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedImages([]);
    
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          platform,
          batchCount,
          brandKit: applyBrandKit ? { apply: true, primaryColor: '#2563eb', brandVoice: 'Modern, professional' } : undefined,
        }),
      });
      const data = await res.json();

      if (data.success && data.images) {
        const newImages: GeneratedImage[] = data.images.map((img: any, i: number) => ({
          id: `gen-${Date.now()}-${i}`,
          url: img.url,
        }));
        setGeneratedImages(newImages);
      } else if (data.error) {
        alert('Generation failed: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Could not reach the generate API.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] gap-6">
      {/* Left Config Panel */}
      <div className="w-full lg:w-[400px] shrink-0 glass-panel flex flex-col h-full overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center gap-3 bg-white/[0.02]">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Palette className="w-4 h-4" />
          </div>
          <h2 className="font-bold text-white text-lg">Campaign Setup</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          <PromptInput 
            prompt={prompt} 
            setPrompt={setPrompt} 
            onEnhance={handleEnhance} 
            isEnhancing={isEnhancing} 
          />
          
          <div className="w-full h-px bg-white/5" />
          
          <PlatformSelector platform={platform} setPlatform={setPlatform} />
          
          <div className="w-full h-px bg-white/5" />
          
          <div className="grid grid-cols-2 gap-6">
            <BatchSelector batchCount={batchCount} setBatchCount={setBatchCount} />
            <TextPlacementGrid placement={textPlacement} setPlacement={setTextPlacement} />
          </div>

          <div className="w-full h-px bg-white/5" />

          {/* Brand Kit Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <div>
              <div className="font-medium text-white text-sm">Apply Brand Kit</div>
              <div className="text-xs text-orange-200/60 mt-0.5">Inject colors & logo</div>
            </div>
            <button 
              onClick={() => setApplyBrandKit(!applyBrandKit)}
              className={`w-11 h-6 rounded-full transition-colors relative ${applyBrandKit ? 'bg-orange-500' : 'bg-gray-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${applyBrandKit ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 border-t border-white/5 bg-black/20">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] disabled:shadow-none"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Generating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Play className="w-4 h-4 fill-white" />
                Generate Assets
              </span>
            )}
          </button>
          <div className="text-center mt-3 text-xs text-gray-500">
            Costs {batchCount} credit{batchCount > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Right Preview Panel */}
      <div className="flex-1 h-full min-h-[500px]">
        <GenerationPreview 
          images={generatedImages} 
          isGenerating={isGenerating} 
          batchCount={batchCount}
        />
      </div>
    </div>
  );
}
