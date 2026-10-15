import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClassifiedItem, ClassifiedCondition } from '../../types';
import { NewClassifiedModal } from './NewClassifiedModal';
import { ClassifiedDetailModal } from './ClassifiedDetailModal';
import { AuthModal } from '../auth/AuthModal';
import {
  Tag,
  Search,
  Plus,
  MessageCircle,
  Eye,
  SlidersHorizontal,
  Bike,
  Sparkles,
} from 'lucide-react';

export const ClassifiedsView: React.FC = () => {
  const {
    classifieds,
    categories,
    currentUser,
    selectedClassifiedId,
    setSelectedClassifiedId,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedCondition, setSelectedCondition] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recente' | 'menor-preco' | 'maior-preco'>('recente');

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const classifiedCategories = categories.filter(
    (c) => c.type === 'classificados' || c.type === 'ambos'
  );

  // Filter
  const filteredItems = classifieds
    .filter((item) => {
      if (item.status !== 'ativo') return false;
      const matchesCat =
        selectedCategory === 'todos' || item.categoryId === selectedCategory;
      const matchesCond =
        selectedCondition === 'todos' || item.condition === selectedCondition;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sellerCity.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCat && matchesCond && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'menor-preco') return a.price - b.price;
      if (sortBy === 'maior-preco') return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleStartAnnouncement = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
    } else {
      setIsNewModalOpen(true);
    }
  };

  const activeItem = classifieds.find((c) => c.id === selectedClassifiedId) || null;

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-neutral-900 border border-neutral-800 p-6 sm:p-10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Bike className="w-3.5 h-3.5" /> Mercado Ciclista Oficial
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-black uppercase text-white mb-2">
            Classificados Amarelinhos
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Compre, venda e troque bicicletas (Speed, MTB, Gravel), peças, componentes e vestuário diretamente entre ciclistas do pelotão. Contato direto via WhatsApp!
          </p>
        </div>

        <div className="shrink-0">
          <button
            onClick={handleStartAnnouncement}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-yellow-400/25 transition active:scale-95"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>Anunciar Equipamento</span>
          </button>
          {!currentUser && (
            <p className="text-[11px] text-neutral-400 text-center mt-2">
              * Exige cadastro rápido para anunciar
            </p>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="space-y-3">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('todos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              selectedCategory === 'todos'
                ? 'bg-yellow-400 text-neutral-950 shadow-md shadow-yellow-400/20'
                : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <span>Todas as Categorias</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                selectedCategory === 'todos'
                  ? 'bg-neutral-950 text-yellow-400'
                  : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {classifieds.filter((c) => c.status === 'ativo').length}
            </span>
          </button>
          {classifiedCategories.map((cat) => {
            const count = classifieds.filter(
              (c) => c.status === 'ativo' && c.categoryId === cat.id
            ).length;
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

        {/* Search, Condition & Sort Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar bike speed, garmin, capacete, rodas..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-neutral-300 focus:outline-none focus:border-yellow-400"
            >
              <option value="todos">Todas as condições</option>
              <option value="novo">Apenas Novos</option>
              <option value="seminovo">Apenas Seminovos</option>
              <option value="usado">Apenas Usados</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-neutral-300 focus:outline-none focus:border-yellow-400"
            >
              <option value="recente">Mais Recentes</option>
              <option value="menor-preco">Menor Preço</option>
              <option value="maior-preco">Maior Preço</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Classifieds */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900/40 rounded-3xl border border-neutral-800 p-8">
          <Tag className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">
            Nenhum anúncio encontrado
          </h3>
          <p className="text-xs text-neutral-400 mb-4">
            Seja o primeiro a anunciar nessa categoria ou ajuste os filtros.
          </p>
          <button
            onClick={handleStartAnnouncement}
            className="px-5 py-2.5 rounded-xl bg-yellow-400 text-neutral-950 font-bold text-xs inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Anunciar Agora
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const itemCategory = categories.find((c) => c.id === item.categoryId);

            return (
              <div
                key={item.id}
                className="bg-neutral-900 border border-neutral-800 hover:border-yellow-400/40 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between group shadow-lg"
              >
                <div
                  className="relative aspect-4/3 bg-neutral-950 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedClassifiedId(item.id)}
                >
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                    {itemCategory && (
                      <span className="bg-neutral-950/90 backdrop-blur-md text-yellow-300 border border-yellow-400/40 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                        <Tag className="w-2.5 h-2.5 text-yellow-400" />
                        {itemCategory.name}
                      </span>
                    )}

                    <span className="bg-neutral-950/90 backdrop-blur-sm text-neutral-200 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-neutral-700">
                      {item.condition}
                    </span>
                  </div>

                  {item.images.length > 1 && (
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/60 text-[10px] font-bold text-white flex items-center gap-1">
                      <Eye className="w-3 h-3 text-yellow-400" />
                      +{item.images.length} fotos
                    </span>
                  )}
                </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => setSelectedClassifiedId(item.id)}
                    className="font-bold text-white text-base hover:text-yellow-400 cursor-pointer transition mb-1.5 line-clamp-1"
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs text-neutral-400 line-clamp-2 mb-3 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-4">
                    <span>{item.sellerCity}</span>
                    <span>Vendedor: {item.sellerName.split(' ')[0]}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
                      Preço
                    </span>
                    <div className="font-display text-2xl font-black text-yellow-400 leading-none">
                      R$ {item.price.toLocaleString('pt-BR')}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedClassifiedId(item.id)}
                    className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Ver & Contatar</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* New Classified Modal */}
      <NewClassifiedModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
      />

      {/* Auth Modal Trigger if not logged in */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode="login"
        onSuccess={() => setIsNewModalOpen(true)}
      />

      {/* Detail Modal */}
      {selectedClassifiedId && (
        <ClassifiedDetailModal
          item={activeItem}
          onClose={() => setSelectedClassifiedId(null)}
        />
      )}
    </div>
  );
};
