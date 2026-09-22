import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Package,
  FolderTree,
  ShoppingBag,
  Palette,
  Settings,
  ChevronDown,
  ExternalLink,
  QrCode,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  Store,
  ArrowLeft,
  Sparkles,
  Shield,
  Layers,
} from 'lucide-react';
import { useBusiness } from '../../contexts/BusinessContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { AdminDashboardView } from './AdminDashboardView';
import { BusinessManagerView } from './BusinessManagerView';
import { ProductManagerView } from './ProductManagerView';
import { CategoryManagerView } from './CategoryManagerView';
import { OrdersManagerView } from './OrdersManagerView';
import { TemplatesGalleryView } from './TemplatesGalleryView';
import { SettingsView } from './SettingsView';
import { AdminLoginView } from './AdminLoginView';
import { QRCodeModal } from '../common/QRCodeModal';
import { FirebaseSetupModal } from '../common/FirebaseSetupModal';

export const AdminLayout: React.FC = () => {
  const {
    businesses,
    selectedBusinessId,
    setSelectedBusinessId,
    activeBusiness,
    goToLanding,
    goToPublicStore,
  } = useBusiness();
  const { user, isAuthenticated, isLoading, logout, isFirebaseConnected } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState<boolean>(false);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState<boolean>(false);

  const [isProductCreateTriggered, setIsProductCreateTriggered] = useState<boolean>(false);
  const [isBusinessCreateTriggered, setIsBusinessCreateTriggered] = useState<boolean>(false);

  // Pantalla de carga mientras se verifica el token con Firebase Auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-center text-white">
        <div className="w-10 h-10 border-3 border-blue-400 border-t-transparent rounded-full animate-spin mb-4" />
        <h3 className="text-sm font-bold text-white tracking-wide">
          Verificando sesión con Firebase Authentication...
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          D. E. K NovaCore — Panel de Control
        </p>
      </div>
    );
  }

  // Si no está autenticado o no hay usuario, solicitar contraseña
  if (!isAuthenticated || !user) {
    return <AdminLoginView />;
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard / Resumen', icon: LayoutDashboard },
    { id: 'businesses', label: 'Mis Negocios', icon: Building2 },
    { id: 'products', label: 'Productos & Catálogo', icon: Package },
    { id: 'categories', label: 'Categorías', icon: FolderTree },
    { id: 'orders', label: 'Pedidos Recibidos', icon: ShoppingBag },
    { id: 'templates', label: 'Galería de Plantillas', icon: Palette },
    { id: 'settings', label: 'Configuración & Firebase', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      {/* Top Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
        {/* Left: Mobile Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={goToLanding}
            className="cursor-pointer flex items-center gap-2.5 select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-[#253745] text-white flex items-center justify-center font-black text-sm shadow">
              <span className="text-amber-400">D</span>.E
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-extrabold text-sm tracking-tight leading-none text-slate-900 dark:text-white">
                D. E. K <span className="text-[#253745] dark:text-blue-400">NovaCore</span>
              </span>
              <span className="text-[10px] font-bold uppercase text-slate-400">
                Panel Administrador
              </span>
            </div>
          </div>
        </div>

        {/* Center: Active Business Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <span className="hidden lg:inline text-xs font-semibold text-slate-500 dark:text-slate-400">
            Negocio Activo:
          </span>
          <div className="relative">
            <select
              value={selectedBusinessId}
              onChange={(e) => setSelectedBusinessId(e.target.value)}
              className="text-xs font-bold py-2 pl-3 pr-8 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#253745] cursor-pointer appearance-none shadow-sm max-w-[200px] sm:max-w-xs truncate"
            >
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.template})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {activeBusiness && (
            <button
              onClick={() => goToPublicStore(activeBusiness.slug)}
              className="hidden sm:flex items-center gap-1 px-3 py-2 bg-[#253745] hover:bg-[#1a2630] text-white text-xs font-bold rounded-xl shadow transition-all"
              title="Ver cómo ven tus clientes este sitio"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Ver Sitio</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {activeBusiness && (
            <button
              onClick={() => setIsQRModalOpen(true)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title="Código QR del negocio"
            >
              <QrCode className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setIsFirebaseModalOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px] font-semibold"
            title="Conexión Firebase"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Firebase</span>
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Cambiar tema"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          {/* User badge & Logout */}
          <div className="flex items-center gap-1.5">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-[11px] font-bold text-slate-900 dark:text-white truncate max-w-[130px]">
                {user.displayName || user.email}
              </span>
              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                {isFirebaseConnected ? 'Firebase Auth' : 'Admin'}
              </span>
            </div>

            <button
              onClick={() => logout()}
              className="p-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200/50 dark:border-rose-900/50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Cerrar sesión de administrador"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>

            <button
              onClick={goToLanding}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Ir a página de inicio pública"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Web</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Panel Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between pt-16 md:pt-0 transform transition-transform duration-200 md:static md:translate-x-0 ${
            mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
        >
          {/* Navigation Items */}
          <div className="p-4 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
              Menú Principal
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#253745] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer: Active Business Card & Admin Profile */}
          <div className="p-4 space-y-2.5 border-t border-slate-100 dark:border-slate-800">
            {activeBusiness && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5">
                <img
                  src={activeBusiness.logoUrl}
                  alt={activeBusiness.name}
                  className="w-9 h-9 rounded-lg object-cover border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {activeBusiness.name}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                    /negocio/{activeBusiness.slug}
                  </div>
                </div>
              </div>
            )}

            {/* Current user card with logout */}
            <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#253745] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {user.email ? user.email.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                    {user.email}
                  </div>
                  <div className="text-[9px] text-slate-400">
                    Administrador
                  </div>
                </div>
              </div>
              <button
                onClick={() => logout()}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>


        {/* Overlay backdrop for mobile sidebar */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
          />
        )}

        {/* Dynamic Content Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <AdminDashboardView
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenCreateBusiness={() => {
                setActiveTab('businesses');
                setIsBusinessCreateTriggered(true);
              }}
              onOpenCreateProduct={() => {
                setActiveTab('products');
                setIsProductCreateTriggered(true);
              }}
              onOpenQR={() => setIsQRModalOpen(true)}
            />
          )}

          {activeTab === 'businesses' && (
            <BusinessManagerView
              isCreateOpenInitially={isBusinessCreateTriggered}
            />
          )}

          {activeTab === 'products' && (
            <ProductManagerView
              isCreateOpenInitially={isProductCreateTriggered}
            />
          )}

          {activeTab === 'categories' && <CategoryManagerView />}

          {activeTab === 'orders' && <OrdersManagerView />}

          {activeTab === 'templates' && <TemplatesGalleryView />}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* QR Modal for active business */}
      {activeBusiness && (
        <QRCodeModal
          business={activeBusiness}
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
        />
      )}

      {/* Firebase Setup & Rules Modal */}
      <FirebaseSetupModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
      />
    </div>
  );
};
