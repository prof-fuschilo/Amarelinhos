import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, User as UserIcon, Mail, Phone, MapPin, Lock, Bike, ShieldCheck } from 'lucide-react';
import { AmarelinhosLogo } from '../common/AmarelinhosLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
  onSuccess,
}) => {
  const { login, register } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('São Paulo - SP');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      if (!email) {
        setError('Por favor, informe seu e-mail.');
        return;
      }
      const res = login(email, password);
      if (res.success) {
        onClose();
        if (onSuccess) onSuccess();
      } else {
        setError(res.message);
      }
    } else {
      if (!name || !email || !phone) {
        setError('Preencha os campos obrigatórios (Nome, E-mail e WhatsApp).');
        return;
      }
      const res = register(name, email, phone, city, password);
      if (res.success) {
        onClose();
        if (onSuccess) onSuccess();
      } else {
        setError(res.message);
      }
    }
  };

  const handleQuickDemo = (type: 'client' | 'admin') => {
    if (type === 'admin') {
      login('admin@amarelinhos.com.br', 'admin');
    } else {
      login('carlos.mendes@email.com', '123456');
    }
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <AmarelinhosLogo size={60} />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {mode === 'login' ? 'Acessar Conta' : 'Criar Cadastro'}
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {mode === 'login'
              ? 'Entre para anunciar equipamentos ou gerenciar seu perfil'
              : 'Cadastre-se para anunciar nos Classificados dos Amarelinhos'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Nome Completo *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full bg-neutral-800/80 border border-neutral-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  WhatsApp com DDD *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full bg-neutral-800/80 border border-neutral-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Cidade / Estado *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: São Paulo - SP"
                    className="w-full bg-neutral-800/80 border border-neutral-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400 transition"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">E-mail *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full bg-neutral-800/80 border border-neutral-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Senha {mode === 'register' ? '(mínimo 6 dígitos)' : ''}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-800/80 border border-neutral-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-yellow-400 hover:bg-yellow-300 active:scale-[0.98] text-neutral-950 font-bold py-3 px-4 rounded-xl shadow-lg shadow-yellow-400/20 transition flex items-center justify-center gap-2"
          >
            {mode === 'login' ? (
              <>
                <UserIcon className="w-4 h-4" /> Entrar na Conta
              </>
            ) : (
              <>
                <Bike className="w-4 h-4" /> Finalizar Cadastro
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Logins for smooth evaluation */}
        <div className="mt-5 pt-4 border-t border-neutral-800/80">
          <p className="text-[11px] text-center text-neutral-400 mb-2.5 font-medium">
            ⚡ Acesso Rápido para Avaliação do Protótipo:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-yellow-400/30 text-yellow-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" />
              Entrar como Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('client')}
              className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
              Entrar como Cliente
            </button>
          </div>
        </div>

        <div className="mt-5 text-center">
          {mode === 'login' ? (
            <p className="text-xs text-neutral-400">
              Ainda não tem conta?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                className="text-yellow-400 font-semibold hover:underline"
              >
                Cadastre-se grátis
              </button>
            </p>
          ) : (
            <p className="text-xs text-neutral-400">
              Já possui cadastro?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className="text-yellow-400 font-semibold hover:underline"
              >
                Fazer login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
