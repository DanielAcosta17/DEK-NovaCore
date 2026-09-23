import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { BusinessProvider, useBusiness } from './contexts/BusinessContext';
import { CartProvider } from './contexts/CartContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Hero } from './components/landing/Hero';
import { Services } from './components/landing/Services';
import { HowItWorks } from './components/landing/HowItWorks';
import { TemplatesSection } from './components/landing/TemplatesSection';
import { Pricing } from './components/landing/Pricing';
import { ContactSection } from './components/landing/ContactSection';
import { PublicBusinessView } from './components/public/PublicBusinessView';
import { AdminLayout } from './components/admin/AdminLayout';
import { FirebaseSetupModal } from './components/common/FirebaseSetupModal';

const AppContent: React.FC = () => {
  const {
    activeView,
    activeBusiness,
    currentPublicSlug,
    goToPublicStore,
    goToAdmin,
    goToLanding,
    businesses,
    isLoading,
    defaultHomePage,
  } = useBusiness();

  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);

  // Synchronize with URL routing (hash, search params, pathname)
  useEffect(() => {
    const handleUrlRoute = () => {
      // 1. Check Hash: e.g. #negocio/pasteleria-dulce-encanto or #admin
      const hash = window.location.hash.replace(/^#\/?/, '');
      
      // 2. Check Search query: e.g. ?negocio=slug or ?tienda=slug
      const urlParams = new URLSearchParams(window.location.search);
      const querySlug = urlParams.get('negocio') || urlParams.get('tienda');

      // 3. Check Pathname: e.g. /negocio/slug
      const pathMatches = window.location.pathname.match(/\/negocio\/([^/]+)/);
      const pathSlug = pathMatches ? pathMatches[1] : null;

      const targetSlug = querySlug || pathSlug || (hash.startsWith('negocio/') ? hash.replace('negocio/', '') : null);

      if (targetSlug) {
        goToPublicStore(decodeURIComponent(targetSlug));
      } else if (hash === 'admin' || window.location.pathname === '/admin') {
        goToAdmin();
      } else if (hash === 'inicio' || hash === '') {
        // If user set defaultHomePage to store and there's a business, open it
        if (defaultHomePage === 'store' && businesses.length > 0) {
          goToPublicStore(businesses[0].slug);
        } else {
          goToLanding();
        }
      }
    };

    handleUrlRoute();
    window.addEventListener('hashchange', handleUrlRoute);
    window.addEventListener('popstate', handleUrlRoute);
    return () => {
      window.removeEventListener('hashchange', handleUrlRoute);
      window.removeEventListener('popstate', handleUrlRoute);
    };
  }, [businesses.length, defaultHomePage]);

  // Update hash when activeView changes (avoid wiping user's slug during load)
  useEffect(() => {
    if (isLoading) return;

    if (activeView === 'admin') {
      if (window.location.hash !== '#admin') {
        window.history.replaceState(null, '', '#admin');
      }
    } else if (activeView === 'public_store' && activeBusiness) {
      const targetHash = `#negocio/${activeBusiness.slug}`;
      if (window.location.hash !== targetHash) {
        window.history.replaceState(null, '', targetHash);
      }
    } else if (activeView === 'landing') {
      if (window.location.hash.startsWith('#negocio/') || window.location.hash === '#admin') {
        window.history.replaceState(null, '', ' ');
      }
    }
  }, [activeView, activeBusiness, isLoading]);

  // Show clean loading spinner while Firebase initializes
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d1520] text-slate-100 flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-14 h-14 rounded-2xl bg-sky-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-xl shadow-sky-500/20 mb-4 animate-pulse">
          <span>D</span>
        </div>
        <h2 className="text-base font-bold text-white mb-1">Cargando sitio web...</h2>
        <p className="text-xs text-sky-300">Conectando catálogo y configuración en tiempo real</p>
      </div>
    );
  }

  // If activeView is Admin
  if (activeView === 'admin') {
    return <AdminLayout />;
  }

  // If activeView is Public Store
  if (activeView === 'public_store') {
    if (activeBusiness) {
      return <PublicBusinessView business={activeBusiness} />;
    }

    // If a slug was requested but no business matched
    return (
      <div className="min-h-screen bg-[#0d1520] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#16222f] border border-slate-700/80 shadow-2xl space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto text-xl font-bold">
            !
          </div>
          <h2 className="text-lg font-bold text-white">Negocio no encontrado</h2>
          <p className="text-xs text-sky-200">
            {currentPublicSlug
              ? `No se encontró ningún negocio registrado con el enlace "/#negocio/${currentPublicSlug}".`
              : 'No hay ningún negocio seleccionado para mostrar.'}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
            <button
              onClick={goToLanding}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sky-200 text-xs font-semibold rounded-xl border border-slate-700 cursor-pointer"
            >
              Ir a Inicio
            </button>
            <button
              onClick={goToAdmin}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-xl cursor-pointer"
            >
              Ir al Panel Administrador
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default: Landing Page
  return (
    <div className="min-h-screen bg-[#0d1520] text-slate-100 flex flex-col transition-colors duration-200 selection:bg-sky-500 selection:text-slate-950">
      {/* Sticky Navigation */}
      <Navbar
        onOpenCreateBusiness={goToAdmin}
        onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
      />

      {/* Landing Sections */}
      <main className="flex-1">
        <Hero onOpenCreateBusiness={goToAdmin} />
        <Services />
        <HowItWorks />
        <TemplatesSection />
        <Pricing onSelectPlan={goToAdmin} />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)} />

      {/* Firebase Setup Modal */}
      <FirebaseSetupModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BusinessProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </BusinessProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
