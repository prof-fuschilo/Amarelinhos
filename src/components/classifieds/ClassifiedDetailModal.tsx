import React, { useState } from 'react';
import { ClassifiedItem } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  MessageCircle,
  MapPin,
  Calendar,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  User,
  Share2,
} from 'lucide-react';

interface ClassifiedDetailModalProps {
  item: ClassifiedItem | null;
  onClose: () => void;
}

export const ClassifiedDetailModal: React.FC<ClassifiedDetailModalProps> = ({
  item,
  onClose,
}) => {
  const { categories, showToast } = useApp();
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  if (!item) return null;

  const category = categories.find((c) => c.id === item.categoryId);
  const currentImg = item.images[selectedImgIndex] || item.images[0];

  const formattedDate = new Date(item.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const whatsappMessage = encodeURIComponent(
    `Olá ${item.sellerName}! Vi seu anúncio "${item.title}" por R$ ${item.price.toLocaleString(
      'pt-BR'
    )} nos Classificados dos Amarelinhos. O item ainda está disponível?`
  );

  const cleanPhone = item.sellerPhone.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${whatsappMessage}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: `Confira este anúncio nos Classificados Amarelinhos: ${item.title} por R$ ${item.price.toLocaleString('pt-BR')}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Link do anúncio copiado para compartilhar!', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Top Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-neutral-950/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 transition"
            title="Compartilhar"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-neutral-950/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {/* Main Gallery */}
          <div className="relative aspect-16/10 bg-neutral-950 flex items-center justify-center overflow-hidden">
            <img
              src={currentImg}
              alt={item.title}
              className="w-full h-full object-contain"
            />

            {item.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setSelectedImgIndex((prev) =>
                      prev === 0 ? item.images.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-black text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    setSelectedImgIndex((prev) =>
                      prev === item.images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-black text-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <div className="absolute bottom-3 left-3 flex gap-2">
              <span className="px-2.5 py-1 rounded-full bg-neutral-950/90 text-white text-[10px] font-black uppercase border border-neutral-700">
                {item.condition}
              </span>
              {category && (
                <span className="px-2.5 py-1 rounded-full bg-yellow-400 text-neutral-950 text-[10px] font-black uppercase">
                  {category.name}
                </span>
              )}
            </div>

            <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/70 text-[11px] font-bold text-white">
              {selectedImgIndex + 1} / {item.images.length}
            </span>
          </div>

          {/* Thumbnails */}
          {item.images.length > 1 && (
            <div className="flex gap-2 p-3 bg-neutral-950 border-b border-neutral-800 overflow-x-auto">
              {item.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                    selectedImgIndex === idx
                      ? 'border-yellow-400 scale-95'
                      : 'border-neutral-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Details Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {item.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                    {item.sellerCity}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                    Anunciado em {formattedDate}
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Valor Pedido
                </span>
                <span className="font-display text-4xl font-black text-yellow-400">
                  R$ {item.price.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>

            {/* Seller Contact Card */}
            <div className="bg-neutral-950 p-4 sm:p-5 rounded-2xl border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-yellow-400/20 text-yellow-400 flex items-center justify-center font-bold text-base uppercase">
                  {item.sellerName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{item.sellerName}</p>
                  <p className="text-xs text-neutral-400">
                    Membro verificado do grupo de ciclistas
                  </p>
                </div>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                Negociar no WhatsApp
              </a>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Descrição do Equipamento
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800/80">
                {item.description}
              </p>
            </div>

            {/* Security Tip */}
            <div className="p-3.5 rounded-2xl bg-neutral-950/50 border border-neutral-800/80 flex items-start gap-2.5 text-[11px] text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <span>
                <strong>Dica de segurança Amarelinhos:</strong> Marque encontros para ver a bicicleta em locais públicos e movimentados (como postos ou pontos de encontro do pelotão). Nunca faça adiantamentos sem inspecionar o produto.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
