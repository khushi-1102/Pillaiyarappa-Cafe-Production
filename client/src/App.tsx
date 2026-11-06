import React, { useState, useEffect } from 'react';
import { appStore, subscribeToStore } from './services/store';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileStickyBar } from './components/layout/MobileStickyBar';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { OrderModal } from './components/common/OrderModal';
import { BrandBackgroundOverlay } from './components/brand/BrandBackgroundOverlay';
import { CartProvider } from './hooks/useCart';
import { FloatingCartBar } from './components/common/FloatingCartBar';
import { CartDrawer } from './components/common/CartDrawer';

// Pages
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { AboutPage } from './pages/AboutPage';
import { CateringPage } from './pages/CateringPage';
import { BranchesPage } from './pages/BranchesPage';
import { ContactPage } from './pages/ContactPage';
import { GalleryPage } from './pages/GalleryPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  // Sync state with store
  const [settings, setSettings] = useState(() => appStore.getSettings());
  const [categories, setCategories] = useState(() => appStore.getCategories());
  const [menuItems, setMenuItems] = useState(() => appStore.getMenuItems());
  const [branches, setBranches] = useState(() => appStore.getBranches());
  const [offers, setOffers] = useState(() => appStore.getOffers());
  const [gallery, setGallery] = useState(() => appStore.getGallery());
  const [addons, setAddons] = useState(() => appStore.getAddons());

  // Routing
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;

      // Ensure default landing page on mobile is always the Home page ('/')
      // This prevents landing directly on /menu if user opened an old test link or if mobile browser restored a /menu tab
      const isMobile =
        window.innerWidth <= 768 ||
        /iphone|ipad|ipod|android/i.test(navigator.userAgent || '');
      const isDirectMenuLanding = path === '/menu' || path === '/menu/';
      const hasNavigatedInSession =
        typeof sessionStorage !== 'undefined' &&
        sessionStorage.getItem('pillaiyarappa_nav_active');

      if (isMobile && isDirectMenuLanding && !hasNavigatedInSession) {
        window.history.replaceState(null, '', '/');
        return '/';
      }

      return hash ? `${path}${hash}` : path || '/';
    }
    return '/';
  });

  // Order modal state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Subscribe to store updates and trigger background server sync on mount
  useEffect(() => {
    appStore.syncWithServer();
    const unsubscribe = subscribeToStore(() => {
      setSettings(appStore.getSettings());
      setCategories(appStore.getCategories());
      setMenuItems(appStore.getMenuItems());
      setAddons(appStore.getAddons());
      setBranches(appStore.getBranches());
      setOffers(appStore.getOffers());
      setGallery(appStore.getGallery());
    });
    return unsubscribe;
  }, []);

  // Browser navigation popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.hash);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigate helper
  const navigate = (path: string) => {
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('pillaiyarappa_nav_active', '1');
      }
    } catch {}
    setCurrentPath(path);
    window.history.pushState(null, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine active route
  const getCleanRoute = () => {
    const [pathPart] = currentPath.split('#');
    return pathPart || '/';
  };

  const getHashSlug = () => {
    const parts = currentPath.split('#');
    return parts[1] || '';
  };

  const cleanRoute = getCleanRoute();
  const hashSlug = getHashSlug();

  const isAdminRoute = cleanRoute === '/admin';

  return (
    <CartProvider>
      <div className="min-h-screen bg-[#090909] text-white flex flex-col font-sans selection:bg-emerald-500 selection:text-white relative">
        {/* Brand Identity Overlay: Subtle Kolam & Botanical Ambiance */}
        <BrandBackgroundOverlay />

        {/* Skip to Main Content Link for Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-500 focus:text-white focus:font-bold focus:rounded-lg focus:shadow-xl focus:outline-none"
        >
          Skip to main content
        </a>

        {/* Global Header (Hidden on Admin page for full screen dashboard) */}
        {!isAdminRoute && (
          <Header
            currentPath={cleanRoute}
            onNavigate={navigate}
            settings={settings}
            onOpenOrderModal={() => setIsOrderModalOpen(true)}
          />
        )}

        {/* Main Content Area */}
        <main id="main-content" className="flex-1 pb-32 sm:pb-0" role="main" tabIndex={-1}>
          {cleanRoute === '/' && (
            <HomePage
              settings={settings}
              categories={categories}
              items={menuItems}
              branches={branches}
              gallery={gallery}
              offers={offers}
              onNavigate={navigate}
              onOpenOrderModal={() => setIsOrderModalOpen(true)}
            />
          )}

        {cleanRoute === '/menu' && (
          <MenuPage
            categories={categories}
            items={menuItems}
            addons={addons}
            settings={settings}
            onOpenOrderModal={() => setIsOrderModalOpen(true)}
            initialCategorySlug={hashSlug}
          />
        )}

        {cleanRoute === '/about' && (
          <AboutPage
            settings={settings}
            branches={branches}
            onNavigate={navigate}
            onOpenOrderModal={() => setIsOrderModalOpen(true)}
          />
        )}

        {cleanRoute === '/catering' && (
          <CateringPage settings={settings} branches={branches} />
        )}

        {cleanRoute === '/branches' && (
          <BranchesPage
            branches={branches}
            settings={settings}
            onOpenOrderModal={() => setIsOrderModalOpen(true)}
          />
        )}

        {cleanRoute === '/contact' && (
          <ContactPage settings={settings} branches={branches} />
        )}

        {cleanRoute === '/gallery' && <GalleryPage gallery={gallery} />}

        {cleanRoute === '/privacy' && <PrivacyPage />}

        {cleanRoute === '/terms' && <TermsPage />}

        {cleanRoute === '/admin' && (
          <AdminPage
            settings={settings}
            categories={categories}
            menuItems={menuItems}
            addons={addons}
            branches={branches}
            offers={offers}
            onNavigateHome={() => navigate('/')}
          />
        )}
      </main>

      {/* Global Footer (Hidden on Admin page) */}
      {!isAdminRoute && (
        <Footer
          onNavigate={navigate}
          settings={settings}
          branches={branches}
        />
      )}

        {/* Mobile Sticky Action Bar on public pages */}
        {!isAdminRoute && (
          <MobileStickyBar
            settings={settings}
            currentPath={cleanRoute}
            onOpenOrderModal={() => setIsOrderModalOpen(true)}
          />
        )}

        {/* Floating Cart Bar (Above mobile bar on phones & bottom-right pill on desktop) */}
        {!isAdminRoute && <FloatingCartBar />}

        {/* Ultra-Premium Cart Drawer with 1-Tap WhatsApp Checkout */}
        <CartDrawer settings={settings} />

        {/* Order Options Modal */}
        <OrderModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          settings={settings}
          branches={branches}
        />

        {/* Offline Connectivity Status Banner & Sync Notification */}
        <OfflineIndicator />
      </div>
    </CartProvider>
  );
}
