import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Store,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  QrCode,
  Zap,
} from 'lucide-react';
import { useBusiness } from '../../contexts/BusinessContext';

interface HeroProps {
  onOpenCreateBusiness: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenCreateBusiness }) => {
  const { businesses, goToPublicStore } = useBusiness();

  const handleScrollToExamples = () => {
    const el = document.getElementById('ejemplos-en-vivo');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="inicio" className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Subtle background glow effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#253745]/5 dark:bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Eyebrow Tag */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-sm animate-float">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[#253745] dark:text-blue-400 font-bold">Plataforma SaaS Multi-Negocio</span>
            <span className="text-slate-400">•</span>
            <span>Catálogos, Menús QR & Sitios Web</span>
          </div>
        </div>

        {/* Main Headline and Subtitle */}
        <div className="text-center mt-6 max-w-4xl mx-auto space-y-5">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            Tu negocio merece{' '}
            <span className="text-[#253745] dark:text-blue-400 underline decoration-slate-300 dark:decoration-slate-700 decoration-wavy decoration-2">
              estar en Internet
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Creamos catálogos, menús y sitios web profesionales para llevar tu negocio al mundo digital. Vende más rápido con pedidos automáticos directos a tu WhatsApp.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onOpenCreateBusiness}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#253745] hover:bg-[#1a2630] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#253745]/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2.5 shine-effect"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Crear mi sitio</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleScrollToExamples}
              className="w-full sm:w-auto px-7 py-3.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-sm font-bold rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Store className="w-4 h-4 text-[#253745] dark:text-blue-400" />
              <span>Ver ejemplos en vivo</span>
            </button>
          </div>

          {/* Quick trust metrics */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Sin comisiones por ventas
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Pedidos directos a WhatsApp
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Código QR incluido
            </span>
          </div>
        </div>

        {/* Visual representation of 4 different business types requested:
            Pastelería, Restaurante, Tienda de ropa, Ferretería */}
        <div id="ejemplos-en-vivo" className="mt-16 lg:mt-20">
          <div className="text-center mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#253745] dark:text-blue-400">
              Casos Reales y Plantillas Pre-configuradas
            </h3>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              Explora cómo luce cada tipo de negocio con nuestra plataforma
            </p>
          </div>

          {businesses.length === 0 ? (
            <div className="max-w-xl mx-auto p-8 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-[#253745] dark:text-blue-400 flex items-center justify-center">
                <Store className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Plataforma lista en blanco (0)
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Todos los catálogos demo han sido limpiados. Crea tu propio negocio o restaurante desde el panel de control y míralo reflejado aquí y en Firestore de inmediato.
                </p>
              </div>
              <button
                onClick={onOpenCreateBusiness}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#253745] hover:bg-[#1a2630] text-white text-xs font-bold rounded-xl shadow transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Crear mi primer negocio</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {businesses.map((biz) => {
                return (
                  <div
                    key={biz.id}
                    onClick={() => goToPublicStore(biz.slug)}
                    className="group cursor-pointer bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-750 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
                  >
                    {/* Cover image header */}
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={biz.coverUrl}
                        alt={biz.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Template Badge */}
                      <div className="absolute top-3 left-3">
                        <span
                          className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide rounded-full text-white shadow"
                          style={{ backgroundColor: biz.primaryColor }}
                        >
                          {biz.template === 'restaurant'
                            ? 'Restaurante'
                            : biz.template === 'bakery'
                            ? 'Pastelería'
                            : biz.template === 'fashion'
                            ? 'Tienda de Ropa'
                            : biz.template === 'hardware'
                            ? 'Ferretería'
                            : 'Comercio'}
                        </span>
                      </div>

                      {/* Logo Avatar Floating */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-2.5">
                        <img
                          src={biz.logoUrl}
                          alt={biz.name}
                          className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-md bg-white"
                        />
                        <div className="text-white">
                          <div className="text-xs font-bold leading-tight drop-shadow truncate max-w-[170px]">
                            {biz.name}
                          </div>
                          <div className="text-[10px] opacity-80 truncate max-w-[170px]">
                            {biz.address}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Body description */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {biz.description}
                      </p>

                      {/* Highlights & View Button */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          <span>Pedidos WhatsApp</span>
                        </div>

                        <span className="text-xs font-bold text-[#253745] dark:text-blue-400 group-hover:underline flex items-center gap-1">
                          Ver Sitio <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
