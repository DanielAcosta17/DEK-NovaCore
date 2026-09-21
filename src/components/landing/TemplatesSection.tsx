import React from 'react';
import {
  UtensilsCrossed,
  Cake,
  Shirt,
  Wrench,
  Store,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { AVAILABLE_TEMPLATES } from '../../data/initialData';
import { useBusiness } from '../../contexts/BusinessContext';

export const TemplatesSection: React.FC = () => {
  const { businesses, goToPublicStore } = useBusiness();

  const iconMap: Record<string, any> = {
    UtensilsCrossed,
    Cake,
    Sparkles: Shirt,
    Wrench,
    Store,
  };

  return (
    <section id="plantillas" className="py-16 lg:py-24 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#253745] dark:text-blue-400">
            Arquitectura Modular Adaptable
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            5 Plantillas Visuales Especializadas
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Un único motor reactivo ultrarrápido que adapta automáticamente su disposición, tipografías, botones y flujo de pedido según el rubro de tu negocio.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AVAILABLE_TEMPLATES.map((tmpl) => {
            const Icon = iconMap[tmpl.icon] || Store;
            // Find a demo business matching this template
            const matchingBiz = businesses.find((b) => b.template === tmpl.id);

            return (
              <div
                key={tmpl.id}
                className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-750 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: tmpl.previewColor }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                      {tmpl.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {tmpl.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {tmpl.bestFor}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {tmpl.description}
                  </p>

                  <div className="space-y-1.5 pt-2">
                    {tmpl.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800">
                  {matchingBiz ? (
                    <button
                      onClick={() => goToPublicStore(matchingBiz.slug)}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Ver ejemplo: {matchingBiz.name}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="text-center text-[11px] text-slate-400">
                      Plantilla lista para vincular a tu negocio
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
