import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  OrderStatus,
  ClothingSize,
  Product,
  ClassifiedStatus,
  ClassifiedCondition,
  ClassifiedItem,
  Category,
  RideSchedule,
  Order,
  OrderItem,
} from '../../types';
import {
  LayoutDashboard,
  ShoppingBag,
  Tag,
  FolderTree,
  Users,
  Settings,
  Calendar,
  Server,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Truck,
  CheckCheck,
  XCircle,
  ExternalLink,
  MessageCircle,
  QrCode,
  RotateCcw,
  Download,
  Copy,
  ChevronRight,
  ShieldAlert,
  Check,
  X,
  Image as ImageIcon,
  FileSpreadsheet,
  Search,
  GitBranch,
  HardDrive,
  CloudUpload,
  Terminal,
} from 'lucide-react';
import { AmarelinhosLogo } from '../common/AmarelinhosLogo';
import { ImageGalleryManager, DEFAULT_CYCLING_PRESETS } from '../common/ImageGalleryManager';

type AdminTab =
  | 'kanban'
  | 'produtos'
  | 'classificados'
  | 'categorias'
  | 'clientes'
  | 'pedais'
  | 'configuracoes'
  | 'producao';

export const AdminView: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    updateOrderTracking,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    classifieds,
    updateClassified,
    updateClassifiedStatus,
    deleteClassified,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    users,
    rides,
    addRide,
    deleteRide,
    groupConfig,
    updateGroupConfig,
    resetToDefaultData,
    currentUser,
    login,
    showToast,
  } = useApp();

  const [currentTab, setCurrentTab] = useState<AdminTab>('kanban');

  // Admin login check
  const [adminEmail, setAdminEmail] = useState('admin@amarelinhos.com.br');
  const [adminPass, setAdminPass] = useState('admin');

  // Tracking modal / input state
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<string | null>(null);
  const [trackingInput, setTrackingInput] = useState('');

  // Product modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState<{
    name: string;
    description: string;
    price: number;
    categoryId: string;
    images: string[];
    sizes: ClothingSize[];
    isPreOrder: boolean;
    badge: string;
    estimatedDelivery: string;
    fabric: string;
  }>({
    name: '',
    description: '',
    price: 189.9,
    categoryId: categories.find((c) => c.type === 'loja')?.id || '',
    images: ['https://images.unsplash.com/photo-1544965838-54ef8406f868?auto=format&fit=crop&w=800&q=80'],
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    isPreOrder: true,
    badge: '',
    estimatedDelivery: '15 a 20 dias úteis',
    fabric: 'Poliéster Dry-Tech com elastano UV50+',
  });

  // Classified edit modal state in Admin
  const [editingClassified, setEditingClassified] = useState<ClassifiedItem | null>(null);
  const [isClassifiedModalOpen, setIsClassifiedModalOpen] = useState(false);
  const [classifiedForm, setClassifiedForm] = useState<{
    title: string;
    categoryId: string;
    price: number;
    condition: ClassifiedCondition;
    description: string;
    images: string[];
    status: ClassifiedStatus;
  }>({
    title: '',
    categoryId: '',
    price: 0,
    condition: 'seminovo',
    description: '',
    images: [],
    status: 'ativo',
  });

  // Category form & editing state
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<'loja' | 'classificados' | 'ambos'>('classificados');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');
  const [editingCatType, setEditingCatType] = useState<'loja' | 'classificados' | 'ambos'>('classificados');

  // Filters for admin tabs
  const [productCategoryFilter, setProductCategoryFilter] = useState('todos');
  const [classifiedCategoryFilter, setClassifiedCategoryFilter] = useState('todos');

  // Inline Category creation inside Product and Classified modals
  const [isAddingCatInProductModal, setIsAddingCatInProductModal] = useState(false);
  const [inlineCatNameProduct, setInlineCatNameProduct] = useState('');
  const [isAddingCatInClassifiedModal, setIsAddingCatInClassifiedModal] = useState(false);
  const [inlineCatNameClassified, setInlineCatNameClassified] = useState('');

  // Dedicated Quick Photo Manager Modal
  const [quickPhotoModal, setQuickPhotoModal] = useState<{
    type: 'produto' | 'classificado';
    id: string;
    name: string;
    images: string[];
  } | null>(null);

  // Orders Flow & Simplified List states
  const [orderViewMode, setOrderViewMode] = useState<'foco' | 'kanban4'>('foco');
  const [historyStatusFilter, setHistoryStatusFilter] = useState<'todos' | 'enviado' | 'entregue'>('todos');
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Production scripts viewer state
  const [selectedScriptTab, setSelectedScriptTab] = useState<
    'setup' | 'deploy' | 'github' | 'drive' | 'nginx' | 'pm2' | 'docker'
  >('setup');
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  // Ride form
  const [rideForm, setRideForm] = useState<Omit<RideSchedule, 'id'>>({
    title: '',
    date: 'Sábado',
    time: '07:00',
    meetingPoint: '',
    distanceKm: 40,
    elevationM: 400,
    difficulty: 'Intermediário',
    gpxOrMapsLink: 'https://maps.google.com',
    description: '',
    leader: 'Capitão do Pelotão',
  });

  // Configuration edit state
  const [configForm, setConfigForm] = useState(groupConfig);

  // If not logged in as admin, show login gate
  if (currentUser?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-12 bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl text-center">
        <div className="flex justify-center mb-4">
          <AmarelinhosLogo size={70} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Painel de Controle Amarelinhos</h2>
        <p className="text-xs text-neutral-400 mb-6">
          Acesso exclusivo para os organizadores e administradores do grupo.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            login(adminEmail, adminPass);
          }}
          className="space-y-3.5 text-left"
        >
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">E-mail</label>
            <input
              type="text"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Senha</label>
            <input
              type="password"
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 py-3 bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold text-xs rounded-xl shadow-lg shadow-yellow-400/20 transition active:scale-95"
          >
            Entrar como Administrador
          </button>
        </form>

        <p className="text-[11px] text-neutral-500 mt-4">
          * Para avaliação rápida, basta clicar em "Entrar como Administrador" com as credenciais pré-preenchidas.
        </p>
      </div>
    );
  }

  // Metrics
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelado')
    .reduce((acc, o) => acc + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.status === 'pendente').length;
  const paidOrders = orders.filter((o) => o.status === 'pago').length;

  // Kanban columns
  const kanbanColumns: {
    status: OrderStatus;
    title: string;
    icon: React.ElementType;
    color: string;
    bgHeader: string;
  }[] = [
    {
      status: 'pendente',
      title: 'Pendente (Aguardando PIX)',
      icon: Clock,
      color: 'text-amber-400',
      bgHeader: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      status: 'pago',
      title: 'Pago',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bgHeader: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      status: 'enviado',
      title: 'Enviado / Disponível',
      icon: Truck,
      color: 'text-blue-400',
      bgHeader: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      status: 'entregue',
      title: 'Entregue / Concluído',
      icon: CheckCheck,
      color: 'text-purple-400',
      bgHeader: 'bg-purple-500/10 border-purple-500/20',
    },
  ];

  // Handle open product editor
  const handleOpenProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId,
        images: [...product.images],
        sizes: [...product.sizes],
        isPreOrder: !!product.isPreOrder,
        badge: product.badge || '',
        estimatedDelivery: product.estimatedDelivery || '',
        fabric: product.fabric || '',
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: 189.9,
        categoryId: categories.find((c) => c.type === 'loja')?.id || '',
        images: ['https://images.unsplash.com/photo-1544965838-54ef8406f868?auto=format&fit=crop&w=800&q=80'],
        sizes: ['PP', 'P', 'M', 'G', 'GG'],
        isPreOrder: true,
        badge: 'Novo',
        estimatedDelivery: '15 a 20 dias úteis',
        fabric: 'Dry-Tech UV50+',
      });
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    const stockBySize: Record<ClothingSize, number> = {
      PP: 10,
      P: 20,
      M: 30,
      G: 25,
      GG: 15,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...productForm,
        stockBySize,
      });
    } else {
      addProduct({
        ...productForm,
        slug: productForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        stockBySize,
      });
    }
    setIsProductModalOpen(false);
  };

  const handleOpenClassifiedModal = (item: ClassifiedItem) => {
    setEditingClassified(item);
    setClassifiedForm({
      title: item.title,
      categoryId: item.categoryId,
      price: item.price,
      condition: item.condition,
      description: item.description,
      images: [...item.images],
      status: item.status,
    });
    setIsClassifiedModalOpen(true);
  };

  const handleSaveClassified = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClassified) return;
    if (classifiedForm.images.length === 0) {
      showToast('O anúncio deve ter pelo menos 1 foto.', 'error');
      return;
    }
    updateClassified(editingClassified.id, classifiedForm);
    setIsClassifiedModalOpen(false);
    showToast('Anúncio e galeria de fotos atualizados com sucesso!', 'success');
  };

  const productPresets = [
    { label: 'Jersey Amarelinhos', url: 'https://images.unsplash.com/photo-1544965838-54ef8406f868?auto=format&fit=crop&w=800&q=80' },
    { label: 'Bretelle Pro Gel', url: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=800&q=80' },
    { label: 'Corta-Vento', url: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=800&q=80' },
    { label: 'Manga Longa UV50+', url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80' },
    { label: 'Meias Cano Médio', url: 'https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&w=800&q=80' },
    { label: 'Caramanhola Térmica', url: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=800&q=80' },
  ];

  const handleExportBackup = () => {
    const fullBackup = {
      exportedAt: new Date().toISOString(),
      groupConfig,
      products,
      orders,
      classifieds,
      categories,
      rides,
      users,
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `amarelinhos-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    showToast('Backup completo dos dados baixado com sucesso!', 'success');
  };

  const handleExportPendingAndPaidExcel = () => {
    const targetOrders = orders.filter((o) => o.status === 'pendente' || o.status === 'pago');

    if (targetOrders.length === 0) {
      showToast('Nenhuma encomenda Pendente ou Paga para exportar no momento.', 'info');
      return;
    }

    // CSV headers compatible with Microsoft Excel in Brazilian Portuguese (UTF-8 with BOM and semicolon separator)
    const headers = [
      'Código Encomenda',
      'Data / Hora',
      'Status',
      'Nome do Cliente',
      'WhatsApp / Telefone',
      'E-mail',
      'Cidade',
      'Estado',
      'Endereço de Entrega',
      'Método de Entrega',
      'Total de Peças',
      'Grade de Produtos e Tamanhos',
      'Valor Total (R$)',
      'TXID PIX',
      'Observações do Cliente',
    ];

    const escapeCsv = (str: string | number | undefined | null) => {
      if (str === undefined || str === null) return '""';
      const clean = String(str).replace(/"/g, '""').replace(/[\r\n]+/g, ' ');
      return `"${clean}"`;
    };

    const rows = targetOrders.map((ord) => {
      const itemsDetail = ord.items
        .map((it) => `${it.quantity}x ${it.productName} (Tam: ${it.size})`)
        .join('; ');
      const totalPieces = ord.items.reduce((acc, it) => acc + it.quantity, 0);
      const formattedDate = new Date(ord.createdAt).toLocaleString('pt-BR');
      const statusLabel = ord.status === 'pago' ? 'Pago' : 'Pendente (Aguardando PIX)';
      const deliveryLabel = ord.deliveryMethod === 'retirada' ? 'Retirada no Pedal' : 'Envio Correios';

      return [
        escapeCsv(ord.code),
        escapeCsv(formattedDate),
        escapeCsv(statusLabel),
        escapeCsv(ord.customer.name),
        escapeCsv(ord.customer.phone),
        escapeCsv(ord.customer.email),
        escapeCsv(ord.customer.city),
        escapeCsv(ord.customer.state),
        escapeCsv(ord.customer.address || 'N/A'),
        escapeCsv(deliveryLabel),
        escapeCsv(totalPieces),
        escapeCsv(itemsDetail),
        escapeCsv(ord.totalAmount.toFixed(2).replace('.', ',')),
        escapeCsv(ord.pixTxid),
        escapeCsv(ord.customer.notes || ''),
      ].join(';');
    });

    const csvContent = '\uFEFF' + [headers.map((h) => `"${h}"`).join(';'), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().slice(0, 10);
    link.download = `amarelinhos_encomendas_pendentes_e_pagos_${dateStr}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    showToast(`Planilha Excel exportada com ${targetOrders.length} encomenda(s) Pendentes e Pagas!`, 'success');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Admin Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AmarelinhosLogo size={48} />
          <div>
            <div className="inline-flex items-center gap-1.5 text-yellow-400 text-[10px] font-black uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              Painel Administrativo Ativo
            </div>
            <h1 className="font-display text-3xl font-black uppercase text-white">
              Gestão Geral Amarelinhos
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportBackup}
            className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold flex items-center gap-1.5 transition border border-neutral-700"
            title="Baixar JSON com todos os dados"
          >
            <Download className="w-3.5 h-3.5 text-yellow-400" />
            <span>Exportar Backup</span>
          </button>

          <button
            onClick={resetToDefaultData}
            className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition border border-neutral-700"
            title="Restaurar dados iniciais de demonstração"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrões</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
            Faturamento Encomendas
          </span>
          <div className="font-display text-3xl font-black text-yellow-400 leading-none">
            R$ {totalRevenue.toFixed(2).replace('.', ',')}
          </div>
        </div>

        <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
            Aguardando Pagamento
          </span>
          <div className="font-display text-3xl font-black text-amber-400 leading-none">
            {pendingOrders}
          </div>
        </div>

        <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
            Pedidos Pagos
          </span>
          <div className="font-display text-3xl font-black text-emerald-400 leading-none">
            {paidOrders}
          </div>
        </div>

        <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
            Anúncios Classificados
          </span>
          <div className="font-display text-3xl font-black text-white leading-none">
            {classifieds.length}
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-800 scrollbar-none">
        {[
          { id: 'kanban', label: '📦 Kanban de Encomendas', count: orders.length },
          { id: 'produtos', label: '🏷️ Produtos (PP-GG)', count: products.length },
          { id: 'classificados', label: '📢 Moderação Anúncios', count: classifieds.length },
          { id: 'categorias', label: '📂 Categorias', count: categories.length },
          { id: 'clientes', label: '👥 Clientes', count: users.length },
          { id: 'pedais', label: '🚴 Próximos Pedais', count: rides.length },
          { id: 'configuracoes', label: '⚙️ Dados & PIX BACEN' },
          { id: 'producao', label: '🚀 Produção & Deploy' },
        ].map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id as AdminTab)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
                isActive
                  ? 'bg-yellow-400 text-neutral-950 shadow-md shadow-yellow-400/20'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-neutral-950 text-yellow-400' : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: KANBAN DE ENCOMENDAS */}
      {currentTab === 'kanban' && (
        <div className="space-y-6">
          {/* Top Bar with Title, Excel Export & View Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 p-4 sm:p-5 rounded-3xl shadow-lg">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <h2 className="font-display text-2xl font-bold uppercase text-white">
                  Fluxo de Encomendas dos Clientes
                </h2>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Gerencie pedidos de uniformes, confira comprovantes PIX, exporte a planilha para confecção e acompanhe entregas
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Export to Excel Button for Pendentes e Pagos */}
              <button
                type="button"
                onClick={handleExportPendingAndPaidExcel}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition active:scale-95 border border-emerald-400"
                title="Exportar encomendas com status Pendente e Pago para planilha Excel (.csv UTF-8)"
              >
                <FileSpreadsheet className="w-4 h-4 text-neutral-950 shrink-0" />
                <span>Exportar Excel (Pendentes & Pagos)</span>
                <span className="px-1.5 py-0.5 rounded-md bg-neutral-950 text-emerald-400 text-[10px] font-black">
                  {pendingOrders + paidOrders}
                </span>
              </button>

              {/* View Mode Toggle: Visão Otimizada vs 4 Colunas */}
              <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
                <button
                  type="button"
                  onClick={() => setOrderViewMode('foco')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                    orderViewMode === 'foco'
                      ? 'bg-yellow-400 text-neutral-950 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Visão Focada: Pendentes e Pagos em destaque com lista simplificada para Enviados e Entregues"
                >
                  <span>Visão Otimizada</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderViewMode('kanban4')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                    orderViewMode === 'kanban4'
                      ? 'bg-yellow-400 text-neutral-950 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Exibir todas as 4 colunas tradicionais do Kanban"
                >
                  <span>4 Colunas</span>
                </button>
              </div>
            </div>
          </div>

          {/* VIEW MODE 1: VISÃO OTIMIZADA (Pendentes & Pagos em Destaque + Lista Simplificada para Enviados & Entregues) */}
          {orderViewMode === 'foco' ? (
            <div className="space-y-6">
              {/* 2 Wide Columns: Pendente & Pago */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold text-neutral-400 tracking-wider">
                      Fase Operacional Ativa (Produção & Pagamentos)
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-800 text-yellow-400 font-bold">
                      {pendingOrders + paidOrders} pedidos em andamento
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                  {kanbanColumns
                    .filter((c) => c.status === 'pendente' || c.status === 'pago')
                    .map((col) => {
                      const colOrders = orders.filter((o) => o.status === col.status);
                      const ColIcon = col.icon;

                      return (
                        <div
                          key={col.status}
                          className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-4 flex flex-col gap-3 min-h-[380px]"
                        >
                          {/* Column Header */}
                          <div
                            className={`p-3.5 rounded-2xl border flex items-center justify-between ${col.bgHeader}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <ColIcon className={`w-4 h-4 ${col.color}`} />
                              <span className="text-sm font-bold text-white">{col.title}</span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-neutral-950 text-white text-xs font-bold">
                              {colOrders.length}
                            </span>
                          </div>

                          {/* Orders Cards */}
                          <div className="space-y-3 flex-1 overflow-y-auto max-h-[620px] pr-1">
                            {colOrders.length === 0 ? (
                              <div className="text-center py-12 text-neutral-500 text-xs">
                                Nenhum pedido com status "{col.title}" no momento.
                              </div>
                            ) : (
                              colOrders.map((ord) => (
                                <div
                                  key={ord.id}
                                  className="bg-neutral-950 border border-neutral-800 hover:border-yellow-400/40 rounded-2xl p-4 shadow-md transition space-y-3"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono text-xs font-bold text-yellow-400">
                                        #{ord.code}
                                      </span>
                                      <span
                                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                          ord.status === 'pago'
                                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                        }`}
                                      >
                                        {ord.status === 'pago' ? 'Pago' : 'Aguardando PIX'}
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-neutral-500">
                                      {new Date(ord.createdAt).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </span>
                                  </div>

                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <p className="text-xs font-bold text-white truncate">
                                        {ord.customer.name}
                                      </p>
                                      <p className="text-[11px] text-neutral-400 flex items-center gap-1.5 mt-0.5">
                                        <span>WhatsApp:</span>
                                        <a
                                          href={`https://wa.me/55${ord.customer.phone.replace(/\D/g, '')}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-emerald-400 hover:underline font-bold inline-flex items-center gap-1"
                                        >
                                          <MessageCircle className="w-3 h-3 text-emerald-400" />
                                          {ord.customer.phone}
                                        </a>
                                      </p>
                                      {ord.customer.city && (
                                        <p className="text-[10px] text-neutral-500">
                                          {ord.customer.city} - {ord.customer.state}
                                        </p>
                                      )}
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => setSelectedOrderDetails(ord)}
                                      className="text-[10px] text-neutral-400 hover:text-white px-2 py-1 rounded-lg bg-neutral-900 border border-neutral-800 transition"
                                      title="Ver todos os detalhes da encomenda"
                                    >
                                      Detalhes
                                    </button>
                                  </div>

                                  {/* Items with Sizes */}
                                  <div className="bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-800/80 space-y-1.5 text-xs">
                                    <div className="text-[10px] uppercase font-bold text-neutral-400 flex justify-between">
                                      <span>Peças da Encomenda</span>
                                      <span className="text-neutral-400">
                                        {ord.items.reduce((acc, it) => acc + it.quantity, 0)} un.
                                      </span>
                                    </div>
                                    {ord.items.map((it, i) => (
                                      <div key={i} className="flex items-center justify-between text-[11px]">
                                        <span className="truncate max-w-[200px] text-neutral-200">
                                          {it.quantity}x {it.productName}
                                        </span>
                                        <span className="font-bold text-yellow-400 px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700">
                                          Tam: {it.size}
                                        </span>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Delivery info & Notes */}
                                  <div className="text-[11px] text-neutral-400 flex items-center justify-between">
                                    <span>Entrega:</span>
                                    <span className="font-medium text-white capitalize">
                                      {ord.deliveryMethod === 'retirada' ? 'Retirada no Pedal' : 'Envio Correios'}
                                    </span>
                                  </div>

                                  {ord.customer.notes && (
                                    <div className="text-[10px] text-neutral-300 bg-neutral-900 p-2 rounded-lg border border-neutral-800">
                                      Obs: <em>{ord.customer.notes}</em>
                                    </div>
                                  )}

                                  <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                                    <span className="text-[10px] text-neutral-500 font-mono">
                                      TXID: {ord.pixTxid}
                                    </span>
                                    <span className="font-display text-xl font-black text-yellow-400">
                                      R$ {ord.totalAmount.toFixed(2).replace('.', ',')}
                                    </span>
                                  </div>

                                  {/* Action Buttons to Transition Status */}
                                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                                    {col.status === 'pendente' && (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() => updateOrderStatus(ord.id, 'pago')}
                                          className="col-span-2 py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-xl transition shadow-md shadow-emerald-500/20 active:scale-95"
                                        >
                                          ✓ Confirmar PIX Pago
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (confirm(`Tem certeza que deseja cancelar a encomenda #${ord.code}?`)) {
                                              updateOrderStatus(ord.id, 'cancelado');
                                            }
                                          }}
                                          className="col-span-2 py-1 text-neutral-500 hover:text-red-400 text-[10px]"
                                        >
                                          Cancelar Pedido
                                        </button>
                                      </>
                                    )}

                                    {col.status === 'pago' && (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setSelectedOrderForTracking(ord.id);
                                            setTrackingInput('');
                                          }}
                                          className="py-2 px-2 bg-blue-500 hover:bg-blue-400 text-neutral-950 font-bold text-[11px] rounded-xl transition shadow-md shadow-blue-500/20"
                                        >
                                          Despachar / Rastreio
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => updateOrderStatus(ord.id, 'enviado')}
                                          className="py-2 px-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-[11px] rounded-xl border border-neutral-700 transition"
                                        >
                                          Disponível Retirada
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* SECTION: LISTA MAIS SIMPLIFICADA DE PEDIDOS ENVIADOS E ENTREGUES */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-xl space-y-4">
                {/* Header of Simplified List */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold uppercase text-white flex items-center gap-2">
                        <span>Pedidos Enviados e Entregues</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-sans font-bold">
                          {orders.filter((o) => o.status === 'enviado' || o.status === 'entregue').length}
                        </span>
                      </h3>
                      <p className="text-[11px] text-neutral-400">
                        Lista simplificada e compacta para rápido acompanhamento das entregas do pelotão
                      </p>
                    </div>
                  </div>

                  {/* Filter and Search controls */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
                      <button
                        type="button"
                        onClick={() => setHistoryStatusFilter('todos')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
                          historyStatusFilter === 'todos'
                            ? 'bg-neutral-800 text-white'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Todos ({orders.filter((o) => o.status === 'enviado' || o.status === 'entregue').length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setHistoryStatusFilter('enviado')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
                          historyStatusFilter === 'enviado'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Enviados ({orders.filter((o) => o.status === 'enviado').length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setHistoryStatusFilter('entregue')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
                          historyStatusFilter === 'entregue'
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Entregues ({orders.filter((o) => o.status === 'entregue').length})
                      </button>
                    </div>

                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={historySearchTerm}
                        onChange={(e) => setHistorySearchTerm(e.target.value)}
                        placeholder="Buscar cliente ou #código..."
                        className="bg-neutral-950 border border-neutral-800 rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400 w-44 sm:w-56"
                      />
                      {historySearchTerm && (
                        <button
                          type="button"
                          onClick={() => setHistorySearchTerm('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Simplified List Content */}
                {(() => {
                  const filteredHistory = orders.filter((o) => {
                    if (o.status !== 'enviado' && o.status !== 'entregue') return false;
                    if (historyStatusFilter !== 'todos' && o.status !== historyStatusFilter) return false;
                    if (historySearchTerm.trim()) {
                      const q = historySearchTerm.toLowerCase();
                      const matchName = o.customer.name.toLowerCase().includes(q);
                      const matchCode = o.code.toLowerCase().includes(q);
                      const matchPhone = o.customer.phone.toLowerCase().includes(q);
                      const matchProduct = o.items.some((it) => it.productName.toLowerCase().includes(q));
                      if (!matchName && !matchCode && !matchPhone && !matchProduct) return false;
                    }
                    return true;
                  });

                  if (filteredHistory.length === 0) {
                    return (
                      <div className="text-center py-10 bg-neutral-950/50 rounded-2xl border border-neutral-800/80 text-neutral-500 text-xs">
                        {historySearchTerm
                          ? `Nenhum pedido encontrado para "${historySearchTerm}".`
                          : 'Nenhum pedido com status Enviado ou Entregue no momento.'}
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-2">
                      {filteredHistory.map((ord) => {
                        const isEnviado = ord.status === 'enviado';
                        const totalPieces = ord.items.reduce((acc, it) => acc + it.quantity, 0);

                        return (
                          <div
                            key={ord.id}
                            className="bg-neutral-950 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-3 sm:p-4 transition flex flex-col md:flex-row md:items-center justify-between gap-3"
                          >
                            {/* Column 1: Code, Status & Date */}
                            <div className="flex items-center gap-3 min-w-[200px]">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-yellow-400">
                                    #{ord.code}
                                  </span>
                                  <span
                                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                      isEnviado
                                        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                                        : 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                                    }`}
                                  >
                                    {isEnviado ? 'Enviado / Retirada' : '✓ Entregue'}
                                  </span>
                                </div>
                                <div className="text-[10px] text-neutral-500 mt-0.5">
                                  {new Date(ord.createdAt).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                  {' • '}
                                  <span className="capitalize text-neutral-400">
                                    {ord.deliveryMethod === 'retirada' ? 'Retirada no Pedal' : 'Correios'}
                                  </span>
                                  {ord.trackingCode && (
                                    <span className="ml-1 text-blue-400 font-mono">
                                      ({ord.trackingCode})
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Column 2: Customer & WhatsApp */}
                            <div className="min-w-[180px]">
                              <p className="text-xs font-bold text-white truncate">
                                {ord.customer.name}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <a
                                  href={`https://wa.me/55${ord.customer.phone.replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                                >
                                  <MessageCircle className="w-3 h-3 text-emerald-400" />
                                  {ord.customer.phone}
                                </a>
                                {ord.customer.city && (
                                  <span className="text-[10px] text-neutral-500">
                                    {ord.customer.city}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Column 3: Items & Sizes summary */}
                            <div className="flex-1 min-w-[200px]">
                              <div className="flex flex-wrap items-center gap-1.5">
                                {ord.items.map((it, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200"
                                  >
                                    <span>{it.quantity}x {it.productName.split(' ')[0]}</span>
                                    <strong className="text-yellow-400 font-black">{it.size}</strong>
                                  </span>
                                ))}
                                {totalPieces > 2 && (
                                  <span className="text-[10px] text-neutral-400">
                                    ({totalPieces} peças no total)
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Column 4: Total & Quick Action */}
                            <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-800">
                              <span className="font-display text-base font-black text-white shrink-0">
                                R$ {ord.totalAmount.toFixed(2).replace('.', ',')}
                              </span>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {isEnviado ? (
                                  <button
                                    type="button"
                                    onClick={() => updateOrderStatus(ord.id, 'entregue')}
                                    className="py-1.5 px-3 bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs rounded-xl transition shadow-sm active:scale-95 flex items-center gap-1"
                                    title="Marcar como entregue ao ciclista"
                                  >
                                    <CheckCheck className="w-3.5 h-3.5" />
                                    <span>Marcar Entregue</span>
                                  </button>
                                ) : (
                                  <span className="text-[11px] text-purple-400 font-bold px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center gap-1">
                                    <CheckCheck className="w-3 h-3 text-purple-400" />
                                    Concluído
                                  </span>
                                )}

                                <button
                                  type="button"
                                  onClick={() => setSelectedOrderDetails(ord)}
                                  className="py-1.5 px-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs rounded-xl transition border border-neutral-700"
                                  title="Ver todos os detalhes"
                                >
                                  Ver
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          ) : (
            /* VIEW MODE 2: KANBAN CLÁSSICO DE 4 COLUNAS */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
              {kanbanColumns.map((col) => {
                const colOrders = orders.filter((o) => o.status === col.status);
                const ColIcon = col.icon;

                return (
                  <div
                    key={col.status}
                    className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-4 flex flex-col gap-3 min-h-[450px]"
                  >
                    {/* Column Header */}
                    <div
                      className={`p-3 rounded-2xl border flex items-center justify-between ${col.bgHeader}`}
                    >
                      <div className="flex items-center gap-2">
                        <ColIcon className={`w-4 h-4 ${col.color}`} />
                        <span className="text-xs font-bold text-white">{col.title}</span>
                      </div>
                      <span className="w-5 h-5 rounded-full bg-neutral-950 text-white text-[11px] font-bold flex items-center justify-center">
                        {colOrders.length}
                      </span>
                    </div>

                    {/* Orders Cards */}
                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                      {colOrders.length === 0 ? (
                        <div className="text-center py-10 text-neutral-600 text-xs">
                          Nenhum pedido nesta etapa
                        </div>
                      ) : (
                        colOrders.map((ord) => (
                          <div
                            key={ord.id}
                            className="bg-neutral-950 border border-neutral-800 hover:border-yellow-400/40 rounded-2xl p-4 shadow-md transition space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs font-bold text-yellow-400">
                                #{ord.code}
                              </span>
                              <span className="text-[10px] text-neutral-500">
                                {new Date(ord.createdAt).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>

                            <div>
                              <p className="text-xs font-bold text-white truncate">
                                {ord.customer.name}
                              </p>
                              <p className="text-[11px] text-neutral-400 flex items-center gap-1">
                                <span>WhatsApp:</span>
                                <a
                                  href={`https://wa.me/55${ord.customer.phone.replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-400 hover:underline font-medium"
                                >
                                  {ord.customer.phone}
                                </a>
                              </p>
                            </div>

                            {/* Items with Sizes */}
                            <div className="bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-800/80 space-y-1.5 text-xs">
                              {ord.items.map((it, i) => (
                                <div key={i} className="flex items-center justify-between text-[11px]">
                                  <span className="truncate max-w-[150px] text-neutral-200">
                                    {it.quantity}x {it.productName}
                                  </span>
                                  <span className="font-bold text-yellow-400 px-1.5 py-0.5 rounded bg-neutral-800">
                                    Tam: {it.size}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Delivery info */}
                            <div className="text-[11px] text-neutral-400 flex items-center justify-between">
                              <span>Tipo:</span>
                              <span className="font-medium text-white capitalize">
                                {ord.deliveryMethod === 'retirada' ? 'Retirada no Pedal' : 'Envio Correios'}
                              </span>
                            </div>

                            {ord.trackingCode && (
                              <div className="text-[10px] text-blue-400 bg-blue-500/10 p-1.5 rounded-lg border border-blue-500/20">
                                Rastreio: <strong>{ord.trackingCode}</strong>
                              </div>
                            )}

                            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                              <span className="font-display text-xl font-black text-yellow-400">
                                R$ {ord.totalAmount.toFixed(2).replace('.', ',')}
                              </span>
                            </div>

                            {/* Action Buttons to Transition Status */}
                            <div className="grid grid-cols-2 gap-1.5 pt-1">
                              {col.status === 'pendente' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => updateOrderStatus(ord.id, 'pago')}
                                    className="col-span-2 py-1.5 px-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-[10px] rounded-lg transition"
                                  >
                                    ✓ Confirmar PIX Pago
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateOrderStatus(ord.id, 'cancelado')}
                                    className="col-span-2 py-1 text-neutral-500 hover:text-red-400 text-[10px]"
                                  >
                                    Cancelar
                                  </button>
                                </>
                              )}

                              {col.status === 'pago' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedOrderForTracking(ord.id);
                                      setTrackingInput('');
                                    }}
                                    className="py-1.5 px-2 bg-blue-500 hover:bg-blue-400 text-neutral-950 font-bold text-[10px] rounded-lg transition"
                                  >
                                    Despachar / Rastreio
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateOrderStatus(ord.id, 'enviado')}
                                    className="py-1.5 px-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-[10px] rounded-lg border border-neutral-700 transition"
                                  >
                                    Disponível Retirada
                                  </button>
                                </>
                              )}

                              {col.status === 'enviado' && (
                                <button
                                  type="button"
                                  onClick={() => updateOrderStatus(ord.id, 'entregue')}
                                  className="col-span-2 py-1.5 px-2 bg-purple-500 hover:bg-purple-400 text-white font-bold text-[10px] rounded-lg transition"
                                >
                                  ✓ Marcar como Entregue
                                </button>
                              )}

                              {col.status === 'entregue' && (
                                <div className="col-span-2 text-center text-[10px] text-emerald-400 font-bold py-1">
                                  Pedido Concluído
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Modal de Detalhes Completos da Encomenda */}
          {selectedOrderDetails && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl my-auto animate-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      Ficha da Encomenda
                    </span>
                    <h3 className="font-mono text-2xl font-black text-yellow-400">
                      #{selectedOrderDetails.code}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedOrderDetails(null)}
                    className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Status & Date */}
                  <div className="flex items-center justify-between bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Status Atual:</span>
                      <strong className="text-white capitalize font-black text-sm">
                        {selectedOrderDetails.status === 'pago'
                          ? 'Pago'
                          : selectedOrderDetails.status === 'enviado'
                          ? 'Enviado / Disponível Retirada'
                          : selectedOrderDetails.status === 'entregue'
                          ? 'Entregue / Concluído'
                          : selectedOrderDetails.status}
                      </strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-neutral-400 block">Data do Pedido:</span>
                      <span className="text-neutral-200">
                        {new Date(selectedOrderDetails.createdAt).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      Dados do Ciclista
                    </span>
                    <p className="font-bold text-white text-sm">{selectedOrderDetails.customer.name}</p>
                    <p className="text-neutral-300">WhatsApp: {selectedOrderDetails.customer.phone}</p>
                    <p className="text-neutral-400">E-mail: {selectedOrderDetails.customer.email}</p>
                    <p className="text-neutral-400">
                      Cidade: {selectedOrderDetails.customer.city} - {selectedOrderDetails.customer.state}
                    </p>
                    {selectedOrderDetails.customer.address && (
                      <p className="text-neutral-300">
                        Endereço: {selectedOrderDetails.customer.address}
                      </p>
                    )}
                    {selectedOrderDetails.customer.notes && (
                      <p className="text-amber-300 bg-amber-500/10 p-2 rounded border border-amber-500/20">
                        Obs: {selectedOrderDetails.customer.notes}
                      </p>
                    )}
                  </div>

                  {/* Items Table */}
                  <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      Itens e Tamanhos
                    </span>
                    {selectedOrderDetails.items.map((it: OrderItem, idx: number) => (
                      <div key={idx} className="flex items-center justify-between pb-1.5 border-b border-neutral-800/60 last:border-0 last:pb-0">
                        <div>
                          <p className="font-bold text-white">{it.productName}</p>
                          <span className="text-[11px] text-neutral-400">
                            Qtd: {it.quantity} x R$ {it.unitPrice.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-yellow-400 text-neutral-950 font-black text-xs">
                          {it.size}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery & Tracking */}
                  <div className="flex items-center justify-between bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-[11px]">
                    <div>
                      <span className="text-neutral-400 block">Forma de Entrega:</span>
                      <strong className="text-white capitalize">
                        {selectedOrderDetails.deliveryMethod === 'retirada'
                          ? 'Retirada no Pedal Oficial'
                          : 'Envio Correios'}
                      </strong>
                    </div>
                    {selectedOrderDetails.trackingCode && (
                      <div className="text-right">
                        <span className="text-neutral-400 block">Rastreio:</span>
                        <strong className="text-blue-400 font-mono">
                          {selectedOrderDetails.trackingCode}
                        </strong>
                      </div>
                    )}
                  </div>

                  {/* Total Amount */}
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-neutral-400">Total da Encomenda:</span>
                    <span className="font-display text-2xl font-black text-yellow-400">
                      R$ {selectedOrderDetails.totalAmount.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOrderDetails(null)}
                    className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-xl transition"
                  >
                    Fechar Detalhes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tracking code prompt modal */}
          {selectedOrderForTracking && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
                <h3 className="text-sm font-bold text-white">Código de Rastreio dos Correios</h3>
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="Ex: BR123456789SP"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white uppercase focus:outline-none focus:border-yellow-400"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setSelectedOrderForTracking(null)}
                    className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      updateOrderTracking(selectedOrderForTracking, trackingInput || 'ENTREGA_PEDAL');
                      setSelectedOrderForTracking(null);
                    }}
                    className="px-4 py-1.5 bg-yellow-400 text-neutral-950 text-xs font-bold rounded-xl"
                  >
                    Salvar e Despachar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUTOS DA LOJA (CRUD) */}
      {currentTab === 'produtos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold uppercase text-white">
                Cadastro de Uniformes e Produtos
              </h2>
              <p className="text-xs text-neutral-400">
                Todos os produtos possuem tamanhos configuráveis de PP a GG e estoque independente
              </p>
            </div>
            <button
              onClick={() => handleOpenProductModal()}
              className="px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-yellow-400/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Produto</span>
            </button>
          </div>

          {/* Category Filter Pills for Admin Products */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setProductCategoryFilter('todos')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                productCategoryFilter === 'todos'
                  ? 'bg-yellow-400 text-neutral-950 shadow-md shadow-yellow-400/20'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <span>Todos os Produtos</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-950/40 font-bold">
                {products.length}
              </span>
            </button>
            {categories
              .filter((c) => c.type === 'loja' || c.type === 'ambos')
              .map((cat) => {
                const count = products.filter((p) => p.categoryId === cat.id).length;
                const isSelected = productCategoryFilter === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setProductCategoryFilter(cat.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-yellow-400 text-neutral-950 shadow-md shadow-yellow-400/20'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-950/40 font-bold">
                      {count}
                    </span>
                  </button>
                );
              })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products
              .filter((p) => productCategoryFilter === 'todos' || p.categoryId === productCategoryFilter)
              .map((prod) => {
                const prodCat = categories.find((c) => c.id === prod.categoryId);

                return (
                  <div
                    key={prod.id}
                    className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between space-y-3"
                  >
                    <div className="flex gap-3">
                      <div className="relative group shrink-0">
                        <img
                          src={prod.images[0]}
                          alt=""
                          className="w-16 h-16 rounded-xl object-cover bg-neutral-950 border border-neutral-800"
                        />
                        <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-black/80 text-[9px] font-bold text-yellow-400 border border-neutral-700">
                          {prod.images.length} 📸
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          {prodCat && (
                            <span className="text-[10px] font-black uppercase text-yellow-400 bg-neutral-950 px-2 py-0.5 rounded-full border border-neutral-800">
                              {prodCat.name}
                            </span>
                          )}
                          {prod.badge && (
                            <span className="text-[10px] font-bold uppercase text-neutral-300 bg-neutral-800 px-2 py-0.5 rounded-full">
                              {prod.badge}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-white text-sm truncate">{prod.name}</h3>
                        <p className="font-display text-xl font-bold text-white">
                          R$ {prod.price.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>

                    {/* Mini thumbnails preview for fast image verification */}
                    {prod.images.length > 1 && (
                      <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
                        {prod.images.map((imgUrl, i) => (
                          <div
                            key={i}
                            className={`w-9 h-9 rounded-lg overflow-hidden shrink-0 border ${
                              i === 0 ? 'border-yellow-400 ring-1 ring-yellow-400/40' : 'border-neutral-800'
                            }`}
                          >
                            <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800/80 text-xs space-y-1">
                      <div className="text-[11px] text-neutral-400">Tamanhos Disponíveis:</div>
                      <div className="flex flex-wrap gap-1">
                        {prod.sizes.map((sz) => (
                          <span
                            key={sz}
                            className="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] font-bold text-neutral-300 border border-neutral-700"
                          >
                            {sz}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
                      {/* Direct Quick Photo Manager */}
                      <button
                        onClick={() =>
                          setQuickPhotoModal({
                            type: 'produto',
                            id: prod.id,
                            name: prod.name,
                            images: [...prod.images],
                          })
                        }
                        className="px-2.5 py-1 rounded-lg bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 flex items-center gap-1 font-bold text-[11px] transition"
                        title="Gerenciar e reordenar fotos deste produto"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-yellow-400" />
                        <span>Fotos ({prod.images.length})</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenProductModal(prod)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
                          title="Editar Detalhes"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-yellow-400" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Excluir o produto "${prod.name}"?`)) {
                              deleteProduct(prod.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-500/20 text-neutral-400 hover:text-red-400"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Product Modal Form with Image Gallery Manager and Category select */}
          {isProductModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-auto space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <h3 className="font-display text-2xl font-bold uppercase text-white flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-yellow-400" />
                    {editingProduct ? 'Editar Produto da Loja' : 'Cadastrar Novo Produto'}
                  </h3>
                  <button
                    onClick={() => setIsProductModalOpen(false)}
                    className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-neutral-300 mb-1">Nome do Produto *</label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="Ex: Camisa Oficial Amarelinhos 2025"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-yellow-400"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-neutral-300 flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5 text-yellow-400" />
                          Categoria da Loja *
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsAddingCatInProductModal(!isAddingCatInProductModal)}
                          className="text-[10px] text-yellow-400 hover:text-yellow-300 flex items-center gap-0.5 font-bold"
                        >
                          <Plus className="w-3 h-3" />
                          {isAddingCatInProductModal ? 'Cancelar' : 'Nova Categoria'}
                        </button>
                      </div>

                      {isAddingCatInProductModal ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={inlineCatNameProduct}
                            onChange={(e) => setInlineCatNameProduct(e.target.value)}
                            placeholder="Nova Categoria..."
                            className="flex-1 bg-neutral-950 border border-yellow-400 rounded-xl px-2.5 py-2 text-white text-xs focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!inlineCatNameProduct.trim()) return;
                              const name = inlineCatNameProduct.trim();
                              const newId = 'cat-' + Date.now().toString(36);
                              addCategory({
                                name,
                                slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                                type: 'loja',
                              });
                              setProductForm((prev) => ({ ...prev, categoryId: newId }));
                              setInlineCatNameProduct('');
                              setIsAddingCatInProductModal(false);
                              showToast(`Categoria "${name}" criada e selecionada!`, 'success');
                            }}
                            className="px-2.5 py-2 bg-yellow-400 text-neutral-950 text-xs font-bold rounded-xl"
                          >
                            Criar
                          </button>
                        </div>
                      ) : (
                        <select
                          value={productForm.categoryId}
                          onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-yellow-400"
                          required
                        >
                          <option value="">Selecione uma categoria...</option>
                          {categories
                            .filter((c) => c.type === 'loja' || c.type === 'ambos')
                            .map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name} {c.type === 'ambos' ? '(Loja & Classificados)' : ''}
                              </option>
                            ))}
                        </select>
                      )}
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-300 mb-1">Preço em R$ *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={productForm.price}
                        onChange={(e) =>
                          setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-yellow-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-300 mb-1">Selo / Badge</label>
                      <input
                        type="text"
                        value={productForm.badge}
                        onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                        placeholder="Ex: Mais Vendido, Linha Pro"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-300 mb-1">Descrição do Produto</label>
                    <textarea
                      rows={2}
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      placeholder="Descreva detalhes como bolsos, tecido, proteção solar, refletivos..."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-yellow-400 resize-none"
                    />
                  </div>

                  {/* Sizes (PP to GG) */}
                  <div>
                    <label className="block font-bold text-neutral-300 mb-1.5">
                      Tamanhos Disponíveis para Encomenda (PP a GG)
                    </label>
                    <div className="flex gap-2">
                      {(['PP', 'P', 'M', 'G', 'GG'] as ClothingSize[]).map((sz) => {
                        const isIncluded = productForm.sizes.includes(sz);
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => {
                              const newSizes = isIncluded
                                ? productForm.sizes.filter((s) => s !== sz)
                                : [...productForm.sizes, sz];
                              setProductForm({ ...productForm, sizes: newSizes });
                            }}
                            className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                              isIncluded
                                ? 'bg-yellow-400 text-neutral-950 border-yellow-400'
                                : 'bg-neutral-950 text-neutral-500 border-neutral-800'
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Advanced Multi-Image Gallery Manager for Products */}
                  <ImageGalleryManager
                    images={productForm.images}
                    onChange={(imgs) => setProductForm({ ...productForm, images: imgs })}
                    maxImages={8}
                    label="Galeria de Imagens do Uniforme / Produto"
                    helperText="Adicione fotos do produto. Você pode definir qual é a foto de Capa (Foto #1), reordenar com setas e remover fotos individualmente."
                    presets={productPresets}
                  />

                  <div className="flex justify-end gap-2 pt-4 border-t border-neutral-800">
                    <button
                      type="button"
                      onClick={() => setIsProductModalOpen(false)}
                      className="px-4 py-2 text-neutral-400 hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold rounded-xl shadow-md transition"
                    >
                      Salvar Produto
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MODERAÇÃO DE CLASSIFICADOS */}
      {currentTab === 'classificados' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold uppercase text-white">
                Moderação de Classificados dos Ciclistas
              </h2>
              <p className="text-xs text-neutral-400">
                Gerencie anúncios postados pelos usuários, pause, ative ou remova anúncios
              </p>
            </div>
          </div>

          {/* Category Filter Pills for Admin Classifieds */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setClassifiedCategoryFilter('todos')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                classifiedCategoryFilter === 'todos'
                  ? 'bg-yellow-400 text-neutral-950 shadow-md shadow-yellow-400/20'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <span>Todos os Anúncios</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-950/40 font-bold">
                {classifieds.length}
              </span>
            </button>
            {categories
              .filter((c) => c.type === 'classificados' || c.type === 'ambos')
              .map((cat) => {
                const count = classifieds.filter((c) => c.categoryId === cat.id).length;
                const isSelected = classifiedCategoryFilter === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setClassifiedCategoryFilter(cat.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-yellow-400 text-neutral-950 shadow-md shadow-yellow-400/20'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-950/40 font-bold">
                      {count}
                    </span>
                  </button>
                );
              })}
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Equipamento</th>
                    <th className="p-3">Categoria</th>
                    <th className="p-3">Preço</th>
                    <th className="p-3">Vendedor</th>
                    <th className="p-3">WhatsApp</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {classifieds
                    .filter((item) => classifiedCategoryFilter === 'todos' || item.categoryId === classifiedCategoryFilter)
                    .map((item) => {
                      const itemCat = categories.find((c) => c.id === item.categoryId);

                      return (
                        <tr key={item.id} className="hover:bg-neutral-800/40 transition">
                          <td className="p-3 flex items-center gap-3">
                            <div className="relative group shrink-0">
                              <img
                                src={item.images[0]}
                                alt=""
                                className="w-12 h-12 rounded-xl object-cover bg-neutral-950 border border-neutral-800"
                              />
                              <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-black/85 text-[9px] font-bold text-yellow-400 border border-neutral-700">
                                {item.images.length} 📸
                              </span>
                            </div>
                            <div>
                              <p className="font-bold text-white">{item.title}</p>
                              <span className="text-[10px] text-neutral-500 uppercase">{item.condition}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="px-2.5 py-0.5 rounded-full bg-neutral-950 text-yellow-300 text-[10px] font-bold border border-yellow-400/20">
                              {itemCat?.name || 'Sem Categoria'}
                            </span>
                          </td>
                          <td className="p-3 font-display text-lg font-bold text-yellow-400">
                            R$ {item.price.toLocaleString('pt-BR')}
                          </td>
                          <td className="p-3">{item.sellerName}</td>
                          <td className="p-3">
                            <a
                              href={`https://wa.me/55${item.sellerPhone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              {item.sellerPhone}
                            </a>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                item.status === 'ativo'
                                  ? 'bg-emerald-500/15 text-emerald-400'
                                  : item.status === 'vendido'
                                  ? 'bg-neutral-700 text-neutral-300'
                                  : 'bg-amber-500/15 text-amber-400'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Quick Photo Manager Trigger for Classified */}
                              <button
                                onClick={() =>
                                  setQuickPhotoModal({
                                    type: 'classificado',
                                    id: item.id,
                                    name: item.title,
                                    images: [...item.images],
                                  })
                                }
                                className="px-2 py-1 rounded-lg bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 flex items-center gap-1 font-bold text-[11px] transition"
                                title="Gerenciar e reordenar fotos deste classificado"
                              >
                                <ImageIcon className="w-3 h-3 text-yellow-400" />
                                <span>Fotos ({item.images.length})</span>
                              </button>

                              <button
                                onClick={() => handleOpenClassifiedModal(item)}
                                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
                                title="Editar Anúncio e Imagens"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-yellow-400" />
                              </button>

                              {item.status !== 'ativo' ? (
                                <button
                                  onClick={() => updateClassifiedStatus(item.id, 'ativo')}
                                  className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-[11px] font-bold"
                                >
                                  Ativar
                                </button>
                              ) : (
                                <button
                                  onClick={() => updateClassifiedStatus(item.id, 'pausado')}
                                  className="px-2 py-1 bg-neutral-800 text-neutral-300 rounded-lg text-[11px]"
                                >
                                  Pausar
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  if (confirm('Excluir este anúncio permanentemente?')) {
                                    deleteClassified(item.id);
                                  }
                                }}
                                className="p-1 text-neutral-500 hover:text-red-400"
                                title="Remover"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit Classified Modal for Admin */}
          {isClassifiedModalOpen && editingClassified && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-auto space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <h3 className="font-display text-2xl font-bold uppercase text-white flex items-center gap-2">
                    <Tag className="w-5 h-5 text-yellow-400" />
                    Gerenciar Anúncio & Fotos (Classificados)
                  </h3>
                  <button
                    onClick={() => setIsClassifiedModalOpen(false)}
                    className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveClassified} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-neutral-300 mb-1">Título do Anúncio *</label>
                    <input
                      type="text"
                      value={classifiedForm.title}
                      onChange={(e) => setClassifiedForm({ ...classifiedForm, title: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-yellow-400"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-neutral-300 flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5 text-yellow-400" />
                          Categoria do Anúncio *
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsAddingCatInClassifiedModal(!isAddingCatInClassifiedModal)}
                          className="text-[10px] text-yellow-400 hover:text-yellow-300 flex items-center gap-0.5 font-bold"
                        >
                          <Plus className="w-3 h-3" />
                          {isAddingCatInClassifiedModal ? 'Cancelar' : 'Nova'}
                        </button>
                      </div>

                      {isAddingCatInClassifiedModal ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={inlineCatNameClassified}
                            onChange={(e) => setInlineCatNameClassified(e.target.value)}
                            placeholder="Nova Categoria..."
                            className="flex-1 bg-neutral-950 border border-yellow-400 rounded-xl px-2 py-2 text-white text-xs focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!inlineCatNameClassified.trim()) return;
                              const name = inlineCatNameClassified.trim();
                              const newId = 'class-' + Date.now().toString(36);
                              addCategory({
                                name,
                                slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                                type: 'classificados',
                              });
                              setClassifiedForm((prev) => ({ ...prev, categoryId: newId }));
                              setInlineCatNameClassified('');
                              setIsAddingCatInClassifiedModal(false);
                              showToast(`Categoria "${name}" criada e selecionada!`, 'success');
                            }}
                            className="px-2.5 py-2 bg-yellow-400 text-neutral-950 text-xs font-bold rounded-xl"
                          >
                            Criar
                          </button>
                        </div>
                      ) : (
                        <select
                          value={classifiedForm.categoryId}
                          onChange={(e) => setClassifiedForm({ ...classifiedForm, categoryId: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-yellow-400"
                          required
                        >
                          <option value="">Selecione...</option>
                          {categories
                            .filter((c) => c.type === 'classificados' || c.type === 'ambos')
                            .map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name} {c.type === 'ambos' ? '(Loja & Classificados)' : ''}
                              </option>
                            ))}
                        </select>
                      )}
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-300 mb-1">Preço em R$ *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={classifiedForm.price}
                        onChange={(e) =>
                          setClassifiedForm({ ...classifiedForm, price: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-yellow-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-300 mb-1">Status da Moderação</label>
                      <select
                        value={classifiedForm.status}
                        onChange={(e) =>
                          setClassifiedForm({ ...classifiedForm, status: e.target.value as ClassifiedStatus })
                        }
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-yellow-400 font-bold"
                      >
                        <option value="ativo">Ativo (Visível)</option>
                        <option value="pausado">Pausado</option>
                        <option value="vendido">Vendido</option>
                        <option value="moderacao">Em Moderação</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-300 mb-1">Descrição</label>
                    <textarea
                      rows={3}
                      value={classifiedForm.description}
                      onChange={(e) => setClassifiedForm({ ...classifiedForm, description: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-yellow-400 resize-none"
                    />
                  </div>

                  {/* Image Gallery Manager for Classified */}
                  <ImageGalleryManager
                    images={classifiedForm.images}
                    onChange={(imgs) => setClassifiedForm({ ...classifiedForm, images: imgs })}
                    maxImages={4}
                    label="Gerenciamento de Imagens do Classificado"
                    helperText="Adicione novas fotos, remova ou reordene com as setas. A primeira foto é a capa principal do anúncio."
                  />

                  <div className="flex justify-end gap-2 pt-4 border-t border-neutral-800">
                    <button
                      type="button"
                      onClick={() => setIsClassifiedModalOpen(false)}
                      className="px-4 py-2 text-neutral-400 hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold rounded-xl shadow-md transition"
                    >
                      Salvar Alterações
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CATEGORIAS */}
      {currentTab === 'categorias' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold uppercase text-white">
                Categorias Cadastradas no Sistema
              </h2>
              <p className="text-xs text-neutral-400">
                Gerencie as seções da Loja Oficial e dos Classificados de ciclismo
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add Category Form */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-white text-sm">Criar Nova Categoria</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1">Nome da Categoria</label>
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Ex: Rodas de Carbono, Sapatilhas..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Onde esta categoria será exibida</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewCatType('classificados')}
                      className={`py-2 px-2.5 rounded-xl font-bold border text-[11px] transition ${
                        newCatType === 'classificados'
                          ? 'bg-yellow-400 text-neutral-950 border-yellow-400'
                          : 'bg-neutral-950 text-neutral-400 border-neutral-800'
                      }`}
                    >
                      Classificados
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewCatType('loja')}
                      className={`py-2 px-2.5 rounded-xl font-bold border text-[11px] transition ${
                        newCatType === 'loja'
                          ? 'bg-yellow-400 text-neutral-950 border-yellow-400'
                          : 'bg-neutral-950 text-neutral-400 border-neutral-800'
                      }`}
                    >
                      Loja Oficial
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewCatType('ambos')}
                      className={`py-2 px-2.5 rounded-xl font-bold border text-[11px] transition ${
                        newCatType === 'ambos'
                          ? 'bg-yellow-400 text-neutral-950 border-yellow-400'
                          : 'bg-neutral-950 text-neutral-400 border-neutral-800'
                      }`}
                    >
                      Ambos (Loja & Classificados)
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!newCatName.trim()) return;
                    addCategory({
                      name: newCatName.trim(),
                      slug: newCatName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                      type: newCatType,
                    });
                    setNewCatName('');
                    showToast(`Categoria "${newCatName.trim()}" cadastrada com sucesso!`, 'success');
                  }}
                  className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold rounded-xl transition shadow-md"
                >
                  Adicionar Categoria ao Sistema
                </button>
              </div>
            </div>

            {/* Existing Categories List with Item Counts and Inline Rename */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">Categorias Existentes & Vinculações</h3>
                <span className="text-[11px] text-neutral-400">Total: {categories.length}</span>
              </div>

              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {categories.map((cat) => {
                  const isEditing = editingCatId === cat.id;
                  const prodCount = products.filter((p) => p.categoryId === cat.id).length;
                  const classCount = classifieds.filter((c) => c.categoryId === cat.id).length;
                  const totalLinked = prodCount + classCount;

                  return (
                    <div
                      key={cat.id}
                      className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col gap-2 text-xs transition hover:border-neutral-700"
                    >
                      {isEditing ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editingCatName}
                              onChange={(e) => setEditingCatName(e.target.value)}
                              placeholder="Nome da categoria..."
                              className="flex-1 bg-neutral-900 border border-yellow-400 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => {
                                if (editingCatName.trim()) {
                                  updateCategory(cat.id, {
                                    name: editingCatName.trim(),
                                    slug: editingCatName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                                    type: editingCatType,
                                  });
                                }
                                setEditingCatId(null);
                                showToast('Categoria atualizada!', 'success');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-yellow-400 text-neutral-950 font-bold text-xs"
                              title="Salvar"
                            >
                              Salvar
                            </button>
                            <button
                              onClick={() => setEditingCatId(null)}
                              className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white"
                              title="Cancelar"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-neutral-400">Exibir em:</span>
                            {(['classificados', 'loja', 'ambos'] as const).map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => setEditingCatType(t)}
                                className={`text-[10px] px-2 py-0.5 rounded-md border font-bold capitalize ${
                                  editingCatType === t
                                    ? 'bg-yellow-400 text-neutral-950 border-yellow-400'
                                    : 'bg-neutral-900 text-neutral-400 border-neutral-800'
                                }`}
                              >
                                {t === 'ambos' ? 'Ambos' : t}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-white text-sm">{cat.name}</span>
                              <span
                                className={`px-2 py-0.2 rounded-full text-[10px] font-bold uppercase ${
                                  cat.type === 'loja'
                                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                    : cat.type === 'classificados'
                                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                                    : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                }`}
                              >
                                {cat.type === 'ambos' ? 'Loja & Classificados' : cat.type === 'loja' ? 'Loja Oficial' : 'Classificados'}
                              </span>
                            </div>

                            <div className="text-[11px] text-neutral-400 mt-0.5 flex items-center gap-2">
                              <span>
                                🏷️ {prodCount} {prodCount === 1 ? 'produto na loja' : 'produtos na loja'}
                              </span>
                              <span>•</span>
                              <span>
                                📢 {classCount} {classCount === 1 ? 'anúncio' : 'anúncios'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => {
                                setEditingCatId(cat.id);
                                setEditingCatName(cat.name);
                                setEditingCatType(cat.type);
                              }}
                              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-yellow-400 border border-neutral-800"
                              title="Editar Categoria"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    `Excluir categoria "${cat.name}"? ${
                                      totalLinked > 0
                                        ? `Atenção: Existem ${totalLinked} itens vinculados a esta categoria!`
                                        : ''
                                    }`
                                  )
                                ) {
                                  deleteCategory(cat.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-red-500/20 text-neutral-500 hover:text-red-400 border border-neutral-800"
                              title="Excluir Categoria"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CLIENTES */}
      {currentTab === 'clientes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold uppercase text-white">
                Clientes & Membros Cadastrados
              </h2>
              <p className="text-xs text-neutral-400">
                Lista de todos os ciclistas com cadastro para encomendas e classificados
              </p>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Nome</th>
                    <th className="p-3">E-mail</th>
                    <th className="p-3">WhatsApp</th>
                    <th className="p-3">Cidade</th>
                    <th className="p-3">Perfil</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {users.map((usr) => (
                    <tr key={usr.id} className="hover:bg-neutral-800/40 transition">
                      <td className="p-3 font-bold text-white flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-yellow-400/20 text-yellow-400 flex items-center justify-center uppercase font-bold text-xs">
                          {usr.name.charAt(0)}
                        </div>
                        {usr.name}
                      </td>
                      <td className="p-3 text-neutral-400">{usr.email}</td>
                      <td className="p-3">
                        <a
                          href={`https://wa.me/55${usr.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:underline font-bold"
                        >
                          {usr.phone}
                        </a>
                      </td>
                      <td className="p-3 text-neutral-400">{usr.city}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            usr.role === 'admin'
                              ? 'bg-yellow-400 text-neutral-950'
                              : 'bg-neutral-800 text-neutral-300'
                          }`}
                        >
                          {usr.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: PEDAIS */}
      {currentTab === 'pedais' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold uppercase text-white">
                Programação de Pedais do Pelotão
              </h2>
              <p className="text-xs text-neutral-400">
                Cadastre e edite saídas noturnas, pedais de fim de semana e treinos de serra
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rides.map((r) => (
              <div
                key={r.id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-yellow-400 uppercase">
                      {r.difficulty} • {r.date}
                    </span>
                    <button
                      onClick={() => deleteRide(r.id)}
                      className="text-neutral-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h3 className="font-bold text-white text-base">{r.title}</h3>
                  <p className="text-xs text-neutral-400 mt-1">{r.description}</p>
                  <p className="text-xs text-neutral-300 mt-2">
                    📍 Ponto: <strong className="text-white">{r.meetingPoint}</strong>
                  </p>
                </div>
                <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                  <span>
                    {r.distanceKm} km • +{r.elevationM} m
                  </span>
                  <span>Líder: {r.leader}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Form to Add Ride */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-white text-sm">Adicionar Novo Pedal na Agenda</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Título do Pedal</label>
                <input
                  type="text"
                  value={rideForm.title}
                  onChange={(e) => setRideForm({ ...rideForm, title: e.target.value })}
                  placeholder="Ex: Treino no Jaraguá"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Data / Frequência</label>
                <input
                  type="text"
                  value={rideForm.date}
                  onChange={(e) => setRideForm({ ...rideForm, date: e.target.value })}
                  placeholder="Ex: Todo Domingo"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Horário</label>
                <input
                  type="text"
                  value={rideForm.time}
                  onChange={(e) => setRideForm({ ...rideForm, time: e.target.value })}
                  placeholder="Ex: 06:30"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-400 mb-1">Ponto de Encontro</label>
                <input
                  type="text"
                  value={rideForm.meetingPoint}
                  onChange={(e) => setRideForm({ ...rideForm, meetingPoint: e.target.value })}
                  placeholder="Ex: Praça dos Ciclistas / Paulista"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Dificuldade</label>
                <select
                  value={rideForm.difficulty}
                  onChange={(e) => setRideForm({ ...rideForm, difficulty: e.target.value as any })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-yellow-400"
                >
                  <option value="Iniciante">Iniciante</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Bruto / Avançado">Bruto / Avançado</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!rideForm.title.trim()) return;
                    addRide(rideForm);
                    setRideForm({
                      title: '',
                      date: 'Sábado',
                      time: '07:00',
                      meetingPoint: '',
                      distanceKm: 40,
                      elevationM: 400,
                      difficulty: 'Intermediário',
                      gpxOrMapsLink: 'https://maps.google.com',
                      description: '',
                      leader: 'Capitão do Pelotão',
                    });
                  }}
                  className="px-6 py-2.5 bg-yellow-400 text-neutral-950 font-bold rounded-xl"
                >
                  Publicar Pedal na Agenda
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: CONFIGURAÇÕES DO GRUPO & PIX BACEN */}
      {currentTab === 'configuracoes' && (
        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="font-display text-2xl font-bold uppercase text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-yellow-400" />
              Configuração Oficial do PIX (EMV / BACEN)
            </h2>
            <p className="text-xs text-neutral-400">
              Esses dados alimentam a geração do QR Code e da string PIX Copia e Cola conforme as normas do Banco Central do Brasil.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-300 mb-1">
                  Chave PIX Oficial (CNPJ, CPF, E-mail ou Telefone)
                </label>
                <input
                  type="text"
                  value={configForm.pixConfig.key}
                  onChange={(e) =>
                    setConfigForm({
                      ...configForm,
                      pixConfig: { ...configForm.pixConfig, key: e.target.value },
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">
                  Nome do Titular Recebedor (até 25 caracteres)
                </label>
                <input
                  type="text"
                  maxLength={25}
                  value={configForm.pixConfig.merchantName}
                  onChange={(e) =>
                    setConfigForm({
                      ...configForm,
                      pixConfig: { ...configForm.pixConfig, merchantName: e.target.value },
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white uppercase focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">
                  Cidade do Recebedor (até 15 caracteres)
                </label>
                <input
                  type="text"
                  maxLength={15}
                  value={configForm.pixConfig.merchantCity}
                  onChange={(e) =>
                    setConfigForm({
                      ...configForm,
                      pixConfig: { ...configForm.pixConfig, merchantCity: e.target.value },
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white uppercase focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">
                  Prefixo TXID das Encomendas
                </label>
                <input
                  type="text"
                  maxLength={8}
                  value={configForm.pixConfig.txidPrefix}
                  onChange={(e) =>
                    setConfigForm({
                      ...configForm,
                      pixConfig: { ...configForm.pixConfig, txidPrefix: e.target.value.toUpperCase() },
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white uppercase font-mono focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>
          </div>

          {/* Social Links & texts */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h2 className="font-display text-2xl font-bold uppercase text-white">
              Apresentação & Redes Sociais
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-300 mb-1">Lema / Slogan</label>
                <input
                  type="text"
                  value={configForm.tagline}
                  onChange={(e) => setConfigForm({ ...configForm, tagline: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">Banner de Aviso Superior</label>
                <input
                  type="text"
                  value={configForm.bannerNotice || ''}
                  onChange={(e) => setConfigForm({ ...configForm, bannerNotice: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">Link do Grupo WhatsApp</label>
                <input
                  type="url"
                  value={configForm.whatsappGroupUrl}
                  onChange={(e) => setConfigForm({ ...configForm, whatsappGroupUrl: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">Link do Strava Clube</label>
                <input
                  type="url"
                  value={configForm.stravaUrl}
                  onChange={(e) => setConfigForm({ ...configForm, stravaUrl: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">Link do Instagram</label>
                <input
                  type="url"
                  value={configForm.instagramUrl}
                  onChange={(e) => setConfigForm({ ...configForm, instagramUrl: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">Telefone Oficial com DDD</label>
                <input
                  type="text"
                  value={configForm.contactPhone}
                  onChange={(e) => setConfigForm({ ...configForm, contactPhone: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-neutral-300 mb-1">Texto de Apresentação</label>
                <textarea
                  rows={2}
                  value={configForm.aboutText}
                  onChange={(e) => setConfigForm({ ...configForm, aboutText: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => updateGroupConfig(configForm)}
              className="py-3 px-6 bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold text-xs rounded-xl shadow-lg shadow-yellow-400/20 transition active:scale-95"
            >
              Salvar Alterações de Configuração
            </button>
          </div>
        </div>
      )}

      {/* TAB 8: PRODUÇÃO, GUIA DE INSTALAÇÃO, GITHUB & GOOGLE DRIVE */}
      {currentTab === 'producao' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-400">
                  <Server className="w-8 h-8" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-yellow-400 text-[10px] font-black uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                    Central de Deploy & Produção
                  </div>
                  <h2 className="font-display text-3xl font-black uppercase text-white">
                    Servidor Web, GitHub & Google Drive
                  </h2>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-yellow-400/20 transition active:scale-95"
                  title="Baixar backup completo para salvar no Google Drive"
                >
                  <HardDrive className="w-4 h-4 text-neutral-950" />
                  <span>Gravar no Google Drive</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-4xl">
              Todos os arquivos de configuração, scripts de automação, contêineres Docker, rotinas de backup para o Google Drive e o repositório Git para o GitHub foram gerados com sucesso.
            </p>
          </div>

          {/* Cards: GitHub, Google Drive e Servidor Web */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: GitHub */}
            <div className="bg-neutral-900 border border-neutral-800 hover:border-yellow-400/40 rounded-3xl p-5 space-y-3 transition flex flex-col justify-between shadow-lg">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                    <GitBranch className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30">
                    Git Inicializado
                  </span>
                </div>
                <h3 className="font-bold text-white text-base">Repositório GitHub</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Repositório Git local criado no branch principal <strong>main</strong> com 42 arquivos commitados.
                </p>
              </div>

              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-[11px] font-mono text-neutral-300 space-y-1">
                <p className="text-neutral-500"># Comandos para enviar ao GitHub:</p>
                <p className="text-yellow-400 break-all">git remote add origin https://github.com/fuschilo/amarelinhos.git</p>
                <p className="text-yellow-400">git push -u origin main</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    'git remote add origin https://github.com/fuschilo/amarelinhos.git\ngit branch -M main\ngit push -u origin main'
                  );
                  showToast('Comandos do GitHub copiados para a área de transferência!', 'success');
                }}
                className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition border border-neutral-700"
              >
                <Copy className="w-3.5 h-3.5 text-yellow-400" />
                <span>Copiar Comandos GitHub</span>
              </button>
            </div>

            {/* Card 2: Google Drive */}
            <div className="bg-neutral-900 border border-neutral-800 hover:border-yellow-400/40 rounded-3xl p-5 space-y-3 transition flex flex-col justify-between shadow-lg">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <CloudUpload className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Backup Pronto
                  </span>
                </div>
                <h3 className="font-bold text-white text-base">Gravação no Google Drive</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Baixe o backup completo do banco de dados e arquivos para salvar no seu Drive ou use o script <code>scripts/backup-drive.sh</code>.
                </p>
              </div>

              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-[11px] font-mono text-neutral-300 space-y-1">
                <p className="text-neutral-500"># Backup automatizado no servidor:</p>
                <p className="text-emerald-400">bash scripts/backup-drive.sh</p>
                <p className="text-neutral-500"># Sincroniza via rclone para gdrive:</p>
              </div>

              <button
                type="button"
                onClick={handleExportBackup}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-black flex items-center justify-center gap-1.5 transition shadow-md shadow-emerald-500/20 active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-neutral-950" />
                <span>Baixar Backup para o Drive</span>
              </button>
            </div>

            {/* Card 3: Servidor Web */}
            <div className="bg-neutral-900 border border-neutral-800 hover:border-yellow-400/40 rounded-3xl p-5 space-y-3 transition flex flex-col justify-between shadow-lg">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Server className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                    Node 20 + Nginx
                  </span>
                </div>
                <h3 className="font-bold text-white text-base">Servidor Web em Produção</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Scripts prontos para Ubuntu 22.04/24.04 LTS com PM2 (zero-downtime) e Nginx com SSL Let's Encrypt gratuito.
                </p>
              </div>

              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-[11px] font-mono text-neutral-300 space-y-1">
                <p className="text-neutral-500"># Instalação e deploy em 2 comandos:</p>
                <p className="text-blue-400">sudo bash scripts/setup-server.sh</p>
                <p className="text-blue-400">sudo bash scripts/deploy.sh</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText('sudo bash scripts/setup-server.sh && sudo bash scripts/deploy.sh');
                  showToast('Comandos de deploy copiados!', 'success');
                }}
                className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition border border-neutral-700"
              >
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                <span>Copiar Comandos de Deploy</span>
              </button>
            </div>
          </div>

          {/* Central de Visualização dos Scripts Gerados */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
              <div>
                <h3 className="font-display text-xl font-bold uppercase text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-yellow-400" />
                  <span>Scripts e Arquivos de Produção Gerados</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Visualize, inspecione e copie o conteúdo de cada script gerado para o servidor
                </p>
              </div>

              {/* Selector Tabs */}
              <div className="flex flex-wrap bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs gap-1">
                <button
                  type="button"
                  onClick={() => setSelectedScriptTab('setup')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition text-[11px] ${
                    selectedScriptTab === 'setup'
                      ? 'bg-yellow-400 text-neutral-950 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  setup-server.sh
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedScriptTab('deploy')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition text-[11px] ${
                    selectedScriptTab === 'deploy'
                      ? 'bg-yellow-400 text-neutral-950 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  deploy.sh
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedScriptTab('github')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition text-[11px] ${
                    selectedScriptTab === 'github'
                      ? 'bg-yellow-400 text-neutral-950 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  github-sync.sh
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedScriptTab('drive')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition text-[11px] ${
                    selectedScriptTab === 'drive'
                      ? 'bg-yellow-400 text-neutral-950 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  backup-drive.sh
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedScriptTab('nginx')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition text-[11px] ${
                    selectedScriptTab === 'nginx'
                      ? 'bg-yellow-400 text-neutral-950 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  nginx.conf
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedScriptTab('pm2')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition text-[11px] ${
                    selectedScriptTab === 'pm2'
                      ? 'bg-yellow-400 text-neutral-950 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  PM2 Ecosystem
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedScriptTab('docker')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition text-[11px] ${
                    selectedScriptTab === 'docker'
                      ? 'bg-yellow-400 text-neutral-950 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Dockerfile
                </button>
              </div>
            </div>

            {/* Script Display Box */}
            {(() => {
              const scriptMap = {
                setup: {
                  filename: 'scripts/setup-server.sh',
                  title: 'Provisionamento Completo do Servidor (Ubuntu/Debian)',
                  desc: 'Atualiza o SO, instala Node.js 20 LTS, Nginx, PM2, Certbot SSL e configura o firewall UFW.',
                  content: `#!/usr/bin/env bash
# 🚴 AMARELINHOS - PROVISIONAMENTO DO SERVIDOR
set -e
apt-get update -y && apt-get upgrade -y
apt-get install -y curl wget git unzip ufw htop build-essential
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs nginx certbot python3-certbot-nginx
npm install -g pm2
ufw allow OpenSSH && ufw allow 'Nginx Full' && ufw --force enable
mkdir -p /var/www/amarelinhos /var/log/amarelinhos /var/backups/amarelinhos
echo "✓ Servidor preparado! Próximo passo: bash scripts/deploy.sh"`,
                },
                deploy: {
                  filename: 'scripts/deploy.sh',
                  title: 'Deploy Contínuo em Produção (Zero Downtime)',
                  desc: 'Gera backup automático, instala dependências, compila frontend/backend e recarrega o PM2 com verificação de saúde.',
                  content: `#!/usr/bin/env bash
# 🚴 AMARELINHOS - DEPLOY EM PRODUÇÃO
set -e
PROJECT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"
npm install --include=dev
npm run build
pm2 reload ecosystem.config.cjs --update-env || pm2 start ecosystem.config.cjs
sleep 2
curl -sSf http://localhost:3000/api/health && echo "✓ Servidor online e saudável!"`,
                },
                github: {
                  filename: 'scripts/github-sync.sh',
                  title: 'Sincronização com o GitHub',
                  desc: 'Adiciona arquivos, comita e envia a branch main para o repositório remoto no GitHub.',
                  content: `#!/usr/bin/env bash
# 🚴 AMARELINHOS - SINCRONIZAÇÃO COM GITHUB
git add .
git commit -m "feat: Sistema Amarelinhos Ciclismo completo para produção" || true
# git remote add origin https://github.com/fuschilo/amarelinhos-ciclismo.git
git branch -M main
git push -u origin main`,
                },
                drive: {
                  filename: 'scripts/backup-drive.sh',
                  title: 'Gravação e Backup no Google Drive',
                  desc: 'Gera pacote .tar.gz dos dados e envia para o Google Drive automaticamente via rclone ou cron diário.',
                  content: `#!/usr/bin/env bash
# 🚴 AMARELINHOS - BACKUP NO GOOGLE DRIVE
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p backups/drive_\${TIMESTAMP}
cp -r src/data backups/drive_\${TIMESTAMP}/
tar -czf backups/amarelinhos_backup_\${TIMESTAMP}.tar.gz -C backups drive_\${TIMESTAMP}
rm -rf backups/drive_\${TIMESTAMP}
# Se tiver rclone configurado:
# rclone copy backups/amarelinhos_backup_\${TIMESTAMP}.tar.gz gdrive:Amarelinhos_Backups/
echo "✓ Backup gerado: backups/amarelinhos_backup_\${TIMESTAMP}.tar.gz"`,
                },
                nginx: {
                  filename: 'nginx.conf',
                  title: 'Configuração do Servidor Web Nginx & HTTPS',
                  desc: 'Reverse proxy de alto desempenho com compressão Gzip, cache de assets estáticos e suporte a SSL Let\'s Encrypt.',
                  content: `server {
    listen 80;
    server_name amarelinhos.com.br www.amarelinhos.com.br;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name amarelinhos.com.br www.amarelinhos.com.br;

    ssl_certificate /etc/letsencrypt/live/amarelinhos.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/amarelinhos.com.br/privkey.pem;

    root /var/www/amarelinhos/dist;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript image/svg+xml;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}`,
                },
                pm2: {
                  filename: 'ecosystem.config.cjs',
                  title: 'Configuração do Process Manager PM2',
                  desc: 'Gerencia o processo Node.js em background, monitorando uso de memória e reiniciando em caso de reboot.',
                  content: `module.exports = {
  apps: [{
    name: 'amarelinhos-app',
    script: 'dist/server.js',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    max_memory_restart: '350M',
    env: { NODE_ENV: 'production', PORT: 3000 },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log'
  }]
};`,
                },
                docker: {
                  filename: 'Dockerfile & docker-compose.yml',
                  title: 'Contêiner Docker Multi-Stage (Alpine Linux)',
                  desc: 'Empacotamento completo em contêiner ultraleve para execução isolada em qualquer nuvem ou servidor Docker.',
                  content: `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3000
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.js"]`,
                },
              };

              const current = scriptMap[selectedScriptTab];

              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-yellow-400">
                        {current.filename}
                      </span>
                      <p className="text-[11px] text-neutral-400 mt-0.5">{current.desc}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(current.content);
                        setCopiedScript(selectedScriptTab);
                        showToast(`Arquivo "${current.filename}" copiado!`, 'success');
                        setTimeout(() => setCopiedScript(null), 2500);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition border border-neutral-700"
                    >
                      {copiedScript === selectedScriptTab ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-yellow-400" />
                          <span>Copiar Conteúdo</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <pre className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl p-4 text-xs font-mono text-neutral-300 overflow-x-auto leading-relaxed max-h-72 scrollbar-thin">
                      <code>{current.content}</code>
                    </pre>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* BACEN PIX API Integration Note */}
          <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 text-xs space-y-2 text-neutral-300 shadow-xl">
            <h4 className="font-bold text-white flex items-center gap-2">
              <QrCode className="w-4 h-4 text-yellow-400" />
              <span>Especificação da API Pix BACEN (EMV BR Code Padrão Banco Central)</span>
            </h4>
            <p className="text-neutral-400 leading-relaxed text-[11px]">
              A aplicação implementa os padrões oficiais do Banco Central do Brasil (<a href="https://github.com/bacen/pix-api" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">github.com/bacen/pix-api</a>). O payload padrão EMV TLV gerado é universalmente aceito por todas as instituições bancárias e fintechs (Nubank, Itaú, Bradesco, Banco do Brasil, Inter, Caixa, Mercado Pago, etc.), com cálculo dinâmico de CRC16-CCITT em tempo real.
            </p>
          </div>
        </div>
      )}

      {/* DEDICATED QUICK PHOTO MANAGER MODAL FOR PRODUCTS & CLASSIFIEDS */}
      {quickPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 shrink-0">
              <div>
                <span className="text-[10px] font-black uppercase text-yellow-400 tracking-wider">
                  Gerenciador de Imagens Amarelinhos
                </span>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-yellow-400" />
                  {quickPhotoModal.name}
                </h3>
              </div>
              <button
                onClick={() => setQuickPhotoModal(null)}
                className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Gallery Manager Component */}
            <div className="overflow-y-auto flex-1 pr-1">
              <ImageGalleryManager
                images={quickPhotoModal.images}
                onChange={(imgs) => setQuickPhotoModal({ ...quickPhotoModal, images: imgs })}
                maxImages={quickPhotoModal.type === 'produto' ? 8 : 6}
                label={`Fotos do ${quickPhotoModal.type === 'produto' ? 'Produto' : 'Classificado'}`}
                helperText="Adicione novas fotos, use drag & drop, defina qual é a foto de Capa (#1), reordene com as setas ou remova fotos indesejadas."
                presets={DEFAULT_CYCLING_PRESETS}
              />
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-800 shrink-0">
              <span className="text-xs text-neutral-400">
                {quickPhotoModal.images.length}{' '}
                {quickPhotoModal.images.length === 1 ? 'foto selecionada' : 'fotos selecionadas'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuickPhotoModal(null)}
                  className="px-4 py-2 text-xs font-bold text-neutral-400 hover:text-white transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (quickPhotoModal.images.length === 0) {
                      showToast('É necessário manter pelo menos 1 foto.', 'error');
                      return;
                    }
                    if (quickPhotoModal.type === 'produto') {
                      updateProduct(quickPhotoModal.id, { images: quickPhotoModal.images });
                      showToast('Fotos do produto salvas com sucesso!', 'success');
                    } else {
                      updateClassified(quickPhotoModal.id, { images: quickPhotoModal.images });
                      showToast('Fotos do anúncio salvas com sucesso!', 'success');
                    }
                    setQuickPhotoModal(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-black text-xs shadow-lg shadow-yellow-400/20 transition active:scale-95"
                >
                  Salvar Fotos Agora
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
