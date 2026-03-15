'use client';

import { useEffect, useRef, useState } from 'react';
import { Download, Undo, ArrowLeft, Image as ImageIcon, Move, Type as TypeIcon, Palette } from 'lucide-react';
import Link from 'next/link';

interface EditorWorkspaceProps {
  id: string;
}

export default function EditorWorkspace({ id }: EditorWorkspaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<any>(null);
  const fabricModuleRef = useRef<any>(null);

  const [activeObject, setActiveObject] = useState<any>(null);
  const [fontFamily, setFontFamily] = useState('Inter');
  const [fillColor, setFillColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(48);
  const [isExporting, setIsExporting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [canvasError, setCanvasError] = useState('');

  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    let disposed = false;

    import('fabric').then((fabricModule) => {
      if (disposed || !canvasRef.current) return;

      const { fabric } = fabricModule;
      fabricModuleRef.current = fabric;

      // Get the generated image from sessionStorage
      const storedImageUrl = sessionStorage.getItem(`editor-image-${id}`);
      const isDataUrl = storedImageUrl?.startsWith('data:');

      const initCanvas = (w: number, h: number) => {
        if (disposed || !canvasRef.current) return;

        const maxWidth = 850;
        const maxHeight = 700;
        const scale = Math.min(maxWidth / w, maxHeight / h, 1);
        const canvasWidth = Math.round(w * scale);
        const canvasHeight = Math.round(h * scale);

        const canvas = new fabric.Canvas(canvasRef.current!, {
          width: canvasWidth,
          height: canvasHeight,
          backgroundColor: '#1a1a1a',
          preserveObjectStacking: true,
        });

        fabricRef.current = canvas;
        setIsReady(true);

        // Selection listeners
        canvas.on('selection:created', (e: any) => setActiveObject(e.selected?.[0] || null));
        canvas.on('selection:updated', (e: any) => setActiveObject(e.selected?.[0] || null));
        canvas.on('selection:cleared', () => setActiveObject(null));

        return { canvas, canvasWidth, canvasHeight };
      };

      if (storedImageUrl) {
        if (isDataUrl) {
          // For data URLs: use Image() without crossOrigin
          const tempImg = new window.Image();
          tempImg.onload = () => {
            if (disposed) return;
            const result = initCanvas(tempImg.naturalWidth, tempImg.naturalHeight);
            if (!result) return;
            const { canvas, canvasWidth, canvasHeight } = result;

            // Create fabric image from the already-loaded img element
            const fabricImg = new fabric.Image(tempImg, {
              originX: 'left',
              originY: 'top',
              left: 0,
              top: 0,
              scaleX: canvasWidth / tempImg.naturalWidth,
              scaleY: canvasHeight / tempImg.naturalHeight,
              selectable: false,
              evented: false,
            });
            canvas.add(fabricImg);
            canvas.sendToBack(fabricImg);
            canvas.renderAll();
          };
          tempImg.onerror = () => {
            if (disposed) return;
            setCanvasError('Could not load image.');
            initCanvas(800, 600);
          };
          tempImg.src = storedImageUrl;
        } else {
          // For regular URLs: use fabric.Image.fromURL with crossOrigin
          const tempImg = new window.Image();
          tempImg.crossOrigin = 'anonymous';
          tempImg.onload = () => {
            if (disposed) return;
            const result = initCanvas(tempImg.naturalWidth, tempImg.naturalHeight);
            if (!result) return;
            const { canvas, canvasWidth, canvasHeight } = result;

            fabric.Image.fromURL(storedImageUrl, (img: any) => {
              if (disposed) return;
              img.set({
                originX: 'left',
                originY: 'top',
                left: 0,
                top: 0,
                scaleX: canvasWidth / img.width,
                scaleY: canvasHeight / img.height,
                selectable: false,
                evented: false,
              });
              canvas.add(img);
              canvas.sendToBack(img);
              canvas.renderAll();
            }, { crossOrigin: 'anonymous' });
          };
          tempImg.onerror = () => {
            if (disposed) return;
            setCanvasError('Could not load image.');
            initCanvas(800, 600);
          };
          tempImg.src = storedImageUrl;
        }
      } else {
        // No image in session — create empty canvas
        initCanvas(800, 600);
        setCanvasError('No generated image found. Use The Studio to generate an image first.');
      }
    });

    return () => {
      disposed = true;
      if (fabricRef.current) {
        fabricRef.current.dispose();
        fabricRef.current = null;
      }
    };
  }, [id]);

  useEffect(() => {
    if (!activeObject || activeObject.type !== 'i-text') return;
    setFontFamily(activeObject.fontFamily || 'Inter');
    setFillColor(activeObject.fill || '#ffffff');
    setFontSize(activeObject.fontSize || 48);
  }, [activeObject]);

  const handleAddText = () => {
    const canvas = fabricRef.current;
    const fabric = fabricModuleRef.current;
    if (!canvas || !fabric) return;
    const text = new fabric.IText('Double Click to Edit', {
      fontFamily: 'Inter',
      fontSize: 48,
      fill: '#ffffff',
      left: 100,
      top: 100,
      shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.6)', blur: 6, offsetX: 0, offsetY: 2 }),
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const handleReAddLogo = async () => {
    const canvas = fabricRef.current;
    const fabric = fabricModuleRef.current;
    if (!canvas || !fabric) return;

    try {
      // Fetch the user's brand logo from Supabase
      const res = await fetch('/api/brand-logo');
      const data = await res.json();
      
      if (!data.logoUrl) {
        alert('Brand Kit\'te logo bulunamadı. Önce Brand Kit sayfasından logo yükleyin.');
        return;
      }

      fabric.Image.fromURL(data.logoUrl, (img: any) => {
        img.scaleToWidth(150);
        img.set({ left: 50, top: 50 });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      }, { crossOrigin: 'anonymous' });
    } catch (err) {
      console.error('Logo fetch error:', err);
      alert('Logo yüklenirken hata oluştu.');
    }
  };

  const handlePropertyChange = (property: string, value: any) => {
    const canvas = fabricRef.current;
    if (!canvas || !activeObject) return;
    activeObject.set(property, value);
    canvas.renderAll();
  };

  const handleExport = async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    setIsExporting(true);
    try {
      canvas.discardActiveObject();
      canvas.renderAll();
      const dataURL = canvas.toDataURL({ format: 'png', quality: 1, multiplier: 2 });
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `Voon-Edited-${id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex bg-black h-[100vh] w-full overflow-hidden absolute inset-0 z-50">
      {/* Left Toolbar */}
      <div className="w-16 flex flex-col items-center py-6 border-r border-white/10 glass-panel border-y-0 border-l-0 rounded-none z-10">
        <Link href="/history" className="mb-8 w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="Back to Library">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="space-y-4 flex flex-col w-full px-2">
          <button onClick={handleAddText} disabled={!isReady} title="Add Text" className="w-12 h-12 flex flex-col items-center justify-center gap-1 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            <TypeIcon className="w-5 h-5" />
            <span className="text-[9px]">Text</span>
          </button>
          <button onClick={handleReAddLogo} disabled={!isReady} title="Re-add Logo" className="w-12 h-12 flex flex-col items-center justify-center gap-1 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            <ImageIcon className="w-5 h-5" />
            <span className="text-[9px]">Logo</span>
          </button>
          <button title="Image Filters (Pro)" className="w-12 h-12 flex flex-col items-center justify-center gap-1 rounded-xl text-gray-600 cursor-not-allowed transition-colors">
            <Palette className="w-5 h-5" />
            <span className="text-[9px]">FX</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col relative bg-[#111]">
        {/* Top Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-black/40 backdrop-blur-md absolute top-0 w-full z-10">
          <div className="text-white font-medium flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold tracking-wider uppercase">
              Editing
            </span>
            Campaign Asset #{id.slice(0, 6)}
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium">
              <Undo className="w-4 h-4" /> Undo
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting || !isReady}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Exporting...' : 'Export High-Res'}
            </button>
          </div>
        </div>

        {/* Canvas Wrapper */}
        <div className="flex-1 overflow-auto flex items-center justify-center pt-16">
          {canvasError && !isReady && (
            <div className="text-center text-red-400 text-sm">{canvasError}</div>
          )}
          <div className="shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 rounded-lg overflow-hidden relative">
            <canvas ref={canvasRef} />
          </div>
        </div>
      </div>

      {/* Right Toolbar - Properties */}
      <div className="w-64 glass-panel border-y-0 border-r-0 rounded-none z-10 flex flex-col">
        <div className="h-16 border-b border-white/10 flex items-center px-6">
          <h3 className="font-bold text-white tracking-tight">Properties</h3>
        </div>

        <div className="flex-1 p-6 overflow-y-auto w-full">
          {!activeObject ? (
            <div className="text-center text-gray-500 text-sm mt-10">
              <Move className="w-8 h-8 mx-auto mb-3 opacity-20" />
              {isReady 
                ? 'Select an object on the canvas to edit its properties.'
                : 'Loading canvas...'}
            </div>
          ) : (
            <div className="space-y-6 w-full">
              {activeObject.type === 'i-text' && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Font Family</label>
                    <select
                      value={fontFamily}
                      onChange={(e) => {
                        setFontFamily(e.target.value);
                        handlePropertyChange('fontFamily', e.target.value);
                      }}
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Playfair Display">Playfair Display</option>
                      <option value="Montserrat">Montserrat</option>
                      <option value="Arial">Arial</option>
                      <option value="Georgia">Georgia</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Size & Color</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={fontSize}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setFontSize(val);
                          handlePropertyChange('fontSize', val);
                        }}
                        className="w-20 bg-black border border-white/10 rounded-lg px-2 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-center"
                      />
                      <input
                        type="color"
                        value={fillColor}
                        onChange={(e) => {
                          setFillColor(e.target.value);
                          handlePropertyChange('fill', e.target.value);
                        }}
                        className="flex-1 h-10 rounded-lg cursor-pointer bg-black border border-white/10 p-0.5"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Depth (Layering)</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { fabricRef.current?.bringForward(activeObject); fabricRef.current?.renderAll(); }}
                    className="flex justify-center items-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg py-2 transition-colors text-xs font-medium"
                  >
                    Bring Forward
                  </button>
                  <button
                    onClick={() => { fabricRef.current?.sendBackwards(activeObject); fabricRef.current?.renderAll(); }}
                    className="flex justify-center items-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg py-2 transition-colors text-xs font-medium"
                  >
                    Send Backward
                  </button>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 mt-4">
                <button
                  onClick={() => {
                    fabricRef.current?.remove(activeObject);
                    fabricRef.current?.discardActiveObject();
                    fabricRef.current?.renderAll();
                    setActiveObject(null);
                  }}
                  className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm font-medium py-2 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
