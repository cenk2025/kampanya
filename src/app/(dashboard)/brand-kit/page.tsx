'use client';

import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Palette, Upload, Type, Image as ImageIcon, Save, Check } from 'lucide-react';
import BrandPreviewCard from '@/components/brand/BrandPreviewCard';

export default function BrandKitPage() {
  const [primaryColor, setPrimaryColor] = useState('#2563eb');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [brandVoice, setBrandVoice] = useState('Modern, tech-focused, professional');
  const [previewText, setPreviewText] = useState('Level up your campaigns');
  
  const [logoPosition, setLogoPosition] = useState<'TL' | 'TR' | 'BL' | 'BR'>('BL');
  const [bgImage, setBgImage] = useState('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80');

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const backgrounds = [
    { id: 'office', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80' },
    { id: 'tech', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80' },
    { id: 'abstract', url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&q=80' },
    { id: 'gradient', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80' },
  ];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create local preview URL
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call to save to Supabase
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-8 pb-10">
      
      {/* Left Settings Panel */}
      <div className="flex-1 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
            <Palette className="w-8 h-8 text-orange-500" />
            Brand Kit
          </h1>
          <p className="text-gray-400">Define your visual identity. We'll automatically apply these parameters to every generated asset.</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl relative">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">1</div>
            Brand Colors
          </h3>
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="shrink-0">
              <HexColorPicker color={primaryColor} onChange={setPrimaryColor} />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Primary Color Hex</label>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg shadow-inner border border-white/10" style={{ backgroundColor: primaryColor }} />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white font-mono uppercase w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500">
                This color will be used for subtle atmospheric lighting, gradient overlays, and button accents in generated images.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs">2</div>
              Logo Assets
            </h3>
            
            <div className="border-2 border-dashed border-white/10 hover:border-blue-500/50 rounded-xl p-6 text-center transition-colors relative group">
              <input 
                type="file" 
                accept="image/png, image/svg+xml" 
                onChange={handleLogoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {logoUrl ? (
                <div className="flex flex-col items-center">
                  <img src={logoUrl} alt="Logo Preview" className="h-16 object-contain mb-3" />
                  <span className="text-sm text-blue-400 group-hover:underline">Click to change logo</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3">
                    <Upload className="w-5 h-5 text-gray-400" />
                  </div>
                  <span className="text-white font-medium mb-1">Upload Primary Logo</span>
                  <span className="text-xs text-gray-500">PNG or SVG, transparent background</span>
                </div>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">Default Logo Placement</label>
              <div className="flex gap-2">
                {(['TL', 'TR', 'BL', 'BR'] as const).map(pos => (
                  <button
                    key={pos}
                    onClick={() => setLogoPosition(pos)}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors border ${
                      logoPosition === pos 
                        ? 'bg-blue-600/20 text-blue-300 border-blue-500/50' 
                        : 'bg-black/40 text-gray-500 border-white/5 hover:bg-white/5'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs">3</div>
              Typography & Voice
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Type className="w-4 h-4" /> Brand Font
                </label>
                <select 
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="Inter">Inter (Default)</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Playfair Display">Playfair Display</option>
                  <option value="Montserrat">Montserrat</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Brand Voice / Identity</label>
                <textarea 
                  value={brandVoice}
                  onChange={(e) => setBrandVoice(e.target.value)}
                  placeholder="e.g. Minimalist, luxury, clean..."
                  className="w-full h-24 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Preview Panel */}
      <div className="w-full lg:w-[400px] shrink-0 sticky top-8">
        <div className="glass-panel p-6 rounded-2xl flex flex-col h-[calc(100vh-8rem)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-white text-lg flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-gray-400" />
              Live Preview
            </h2>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                saved 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-white text-black hover:bg-gray-200 shadow-md transform hover:scale-105 active:scale-95'
              }`}
            >
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? 'Saved' : saving ? 'Saving...' : 'Save Kit'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide -mx-6 px-6">
            <BrandPreviewCard 
              primaryColor={primaryColor}
              fontFamily={fontFamily}
              logoUrl={logoUrl}
              backgroundUrl={bgImage}
              previewText={previewText}
              logoPosition={logoPosition}
            />
          </div>

          <div className="pt-6 border-t border-white/5 mt-auto">
            <label className="block text-xs font-medium text-gray-400 mb-3">Test Background Image</label>
            <div className="grid grid-cols-4 gap-2">
              {backgrounds.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setBgImage(bg.url)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    bgImage === bg.url ? 'border-primary scale-110 shadow-lg relative z-10' : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={bg.url} alt="bg" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
