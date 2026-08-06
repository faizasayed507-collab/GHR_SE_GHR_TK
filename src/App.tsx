/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Category, Product, Seller, Order, CartItem, Review, OrderStatus, UserAccount, UserRole, VerificationStatus } from './types';
import { mockProducts, mockSellers, mockOrders } from './data/mockData';
import { Navbar } from './components/Navbar';
import { HeaderPills } from './components/HeaderPills';
import { HeroBanner } from './components/HeroBanner';
import { FeaturedHomepreneurs } from './components/FeaturedHomepreneurs';
import { ProductFeed } from './components/ProductFeed';
import { ProductDetailModal } from './components/ProductDetailModal';
import { EscrowModal } from './components/EscrowModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ArtisanChatModal } from './components/ArtisanChatModal';
import { SellerDashboardShell } from './components/SellerDashboard/SellerDashboardShell';
import { AuthModal } from './components/AuthModal';
import { AuthScreen } from './components/AuthScreen';
import AdminPanel from './components/SellerDashboard/AdminPanel';
import { Footer } from './components/Footer';
import { Store, LogOut, ShieldCheck, CheckCircle2 } from 'lucide-react';

const SEED_ACCOUNTS: UserAccount[] = [
  {
    id: 'buyer_demo',
    name: 'Ayesha Khan',
    emailOrPhone: 'ayesha@demo.pk',
    role: 'buyer',
  },
  {
    id: 'seller_demo',
    name: 'Fatima Zahra',
    emailOrPhone: '0300-1234567',
    role: 'seller',
    shopName: 'Multan Silk Studio',
    city: 'Multan',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  },
];

export default function App() {
  // Auth & Accounts State
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('ghar_se_ghar_tak_accounts');
      return saved ? JSON.parse(saved) : SEED_ACCOUNTS;
    } catch (e) {
      return SEED_ACCOUNTS;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  const [authModalConfig, setAuthModalConfig] = useState<{
    isOpen: boolean;
    mode: 'login' | 'signup';
    role: UserRole;
  }>({
    isOpen: false,
    mode: 'login',
    role: 'buyer',
  });

  // Effective Active Role
  const activeRole: UserRole = currentUser ? currentUser.role : 'buyer';

  // Category & Search State
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Products State with localStorage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('ghar_se_ghar_tak_products');
      return saved ? JSON.parse(saved) : mockProducts;
    } catch (e) {
      return mockProducts;
    }
  });

  const [sellers] = useState<Seller[]>(mockSellers);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedProductIds, setSavedProductIds] = useState<string[]>(['prod-1', 'prod-2']);

  // Modals state
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isEscrowModalOpen, setIsEscrowModalOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [activeChatSeller, setActiveChatSeller] = useState<{ id: string; name: string } | null>(null);

  const handleUpdateAccountStatus = (accountId: string, status: VerificationStatus) => {
    const isVerified = status === 'Verified';

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === accountId
          ? {
              ...acc,
              verificationStatus: status,
              verified: isVerified,
            }
          : acc
      )
    );

    if (currentUser && currentUser.id === accountId) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              verificationStatus: status,
              verified: isVerified,
            }
          : null
      );
    }

    setProducts((prev) =>
      prev.map((p) => {
        if (p.sellerId === accountId || p.seller?.id === accountId) {
          return {
            ...p,
            seller: {
              ...p.seller,
              verified: isVerified,
              verificationStatus: status,
            },
          };
        }
        return p;
      })
    );
  };

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ghar_se_ghar_tak_accounts', JSON.stringify(accounts));
    } catch (e) {
      console.error(e);
    }
  }, [accounts]);

  useEffect(() => {
    try {
      localStorage.setItem('ghar_se_ghar_tak_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('ghar_se_ghar_tak_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('ghar_se_ghar_tak_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  const handleAuthSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setAccounts((prev) => {
      const idx = prev.findIndex(
        (a) =>
          a.id === user.id ||
          a.emailOrPhone.toLowerCase().trim() === user.emailOrPhone.toLowerCase().trim()
      );
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], ...user };
        return updated;
      }
      return [...prev, user];
    });
  };

  const currentSeller: Seller = useMemo(() => {
    if (currentUser && currentUser.role === 'seller') {
      return {
        id: currentUser.id,
        name: currentUser.name || 'Homepreneur',
        homeBusinessName: currentUser.homeBusinessName || currentUser.shopName || `${currentUser.name}'s Home Business`,
        shopName: currentUser.homeBusinessName || currentUser.shopName || `${currentUser.name}'s Home Business`,
        city: currentUser.city || 'Multan',
        avatar:
          currentUser.avatar ||
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        rating: 5.0,
        totalSales: 0,
        joinedYear: '2026',
        bio: `Home-based business owned by ${currentUser.name}. Specializing in authentic handcrafted creations.`,
        verified: currentUser.verificationStatus === 'Verified' || Boolean(currentUser.verified),
        verificationStatus: currentUser.verificationStatus || 'Verified',
      };
    }
    return mockSellers[0];
  }, [currentUser]);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login', role: UserRole = 'buyer') => {
    setAuthModalConfig({
      isOpen: true,
      mode,
      role,
    });
  };

  // Category counts
  const categoryCounts = React.useMemo(() => {
    const counts: Record<Category, number> = {
      All: products.length,
      Clothing: 0,
      Jewellery: 0,
      Perfumes: 0,
      'Gift Baskets': 0,
      'Home Decor': 0,
    };
    products.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category] += 1;
      }
    });
    return counts;
  }, [products]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prevCart, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleUpdateCartNote = (productId: string, note: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, customNote: note } : item
      )
    );
  };

  const handleDirectBuyEscrow = (product: Product) => {
    handleAddToCart(product, 1);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handlePlaceOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
  };

  const handleAddReview = (productId: string, newReview: Omit<Review, 'id' | 'date'>) => {
    const reviewWithMeta: Review = {
      ...newReview,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedReviews = [reviewWithMeta, ...p.reviews];
          const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
          const newAvg = Number((totalRating / updatedReviews.length).toFixed(2));
          return {
            ...p,
            reviews: updatedReviews,
            reviewCount: updatedReviews.length,
            rating: newAvg,
          };
        }
        return p;
      })
    );
  };

  // Saved/Wishlist toggle
  const handleToggleSaved = (productId: string) => {
    setSavedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Seller Actions
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleToggleStock = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, inStock: !p.inStock, stockQuantity: p.inStock ? 0 : 5 }
          : p
      )
    );
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status,
            trackingNumber: trackingNumber || ord.trackingNumber,
            escrowReleaseDate:
              status === 'Payment Released'
                ? new Date().toISOString().split('T')[0] + ' (Released to Artisan)'
                : ord.escrowReleaseDate,
          };
        }
        return ord;
      })
    );
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (!currentUser) {
    return (
      <AuthScreen
        onAuthSuccess={handleAuthSuccess}
        existingAccounts={accounts}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#4A3F35] flex flex-col font-sans selection:bg-[#D4AF37] selection:text-white">
      {/* 0. ADMIN PANEL PORTAL */}
      {showAdminPanel ? (
        <AdminPanel
          accounts={accounts}
          sellers={sellers}
          onUpdateAccountStatus={handleUpdateAccountStatus}
          onClose={() => setShowAdminPanel(false)}
        />
      ) : currentUser.role === 'seller' ? (
        <div className="flex-1 flex flex-col min-h-screen bg-[#FAF6F2]">
          {/* Dedicated Seller Center Header */}
          <header className="sticky top-0 z-40 bg-[#4A3F35] text-white border-b border-[#D4AF37]/30 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#AA820A] flex items-center justify-center text-white font-serif font-bold text-lg shadow-sm border border-[#D4AF37]">
                  G
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-base sm:text-lg text-[#D4AF37]">
                      Ghar Se Ghar Tak
                    </span>
                    <span className="bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Seller Center
                    </span>
                  </div>
                  <p className="text-[10px] text-[#A69689] hidden sm:block">
                    Artisan Studio Dashboard & Escrow Management
                  </p>
                </div>
              </div>

              {/* Logged in Studio info + Admin Portal + Exit / Logout button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAdminPanel(true)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-[#D4AF37] text-xs font-bold rounded-xl border border-[#D4AF37]/40 transition-all flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Admin Panel</span>
                </button>

                <div className="flex items-center gap-2.5 px-3 py-1 bg-white/10 rounded-xl border border-white/15">
                  <img
                    src={currentSeller.avatar}
                    alt={currentSeller.name}
                    className="w-7 h-7 rounded-full object-cover border border-[#D4AF37]"
                  />
                  <div className="text-left text-xs">
                    <span className="font-bold text-white block leading-tight flex items-center gap-1">
                      {currentSeller.name}
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    </span>
                    <span className="text-[10px] text-[#D4AF37] block">
                      {currentSeller.shopName} • {currentSeller.city}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 bg-rose-900/60 hover:bg-rose-900 text-white text-xs font-semibold rounded-xl border border-rose-500/30 transition-all flex items-center gap-1.5"
                  title="Sign out of Seller Account"
                >
                  <LogOut className="w-3.5 h-3.5 text-white" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </header>

          {/* Seller Dashboard Shell */}
          <main className="flex-1">
            <SellerDashboardShell
              seller={currentSeller}
              orders={orders}
              products={products}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onToggleStock={handleToggleStock}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          </main>

          {/* Dedicated Seller Footer */}
          <footer className="bg-[#382F27] text-[#A69689] border-t border-white/10 py-4 px-6 text-center text-xs flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Ghar Se Ghar Tak Seller Portal • Protected by Automated Escrow Vault</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-[#D4AF37] hover:underline text-xs font-semibold"
            >
              Sign Out of Studio
            </button>
          </footer>
        </div>
      ) : (
        /* 2. MAIN BUYER APP (EXCLUSIVELY SHOPPING EXPERIENCE FOR BUYER ACCOUNT / GUEST) */
        <>
          {/* Top Navbar */}
          <Navbar
            cartCount={totalCartCount}
            onOpenCart={() => setIsCartOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenEscrowModal={() => setIsEscrowModalOpen(true)}
            savedCount={savedProductIds.length}
            currentUser={currentUser}
            onOpenAuthModal={(mode) => handleOpenAuth(mode, 'buyer')}
            onLogout={handleLogout}
            onOpenAdminPanel={() => setShowAdminPanel(true)}
          />

          {/* Buyer Logged In Welcome Greeting Bar */}
          {currentUser && (
            <div className="bg-[#FFF9F5] border-b border-[#D4AF37]/30 py-2.5 px-4 text-xs font-medium text-[#4A3F35] shadow-2xs">
              <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span>
                    Welcome, <strong className="text-[#D4AF37] text-sm font-bold font-serif">{currentUser.name}</strong>! You are logged in with Escrow Protection.
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold text-[#8C7B6C] hover:text-rose-700 underline flex items-center gap-1 shrink-0"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}

          <main className="flex-1">
            {/* Category Navigation Pills */}
            <HeaderPills
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              categoryCounts={categoryCounts}
            />

            {/* Hero Banner */}
            <HeroBanner
              onOpenEscrowModal={() => setIsEscrowModalOpen(true)}
              onExploreClick={() => {
                const feedEl = document.getElementById('product-feed');
                if (feedEl) feedEl.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Homepreneurs of the Week */}
            <FeaturedHomepreneurs
              sellers={sellers}
              onSelectSeller={(seller) => {
                setSearchQuery(seller.shopName);
                const feedEl = document.getElementById('product-feed');
                if (feedEl) feedEl.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Product Feed Grid */}
            <ProductFeed
              products={products}
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              onSelectProduct={(p) => setActiveProduct(p)}
              onAddToCart={(p) => handleAddToCart(p, 1)}
              onDirectBuyEscrow={handleDirectBuyEscrow}
              onToggleSaved={handleToggleSaved}
              savedProductIds={savedProductIds}
            />
          </main>

          {/* Buyer Footer */}
          <Footer
            onOpenEscrowModal={() => setIsEscrowModalOpen(true)}
          />
        </>
      )}

      {/* MODALS */}
      {/* Auth Modal (Login/Signup with Role selection) */}
      <AuthModal
        isOpen={authModalConfig.isOpen}
        onClose={() => setAuthModalConfig((prev) => ({ ...prev, isOpen: false }))}
        initialMode={authModalConfig.mode}
        initialRole={authModalConfig.role}
        onAuthSuccess={handleAuthSuccess}
        existingAccounts={accounts}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToCart={handleAddToCart}
        onDirectBuyEscrow={handleDirectBuyEscrow}
        onOpenArtisanChat={(sellerId, sellerName) =>
          setActiveChatSeller({ id: sellerId, name: sellerName })
        }
        onAddReview={handleAddReview}
        onOpenEscrowModal={() => setIsEscrowModalOpen(true)}
      />

      {/* Escrow Explanation Modal */}
      <EscrowModal
        isOpen={isEscrowModalOpen}
        onClose={() => setIsEscrowModalOpen(false)}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onUpdateNote={handleUpdateCartNote}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Safe Escrow Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Direct Artisan Chat Modal */}
      {activeChatSeller && (
        <ArtisanChatModal
          isOpen={Boolean(activeChatSeller)}
          onClose={() => setActiveChatSeller(null)}
          sellerId={activeChatSeller.id}
          sellerName={activeChatSeller.name}
        />
      )}
    </div>
  );
}

