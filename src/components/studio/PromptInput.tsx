'use client';

import { Sparkles, Wand2 } from 'lucide-react';
import { useState } from 'react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (val: string) => void;
  onEnhance: () => void;
  isEnhancing: boolean;
}

export default function PromptInput({ prompt, setPrompt, onEnhance, isEnhancing }: PromptInputProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          Campaign Idea
        </label>
        <button
          onClick={onEnhance}
          disabled={isEnhancing || !prompt.trim()}
          className="text-xs flex items-center gap-1.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-blue-300 hover:text-white px-3 py-1.5 rounded-full border border-blue-500/30 hover:border-blue-400 disabled:opacity-50 transition-all font-medium"
        >
          <Wand2 className={`w-3 h-3 ${isEnhancing ? 'animate-pulse' : ''}`} />
          {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
        </button>
      </div>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g. Summer sale for eco-friendly shoes..."
        className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-all"
      />
    </div>
  );
}
