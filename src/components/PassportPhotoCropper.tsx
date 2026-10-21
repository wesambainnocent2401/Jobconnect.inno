/**
 * Passport Photo Cropper Component (Kenya Standard 7:9 / 350x450px JPEG)
 *
 * Requirements:
 * - Reject files that are not JPG or PNG
 * - Reject files over 10 MB
 * - Reject files under 200 x 250 pixels with clear error message
 * - Crop chosen picture to passport shape (7:9) resized to 350 x 450 JPEG
 * - Interactive pan & zoom preview with head guide
 */

import React, { useState, useRef, useEffect } from 'react';
import { Camera, ZoomIn, ZoomOut, RotateCcw, Check, AlertCircle, X, Upload } from 'lucide-react';

interface PassportPhotoCropperProps {
  value?: string;
  onChange: (photoDataUrl: string) => void;
  required?: boolean;
}

export const PassportPhotoCropper: React.FC<PassportPhotoCropperProps> = ({
  value,
  onChange,
  required = true
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const TARGET_WIDTH = 350;
  const TARGET_HEIGHT = 450; // 7:9 aspect ratio

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file format. Please upload a JPG or PNG passport photograph.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // 2. Check file size (10 MB maximum)
    const MAX_BYTES = 10 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      setError('File is too large. Maximum allowed size is 10 MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // 3. Check minimum resolution (200 x 250 px)
        if (img.width < 200 || img.height < 250) {
          setError(
            `Image resolution is too low (${img.width}x${img.height}px). Minimum required is 200 x 250 pixels for passport clarity.`
          );
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }

        imgRef.current = img;
        setImageSrc(reader.result as string);
        setZoom(1);
        setPan({ x: 0, y: 0 });
        setModalOpen(true);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Redraw canvas with image, pan, and zoom
  useEffect(() => {
    if (!modalOpen || !imgRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imgRef.current;
    ctx.clearRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);

    // Fill background with light neutral tone (standard passport background)
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);

    ctx.save();
    // Center of canvas
    ctx.translate(TARGET_WIDTH / 2 + pan.x, TARGET_HEIGHT / 2 + pan.y);
    ctx.scale(zoom, zoom);

    // Calculate aspect scale so image covers the canvas initially
    const scale = Math.max(TARGET_WIDTH / img.width, TARGET_HEIGHT / img.height);
    const drawW = img.width * scale;
    const drawH = img.height * scale;

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  }, [modalOpen, zoom, pan]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch support for mobile phones!
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => setIsDragging(false);

  const confirmCrop = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.88);
    onChange(dataUrl);
    setModalOpen(false);
  };

  const handleRemovePhoto = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleFileSelect}
        className="hidden"
        id="passport-upload-input"
      />

      {error && (
        <div className="mb-3 p-3 bg-rose-950/40 border border-rose-500/50 rounded-lg flex items-start gap-2.5 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {value ? (
        <div className="flex items-center gap-4 p-3 bg-[#131216] border border-[#d4af37]/30 rounded-xl">
          <div className="relative w-20 h-[103px] rounded-lg overflow-hidden border border-[#d4af37]/50 shadow-md shrink-0 bg-neutral-900">
            <img src={value} alt="Passport photo" className="w-full h-full object-cover" />
            <div className="absolute top-1 right-1 bg-emerald-500 text-black text-[9px] font-bold px-1 rounded shadow">
              350x450
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#f5d77a] flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              Passport Photo Verified
            </p>
            <p className="text-xs text-[#b9b09a] mt-0.5">
              Standard 7:9 ratio, optimized JPEG format.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-[#d4af37] hover:underline flex items-center gap-1 font-medium"
              >
                Change Photo
              </button>
              <span className="text-neutral-600">·</span>
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="text-xs text-rose-400 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-[#d4af37]/40 hover:border-[#d4af37] bg-[#121116]/80 hover:bg-[#18171d] rounded-xl p-6 text-center transition-all group flex flex-col items-center justify-center gap-2 min-h-[140px]"
        >
          <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 group-hover:bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37] transition-all">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#f3eee0] group-hover:text-[#f5d77a]">
              Upload Passport-Size Photo {required && <span className="text-rose-400">*</span>}
            </p>
            <p className="text-xs text-[#b9b09a] mt-0.5">
              Crop to 7:9 ratio (350 x 450 px). JPG or PNG, under 10 MB.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs text-[#d4af37] font-semibold mt-1 bg-[#d4af37]/10 px-3 py-1 rounded-full border border-[#d4af37]/30">
            <Upload className="w-3.5 h-3.5" />
            Select Photo from Device
          </span>
        </div>
      )}

      {/* Interactive Crop Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141318] border border-[#d4af37]/40 rounded-2xl max-w-md w-full p-5 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#f5d77a]">Adjust Passport Photo</h3>
                <p className="text-xs text-[#b9b09a]">Position your head and shoulders inside the guide</p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Canvas Area with 7:9 Guide Overlay */}
            <div className="my-4 flex flex-col items-center justify-center">
              <div
                className="relative overflow-hidden rounded-lg shadow-inner cursor-grab active:cursor-grabbing border-2 border-[#d4af37]"
                style={{ width: '280px', height: '360px' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <canvas
                  ref={canvasRef}
                  width={TARGET_WIDTH}
                  height={TARGET_HEIGHT}
                  className="w-full h-full object-contain"
                />

                {/* Passport Head & Shoulder Guide Overlay */}
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                  <div className="w-32 h-40 rounded-[50%] border-2 border-dashed border-[#f5d77a]/60 mt-4 shadow-sm" />
                  <div className="w-48 h-20 border-t-2 border-dashed border-[#f5d77a]/40 rounded-t-full mt-2" />
                </div>
              </div>

              {/* Controls: Zoom & Reset */}
              <div className="flex items-center gap-4 mt-4 w-full max-w-[280px]">
                <button
                  type="button"
                  onClick={() => setZoom(z => Math.max(0.6, z - 0.15))}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[#f3eee0]"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>

                <input
                  type="range"
                  min="0.6"
                  max="2.5"
                  step="0.05"
                  value={zoom}
                  onChange={e => setZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-[#d4af37]"
                />

                <button
                  type="button"
                  onClick={() => setZoom(z => Math.min(2.5, z + 0.15))}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[#f3eee0]"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setZoom(1);
                    setPan({ x: 0, y: 0 });
                  }}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[#b9b09a]"
                  title="Reset Position"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="btn-gold-outline flex-1 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmCrop}
                className="btn-gold flex-1 py-2 text-sm"
              >
                <Check className="w-4 h-4" />
                Save & Use Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
