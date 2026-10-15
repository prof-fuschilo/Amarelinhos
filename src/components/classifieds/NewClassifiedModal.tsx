import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClassifiedCondition } from '../../types';
import { ImageGalleryManager, DEFAULT_CYCLING_PRESETS } from '../common/ImageGalleryManager';
import {
  X,
  Bike,
  AlertCircle,
  Tag,
  DollarSign,
  FileText,
  Plus,
  Check,
} from 'lucide-react';

interface NewClassifiedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewClassifiedModal: React.FC<NewClassifiedModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { categories, addCategory, addClassified, currentUser, showToast } = useApp();

  const classifiedCategories = categories.filter(
    (c) => c.type === 'classificados' || c.type === 'ambos'
  );

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(classifiedCategories[0]?.id || '');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState<ClassifiedCondition>('seminovo');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  // Inline Category quick creation state
  const [isAddingNewCat, setIsAddingNewCat] = useState(false);
  const [newCatNameInput, setNewCatNameInput] = useState('');

  if (!isOpen) return null;

  const handleCreateInlineCategory = () => {
    if (!newCatNameInput.trim()) return;
    const catName = newCatNameInput.trim();
    const newCatId = 'class-' + Date.now().toString(36);
    addCategory({
      name: catName,
      slug: catName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      type: 'classificados',
    });
    // Find or set as active
    setTimeout(() => {
      setCategoryId(newCatId);
    }, 50);
    setNewCatNameInput('');
    setIsAddingNewCat(false);
    showToast(`Categoria "${catName}" cadastrada com sucesso!`, 'success');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!currentUser) {
      setErrorMsg('Você precisa estar autenticado para anunciar.');
      return;
    }

    if (!title.trim()) {
      setErrorMsg('Por favor, informe o título do anúncio.');
      return;
    }

    if (!categoryId) {
      setErrorMsg('Selecione uma das categorias de ciclismo cadastradas.');
      return;
    }

    const parsedPrice = parseFloat(price.replace(',', '.'));
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setErrorMsg('Informe um valor válido em reais (R$).');
      return;
    }

    if (images.length === 0) {
      setErrorMsg('Adicione pelo menos 1 foto do equipamento para publicar o anúncio.');
      return;
    }

    addClassified({
      title: title.trim(),
      categoryId,
      price: parsedPrice,
      condition,
      description: description.trim(),
      images,
      status: 'ativo',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400">
              Classificados Amarelinhos
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Bike className="w-5 h-5 text-yellow-400" />
              Anunciar Equipamento de Ciclismo
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto flex-1 pr-1 py-4 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Vendedor Info */}
          <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-neutral-400">Anunciante:</span>{' '}
              <strong className="text-white">{currentUser?.name}</strong>
            </div>
            <div className="text-neutral-400">
              WhatsApp: <strong className="text-yellow-400">{currentUser?.phone}</strong>
            </div>
          </div>

          <form id="new-classified-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Título do Anúncio *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Caloi Strada Racing Shimano Tiagra Tam 54"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-neutral-300 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-yellow-400" />
                    Categoria Cadastrada *
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAddingNewCat(!isAddingNewCat)}
                    className="text-[10px] text-yellow-400 hover:text-yellow-300 flex items-center gap-0.5 font-bold"
                  >
                    <Plus className="w-3 h-3" />
                    {isAddingNewCat ? 'Cancelar' : 'Nova Categoria'}
                  </button>
                </div>

                {isAddingNewCat ? (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <input
                      type="text"
                      value={newCatNameInput}
                      onChange={(e) => setNewCatNameInput(e.target.value)}
                      placeholder="Nome da nova categoria..."
                      className="flex-1 bg-neutral-950 border border-yellow-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCreateInlineCategory}
                      className="px-3 py-2 bg-yellow-400 text-neutral-950 text-xs font-bold rounded-xl shrink-0"
                    >
                      Criar
                    </button>
                  </div>
                ) : (
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                    required
                  >
                    <option value="">Selecione uma categoria cadastrada...</option>
                    {classifiedCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.type === 'ambos' ? '(Loja & Classificados)' : ''}
                      </option>
                    ))}
                  </select>
                )}

                {classifiedCategories.length === 0 && !isAddingNewCat && (
                  <p className="text-[11px] text-amber-400 mt-1">
                    Nenhuma categoria cadastrada. Clique em "Nova Categoria" acima para criar.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  Preço em R$ *
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Ex: 4500,00"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
                  required
                />
              </div>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                Condição do Item *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['novo', 'seminovo', 'usado'] as ClassifiedCondition[]).map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setCondition(cond)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition border ${
                      condition === cond
                        ? 'bg-yellow-400 text-neutral-950 border-yellow-400 shadow-sm'
                        : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-yellow-400" />
                Descrição Detalhada *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Descreva detalhes como tamanho do quadro, peças, tempo de uso, motivo da venda e local para retirada..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400 resize-none"
                required
              />
            </div>

            {/* Advanced Multi-Image Manager with Reorder, Cover, Replace and Delete */}
            <ImageGalleryManager
              images={images}
              onChange={setImages}
              maxImages={6}
              label="Fotos do Anúncio (Capa + Galeria)"
              helperText="Envie até 6 fotos do equipamento. Arraste ou use as setas para reordenar, estrela para capa e o botão de troca para substituir uma foto."
              presets={DEFAULT_CYCLING_PRESETS}
            />
          </form>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-neutral-400 hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="new-classified-form"
            className="px-6 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-black text-xs shadow-lg shadow-yellow-400/20 transition active:scale-95"
          >
            Publicar Anúncio Agora
          </button>
        </div>
      </div>
    </div>
  );
};
