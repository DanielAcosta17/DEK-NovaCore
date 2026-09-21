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
    getBusinessBySlug,
    goToPublicStore,
    goToAdmin,
    goToLanding,
    businesses,
  } = useBusiness();

  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);

  // Synchronize with URL hash routing (e.g., #negocio/pasteleria-dulce-encanto, #admin)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash.startsWith('negocio/')) {
        const slug = hash.replace('negocio/', '');
        goToPublicStore(slug);
      } else if (hash === 'admin') {
        goToAdmin();
      } else if (!hash || hash === 'inicio') {
        goToLanding();
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when activeView changes
  useEffect(() => {
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
  }, [activeView, activeBusiness]);

  // If activeView is Admin
  if (activeView === 'admin') {
    return <AdminLayout />;
  }

  // If activeView is Public Store
  if (activeView === 'public_store' && activeBusiness) {
    return <PublicBusinessView business={activeBusiness} />;
  }

  // Default: Landing Page
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-200 selection:bg-[#253745] selection:text-white">
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
