import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { ShieldCheck, Truck, CheckCircle2, Clock, Printer, X, FileText, Send } from 'lucide-react';

interface SellerOrdersProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;
}

export const SellerOrders: React.FC<SellerOrdersProps> = ({
  orders,
  onUpdateOrderStatus,
}) => {
  const [selectedOrderForSlip, setSelectedOrderForSlip] = useState<Order | null>(null);
  const [trackingModalOrder, setTrackingModalOrder] = useState<Order | null>(null);
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [courierName, setCourierName] = useState<string>('TCS Express');

  const handleShipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingModalOrder || !trackingNumber.trim()) return;

    onUpdateOrderStatus(trackingModalOrder.id, 'Shipped', trackingNumber);
    setTrackingModalOrder(null);
    setTrackingNumber('');
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'In Escrow':
        return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'Shipped':
        return 'bg-purple-100 text-purple-900 border-purple-200';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      case 'Payment Released':
        return 'bg-emerald-700 text-white border-emerald-800';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200">
        <h1 className="text-xl font-serif font-bold text-stone-900">
          Escrow Orders Management ({orders.length})
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Track customer orders, enter courier tracking codes, and manage escrow release workflows.
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((ord) => (
          <div
            key={ord.id}
            className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col gap-4"
          >
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-stone-900 text-sm">{ord.orderNumber}</span>
                <span className="text-stone-400">•</span>
                <span className="text-stone-500 font-medium">Placed on {ord.date}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(ord.status)}`}>
                  Status: {ord.status}
                </span>

                <button
                  onClick={() => setSelectedOrderForSlip(ord)}
                  className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Packing Slip</span>
                </button>
              </div>
            </div>

            {/* Middle Content */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center text-xs">
              {/* Customer Column */}
              <div className="md:col-span-4 space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Customer</span>
                <div className="font-bold text-stone-900">{ord.customerName}</div>
                <div className="text-stone-600">{ord.customerPhone}</div>
                <div className="text-stone-500 line-clamp-1">{ord.customerAddress}, {ord.customerCity}</div>
              </div>

              {/* Items Column */}
              <div className="md:col-span-5 space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Items Purchased</span>
                {ord.items.map((it) => (
                  <div key={it.product.id} className="flex items-center gap-2">
                    <img src={it.product.images[0]} alt="" className="w-8 h-8 rounded object-cover border" />
                    <span className="text-stone-800 font-medium truncate max-w-[200px]">{it.quantity}x {it.product.title}</span>
                  </div>
                ))}
              </div>

              {/* Amount Column */}
              <div className="md:col-span-3 text-left md:text-right">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Escrow Amount</span>
                <div className="text-lg font-bold font-serif text-rose-950">
                  Rs. {ord.totalAmount.toLocaleString()}
                </div>
                <span className="text-[10px] text-amber-800 font-semibold block">
                  Via {ord.paymentMethod} Escrow
                </span>
              </div>
            </div>

            {/* Status Pipeline Step Controller */}
            <div className="pt-3 border-t border-stone-100 bg-stone-50/70 p-3 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-stone-700 font-medium">
                  {ord.status === 'In Escrow' && 'Buyer payment locked safely. Dispatch package to ship.'}
                  {ord.status === 'Shipped' && `Shipped via ${ord.courierName || 'Courier'} (${ord.trackingNumber}).`}
                  {ord.status === 'Delivered' && 'Delivered to buyer! Request escrow payment release.'}
                  {ord.status === 'Payment Released' && 'Funds transferred to your Studio Wallet!'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {ord.status === 'In Escrow' && (
                  <button
                    onClick={() => {
                      setTrackingModalOrder(ord);
                      setTrackingNumber(`TCS-${Math.floor(100000 + Math.random() * 900000)}`);
                    }}
                    className="px-3.5 py-1.5 bg-rose-900 hover:bg-rose-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Enter Tracking & Ship</span>
                  </button>
                )}

                {ord.status === 'Shipped' && (
                  <button
                    onClick={() => onUpdateOrderStatus(ord.id, 'Delivered')}
                    className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark as Delivered</span>
                  </button>
                )}

                {ord.status === 'Delivered' && (
                  <button
                    onClick={() => onUpdateOrderStatus(ord.id, 'Payment Released')}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-rose-950 font-bold rounded-lg text-xs shadow-xs"
                  >
                    Release Escrow Funds (Rs. {ord.totalAmount.toLocaleString()})
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tracking Modal */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-rose-100 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-stone-900">
                Ship Order #{trackingModalOrder.orderNumber}
              </h3>
              <button onClick={() => setTrackingModalOrder(null)} className="text-stone-400 hover:text-stone-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleShipSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Courier Service *
                </label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full bg-stone-50 px-3 py-2 text-xs rounded-xl border border-stone-200 font-medium"
                >
                  <option value="TCS Express">TCS Express Courier</option>
                  <option value="M&P Express">M&P Courier</option>
                  <option value="Leopards Courier">Leopards Courier</option>
                  <option value="Pakistan Post">Pakistan Post Express</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Courier Tracking Number *
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  required
                  className="w-full bg-stone-50 px-3 py-2 text-xs rounded-xl border border-stone-200 font-mono font-bold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTrackingModalOrder(null)}
                  className="px-4 py-2 text-stone-600 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-900 text-white text-xs font-bold rounded-xl"
                >
                  Confirm Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Packing Slip Modal */}
      {selectedOrderForSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-stone-300 shadow-2xl font-sans">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-900" />
                <h3 className="text-base font-serif font-bold text-stone-900">Official Packing Slip</h3>
              </div>
              <button onClick={() => setSelectedOrderForSlip(null)} className="text-stone-400 hover:text-stone-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-800 bg-stone-50 p-4 rounded-xl border border-stone-200">
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="font-bold">Ghar Se Ghar Tak Parcel</span>
                <span className="text-rose-900 font-mono font-bold">{selectedOrderForSlip.orderNumber}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Deliver To:</span>
                <div className="font-bold text-sm">{selectedOrderForSlip.customerName}</div>
                <div>{selectedOrderForSlip.customerAddress}</div>
                <div>{selectedOrderForSlip.customerCity}, Pakistan</div>
                <div className="font-mono text-stone-600 mt-1">{selectedOrderForSlip.customerPhone}</div>
              </div>

              <div className="pt-2 border-t border-stone-200">
                <span className="text-stone-500 block mb-1">Parcel Contents:</span>
                {selectedOrderForSlip.items.map((it) => (
                  <div key={it.product.id} className="flex justify-between font-medium">
                    <span>{it.quantity}x {it.product.title}</span>
                  </div>
                ))}
              </div>

              <div className="p-2 bg-amber-100 rounded text-amber-950 font-bold text-[10px] text-center">
                🛡️ SAFE ESCROW SHIPMENT - DO NOT COLLECT COD MONEY
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedOrderForSlip(null)}
                className="px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl"
              >
                Close Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
