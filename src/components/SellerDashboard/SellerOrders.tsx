import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { ShieldCheck, Truck, Printer, X, FileText } from 'lucide-react';

interface SellerOrdersProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string, courier?: string) => void;
}

export const SellerOrders: React.FC<SellerOrdersProps> = ({ orders, onUpdateOrderStatus }) => {
  const [slipOrder, setSlipOrder] = useState<Order | null>(null);
  const [shipOrder, setShipOrder] = useState<Order | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierName, setCourierName] = useState('TCS Express');

  const handleShipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipOrder || !trackingNumber.trim()) return;
    onUpdateOrderStatus(shipOrder.id, 'Shipped', trackingNumber.trim(), courierName);
    setShipOrder(null);
    setTrackingNumber('');
  };

  const badge = (status: string) => {
    switch (status) {
      case 'In Escrow': return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'Shipped': return 'bg-purple-100 text-purple-900 border-purple-200';
      case 'Payment Released': return 'bg-emerald-700 text-white border-emerald-800';
      case 'Disputed': return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'Refunded': return 'bg-stone-200 text-stone-800 border-stone-300';
      default: return 'bg-amber-100 text-amber-900 border-amber-200';
    }
  };

  const hint = (o: Order) => {
    switch (o.status) {
      case 'In Escrow': return 'Buyer ka paisa safe hai. Parcel ship karo.';
      case 'Shipped': return `Shipped via ${o.courierName || 'courier'} (${o.trackingNumber}). Buyer ke confirm karne ka intezar.`;
      case 'Payment Released': return 'Buyer ne confirm kiya. Paisa tumhare wallet mein release ho gaya.';
      case 'Disputed': return 'Buyer ne masla report kiya hai. Admin faisla karega.';
      case 'Refunded': return 'Dispute mein paisa buyer ko wapas gaya.';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-stone-200">
        <h1 className="text-xl font-serif font-bold text-stone-900">Escrow Orders ({orders.length})</h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Orders ship karo aur tracking number daalo. Paisa tab milega jab buyer delivery confirm kare.
        </p>
      </div>

      {orders.length === 0 && (
        <div className="bg-white p-10 rounded-2xl border border-stone-200 text-center text-xs text-stone-500">
          Abhi koi order nahi aaya.
        </div>
      )}

      <div className="space-y-4">
        {orders.map((ord) => (
          <div key={ord.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-stone-900 text-sm">{ord.orderNumber}</span>
                <span className="text-stone-400">•</span>
                <span className="text-stone-500 font-medium">{ord.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge(ord.status)}`}>{ord.status}</span>
                <button
                  onClick={() => setSlipOrder(ord)}
                  className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Packing Slip</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center text-xs">
              <div className="md:col-span-4 space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Customer</span>
                <div className="font-bold text-stone-900">{ord.customerName}</div>
                <div className="text-stone-600">{ord.customerPhone}</div>
                <div className="text-stone-500">{ord.customerAddress}, {ord.customerCity}</div>
              </div>
              <div className="md:col-span-5 space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Items</span>
                {ord.items.map((it, i) => (
                  <div key={i} className="text-stone-800 font-medium">{it.quantity}x {it.product.title}</div>
                ))}
              </div>
              <div className="md:col-span-3 text-left md:text-right">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Escrow Amount</span>
                <div className="text-lg font-bold font-serif text-rose-950">Rs. {ord.totalAmount.toLocaleString()}</div>
                <span className="text-[10px] text-amber-800 font-semibold block">Via {ord.paymentMethod}</span>
              </div>
            </div>

            <div className="bg-stone-50/70 p-3 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-stone-700 font-medium">{hint(ord)}</span>
              </div>
              {ord.status === 'In Escrow' && (
                <button
                  onClick={() => { setShipOrder(ord); setTrackingNumber(''); }}
                  className="px-3.5 py-1.5 bg-rose-900 hover:bg-rose-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Enter Tracking & Ship</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {shipOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-rose-100 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-stone-900">Ship Order {shipOrder.orderNumber}</h3>
              <button onClick={() => setShipOrder(null)} className="text-stone-400 hover:text-stone-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleShipSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Courier *</label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full bg-stone-50 px-3 py-2 text-xs rounded-xl border border-stone-200 font-medium"
                >
                  <option value="TCS Express">TCS</option>
                  <option value="Leopards Courier">Leopards</option>
                  <option value="M&P Express">M&P</option>
                  <option value="Trax">Trax</option>
                  <option value="Pakistan Post">Pakistan Post</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Asli Tracking Number *</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  required
                  placeholder="Courier ki receipt wala number"
                  className="w-full bg-stone-50 px-3 py-2 text-xs rounded-xl border border-stone-200 font-mono font-bold"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShipOrder(null)} className="px-4 py-2 text-stone-600 text-xs font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-rose-900 text-white text-xs font-bold rounded-xl">
                  Confirm Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {slipOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-stone-300 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-900" />
                <h3 className="text-base font-serif font-bold text-stone-900">Packing Slip</h3>
              </div>
              <button onClick={() => setSlipOrder(null)} className="text-stone-400 hover:text-stone-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-stone-800 bg-stone-50 p-4 rounded-xl border border-stone-200">
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="font-bold">Parcel</span>
                <span className="text-rose-900 font-mono font-bold">{slipOrder.orderNumber}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Deliver To:</span>
                <div className="font-bold text-sm">{slipOrder.customerName}</div>
                <div>{slipOrder.customerAddress}</div>
                <div>{slipOrder.customerCity}, Pakistan</div>
                <div className="font-mono text-stone-600 mt-1">{slipOrder.customerPhone}</div>
              </div>
              <div className="pt-2 border-t border-stone-200">
                <span className="text-stone-500 block mb-1">Contents:</span>
                {slipOrder.items.map((it, i) => (
                  <div key={i} className="font-medium">{it.quantity}x {it.product.title}</div>
                ))}
              </div>
              <div className="p-2 bg-amber-100 rounded text-amber-950 font-bold text-[10px] text-center">
                SAFE ESCROW SHIPMENT - COD PAISE MAT LENA
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={() => setSlipOrder(null)} className="px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};