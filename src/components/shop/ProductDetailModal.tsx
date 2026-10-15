import React, { useState } from 'react';
import { Product, ClothingSize } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  ShoppingBag,
  ShieldCheck,
  Ruler,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  const { addToCart, setActiveTab, categories } = useApp();
  const [selectedSize, setSelectedSize] = useState<ClothingSize | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  if (!product) return null;

  const productCategory = categories.find((c) => c.id === product.categoryId);
  const currentImage = product.images[selectedImageIndex] || product.images[0];

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addToCart(product, selectedSize, quantity);
    onClose();
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addToCart(product, selectedSize, quantity);
    onClose();
    setActiveTab('carrinho');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-neutral-950/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Image Gallery */}
          <div className="p-4 sm:p-6 bg-neutral-950/50 flex flex-col justify-between">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 flex items-center justify-center mb-4">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === 0 ? product.images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black text-white"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === product.images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black text-white"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {product.badge && (
                <span className="absolute top-3 left-3 bg-yellow-400 text-neutral-950 text-xs font-black uppercase px-2.5 py-1 rounded-full shadow">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                      selectedImageIndex === idx
                        ? 'border-yellow-400 scale-95'
                        : 'border-neutral-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Size Selection */}
          <div className="p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh]">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {productCategory && (
                  <span className="text-[10px] font-black uppercase tracking-wider text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 px-2.5 py-0.5 rounded-full">
                    {productCategory.name}
                  </span>
                )}
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300">
                  {product.isPreOrder ? '⚡ Encomenda Oficial do Lote' : '✅ Pronta Entrega'}
                </span>
                {product.estimatedDelivery && (
                  <span className="text-[11px] text-neutral-400">
                    • Prazo: {product.estimatedDelivery}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-3 mb-5 pb-4 border-b border-neutral-800">
                <span className="font-display text-4xl font-black text-yellow-400">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-xs text-neutral-400">via PIX com QR Code instantâneo</span>
              </div>

              {/* Size Selector (Mandatory PP to GG) */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
                    Selecione o Tamanho <span className="text-yellow-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1 font-semibold"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    {showSizeGuide ? 'Ocultar Medidas' : 'Tabela de Medidas'}
                  </button>
                </div>

                {sizeError && (
                  <p className="text-xs text-rose-400 mb-2 font-medium">
                    ⚠️ Por favor, escolha um tamanho (PP, P, M, G ou GG) antes de continuar.
                  </p>
                )}

                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((sz) => {
                    const isSelected = selectedSize === sz;
                    const stock = product.stockBySize[sz] ?? 0;
                    const isAvailable = stock > 0 || product.isPreOrder;

                    return (
                      <button
                        key={sz}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => {
                          setSelectedSize(sz);
                          setSizeError(false);
                        }}
                        className={`h-12 rounded-xl font-bold text-sm flex flex-col items-center justify-center transition border ${
                          isSelected
                            ? 'bg-yellow-400 text-neutral-950 border-yellow-400 shadow-md shadow-yellow-400/20'
                            : isAvailable
                            ? 'bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700'
                            : 'bg-neutral-900 text-neutral-600 border-neutral-800 cursor-not-allowed'
                        }`}
                      >
                        <span className="text-base">{sz}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Size Guide Table Drawer */}
                {showSizeGuide && (
                  <div className="mt-4 p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs">
                    <h4 className="font-bold text-yellow-400 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> Guia de Referência de Tamanhos (cm)
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-neutral-800 text-neutral-400">
                            <th className="py-1">Tam.</th>
                            <th className="py-1">Tórax</th>
                            <th className="py-1">Cintura</th>
                            <th className="py-1">Altura Aprox.</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                          <tr><td className="py-1 font-bold text-yellow-400">PP</td><td>80-86 cm</td><td>68-74 cm</td><td>1,50 - 1,62m</td></tr>
                          <tr><td className="py-1 font-bold text-yellow-400">P</td><td>87-94 cm</td><td>75-81 cm</td><td>1,60 - 1,72m</td></tr>
                          <tr><td className="py-1 font-bold text-yellow-400">M</td><td>95-102 cm</td><td>82-88 cm</td><td>1,70 - 1,80m</td></tr>
                          <tr><td className="py-1 font-bold text-yellow-400">G</td><td>103-110 cm</td><td>89-96 cm</td><td>1,78 - 1,88m</td></tr>
                          <tr><td className="py-1 font-bold text-yellow-400">GG</td><td>111-120 cm</td><td>97-106 cm</td><td>1,85 - 1,96m</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-bold text-neutral-300">Quantidade:</span>
                <div className="flex items-center bg-neutral-800 border border-neutral-700 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-neutral-400 hover:text-white"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-sm font-bold text-white min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1.5 text-neutral-400 hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Description & Features */}
              <div className="space-y-3 mb-6 text-xs text-neutral-300 leading-relaxed">
                <p>{product.description}</p>
                {product.fabric && (
                  <p className="text-neutral-400">
                    <strong className="text-neutral-200">Composição:</strong> {product.fabric}
                  </p>
                )}
                {product.features && (
                  <ul className="space-y-1 pt-1">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2 text-neutral-300">
                        <Check className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-neutral-800 space-y-2.5">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs sm:text-sm border border-neutral-700 flex items-center justify-center gap-2 transition"
                >
                  <ShoppingBag className="w-4 h-4 text-yellow-400" />
                  Adicionar ao Carrinho
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-3 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-black text-xs sm:text-sm shadow-lg shadow-yellow-400/20 flex items-center justify-center gap-2 transition active:scale-95"
                >
                  Pedir Agora (PIX)
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Pagamento direto ao grupo com QR Code PIX oficial</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
