import React from 'react';
import { useApp } from '../../context/AppContext';
import { AmarelinhosLogo } from '../common/AmarelinhosLogo';
import {
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  ShoppingBag,
  Tag,
  ArrowRight,
  Instagram,
  MessageCircle,
  Share2,
  TrendingUp,
  Award,
  Users,
  Compass,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { groupConfig, rides, products, classifieds, categories, setActiveTab, setSelectedProductId } = useApp();

  const featuredProducts = products.slice(0, 3);
  const recentClassifieds = classifieds.filter((c) => c.status === 'ativo').slice(0, 3);

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Iniciante':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Intermediário':
        return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-neutral-900 border border-neutral-800 p-6 sm:p-12 shadow-2xl">
        {/* Dynamic Background Light */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-yellow-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-5">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
            {groupConfig.badge}
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[0.95] mb-4">
            O Pelotão Amarelo{' '}
            <span className="text-yellow-400 underline decoration-yellow-400/40 decoration-wavy">
              Mais Animado
            </span>{' '}
            do Brasil
          </h1>

          <p className="text-sm sm:text-lg text-neutral-300 leading-relaxed mb-8 max-w-2xl">
            {groupConfig.tagline} {groupConfig.aboutText}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('loja')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-black text-sm sm:text-base shadow-xl shadow-yellow-400/25 transition active:scale-95"
            >
              <ShoppingBag className="w-5 h-5 text-neutral-950" />
              Encomendar Uniformes (PIX)
            </button>

            <button
              onClick={() => setActiveTab('classificados')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-bold text-sm sm:text-base transition active:scale-95"
            >
              <Tag className="w-5 h-5 text-yellow-400" />
              Ver Classificados
            </button>

            {groupConfig.whatsappGroupUrl && (
              <a
                href={groupConfig.whatsappGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 font-bold text-sm transition"
              >
                <MessageCircle className="w-4 h-4" />
                Grupo WhatsApp
              </a>
            )}
          </div>
        </div>

        {/* Floating Quick Stats */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 border-t border-neutral-800">
          <div className="bg-neutral-950/60 p-3.5 rounded-2xl border border-neutral-800">
            <div className="flex items-center gap-2 text-yellow-400 mb-1">
              <Users className="w-4 h-4" />
              <span className="font-display text-2xl font-bold text-white">+350</span>
            </div>
            <p className="text-[11px] text-neutral-400">Ciclistas no Pelotão</p>
          </div>

          <div className="bg-neutral-950/60 p-3.5 rounded-2xl border border-neutral-800">
            <div className="flex items-center gap-2 text-pink-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="font-display text-2xl font-bold text-white">45.000+</span>
            </div>
            <p className="text-[11px] text-neutral-400">KM Rodados em Grupo</p>
          </div>

          <div className="bg-neutral-950/60 p-3.5 rounded-2xl border border-neutral-800">
            <div className="flex items-center gap-2 text-yellow-400 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="font-display text-2xl font-bold text-white">3x / Sem.</span>
            </div>
            <p className="text-[11px] text-neutral-400">Pedais Oficiais</p>
          </div>

          <div className="bg-neutral-950/60 p-3.5 rounded-2xl border border-neutral-800">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <Award className="w-4 h-4" />
              <span className="font-display text-2xl font-bold text-white">100%</span>
            </div>
            <p className="text-[11px] text-neutral-400">Ninguém Fica Pra Trás</p>
          </div>
        </div>
      </section>

      {/* Social Networks & Community Connect */}
      <section className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-3xl font-black uppercase text-white flex items-center gap-2">
              <Share2 className="w-6 h-6 text-yellow-400" /> Redes & Comunidade
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Acompanhe as fotos, treinos no Strava e participe dos grupos de avisos
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* WhatsApp */}
          <a
            href={groupConfig.whatsappGroupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition group"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">WhatsApp Oficial</p>
              <p className="text-[11px] text-neutral-400">Grupo de avisos e resenha</p>
            </div>
            <ExternalLink className="w-4 h-4 text-neutral-600 group-hover:text-emerald-400 ml-auto" />
          </a>

          {/* Instagram */}
          <a
            href={groupConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-pink-500/50 hover:bg-pink-500/5 transition group"
          >
            <div className="w-11 h-11 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
              <Instagram className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Instagram</p>
              <p className="text-[11px] text-neutral-400">Stories e fotos do pedal</p>
            </div>
            <ExternalLink className="w-4 h-4 text-neutral-600 group-hover:text-pink-400 ml-auto" />
          </a>

          {/* Strava */}
          <a
            href={groupConfig.stravaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-orange-500/50 hover:bg-orange-500/5 transition group"
          >
            <div className="w-11 h-11 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Clube no Strava</p>
              <p className="text-[11px] text-neutral-400">Ranking semanal de km</p>
            </div>
            <ExternalLink className="w-4 h-4 text-neutral-600 group-hover:text-orange-400 ml-auto" />
          </a>

          {/* Google Photos / Link */}
          <a
            href="https://share.google/IE1NurvjwJEgsqiVs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-yellow-400/50 hover:bg-yellow-400/5 transition group"
          >
            <div className="w-11 h-11 rounded-xl bg-yellow-400/10 text-yellow-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
              <AmarelinhosLogo size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Álbum Compartilhado</p>
              <p className="text-[11px] text-neutral-400">Google Fotos do Pelotão</p>
            </div>
            <ExternalLink className="w-4 h-4 text-neutral-600 group-hover:text-yellow-400 ml-auto" />
          </a>
        </div>
      </section>

      {/* Próximos Pedais da Agenda */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Calendar className="w-4 h-4" /> Agenda Semanal
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black uppercase text-white">
              Próximos Pedais do Pelotão
            </h2>
          </div>
          <p className="text-xs text-neutral-400 max-w-sm">
            Concentração no horário. Obrigatório capacete e luzes de sinalização em todos os giros.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rides.map((ride) => (
            <div
              key={ride.id}
              className="bg-neutral-900 border border-neutral-800 hover:border-yellow-400/40 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 group shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${getDifficultyBadge(
                      ride.difficulty
                    )}`}
                  >
                    {ride.difficulty}
                  </span>
                  <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-yellow-400" />
                    {ride.time}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold text-white mb-2 group-hover:text-yellow-400 transition">
                  {ride.title}
                </h3>

                <div className="space-y-1.5 text-xs text-neutral-300 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="font-medium text-white">{ride.date}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                    <span className="text-neutral-300">{ride.meetingPoint}</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-400 line-clamp-3 mb-4 leading-relaxed">
                  {ride.description}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-800">
                <div className="flex items-center justify-between text-xs mb-3">
                  <div className="flex items-center gap-1 text-neutral-400">
                    <Compass className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Distância:</span>
                    <strong className="text-white">{ride.distanceKm} km</strong>
                  </div>
                  <div className="flex items-center gap-1 text-neutral-400">
                    <TrendingUp className="w-3.5 h-3.5 text-pink-400" />
                    <span>Altimetria:</span>
                    <strong className="text-white">+{ride.elevationM} m</strong>
                  </div>
                </div>

                <a
                  href={ride.gpxOrMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold transition border border-neutral-700 group-hover:border-yellow-400/30"
                >
                  <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                  Abrir Ponto no Mapa / GPS
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Destaques da Loja (Uniformes Oficiais) */}
      <section className="bg-neutral-900/40 border border-neutral-800/80 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4" /> Encomendas Abertas
            </div>
            <h2 className="font-display text-3xl font-black uppercase text-white">
              Uniformes Oficiais Amarelinhos
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('loja')}
            className="flex items-center gap-1 text-xs font-bold text-yellow-400 hover:text-yellow-300 transition"
          >
            Ver Catálogo Completo <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredProducts.map((prod) => {
            const prodCat = categories.find((c) => c.id === prod.categoryId);

            return (
              <div
                key={prod.id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-yellow-400/50 transition duration-300 flex flex-col justify-between group"
              >
                <div
                  className="relative aspect-4/3 bg-neutral-950 overflow-hidden cursor-pointer"
                  onClick={() => {
                    setSelectedProductId(prod.id);
                    setActiveTab('loja');
                  }}
                >
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                    {prodCat && (
                      <span className="bg-neutral-950/90 text-yellow-300 border border-yellow-400/30 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                        {prodCat.name}
                      </span>
                    )}
                    {prod.badge && (
                      <span className="bg-yellow-400 text-neutral-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow">
                        {prod.badge}
                      </span>
                    )}
                  </div>
                  {prod.isPreOrder && (
                    <span className="absolute top-3 right-3 bg-neutral-900/90 text-neutral-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-neutral-700">
                      Sob Encomenda
                    </span>
                  )}
                </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => {
                      setSelectedProductId(prod.id);
                      setActiveTab('loja');
                    }}
                    className="font-bold text-white text-sm line-clamp-1 mb-1.5 hover:text-yellow-400 cursor-pointer"
                  >
                    {prod.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-[11px] text-neutral-400">Tamanhos:</span>
                    <div className="flex items-center gap-1">
                      {prod.sizes.map((s) => (
                        <span
                          key={s}
                          className="px-1.5 py-0.5 bg-neutral-800 text-[10px] font-bold rounded text-neutral-300 border border-neutral-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase">Valor no PIX</span>
                    <p className="font-display text-2xl font-black text-yellow-400 leading-none">
                      R$ {prod.price.toFixed(2).replace('.', ',')}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedProductId(prod.id);
                      setActiveTab('loja');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold text-xs transition"
                  >
                    Ver Detalhes
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </section>

      {/* Destaques dos Classificados */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Tag className="w-4 h-4" /> Mercado do Pelotão
            </div>
            <h2 className="font-display text-3xl font-black uppercase text-white">
              Últimos Anúncios nos Classificados
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('classificados')}
            className="flex items-center gap-1 text-xs font-bold text-yellow-400 hover:text-yellow-300 transition"
          >
            Ver Todos <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recentClassifieds.map((item) => {
            const itemCat = categories.find((c) => c.id === item.categoryId);

            return (
              <div
                key={item.id}
                onClick={() => setActiveTab('classificados')}
                className="bg-neutral-900 border border-neutral-800 hover:border-yellow-400/40 rounded-2xl overflow-hidden cursor-pointer group transition flex flex-col justify-between"
              >
                <div className="relative aspect-4/3 bg-neutral-950">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                    {itemCat && (
                      <span className="bg-neutral-950/90 text-yellow-300 border border-yellow-400/30 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                        {itemCat.name}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full bg-neutral-900/90 text-neutral-200 text-[9px] font-bold uppercase border border-neutral-700">
                      {item.condition}
                    </span>
                  </div>
                </div>
                <div className="p-3.5">
                  <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-yellow-400 transition">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 mb-2">{item.sellerCity}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xl font-black text-yellow-400">
                      R$ {item.price.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" /> WhatsApp
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quem Somos / História do Grupo */}
      <section className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-10">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="w-32 h-32 shrink-0 flex items-center justify-center">
            <AmarelinhosLogo size={120} />
          </div>

          <div className="flex-1">
            <div className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-2">
              Nossa Trajetória
            </div>
            <h3 className="font-display text-3xl font-black text-white uppercase mb-3">
              A História por Trás do Pelotão Amarelo
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed mb-4">
              {groupConfig.historyText}
            </p>
            <p className="text-xs text-neutral-400 italic">
              "Pedalar não é apenas dar voltas na roda; é compartilhar o asfalto, cuidar do parceiro de pedal e construir memórias inesquecíveis."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
