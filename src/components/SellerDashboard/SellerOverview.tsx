import React from 'react';
import { Seller, Order, Product } from '../../types';
import { ShieldCheck, TrendingUp, Clock, Star, Wallet, PackageCheck, AlertCircle, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface SellerOverviewProps {
  seller: Seller;
  orders: Order[];
  products: Product[];
  onNavigateTab: (tab: 'products' | 'orders' | 'earnings') => void;
}

export const SellerOverview: React.FC<SellerOverviewProps> = ({
  seller,
  orders,
  products,
  onNavigateTab,
}) => {
  const totalSales = orders
    .filter((o) => o.status === 'Payment Released')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingEscrowAmount = orders
    .filter((o) => o.status === 'In Escrow' || o.status === 'Shipped' || o.status === 'Pending')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'Pending' || o.status === 'In Escrow'
  ).length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950 via-rose-900 to-stone-900 text-white relative overflow-hidden shadow-lg border border-rose-900/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={seller.avatar}
              alt={seller.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-amber-50">
                  Welcome back, {seller.name}!
                </h1>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Studio
                </span>
              </div>
              <p className="text-xs text-rose-200 mt-1">
                {seller.shopName} • {seller.city}, Pakistan • Member since {seller.joinedYear}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('products')}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-rose-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <span>+ Add New Product</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Released Revenue */}
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-500 font-medium block">Released Earnings</span>
            <span className="text-xl font-bold font-serif text-stone-900 mt-0.5 block">
              Rs. {totalSales.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5 mt-1">
              <CheckCircle2 className="w-3 h-3" /> Ready for withdrawal
            </span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        {/* Pending in Escrow */}
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-500 font-medium block">Locked in Escrow</span>
            <span className="text-xl font-bold font-serif text-amber-700 mt-0.5 block">
              Rs. {pendingEscrowAmount.toLocaleString()}
            </span>
            <span className="text-[10px] text-amber-800 font-semibold flex items-center gap-0.5 mt-1">
              <Clock className="w-3 h-3" /> Released after delivery
            </span>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-700">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Orders Count */}
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-500 font-medium block">Pending Orders</span>
            <span className="text-xl font-bold font-serif text-rose-900 mt-0.5 block">
              {pendingOrdersCount} Orders
            </span>
            <span className="text-[10px] text-stone-500 font-medium mt-1 block">
              Requires dispatch
            </span>
          </div>
          <div className="p-3 bg-rose-50 rounded-xl text-rose-800">
            <PackageCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Store Rating */}
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-500 font-medium block">Artisan Rating</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-bold font-serif text-stone-900">
                {seller.rating}
              </span>
              <span className="text-xs text-stone-400">/ 5.0</span>
            </div>
            <span className="text-[10px] text-stone-500 font-medium mt-1 block">
              Based on {seller.totalSales} verified buyers
            </span>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <Star className="w-6 h-6 fill-amber-500" />
          </div>
        </div>
      </div>

      {/* Escrow Protection Reminder Card */}
      <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-900 text-amber-300 rounded-xl shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-rose-950 uppercase tracking-wide">
              How Escrow Protects Pakistani Artisans
            </h3>
            <p className="text-xs text-stone-700 mt-0.5">
              Buyers lock payment upfront before you start crafting. You get 100% guaranteed payment upon delivery confirmation—no non-payment or fake COD returns!
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('orders')}
          className="px-4 py-2 bg-rose-900 text-white text-xs font-bold rounded-xl whitespace-nowrap hover:bg-rose-800 shrink-0"
        >
          View Pending Orders ({pendingOrdersCount})
        </button>
      </div>

      {/* Recent Orders List */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-serif font-bold text-stone-900">
            Recent Escrow Orders
          </h2>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-bold text-rose-800 hover:text-rose-950 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {orders.slice(0, 3).map((ord) => (
            <div
              key={ord.id}
              className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2 font-bold text-stone-900">
                  <span>{ord.orderNumber}</span>
                  <span className="text-stone-400 font-normal">• {ord.date}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    {ord.status}
                  </span>
                </div>
                <div className="text-stone-600 mt-1">
                  Buyer: <strong>{ord.customerName}</strong> ({ord.customerCity})
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <span className="font-bold text-stone-900 font-serif text-sm">
                  Rs. {ord.totalAmount.toLocaleString()}
                </span>
                <button
                  onClick={() => onNavigateTab('orders')}
                  className="px-3 py-1.5 bg-white border border-stone-200 hover:border-rose-300 text-stone-800 font-semibold rounded-lg text-xs"
                >
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
