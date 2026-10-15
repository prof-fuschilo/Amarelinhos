import React from 'react';
import { useApp, AppTab } from '../../context/AppContext';
import { Home, ShoppingBag, Tag, ShieldCheck } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, cartCount, isAdmin } = useApp();

  const tabs: { id: AppTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'inicio', label: 'Início', icon: Home },
    { id: 'loja', label: 'Loja', icon: ShoppingBag },
    { id: 'classificados', label: 'Classificados', icon: Tag },
    { id: 'carrinho', label: 'Carrinho', icon: ShoppingBag, badge: cartCount },
    { id: 'admin', label: isAdmin ? 'Admin' : 'Painel', icon: ShieldCheck },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive ? 'text-yellow-400 font-bold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 bg-yellow-400 text-neutral-950 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-neutral-950">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 font-medium tracking-tight">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-yellow-400 rounded-full shadow-[0_0_10px_#FACC15]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
