import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WelcomeIntro } from './components/WelcomeIntro';
import { MobileBottomContactBar } from './components/MobileBottomContactBar';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { OffersPage } from './pages/OffersPage';
import { WishlistPage } from './pages/WishlistPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { AdminPanel } from './pages/AdminPanel';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { Product } from './types';

function AppContent() {
  const { products, settings } = useStore();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Three-Slide Animated Welcome Experience state (session-based)
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      // Respect prefers-reduced-motion
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return false;
      }
      // Never show intro if directly navigating to /admin
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        const hash = window.location.hash;
        if (path === '/admin' || path.startsWith('/admin') || hash === '#admin') {
          return false;
        }
        return sessionStorage.getItem('sanwariya_welcome_intro_seen') !== 'true';
      }
      return false;
    } catch {
      return false;
    }
  });

  // Handle URL pathname (/admin), hash routing, and deep-linked product modal
  useEffect(() => {
    const handleUrlRouting = () => {
      const pathname = window.location.pathname.replace(/\/$/, '');
      const fullHash = window.location.hash.replace('#', '');
      
      // 1. Direct /admin route support (Netlify / Vercel SPA rewrites & direct refresh)
      if (pathname === '/admin' || pathname.startsWith('/admin') || fullHash === 'admin') {
        setCurrentTab('admin');
        return;
      }

      // 2. Check if deep link is for a specific product (#product=... or #product/...)
      let targetProductId = '';
      if (fullHash.startsWith('product=')) {
        targetProductId = fullHash.split('product=')[1];
      } else if (fullHash.startsWith('product/')) {
        targetProductId = fullHash.split('product/')[1];
      }

      // Also check query param ?product=...
      if (!targetProductId && window.location.search) {
        const urlParams = new URLSearchParams(window.location.search);
        targetProductId = urlParams.get('product') || '';
      }

      if (targetProductId && products.length > 0) {
        const found = products.find(
          p => p.id === targetProductId || p.sku.toLowerCase() === targetProductId.toLowerCase()
        );
        if (found) {
          setSelectedProduct(found);
          return;
        }
      }

      // 3. Tab routing via Hash or Path
      if (fullHash === 'products' || pathname === '/products') setCurrentTab('products');
      else if (fullHash === 'offers' || pathname === '/offers') setCurrentTab('offers');
      else if (fullHash === 'wishlist' || pathname === '/wishlist') setCurrentTab('wishlist');
      else if (fullHash === 'contact' || pathname === '/contact') setCurrentTab('contact');
      else if (fullHash === 'about' || pathname === '/about') setCurrentTab('about');
      else if (fullHash === 'policies' || pathname === '/policies') setCurrentTab('policies');
      else if (!fullHash && pathname === '') setCurrentTab('home');
    };

    handleUrlRouting();
    window.addEventListener('hashchange', handleUrlRouting);
    window.addEventListener('popstate', handleUrlRouting);
    return () => {
      window.removeEventListener('hashchange', handleUrlRouting);
      window.removeEventListener('popstate', handleUrlRouting);
    };
  }, [products]);

  const handleNavigate = (tab: string, categoryId?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (tab === 'category' && categoryId) {
      setSelectedCategory(categoryId);
      setCurrentTab('products');
      window.history.pushState(null, '', '#products');
      return;
    }

    setSelectedCategory(undefined);
    setCurrentTab(tab);

    if (tab === 'admin') {
      // Use clean /admin path with #admin fallback
      window.history.pushState(null, '', '/admin');
    } else if (tab === 'home') {
      window.history.pushState(null, '', '/');
    } else {
      window.history.pushState(null, '', `#${tab}`);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query && currentTab !== 'products') {
      setCurrentTab('products');
      window.history.pushState(null, '', '#products');
    }
  };

  const handleCloseProductModal = () => {
    setSelectedProduct(null);
    if (window.location.hash.startsWith('#product')) {
      history.replaceState(null, '', window.location.pathname + (window.location.search ? window.location.search : ''));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1917] selection:bg-[#E2B158]/30 selection:text-[#1C1917]">
      
      {/* 1. Three-Slide Animated Welcome Experience (Full-screen intro before website entry) */}
      {showIntro && (
        <WelcomeIntro
          onComplete={() => setShowIntro(false)}
          logoUrl={settings.logo_url}
        />
      )}

      {/* 2. Navigation Header */}
      <Navbar
        currentTab={selectedCategory ? `category-${selectedCategory}` : currentTab}
        onNavigate={handleNavigate}
        onOpenCart={() => setCartDrawerOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onReplayIntro={() => setShowIntro(true)}
      />

      {/* 3. Main Content Router with bottom padding so Fixed Mobile Contact Bar never covers content */}
      <main className="flex-1 pb-20 md:pb-6">
        {currentTab === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectProduct={(prod) => setSelectedProduct(prod)}
          />
        )}

        {currentTab === 'products' && (
          <ProductsPage
            initialCategoryId={selectedCategory}
            onSelectProduct={(prod) => setSelectedProduct(prod)}
            externalSearch={searchQuery}
          />
        )}

        {currentTab === 'offers' && (
          <OffersPage
            onSelectProduct={(prod) => setSelectedProduct(prod)}
            onNavigateToProducts={() => handleNavigate('products')}
          />
        )}

        {currentTab === 'wishlist' && (
          <WishlistPage
            onSelectProduct={(prod) => setSelectedProduct(prod)}
            onNavigateToProducts={() => handleNavigate('products')}
          />
        )}

        {currentTab === 'about' && (
          <AboutPage
            onNavigateToContact={() => handleNavigate('contact')}
          />
        )}

        {currentTab === 'contact' && (
          <ContactPage />
        )}

        {currentTab === 'policies' && (
          <PoliciesPage />
        )}

        {currentTab === 'admin' && (
          <AdminPanel />
        )}
      </main>

      {/* 4. Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* 5. Fixed Bottom Contact Bar — Mobile Priority (Call, WhatsApp, Location, YouTube, Instagram, Facebook) */}
      <MobileBottomContactBar />

      {/* 6. Slide-over Shopping Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        onNavigateToProducts={() => handleNavigate('products')}
      />

      {/* 7. Product Details Modal with Size/Color Selectors, Web Share API, and WhatsApp Flow */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={handleCloseProductModal}
        onOpenCart={() => setCartDrawerOpen(true)}
      />

    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
