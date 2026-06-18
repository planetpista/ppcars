import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadVehicleImage } from '../services/storageService';

interface ImageUploaderProps {
  userId: string;
  images: string[];
  maxImages: number;
  language: 'fr' | 'en';
  onChange: (images: string[]) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  userId,
  images,
  maxImages,
  language,
  onChange
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = async (files: FileList) => {
    const remaining = maxImages - images.length;
    if (remaining <= 0) return;

    const selected = Array.from(files).slice(0, remaining);
    setUploading(true);

    const uploaded: string[] = [];
    for (let i = 0; i < selected.length; i++) {
      const file = selected[i];
      if (!file.type.startsWith('image/')) continue;
      const url = await uploadVehicleImage(file, userId, `${Date.now()}_${i}`);
      if (url) uploaded.push(url);
    }

    onChange([...images, ...uploaded]);
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
              <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Zone */}
      {images.length < maxImages && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500">
                {language === 'fr' ? 'Téléchargement...' : 'Uploading...'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload size={28} className="text-gray-400" />
              <p className="text-sm font-medium text-gray-700">
                {language === 'fr' ? 'Glissez ou cliquez pour ajouter des photos' : 'Drag or click to add photos'}
              </p>
              <p className="text-xs text-gray-400">
                {images.length}/{maxImages} {language === 'fr' ? 'photos' : 'photos'}
              </p>
            </div>
          )}
        </div>
      )}

      {images.length >= maxImages && (
        <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
          <ImageIcon size={16} />
          <span>
            {language === 'fr'
              ? `Limite de ${maxImages} photos atteinte`
              : `${maxImages} photo limit reached`}
          </span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;