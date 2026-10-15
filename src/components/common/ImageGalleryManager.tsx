import React, { useRef, useState } from 'react';
import {
  Upload,
  Link as LinkIcon,
  Trash2,
  Star,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  X,
  Plus,
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';

interface PresetItem {
  label: string;
  url: string;
  category?: string;
}

interface ImageGalleryManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
  helperText?: string;
  presets?: PresetItem[];
}

export const DEFAULT_CYCLING_PRESETS: PresetItem[] = [
  {
    label: 'Camisa Amarelinhos',
    category: 'Vestuário',
    url: 'https://images.unsplash.com/photo-1544965838-54ef8406f868?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Pelotão na Estrada',
    category: 'Vestuário',
    url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Bretelle & Detalhes',
    category: 'Vestuário',
    url: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Bicicleta Speed Road',
    category: 'Bikes',
    url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Mountain Bike Trilha',
    category: 'Bikes',
    url: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Capacete Aerodinâmico',
    category: 'Acessórios',
    url: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'GPS Ciclocomputador',
    category: 'Eletrônicos',
    url: 'https://images.unsplash.com/photo-1510519138161-58474ebf8993?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Rodas de Carbono',
    category: 'Componentes',
    url: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=1000&q=80',
  },
];

export const ImageGalleryManager: React.FC<ImageGalleryManagerProps> = ({
  images,
  onChange,
  maxImages = 6,
  label = 'Galeria de Imagens',
  helperText = 'Adicione fotos do seu dispositivo ou cole URLs. A primeira foto será a capa principal.',
  presets = DEFAULT_CYCLING_PRESETS,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  const [replaceTargetIndex, setReplaceTargetIndex] = useState<number | null>(null);

  // Read File list and append
  const processFiles = (files: FileList | File[]) => {
    setErrorMsg('');
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      setErrorMsg(`O limite máximo é de ${maxImages} fotos.`);
      return;
    }

    const filesToRead = fileArray.slice(0, remainingSlots);

    filesToRead.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Apenas arquivos de imagem (JPG, PNG, WebP) são suportados.');
        return;
      }

      // Max size: 6MB per file
      if (file.size > 6 * 1024 * 1024) {
        setErrorMsg(`A imagem "${file.name}" excede o tamanho máximo de 6MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          onChange([...images, result].slice(0, maxImages));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Add via URL
  const handleAddUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    if (images.length >= maxImages) {
      setErrorMsg(`Limite de ${maxImages} imagens atingido.`);
      return;
    }

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image')) {
      setErrorMsg('O link deve começar com https:// ou ser uma URL de imagem válida.');
      return;
    }

    onChange([...images, trimmed]);
    setUrlInput('');
  };

  // Remove individual image
  const handleRemove = (index: number) => {
    const updated = images.filter((_, idx) => idx !== index);
    onChange(updated);
    if (lightboxIndex !== null) {
      if (updated.length === 0) setLightboxIndex(null);
      else if (lightboxIndex >= updated.length) setLightboxIndex(updated.length - 1);
    }
  };

  // Make image the cover (move to position 0)
  const handleMakeCover = (index: number) => {
    if (index === 0) return;
    const target = images[index];
    const filtered = images.filter((_, idx) => idx !== index);
    onChange([target, ...filtered]);
  };

  // Move left
  const handleMoveLeft = (index: number) => {
    if (index === 0) return;
    const copy = [...images];
    const temp = copy[index - 1];
    copy[index - 1] = copy[index];
    copy[index] = temp;
    onChange(copy);
  };

  // Move right
  const handleMoveRight = (index: number) => {
    if (index >= images.length - 1) return;
    const copy = [...images];
    const temp = copy[index + 1];
    copy[index + 1] = copy[index];
    copy[index] = temp;
    onChange(copy);
  };

  // Replace single image
  const handleTriggerReplace = (index: number) => {
    setReplaceTargetIndex(index);
    if (replaceFileInputRef.current) {
      replaceFileInputRef.current.click();
    }
  };

  const handleReplaceFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0] && replaceTargetIndex !== null) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Apenas arquivos de imagem são suportados.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          const updated = [...images];
          updated[replaceTargetIndex] = result;
          onChange(updated);
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
    setReplaceTargetIndex(null);
  };

  return (
    <div className="bg-neutral-950/80 border border-neutral-800 rounded-3xl p-4 sm:p-5 space-y-4 shadow-inner">
      {/* Hidden file input for single image replacement */}
      <input
        ref={replaceFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleReplaceFile}
        className="hidden"
      />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-900">
        <div>
          <label className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
            <ImageIcon className="w-4 h-4 text-yellow-400" />
            {label}{' '}
            <span className="text-yellow-400 font-mono font-bold text-xs">
              [{images.length}/{maxImages}]
            </span>
          </label>
          <p className="text-[11px] text-neutral-400 mt-0.5">{helperText}</p>
        </div>

        {images.length > 0 && (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-yellow-300 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/30">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            Foto #1 = Capa Principal no Catálogo
          </span>
        )}
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-2xl flex items-center justify-between">
          <span>⚠️ {errorMsg}</span>
          <button onClick={() => setErrorMsg('')} className="p-1 text-red-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Drag & Drop Upload Zone + URL Input */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`p-3 rounded-2xl border-2 border-dashed transition-all ${
          isDraggingOver
            ? 'border-yellow-400 bg-yellow-400/10 scale-[1.01]'
            : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
          {/* File input button with Drag & Drop prompt */}
          <div className="sm:col-span-5">
            <label
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition shadow-sm ${
                images.length >= maxImages
                  ? 'bg-neutral-900 text-neutral-600 border border-neutral-800 cursor-not-allowed'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 hover:border-yellow-400'
              }`}
            >
              <Upload className="w-4 h-4 text-yellow-400 shrink-0" />
              <span className="truncate">
                {isDraggingOver ? 'Solte a foto aqui!' : 'Upload do Dispositivo'}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={images.length >= maxImages}
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* URL Input Form */}
          <div className="sm:col-span-7 flex gap-1.5">
            <div className="relative flex-1">
              <LinkIcon className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Cole o link de uma foto (https://...)"
                disabled={images.length >= maxImages}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddUrl();
                  }
                }}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400 disabled:opacity-40"
              />
            </div>
            <button
              type="button"
              onClick={() => handleAddUrl()}
              disabled={images.length >= maxImages || !urlInput.trim()}
              className="px-3.5 py-2 bg-yellow-400 hover:bg-yellow-300 disabled:bg-neutral-800 disabled:text-neutral-600 text-neutral-950 font-black text-xs rounded-xl transition shrink-0"
            >
              Inserir
            </button>
          </div>
        </div>

        <div className="mt-2 text-center text-[10px] text-neutral-500">
          💡 Dica: Você também pode arrastar e soltar fotos direto da pasta do seu computador para cá.
        </div>
      </div>

      {/* Cycling Suggestion Presets */}
      {presets.length > 0 && images.length < maxImages && (
        <div className="bg-neutral-900/40 p-2.5 rounded-2xl border border-neutral-900">
          <div className="text-[10px] text-neutral-400 font-semibold mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>Fotos de Ciclismo em Alta Resolução (Clique para adicionar):</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {presets.map((preset, idx) => {
              const isAlreadyAdded = images.includes(preset.url);

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAlreadyAdded || images.length >= maxImages}
                  onClick={() => {
                    if (images.length < maxImages && !isAlreadyAdded) {
                      onChange([...images, preset.url]);
                    }
                  }}
                  className={`text-[10px] px-2.5 py-1 rounded-lg border transition flex items-center gap-1 ${
                    isAlreadyAdded
                      ? 'bg-neutral-950/40 border-neutral-900 text-neutral-600 cursor-default'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border-neutral-800 hover:border-yellow-400/50'
                  }`}
                >
                  {isAlreadyAdded ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Plus className="w-3 h-3 text-yellow-400" />
                  )}
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Images Grid Manager */}
      {images.length === 0 ? (
        <div className="py-8 border border-dashed border-neutral-800 rounded-2xl text-center bg-neutral-950/40 space-y-2">
          <ImageIcon className="w-10 h-10 text-neutral-600 mx-auto" />
          <p className="text-xs font-bold text-neutral-300">Nenhuma foto adicionada ainda.</p>
          <p className="text-[11px] text-neutral-500 max-w-sm mx-auto">
            Faça upload de fotos nítidas ou use os botões de sugestão acima para ilustrar o equipamento com qualidade máxima.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img, index) => {
              const isCover = index === 0;

              return (
                <div
                  key={index}
                  className={`group relative aspect-square rounded-2xl overflow-hidden border-2 bg-neutral-950 transition shadow-lg ${
                    isCover
                      ? 'border-yellow-400 ring-2 ring-yellow-400/30'
                      : 'border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Top Left: Position Badge & Capa Star */}
                  <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
                    {isCover ? (
                      <span className="px-2.5 py-0.5 rounded-lg bg-yellow-400 text-neutral-950 text-[10px] font-black uppercase shadow-lg flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" /> Capa
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-lg bg-black/80 text-white text-[10px] font-bold backdrop-blur-sm border border-white/10">
                        #{index + 1}
                      </span>
                    )}
                  </div>

                  {/* Top Right: Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="absolute top-2 right-2 p-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white shadow-lg transition active:scale-95 z-10"
                    title="Excluir esta foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Bottom Action Bar */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent p-2 pt-6 flex items-center justify-between gap-1 z-10">
                    {/* Reorder Arrows */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveLeft(index)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white disabled:opacity-20 disabled:pointer-events-none transition"
                        title="Mover para esquerda"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={index >= images.length - 1}
                        onClick={() => handleMoveRight(index)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white disabled:opacity-20 disabled:pointer-events-none transition"
                        title="Mover para direita"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Replace Single Photo */}
                      <button
                        type="button"
                        onClick={() => handleTriggerReplace(index)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition"
                        title="Trocar esta foto por outra"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>

                      {/* Make Cover Button */}
                      {!isCover && (
                        <button
                          type="button"
                          onClick={() => handleMakeCover(index)}
                          className="px-2 py-1 rounded-lg bg-yellow-400/20 hover:bg-yellow-400 text-yellow-300 hover:text-neutral-950 text-[10px] font-black transition flex items-center gap-1 border border-yellow-400/40"
                          title="Definir como foto de capa"
                        >
                          <Star className="w-3 h-3" /> Capa
                        </button>
                      )}

                      {/* Zoom Lightbox */}
                      <button
                        type="button"
                        onClick={() => setLightboxIndex(index)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition"
                        title="Ampliar visualização"
                      >
                        <Maximize2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-1 flex items-center justify-between text-[11px] text-neutral-400 px-1">
            <span>Use as setas para definir a ordem das imagens.</span>
            <span>Clique na estrela para alterar a capa principal.</span>
          </div>
        </div>
      )}

      {/* Lightbox Modal with Fullscreen Zoom and Navigation */}
      {lightboxIndex !== null && images[lightboxIndex] && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden p-2 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800">
              <span className="text-xs font-bold text-neutral-300">
                Foto {lightboxIndex + 1} de {images.length}{' '}
                {lightboxIndex === 0 && <span className="text-yellow-400 font-bold ml-1">(Capa Principal)</span>}
              </span>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Picture */}
            <div className="relative flex-1 flex items-center justify-center p-4 bg-neutral-950 min-h-[350px]">
              <img
                src={images[lightboxIndex]}
                alt={`Ampliada ${lightboxIndex + 1}`}
                className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain mx-auto shadow-2xl"
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((prev) =>
                        prev === 0 ? images.length - 1 : (prev as number) - 1
                      );
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black text-white transition shadow-lg"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((prev) =>
                        prev === images.length - 1 ? 0 : (prev as number) + 1
                      );
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black text-white transition shadow-lg"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom thumbnail strip */}
            {images.length > 1 && (
              <div className="flex items-center justify-center gap-2 p-3 bg-neutral-900 border-t border-neutral-800 overflow-x-auto">
                {images.map((thumb, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition ${
                      lightboxIndex === idx ? 'border-yellow-400 scale-105' : 'border-neutral-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={thumb} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
