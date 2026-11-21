/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Category, Product, Seller, Order, CartItem, Review, OrderStatus, UserAccount, UserRole } from './types';
import { supabase } from './lib/supabase';
import { fetchAllProducts, insertProduct, updateProductRow, deleteProductRow } from './lib/productsApi';
import { fetchMyOrders, shipOrderApi } from './lib/ordersApi';
import { Navbar } from './components/Navbar';
import { HeaderPills } from './components/HeaderPills';
import { HeroBanner } from './components/HeroBanner';
import { FeaturedHomepreneurs } from './components/FeaturedHomepreneurs';
import { ProductFeed } from './components/ProductFeed';
import { ProductDetailModal } from './components/ProductDetailModal';
import { EscrowModal } from './components/EscrowModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { MyOrders } from './components/MyOrders';
import { ArtisanChatModal } from './components/ArtisanChatModal';
import { SellerDashboardShell } from './components/SellerDashboard/SellerDashboardShell';
import { AuthModal } from './components/AuthModal';
import { AuthScreen } from './components/AuthScreen';
import { Footer } from './components/Footer';
import { LogOut, ShieldCheck, CheckCircle2 } from 'lucide-react';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80';

export default function App() {
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

  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedProductIds, setSavedProductIds] = useState<string[]>([]);

  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isEscrowModalOpen, setIsEscrowModalOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState<boolean>(false);
  const [activeChatSeller, setActiveChatSeller] = useState<{ id: string; name: string } | null>(null);

  const reloadProducts = async () => {
    setProducts(await fetchAllProducts());
  };

  const reloadOrders = async () => {
    setOrders(currentUser ? await fetchMyOrders() : []);
  };

  useEffect(() => {
    reloadProducts();
  }, [currentUser]);

  useEffect(() => {
    reloadOrders();
  }, [currentUser]);

  const handleAuthSuccess = (user: UserAccount) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    setCurrentUser(null);
    setCart([]);
    setOrders([]);
  };

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login', role: UserRole = 'buyer') => {
    setAuthModalConfig({ isOpen: true, mode, role });
  };

  const currentSeller: Seller = useMemo(() => {
    const u = currentUser;
    const name = u?.name || 'Homepreneur';
    const business = u?.homeBusinessName || u?.shopName || `${name}'s Home Business`;
    return {
      id: u?.id || '',
      name,
      homeBusinessName: business,
      shopName: business,
      city: u?.city || '',
      avatar: u?.avatar || DEFAULT_AVATAR,
      rating: 0,
      totalSales: 0,
      joinedYear: u?.createdAt ? String(new Date(u.createdAt).getFullYear()) : '2026',
      bio: u?.bio || `Home-based business owned by ${name}.`,
      verified: u?.verificationStatus === 'Verified',
      verificationStatus: u?.verificationStatus || 'Pending Admin Review',
    };
  }, [currentUser]);

  const sellers: Seller[] = useMemo(() => {
    const map = new Map<string, Seller>();
    products.forEach((p) => {
      if (p.seller && !map.has(p.seller.id)) map.set(p.seller.id, p.seller);
    });
    return Array.from(map.values());
  }, [products]);

  const categoryCounts = useMemo(() => {
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

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prevCart, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
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

  const handlePlaceOrder = async (_newOrder?: Order) => {
    setCart([]);
    await reloadOrders();
    await reloadProducts();
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

  const handleToggleSaved = (productId: string) => {
    setSavedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddProduct = async (newProduct: Product) => {
    const saved = await insertProduct(newProduct);
    if (saved) await reloadProducts();
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    if (await updateProductRow(updatedProduct)) await reloadProducts();
  };

  const handleDeleteProduct = async (productId: string) => {
    if (await deleteProductRow(productId)) await reloadProducts();
  };

  const handleToggleStock = async (productId: string) => {
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    const ok = await updateProductRow({
      ...p,
      inStock: !p.inStock,
      stockQuantity: p.inStock ? 0 : 5,
    });
    if (ok) await reloadProducts();
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string,
    courier?: string
  ) => {
    if (status !== 'Shipped') return;
    const res = await shipOrderApi(orderId, courier || 'TCS Express', trackingNumber || '');
    if (!res.ok) alert('Could not ship: ' + res.error);
    await reloadOrders();
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (!currentUser) {
    return (
      <AuthScreen
        onAuthSuccess={handleAuthSuccess}
        existingAccounts={[]}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#4A3F35] flex flex-col font-sans selection:bg-[#D4AF37] selection:text-white">
      {currentUser.role === 'seller' ? (
        <div className="flex-1 flex flex-col min-h-screen bg-[#FAF6F2]">
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

              <div className="flex items-center gap-3">
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
        <>
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
          />

          <div className="bg-[#FFF9F5] border-b border-[#D4AF37]/30 py-2.5 px-4 text-xs font-medium text-[#4A3F35] shadow-2xs">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>
                  Welcome, <strong className="text-[#D4AF37] text-sm font-bold font-serif">{currentUser.name}</strong>! You are logged in with Escrow Protection.
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setIsMyOrdersOpen(true)}
                  className="text-xs font-bold text-[#4A3F35] bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-3 py-1 rounded-full"
                >
                  Meri Orders ({orders.length})
                </button>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold text-[#8C7B6C] hover:text-rose-700 underline flex items-center gap-1"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          <main className="flex-1">
            <HeaderPills
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              categoryCounts={categoryCounts}
            />

            <HeroBanner
              onOpenEscrowModal={() => setIsEscrowModalOpen(true)}
              onExploreClick={() => {
                const feedEl = document.getElementById('product-feed');
                if (feedEl) feedEl.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {sellers.length > 0 && (
              <FeaturedHomepreneurs
                sellers={sellers}
                onSelectSeller={(seller) => {
                  setSearchQuery(seller.shopName || seller.homeBusinessName);
                  const feedEl = document.getElementById('product-feed');
                  if (feedEl) feedEl.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            )}

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

          <Footer onOpenEscrowModal={() => setIsEscrowModalOpen(true)} />
        </>
      )}

      <AuthModal
        isOpen={authModalConfig.isOpen}
        onClose={() => setAuthModalConfig((prev) => ({ ...prev, isOpen: false }))}
        initialMode={authModalConfig.mode}
        initialRole={authModalConfig.role}
        onAuthSuccess={handleAuthSuccess}
        existingAccounts={[]}
      />

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

      <EscrowModal
        isOpen={isEscrowModalOpen}
        onClose={() => setIsEscrowModalOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onUpdateNote={handleUpdateCartNote}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onPlaceOrder={handlePlaceOrder}
      />

      <MyOrders
        isOpen={isMyOrdersOpen}
        onClose={() => setIsMyOrdersOpen(false)}
        orders={orders}
        onChanged={reloadOrders}
      />

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