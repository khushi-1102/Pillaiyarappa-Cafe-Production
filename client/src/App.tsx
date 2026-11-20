import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

// Primary Landing Page (Loaded eagerly for instant 0ms first-paint)
import { HomePage } from './pages/HomePage';

// Lazy-loaded routes (Drastically slashes initial bundle size for lightning-fast loads)
const MenuPage = lazy(() => import('./pages/MenuPage').then((m) => ({ default: m.MenuPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const CateringPage = lazy(() => import('./pages/CateringPage').then((m) => ({ default: m.CateringPage })));
const BranchesPage = lazy(() => import('./pages/BranchesPage').then((m) => ({ default: m.BranchesPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const GalleryPage = lazy(() => import('./pages/GalleryPage').then((m) => ({ default: m.GalleryPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then((m) => ({ default: m.TermsPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then((m) => ({ default: m.AdminPage })));

// Ultra-smooth loading transition skeleton
const PageLoader = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center py-20 select-none">
    <div className="w-10 h-10 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
    <span className="text-[11px] font-bold text-gray-400 mt-4 tracking-widest uppercase">
      Pillaiyarappa
    </span>
  </div>
);

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
          <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
              <motion.div
                key={cleanRoute}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
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
              </motion.div>
            </AnimatePresence>
          </Suspense>
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
