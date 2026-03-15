'use client';

import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react';

export type TextPlacement = 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

interface TextPlacementGridProps {
  placement: TextPlacement;
  setPlacement: (val: TextPlacement) => void;
}

const positions: { id: TextPlacement, label: string }[] = [
  { id: 'top-left', label: 'TL' },
  { id: 'top-center', label: 'TC' },
  { id: 'top-right', label: 'TR' },
  { id: 'center-left', label: 'CL' },
  { id: 'center', label: 'C' },
  { id: 'center-right', label: 'CR' },
  { id: 'bottom-left', label: 'BL' },
  { id: 'bottom-center', label: 'BC' },
  { id: 'bottom-right', label: 'BR' },
];

export default function TextPlacementGrid({ placement, setPlacement }: TextPlacementGridProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-300 flex justify-between items-center">
        <span>Text Overlay Position</span>
        <div className="flex gap-2 text-gray-500">
          <AlignLeft className="w-3.5 h-3.5" />
          <AlignCenter className="w-3.5 h-3.5" />
          <AlignRight className="w-3.5 h-3.5" />
        </div>
      </label>
      
      <div className="aspect-video bg-black/40 rounded-xl border border-white/5 p-2 grid grid-cols-3 grid-rows-3 gap-2">
        {positions.map((pos) => {
          const isActive = placement === pos.id;
          return (
            <button
              key={pos.id}
              onClick={() => setPlacement(pos.id)}
              className={`rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)] text-white'
                  : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-gray-600'}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
