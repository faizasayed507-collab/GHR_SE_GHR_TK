import React, { useState } from 'react';
import { Seller, Order, Product, OrderStatus } from '../../types';
import { SellerOverview } from './SellerOverview';
import { SellerProducts } from './SellerProducts';
import { SellerOrders } from './SellerOrders';
import { SellerEarnings } from './SellerEarnings';
import { LayoutDashboard, ShoppingBag, PackageCheck, Wallet, Store, ShieldCheck } from 'lucide-react';

interface SellerDashboardShellProps {
  seller: Seller;
  orders: Order[];
  products: Product[];
  onAddProduct: (newProduct: Product) => void;
  onUpdateProduct?: (updatedProduct: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onToggleStock: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;
}

export const SellerDashboardShell: React.FC<SellerDashboardShellProps> = ({
  seller,
  orders,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onToggleStock,
  onUpdateOrderStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'earnings'>('overview');

  const pendingCount = orders.filter((o) => o.status === 'Pending' || o.status === 'In Escrow').length;

  return (
    <div className="min-h-[85vh] bg-stone-100/60 pb-12">
      {/* Top Studio Bar */}
      <div className="bg-stone-900 text-white border-b border-stone-800 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4A3F35] to-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-bold font-serif text-lg border border-[#D4AF37]">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-serif font-bold text-amber-100">
                  {seller.homeBusinessName || seller.shopName || `${seller.name}'s Home Business`}
                </h2>
                {seller.verificationStatus === 'Verified' || seller.verified ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                    ✓ Verified Homepreneur
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 flex items-center gap-1">
                    ⏳ Pending CNIC Verification
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400">
                Homepreneur ID: {seller.id} • {seller.city}, Pakistan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-700 text-stone-300">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Escrow Protection Active</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-white border-b border-stone-200 sticky top-14 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 sm:space-x-8 overflow-x-auto no-scrollbar">
            {[
              { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: 'products', label: 'My Home Business', icon: <ShoppingBag className="w-4 h-4" />, count: products.filter(p => p.sellerId === seller.id || p.seller?.id === seller.id).length },
              { id: 'orders', label: 'Orders', icon: <PackageCheck className="w-4 h-4" />, count: pendingCount, badgeColor: 'bg-rose-700 text-white' },
              { id: 'earnings', label: 'Earnings & Wallet', icon: <Wallet className="w-4 h-4" /> },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-3.5 px-3 border-b-2 font-medium text-xs sm:text-sm transition-all whitespace-nowrap ${
                    isActive
                      ? 'border-rose-900 text-rose-950 font-bold'
                      : 'border-transparent text-stone-600 hover:text-stone-900 hover:border-stone-300'
                  }`}
                >
                  <span className={isActive ? 'text-rose-800' : 'text-stone-400'}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        tab.badgeColor || 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <SellerOverview
            seller={seller}
            orders={orders}
            products={products}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'products' && (
          <SellerProducts
            products={products}
            sellerId={seller.id}
            seller={seller}
            onAddProduct={onAddProduct}
            onUpdateProduct={onUpdateProduct}
            onDeleteProduct={onDeleteProduct}
            onToggleStock={onToggleStock}
          />
        )}

        {activeTab === 'orders' && (
          <SellerOrders
            orders={orders}
            onUpdateOrderStatus={onUpdateOrderStatus}
          />
        )}

        {activeTab === 'earnings' && (
          <SellerEarnings
            seller={seller}
            orders={orders}
          />
        )}
      </div>
    </div>
  );
};
