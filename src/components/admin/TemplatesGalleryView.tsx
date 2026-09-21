import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Cake,
  Shirt,
  Wrench,
  Store,
  Check,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { AVAILABLE_TEMPLATES } from '../../data/initialData';
import { useBusiness } from '../../contexts/BusinessContext';
import { TemplateType } from '../../types';

export const TemplatesGalleryView: React.FC = () => {
  const { activeBusiness, updateBusiness, goToPublicStore } = useBusiness();
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const iconMap: Record<string, any> = {
    UtensilsCrossed,
    Cake,
    Sparkles: Shirt,
    Wrench,
    Store,
  };

  const handleApplyTemplate = async (templateId: TemplateType, templateName: string) => {
    if (!activeBusiness) return;
    await updateBusiness({
      ...activeBusiness,
      template: templateId,
    });
    setSuccessNotice(`¡Plantilla "${templateName}" aplicada exitosamente a ${activeBusiness.name}!`);
    setTimeout(() => setSuccessNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Galería de Plantillas Visuales
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Aplica un diseño especializado según el rubro de {activeBusiness?.name}.
        </p>
      </div>

      {successNotice && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold flex items-center justify-between animate-fade-in">
          <span>{successNotice}</span>
          <button
            onClick={() => activeBusiness && goToPublicStore(activeBusiness.slug)}
            className="underline flex items-center gap-1"
          >
            Ver Sitio Ahora <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AVAILABLE_TEMPLATES.map((tmpl) => {
          const Icon = iconMap[tmpl.icon] || Store;
          const isCurrent = activeBusiness?.template === tmpl.id;

          return (
            <div
              key={tmpl.id}
              className={`bg-white dark:bg-slate-850 rounded-2xl border p-6 flex flex-col justify-between transition-all shadow-sm ${
                isCurrent
                  ? 'border-[#253745] dark:border-blue-500 ring-2 ring-[#253745]/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: tmpl.previewColor }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  {isCurrent && (
                    <span className="px-2.5 py-1 bg-[#253745] text-white text-[10px] font-black uppercase rounded-full tracking-wide">
                      En Uso Actual
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {tmpl.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{tmpl.bestFor}</p>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {tmpl.description}
                </p>

                <div className="space-y-1.5 pt-1">
                  {tmpl.features.map((f, i) => (
                    <div key={i} className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold text-xs rounded-xl cursor-default flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    Plantilla Activa
                  </button>
                ) : (
                  <button
                    onClick={() => handleApplyTemplate(tmpl.id, tmpl.name)}
                    className="w-full py-2.5 bg-[#253745] hover:bg-[#1a2630] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Aplicar a {activeBusiness?.name}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
