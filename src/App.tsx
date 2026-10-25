import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
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
  const { products } = useStore();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle URL hash, tab routing, and deep-linked product modal
  useEffect(() => {
    const handleUrlRouting = () => {
      const fullHash = window.location.hash.replace('#', '');
      
      // 1. Check if deep link is for a specific product (#product=... or #product/...)
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

      // 2. Tab routing
      if (fullHash === 'admin') setCurrentTab('admin');
      else if (fullHash === 'products') setCurrentTab('products');
      else if (fullHash === 'offers') setCurrentTab('offers');
      else if (fullHash === 'wishlist') setCurrentTab('wishlist');
      else if (fullHash === 'contact') setCurrentTab('contact');
      else if (fullHash === 'about') setCurrentTab('about');
      else if (fullHash === 'policies') setCurrentTab('policies');
      else if (!fullHash) setCurrentTab('home');
    };

    handleUrlRouting();
    window.addEventListener('hashchange', handleUrlRouting);
    return () => window.removeEventListener('hashchange', handleUrlRouting);
  }, [products]);

  const handleNavigate = (tab: string, categoryId?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (tab === 'category' && categoryId) {
      setSelectedCategory(categoryId);
      setCurrentTab('products');
      window.location.hash = 'products';
      return;
    }
    setSelectedCategory(undefined);
    setCurrentTab(tab);
    window.location.hash = tab === 'home' ? '' : tab;
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query && currentTab !== 'products') {
      setCurrentTab('products');
      window.location.hash = 'products';
    }
  };

  const handleCloseProductModal = () => {
    setSelectedProduct(null);
    // If current hash was product deep-link, clear it gracefully
    if (window.location.hash.startsWith('#product')) {
      history.replaceState(null, '', window.location.pathname + (window.location.search ? window.location.search : ''));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1917] selection:bg-[#E2B158]/30 selection:text-[#1C1917]">
      
      {/* Navigation Header */}
      <Navbar
        currentTab={selectedCategory ? `category-${selectedCategory}` : currentTab}
        onNavigate={handleNavigate}
        onOpenCart={() => setCartDrawerOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {/* Main Content Router */}
      <main className="flex-1">
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

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Slide-over Shopping Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        onNavigateToProducts={() => handleNavigate('products')}
      />

      {/* Product Details Modal with Size/Color Selectors, Web Share API, and WhatsApp Flow */}
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
