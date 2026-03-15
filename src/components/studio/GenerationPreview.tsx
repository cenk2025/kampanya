'use client';

import { Download, Edit3, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface GeneratedImage {
  id: string;
  url: string;
}

interface GenerationPreviewProps {
  images: GeneratedImage[];
  isGenerating: boolean;
  batchCount: number;
}

export default function GenerationPreview({ images, isGenerating, batchCount }: GenerationPreviewProps) {
  const router = useRouter();

  if (isGenerating) {
    return (
      <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center bg-black/40 rounded-2xl border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 animate-pulse" />
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-6" />
        <h3 className="text-xl font-medium text-white mb-2 relative z-10">AI is crafting your asset...</h3>
        <p className="text-sm text-gray-400 max-w-xs text-center relative z-10">
          Generating image with text overlay, composing the perfect shot.
        </p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center bg-black/40 rounded-2xl border border-white/5 border-dashed">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <ImageIcon className="w-8 h-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-300 mb-2">Ready to generate</h3>
        <p className="text-sm text-gray-500 max-w-xs text-center">
          Configure your campaign idea on the left and click Generate to see the magic happen.
        </p>
      </div>
    );
  }

  return (
    <div className={`w-full h-full grid gap-4 ${images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} auto-rows-fr`}>
      {images.map((img, i) => (
        <div key={i} className="relative group rounded-2xl overflow-hidden bg-black/40 border border-white/5 aspect-auto flex flex-col">
          {/* The AI-generated image with text baked in */}
          <img 
            src={img.url} 
            alt={`Generation ${i + 1}`} 
            className="w-full h-full object-contain bg-black"
          />

          {/* Hover Actions */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 z-20">
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => {
                  // Store the image in sessionStorage so the editor can access it
                  sessionStorage.setItem(`editor-image-${img.id}`, img.url);
                  router.push(`/editor/${img.id}`);
                }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg"
              >
                <Edit3 className="w-4 h-4" />
                Open Editor
              </button>
              <button 
                onClick={() => {
                   const link = document.createElement('a');
                   link.href = img.url;
                   link.download = `Voon-Gen-${img.id}.png`;
                   document.body.appendChild(link);
                   link.click();
                   document.body.removeChild(link);
                }}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-md transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
