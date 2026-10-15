import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { ProductDetailModal } from './ProductDetailModal';
import { Search, ShoppingBag, Eye, Zap, Tag } from 'lucide-react';

export const ShopView: React.FC = () => {
  const { products, categories, selectedProductId, setSelectedProductId } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamically load all registered store categories
  const shopCategories = categories.filter((c) => c.type === 'loja' || c.type === 'ambos');

  // Filter products by selected registered category and search term
  const filteredProducts = products.filter((prod) => {
    const matchesCategory =
      selectedCategory === 'todos' || prod.categoryId === selectedCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeModalProduct = products.find((p) => p.id === selectedProductId) || null;

  return (
    <div className="space-y-8 pb-16">
      {/* Shop Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-neutral-900 border border-neutral-800 p-6 sm:p-10 shadow-xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5" /> Lote Oficial Aberto
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-black uppercase text-white mb-2">
            Loja Oficial & Encomendas Amarelinhos
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Garanta o uniforme oficial do nosso grupo de ciclismo. Todos os itens são organizados pelas categorias cadastradas, com tamanhos do PP ao GG e pagamento seguro via PIX BACEN.
          </p>
        </div>
      </div>

      {/* Filter by Registered Categories & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Dynamic Category Pills with Live Product Counters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('todos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              selectedCategory === 'todos'
                ? 'bg-yellow-400 text-neutral-950 shadow-md shadow-yellow-400/20'
                : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <span>Todos os Uniformes</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                selectedCategory === 'todos'
                  ? 'bg-neutral-950 text-yellow-400'
                  : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {products.length}
            </span>
          </button>

          {shopCategories.map((cat) => {
            const count = products.filter((p) => p.categoryId === cat.id).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-yellow-400 text-neutral-950 shadow-md shadow-yellow-400/20'
                    : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isSelected
                      ? 'bg-neutral-950 text-yellow-400'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por camisa, bretelle, corta-vento..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400 transition"
          />
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900/50 rounded-3xl border border-neutral-800 p-8">
          <ShoppingBag className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">Nenhum produto nesta categoria</h3>
          <p className="text-xs text-neutral-400 mb-4">
            Tente buscar com outros termos ou selecione outra categoria cadastrada.
          </p>
          <button
            onClick={() => setSelectedCategory('todos')}
            className="px-4 py-2 rounded-xl bg-neutral-800 text-yellow-400 text-xs font-bold hover:bg-neutral-700 transition"
          >
            Ver todos os produtos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const productCategory = categories.find((c) => c.id === product.categoryId);

            return (
              <div
                key={product.id}
                className="bg-neutral-900 border border-neutral-800 hover:border-yellow-400/40 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between group shadow-lg"
              >
                {/* Product Image Gallery Preview */}
                <div
                  className="relative aspect-4/3 bg-neutral-950 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedProductId(product.id)}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Top Badges: Category & Custom Badge */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                    {productCategory && (
                      <span className="bg-neutral-950/90 backdrop-blur-md text-yellow-300 border border-yellow-400/40 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow flex items-center gap-1">
                        <Tag className="w-2.5 h-2.5 text-yellow-400" />
                        {productCategory.name}
                      </span>
                    )}

                    {product.badge && (
                      <span className="bg-yellow-400 text-neutral-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {product.isPreOrder && (
                    <span className="absolute top-3 right-3 bg-neutral-950/80 backdrop-blur-sm text-neutral-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-neutral-700">
                      Sob Encomenda
                    </span>
                  )}

                  {/* Multiple Images Indicator */}
                  {product.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/60 text-[10px] text-white backdrop-blur-sm flex items-center gap-1 font-semibold">
                      <Eye className="w-3 h-3 text-yellow-400" />
                      <span>{product.images.length} fotos</span>
                    </div>
                  )}
                </div>

                {/* Product Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      onClick={() => setSelectedProductId(product.id)}
                      className="font-bold text-white text-base hover:text-yellow-400 cursor-pointer transition mb-2"
                    >
                      {product.name}
                    </h3>

                    <p className="text-xs text-neutral-400 line-clamp-2 mb-4 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Sizes Available */}
                    <div className="flex items-center gap-1.5 mb-5">
                      <span className="text-[11px] font-bold text-neutral-400 uppercase">Tamanhos:</span>
                      <div className="flex items-center gap-1">
                        {product.sizes.map((sz) => (
                          <span
                            key={sz}
                            className="px-2 py-0.5 bg-neutral-800 text-[11px] font-bold rounded-lg text-neutral-200 border border-neutral-700/80"
                          >
                            {sz}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Action */}
                  <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
                        Valor PIX
                      </span>
                      <div className="font-display text-2xl font-black text-yellow-400 leading-none">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedProductId(product.id)}
                      className="px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-yellow-400/20 transition active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Escolher Tamanho</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProductId && (
        <ProductDetailModal
          product={activeModalProduct}
          onClose={() => setSelectedProductId(null)}
        />
      )}
    </div>
  );
};
