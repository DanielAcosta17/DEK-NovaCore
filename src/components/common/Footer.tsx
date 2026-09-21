import React from 'react';
import {
  Sparkles,
  MessageCircle,
  Mail,
  MapPin,
  Heart,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useBusiness } from '../../contexts/BusinessContext';

interface FooterProps {
  onOpenFirebaseModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenFirebaseModal }) => {
  const { businesses, goToPublicStore, goToAdmin, goToLanding } = useBusiness();

  const businessTypes = [
    'Pastelerías',
    'Restaurantes',
    'Tiendas de ropa',
    'Ferreterías',
    'Barberías',
    'Salones de belleza',
    'Tiendas de accesorios',
    'Supermercados',
    'Emprendimientos',
    'Tiendas de tecnología',
    'Cafeterías',
    'Negocios de comida',
    'Tiendas de regalos',
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={goToLanding}
              className="cursor-pointer flex items-center gap-3 group select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-[#253745] text-white flex items-center justify-center font-black text-lg border border-slate-700 shadow-md">
                <span className="tracking-tighter text-amber-400">D</span>
                <span className="text-white text-xs">.E.K</span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-base tracking-tight leading-tight">
                  D. E. K <span className="text-blue-400">NovaCore</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  WebCatalog Pro Suite
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Potenciamos pequeños y medianos negocios con catálogos digitales interactivos, menús con código QR y sitios web profesionales preparados para vender directamente por WhatsApp.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Firebase Ready
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> WhatsApp Orders
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> QR Integrado
              </span>
            </div>
          </div>

          {/* Col 2: Negocios de Ejemplo */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Ejemplos en Vivo
            </h4>
            <ul className="space-y-2">
              {businesses.map((b) => (
                <li key={b.id}>
                  <button
                    onClick={() => goToPublicStore(b.slug)}
                    className="hover:text-white transition-colors flex items-center gap-1 text-slate-400"
                  >
                    <span>{b.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Rubros Adaptables */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Sectores que Atendemos
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {businessTypes.slice(0, 8).map((type) => (
                <span
                  key={type}
                  className="px-2 py-0.5 rounded bg-slate-800/60 text-slate-400 text-[10px]"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Col 4: Plataforma & Soporte */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Plataforma
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={goToAdmin} className="hover:text-white transition-colors">
                  Panel de Administrador (/admin)
                </button>
              </li>
              {onOpenFirebaseModal && (
                <li>
                  <button
                    onClick={onOpenFirebaseModal}
                    className="hover:text-white transition-colors flex items-center gap-1 text-blue-400 font-semibold"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> Estado Firebase & Reglas
                  </button>
                </li>
              )}
              <li>
                <a
                  href="https://wa.me/50762348901?text=Hola%20D.%20E.%20K%20NovaCore,%20quiero%20informaci%C3%B3n%20sobre%20un%20cat%C3%A1logo%20digital"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  Asistencia por WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} D. E. K NovaCore - Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Diseñado y desarrollado para impulsar el comercio digital en Latinoamérica
          </p>
        </div>
      </div>
    </footer>
  );
};
