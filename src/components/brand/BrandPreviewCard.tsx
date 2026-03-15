'use client';

import { useState } from 'react';

type LayoutMode = 'youtube' | 'instagram' | 'square';

interface BrandPreviewCardProps {
  primaryColor: string;
  fontFamily: string;
  logoUrl: string | null;
  backgroundUrl: string;
  previewText: string;
  logoPosition: 'TL' | 'TR' | 'BL' | 'BR';
}

export default function BrandPreviewCard({
  primaryColor,
  fontFamily,
  logoUrl,
  backgroundUrl,
  previewText,
  logoPosition,
}: BrandPreviewCardProps) {
  const [layout, setLayout] = useState<LayoutMode>('instagram');

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Layout Toggles */}
        <div className="bg-black/50 border border-white/10 rounded-full p-1 flex mb-6">
          {(['youtube', 'instagram', 'square'] as LayoutMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setLayout(mode)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                layout === mode 
                  ? 'bg-white/10 text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* The Live Preview Card */}
        <div 
          className={`relative overflow-hidden rounded-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-all duration-500
            ${layout === 'youtube' ? 'aspect-video w-[320px]' : 
              layout === 'instagram' ? 'aspect-[9/16] w-[240px]' : 
              'aspect-square w-[280px]'}
          `}
          style={{ fontFamily }}
        >
          {/* Background Image */}
          <img 
            src={backgroundUrl} 
            alt="Preview Background" 
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Dynamic Color Gradient Overlay */}
          <div 
            className="absolute inset-0 opacity-60 mix-blend-multiply" 
            style={{ background: `linear-gradient(to bottom right, ${primaryColor}, transparent)` }} 
          />
          <div 
            className="absolute inset-0 opacity-40 mix-blend-overlay"
            style={{ backgroundColor: primaryColor }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Logo Placement */}
          {logoUrl && (
            <div className={`absolute w-12 h-12 transition-all duration-500 ${
              logoPosition === 'TL' ? 'top-4 left-4' :
              logoPosition === 'TR' ? 'top-4 right-4' :
              logoPosition === 'BL' ? 'bottom-4 left-4' :
              'bottom-4 right-4'
            }`}>
              <img src={logoUrl} alt="Brand Logo" className="w-full h-full object-contain filter drop-shadow-md" />
            </div>
          )}

          {/* Text Content */}
          <div className={`absolute w-full px-6 flex flex-col text-white transition-all duration-500 drop-shadow-lg ${
            layout === 'youtube' ? 'bottom-4 text-left' :
            layout === 'instagram' ? 'bottom-20 text-center' :
            'bottom-8 text-center'
          }`}>
            <h2 className="font-bold text-2xl leading-tight tracking-tight shadow-black/50" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              {previewText || 'Summer Sale'}
            </h2>
          </div>

          {/* Decorative Elements based on layout */}
          {layout === 'instagram' && (
            <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white/80 shrink-0" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
