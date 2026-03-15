'use client';

import { MonitorPlay, Smartphone, Square } from 'lucide-react';

export type PlatformType = 'youtube' | 'instagram' | 'square';

interface PlatformSelectorProps {
  platform: PlatformType;
  setPlatform: (val: PlatformType) => void;
}

const platforms = [
  { id: 'youtube', name: 'YouTube', icon: MonitorPlay, ratio: '16:9', desc: 'Clickbait optimized' },
  { id: 'instagram', name: 'Story / Reel', icon: Smartphone, ratio: '9:16', desc: 'Vertical narrative' },
  { id: 'square', name: 'Square', icon: Square, ratio: '1:1', desc: 'Clean product post' },
] as const;

export default function PlatformSelector({ platform, setPlatform }: PlatformSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-300">Format & Platform</label>
      <div className="grid grid-cols-3 gap-3">
        {platforms.map((p) => {
          const Icon = p.icon;
          const isActive = platform === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setPlatform(p.id)}
              className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                isActive
                  ? 'bg-blue-600/10 border-blue-500/50 text-white shadow-[inset_0_0_15px_rgba(37,99,235,0.1)]'
                  : 'bg-black/40 border-white/5 text-gray-400 hover:bg-white/5 hover:text-gray-300'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : ''}`} />
              <div className="text-center">
                <div className="font-medium text-xs mb-0.5">{p.name}</div>
                <div className="text-[10px] opacity-60">{p.ratio}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
