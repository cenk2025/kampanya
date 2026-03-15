'use client';

import { Copy, ImageIcon } from 'lucide-react';

interface BatchSelectorProps {
  batchCount: number;
  setBatchCount: (val: number) => void;
}

export default function BatchSelector({ batchCount, setBatchCount }: BatchSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-300">Variations</label>
        <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">
          {batchCount} Credit{batchCount > 1 ? 's' : ''}
        </span>
      </div>
      <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
        {[1, 2, 4].map((num) => (
          <button
            key={num}
            onClick={() => setBatchCount(num)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
              batchCount === num
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            {num === 1 ? <ImageIcon className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}
