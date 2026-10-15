import React, { useState } from 'react';
import { useApp, AppTab } from '../../context/AppContext';
import { AmarelinhosLogo } from '../common/AmarelinhosLogo';
import {
  ShoppingBag,
  Tag,
  Home,
  ShieldCheck,
  User,
  LogOut,
  MessageCircle,
} from 'lucide-react';
import { AuthModal } from '../auth/AuthModal';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    cartCount,
    currentUser,
    isAdmin,
    logout,
    groupConfig,
  } = useApp();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const navLinks: { id: AppTab; label: string; icon: React.ElementType }[] = [
    { id: 'inicio', label: 'Início', icon: Home },
    { id: 'loja', label: 'Loja Oficial', icon: ShoppingBag },
    { id: 'classificados', label: 'Classificados', icon: Tag },
  ];

  return (
    <>
      {/* Top Banner Notice (Administrable) */}
      {groupConfig.bannerNotice && (
        <div className="bg-yellow-400 text-neutral-950 px-4 py-1.5 text-xs font-bold text-center flex items-center justify-center gap-2 overflow-hidden shadow-sm">
          <span className="truncate">{groupConfig.bannerNotice}</span>
        </div>
      )}

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <button
            onClick={() => setActiveTab('inicio')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <AmarelinhosLogo size={46} showText={true} />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-neutral-900/60 border border-neutral-800 p-1.5 rounded-full">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-yellow-400 text-neutral-950 shadow-md shadow-yellow-400/20'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-neutral-950' : 'text-neutral-400'}`} />
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* WhatsApp Group Quick Link */}
            {groupConfig.whatsappGroupUrl && (
              <a
                href={groupConfig.whatsappGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Entrar no Grupo de WhatsApp"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>Zap do Pelotão</span>
              </a>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setActiveTab('carrinho')}
              className={`relative p-2.5 rounded-2xl border transition-all flex items-center justify-center ${
                activeTab === 'carrinho'
                  ? 'bg-yellow-400 border-yellow-400 text-neutral-950 shadow-lg shadow-yellow-400/25'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-200 hover:border-yellow-400/50 hover:text-white'
              }`}
              title="Ver Encomendas / Carrinho"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-yellow-400 text-neutral-950 text-[11px] font-black rounded-full flex items-center justify-center border-2 border-neutral-950 shadow">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Direct Access */}
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs font-bold transition-all ${
                activeTab === 'admin'
                  ? 'bg-yellow-400 border-yellow-400 text-neutral-950 shadow-lg shadow-yellow-400/20'
                  : isAdmin
                  ? 'bg-neutral-900 border-yellow-400/40 text-yellow-300 hover:bg-neutral-800'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-yellow-400" />
              <span className="hidden sm:inline">Admin</span>
              {isAdmin && (
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              )}
            </button>

            {/* User / Login Trigger */}
            <div className="relative">
              {currentUser ? (
                <div>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 text-xs font-semibold transition"
                  >
                    <div className="w-7 h-7 rounded-xl bg-yellow-400/20 text-yellow-400 flex items-center justify-center font-bold text-xs uppercase">
                      {currentUser.name.charAt(0)}
                    </div>
                    <span className="hidden lg:inline max-w-[100px] truncate">
                      {currentUser.name.split(' ')[0]}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in">
                      <div className="px-3 py-2 border-b border-neutral-800/80 mb-1">
                        <p className="text-xs font-bold text-white truncate">
                          {currentUser.name}
                        </p>
                        <p className="text-[11px] text-neutral-400 truncate">
                          {currentUser.email}
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-800 text-yellow-400">
                          {currentUser.role === 'admin' ? 'Administrador' : 'Ciclista Membro'}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          setActiveTab('admin');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-xl transition"
                      >
                        <ShieldCheck className="w-4 h-4 text-yellow-400" />
                        Painel de Controle
                      </button>

                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Sair da Conta
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white transition"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Entrar</span>
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};
