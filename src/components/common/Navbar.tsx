import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Sun,
  Moon,
  Sparkles,
  LayoutDashboard,
  Store,
  ChevronDown,
  ShoppingBag,
  ExternalLink,
  Shield,
  Layers,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useBusiness } from '../../contexts/BusinessContext';
import { useCart } from '../../contexts/CartContext';

interface NavbarProps {
  onOpenCreateBusiness?: () => void;
  onOpenFirebaseModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreateBusiness, onOpenFirebaseModal }) => {
  const { theme, toggleTheme } = useTheme();
  const {
    businesses,
    activeView,
    goToLanding,
    goToAdmin,
    goToPublicStore,
    currentPublicSlug,
  } = useBusiness();
  const { totalItems, openCart } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [examplesDropdownOpen, setExamplesDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (activeView !== 'landing') {
      goToLanding();
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'glass-effect shadow-sm border-b border-slate-200/80 dark:border-slate-800/80 py-2.5'
          : 'bg-white/95 dark:bg-slate-900/95 border-b border-slate-100 dark:border-slate-800/50 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo Branding */}
        <div
          onClick={goToLanding}
          className="cursor-pointer flex items-center gap-3 group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-[#253745] dark:bg-slate-800 text-white flex items-center justify-center font-black text-lg shadow-md group-hover:scale-105 transition-transform duration-200 border border-slate-700/30">
            <span className="tracking-tighter text-amber-400">D</span>
            <span className="text-white text-xs">.E.K</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight leading-tight flex items-center gap-1.5">
              D. E. K <span className="text-[#253745] dark:text-blue-400 font-black">NovaCore</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
              WebCatalog Pro Suite
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <button
            onClick={() => handleNavClick('inicio')}
            className="hover:text-[#253745] dark:hover:text-white transition-colors"
          >
            Inicio
          </button>
          <button
            onClick={() => handleNavClick('servicios')}
            className="hover:text-[#253745] dark:hover:text-white transition-colors"
          >
            Servicios
          </button>
          <button
            onClick={() => handleNavClick('como-funciona')}
            className="hover:text-[#253745] dark:hover:text-white transition-colors"
          >
            Cómo funciona
          </button>
          <button
            onClick={() => handleNavClick('plantillas')}
            className="hover:text-[#253745] dark:hover:text-white transition-colors"
          >
            Plantillas
          </button>
          <button
            onClick={() => handleNavClick('precios')}
            className="hover:text-[#253745] dark:hover:text-white transition-colors"
          >
            Precios
          </button>
          <button
            onClick={() => handleNavClick('contacto')}
            className="hover:text-[#253745] dark:hover:text-white transition-colors"
          >
            Contacto
          </button>

          {/* Quick Examples Dropdown */}
          <div className="relative">
            <button
              onClick={() => setExamplesDropdownOpen(!examplesDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Store className="w-3.5 h-3.5 text-[#253745] dark:text-blue-400" />
              <span>Ver Sitios Demo</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {examplesDropdownOpen && (
              <div
                onMouseLeave={() => setExamplesDropdownOpen(false)}
                className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-850 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-fade-in"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Sitios Públicos en Vivo
                </div>
                {businesses.map((biz) => (
                  <button
                    key={biz.id}
                    onClick={() => {
                      goToPublicStore(biz.slug);
                      setExamplesDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                      currentPublicSlug === biz.slug ? 'bg-slate-100 dark:bg-slate-800 font-bold text-[#253745] dark:text-blue-400' : ''
                    }`}
                  >
                    <img
                      src={biz.logoUrl}
                      alt={biz.name}
                      className="w-6 h-6 rounded-md object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div className="truncate">
                      <div className="font-semibold text-slate-900 dark:text-white truncate">
                        {biz.name}
                      </div>
                      <div className="text-[10px] text-slate-500 capitalize">
                        {biz.template}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Cambiar tema claro u oscuro"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Cart Icon (if visiting a store or has items) */}
          {(activeView === 'public_store' || totalItems > 0) && (
            <button
              onClick={openCart}
              className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
              title="Abrir Carrito"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          )}

          {/* Admin Panel Button */}
          <button
            onClick={goToAdmin}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              activeView === 'admin'
                ? 'bg-[#253745] text-white border-[#253745]'
                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Panel Admin</span>
          </button>

          {/* Primary CTA "Crear mi sitio" */}
          <button
            onClick={() => {
              if (onOpenCreateBusiness) {
                onOpenCreateBusiness();
              } else {
                goToAdmin();
              }
            }}
            className="px-4 py-2 bg-[#253745] hover:bg-[#1a2630] text-white text-xs font-bold rounded-xl shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 shine-effect"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Crear mi sitio</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 py-4 space-y-3 animate-fade-in text-xs font-medium">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <button
              onClick={() => handleNavClick('inicio')}
              className="p-2 text-left text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Inicio
            </button>
            <button
              onClick={() => handleNavClick('servicios')}
              className="p-2 text-left text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Servicios
            </button>
            <button
              onClick={() => handleNavClick('como-funciona')}
              className="p-2 text-left text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cómo funciona
            </button>
            <button
              onClick={() => handleNavClick('plantillas')}
              className="p-2 text-left text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Plantillas
            </button>
            <button
              onClick={() => handleNavClick('precios')}
              className="p-2 text-left text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Precios
            </button>
            <button
              onClick={() => handleNavClick('contacto')}
              className="p-2 text-left text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Contacto
            </button>
          </div>

          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Sitios de Ejemplo:
            </div>
            <div className="grid grid-cols-2 gap-2">
              {businesses.map((biz) => (
                <button
                  key={biz.id}
                  onClick={() => {
                    goToPublicStore(biz.slug);
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-left flex items-center gap-2 truncate"
                >
                  <img src={biz.logoUrl} alt="" className="w-5 h-5 rounded object-cover" />
                  <span className="truncate">{biz.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                goToAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-xl flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Acceder al Panel de Administrador
            </button>
            {onOpenFirebaseModal && (
              <button
                onClick={() => {
                  onOpenFirebaseModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 border border-blue-200 dark:border-blue-800"
              >
                <Shield className="w-3.5 h-3.5" />
                Configuración Firebase & Reglas
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
