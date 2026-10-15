import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/navigation/Navbar';
import { BottomNav } from './components/navigation/BottomNav';
import { ToastContainer } from './components/common/ToastContainer';
import { HomeView } from './components/home/HomeView';
import { ShopView } from './components/shop/ShopView';
import { ClassifiedsView } from './components/classifieds/ClassifiedsView';
import { CartView } from './components/cart/CartView';
import { AdminView } from './components/admin/AdminView';
import { AmarelinhosLogo } from './components/common/AmarelinhosLogo';
import {
  Instagram,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Heart,
  TrendingUp,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, groupConfig } = useApp();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-yellow-400 selection:text-black">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'inicio' && <HomeView />}
        {activeTab === 'loja' && <ShopView />}
        {activeTab === 'classificados' && <ClassifiedsView />}
        {activeTab === 'carrinho' && <CartView />}
        {activeTab === 'admin' && <AdminView />}
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900/90 border-t border-neutral-800 text-neutral-400 text-xs pb-20 md:pb-8 pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Col 1: Brand */}
            <div className="space-y-3 md:col-span-1">
              <AmarelinhosLogo size={42} showText={true} />
              <p className="text-neutral-400 text-xs leading-relaxed">
                {groupConfig.tagline}
              </p>
              <div className="flex items-center gap-2 pt-1">
                {groupConfig.whatsappGroupUrl && (
                  <a
                    href={groupConfig.whatsappGroupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-emerald-400 transition"
                    title="WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                )}
                {groupConfig.instagramUrl && (
                  <a
                    href={groupConfig.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-pink-400 transition"
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {groupConfig.stravaUrl && (
                  <a
                    href={groupConfig.stravaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-orange-400 transition"
                    title="Strava Clube"
                  >
                    <TrendingUp className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Col 2: Navegação */}
            <div>
              <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-3">
                Navegação
              </h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveTab('inicio')}
                    className="hover:text-yellow-400 transition"
                  >
                    Início & Agenda de Pedais
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('loja')}
                    className="hover:text-yellow-400 transition"
                  >
                    Loja de Uniformes Oficiais
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('classificados')}
                    className="hover:text-yellow-400 transition"
                  >
                    Classificados do Pelotão
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('carrinho')}
                    className="hover:text-yellow-400 transition"
                  >
                    Meu Carrinho & PIX
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Transparência & Pagamento */}
            <div>
              <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-3">
                Pagamentos Oficiais
              </h4>
              <p className="text-neutral-400 text-xs leading-relaxed mb-3">
                Todas as encomendas de uniformes são intermediadas via <strong>PIX EMV oficial</strong> do Banco Central do Brasil com QR Code escaneável.
              </p>
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Seguro & Direto ao Grupo</span>
              </div>
            </div>

            {/* Col 4: Acesso Administrativo */}
            <div>
              <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-3">
                Área de Gestão
              </h4>
              <p className="text-neutral-400 text-xs leading-relaxed mb-3">
                Ferramenta administrativa para controle do Kanban de encomendas, estoque por tamanhos (PP ao GG) e moderação de anúncios.
              </p>
              <button
                onClick={() => setActiveTab('admin')}
                className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-yellow-400 border border-neutral-700 font-bold text-xs inline-flex items-center gap-1.5 transition"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Acessar Painel Admin
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-neutral-500 text-[11px]">
            <p>
              © {new Date().getFullYear()} Grupo de Ciclismo AMARELINHOS. Todos os direitos reservados.
            </p>
            <p className="flex items-center gap-1">
              Feito com <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" /> para a comunidade de ciclistas.
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
