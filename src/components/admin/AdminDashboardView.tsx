import React from 'react';
import {
  Building2,
  Package,
  FolderTree,
  ShoppingBag,
  ExternalLink,
  Plus,
  QrCode,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { useBusiness } from '../../contexts/BusinessContext';

interface AdminDashboardViewProps {
  onNavigate: (tab: string) => void;
  onOpenCreateBusiness: () => void;
  onOpenCreateProduct: () => void;
  onOpenQR: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onNavigate,
  onOpenCreateBusiness,
  onOpenCreateProduct,
  onOpenQR,
}) => {
  const { businesses, products, categories, orders, activeBusiness, goToPublicStore } = useBusiness();

  const bizProducts = products.filter((p) => p.businessId === activeBusiness?.id);
  const bizCategories = categories.filter((c) => c.businessId === activeBusiness?.id);
  const bizOrders = orders.filter((o) => o.businessId === activeBusiness?.id);

  const stats = [
    {
      label: 'Negocios Creados',
      value: businesses.length,
      icon: Building2,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40',
      action: () => onNavigate('businesses'),
    },
    {
      label: `Productos (${activeBusiness?.name || 'Activo'})`,
      value: bizProducts.length,
      icon: Package,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
      action: () => onNavigate('products'),
    },
    {
      label: 'Categorías Activas',
      value: bizCategories.length,
      icon: FolderTree,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40',
      action: () => onNavigate('categories'),
    },
    {
      label: 'Pedidos Recibidos',
      value: bizOrders.length,
      icon: ShoppingBag,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40',
      action: () => onNavigate('orders'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-[#253745] to-[#1a2630] text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Panel de Administración Centralizado</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Gestionando: {activeBusiness?.name || 'Sin negocio'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Personaliza tus productos, actualiza precios en tiempo real y comparte tu catálogo con clientes a través de WhatsApp o código QR.
          </p>
        </div>

        {activeBusiness && (
          <div className="flex flex-wrap items-center gap-2.5 relative z-10">
            <button
              onClick={() => goToPublicStore(activeBusiness.slug)}
              className="py-2.5 px-4 bg-white text-[#253745] hover:bg-slate-100 font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              <span>Ver Sitio en Vivo</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenQR}
              className="py-2.5 px-3.5 bg-white/15 hover:bg-white/25 text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5"
            >
              <QrCode className="w-4 h-4" />
              <span>QR</span>
            </button>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((st, i) => {
          const Icon = st.icon;
          return (
            <div
              key={i}
              onClick={st.action}
              className="p-5 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md cursor-pointer transition-all flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate block max-w-[150px]">
                  {st.label}
                </span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {st.value}
                </span>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${st.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Acciones Rápidas
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={onOpenCreateProduct}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors flex items-center gap-3 text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Agregar Producto
              </div>
              <div className="text-[11px] text-slate-500">Nuevo ítem al catálogo</div>
            </div>
          </button>

          <button
            onClick={onOpenCreateBusiness}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors flex items-center gap-3 text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Nuevo Negocio / Cliente
              </div>
              <div className="text-[11px] text-slate-500">Crear sitio individual</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('templates')}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors flex items-center gap-3 text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Cambiar Plantilla
              </div>
              <div className="text-[11px] text-slate-500">Restaurante, moda, etc.</div>
            </div>
          </button>
        </div>
      </div>

      {/* Featured Products Table Preview */}
      <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Productos Destacados de {activeBusiness?.name}
            </h3>
            <p className="text-xs text-slate-500">Artículos principales visibles en la portada</p>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="text-xs text-[#253745] dark:text-blue-400 font-bold hover:underline"
          >
            Ver todos ({bizProducts.length})
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Producto</th>
                <th className="py-2.5 px-3">Precio</th>
                <th className="py-2.5 px-3">Estado</th>
                <th className="py-2.5 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {bizProducts.slice(0, 5).map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 flex items-center gap-2.5">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-9 h-9 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                        {p.description || 'Sin descripción'}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                    {activeBusiness?.currency || '$'}{p.price.toFixed(2)}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.isAvailable
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {p.isAvailable ? 'Disponible' : 'Agotado'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onNavigate('products')}
                      className="text-xs font-semibold text-[#253745] dark:text-blue-400 hover:underline"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
