import React, { useState } from 'react';
import { Order } from '../types';
import { confirmDeliveryApi, openDisputeApi } from '../lib/ordersApi';
import { X, PackageCheck, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface MyOrdersProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onChanged: () => void;
}

export const MyOrders: React.FC<MyOrdersProps> = ({ isOpen, onClose, orders, onChanged }) => {
  const [tab, setTab] = useState<'active' | 'received'>('active');
  const [disputeFor, setDisputeFor] = useState<Order | null>(null);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  const isDone = (s: string) => s === 'Payment Released' || s === 'Refunded';
  const activeOrders = orders.filter((o) => !isDone(o.status));
  const receivedOrders = orders.filter((o) => isDone(o.status));
  const shown = tab === 'active' ? activeOrders : receivedOrders;

  const confirm = async (o: Order) => {
    if (!window.confirm('Kya aap ko parcel mil gaya aur theek hai? Paisa seller ko chala jayega.')) return;
    setBusy(true);
    const res = await confirmDeliveryApi(o.id);
    setBusy(false);
    if (!res.ok) alert(res.error);
    onChanged();
    if (res.ok) setTab('received');
  };

  const submitDispute = async () => {
    if (!disputeFor || !reason.trim()) return;
    setBusy(true);
    const res = await openDisputeApi(disputeFor.id, reason.trim());
    setBusy(false);
    if (!res.ok) alert(res.error);
    setDisputeFor(null);
    setReason('');
    onChanged();
  };

  const label: Record<string, string> = {
    'In Escrow': 'Paisa escrow mein, seller ship karega',
    'Shipped': 'Parcel raste mein hai',
    'Payment Released': 'Mukammal: parcel receive ho gaya',
    'Disputed': 'Masla report hua, admin dekh raha hai',
    'Refunded': 'Paisa wapas ho gaya',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="bg-[#4A3F35] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-serif font-bold">Meri Orders</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-stone-200 text-xs font-bold">
          <button
            onClick={() => setTab('active')}
            className={`flex-1 py-3 ${tab === 'active' ? 'text-rose-900 border-b-2 border-rose-900' : 'text-stone-500'}`}
          >
            Active ({activeOrders.length})
          </button>
          <button
            onClick={() => setTab('received')}
            className={`flex-1 py-3 ${tab === 'received' ? 'text-emerald-800 border-b-2 border-emerald-700' : 'text-stone-500'}`}
          >
            Received ({receivedOrders.length})
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3">
          {shown.length === 0 && (
            <p className="text-center text-xs text-stone-500 py-10">
              {tab === 'active' ? 'Koi active order nahi.' : 'Abhi koi received order nahi.'}
            </p>
          )}

          {shown.map((o) => (
            <div key={o.id} className="border border-stone-200 rounded-xl p-4 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold font-serif text-sm">{o.orderNumber}</span>
                <span className="text-stone-500">{o.date}</span>
              </div>
              {o.items.map((it, i) => (
                <div key={i} className="text-stone-700">{it.quantity}x {it.product.title}</div>
              ))}
              <div className="flex items-center justify-between font-bold">
                <span>Total</span>
                <span className="font-serif">Rs. {o.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1.5">
                {o.status === 'Payment Released' ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5" />
                )}
                <span className="font-semibold">{o.status}: {label[o.status] || ''}</span>
              </div>
              {o.trackingNumber && (
                <div className="text-stone-600">
                  {o.courierName}: <span className="font-mono font-bold">{o.trackingNumber}</span>
                </div>
              )}
              {o.status === 'Shipped' && (
                <div className="flex gap-2 pt-1">
                  <button
                    disabled={busy}
                    onClick={() => confirm(o)}
                    className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg disabled:opacity-50"
                  >
                    Maal mil gaya
                  </button>
                  <button
                    disabled={busy}
                    onClick={() => setDisputeFor(o)}
                    className="flex-1 py-2 bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold rounded-lg border border-rose-300 flex items-center justify-center gap-1 disabled:opacity-50"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Masla hai
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {disputeFor && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-3">
              <h3 className="font-serif font-bold">Masla batao ({disputeFor.orderNumber})</h3>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                placeholder="Kya masla hai? (jaise maal alag nikla, toota hua tha)"
                className="w-full border border-stone-200 rounded-xl p-3 text-xs"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setDisputeFor(null)} className="px-4 py-2 text-xs font-semibold text-stone-600">
                  Cancel
                </button>
                <button
                  onClick={submitDispute}
                  disabled={busy || !reason.trim()}
                  className="px-4 py-2 bg-rose-900 text-white text-xs font-bold rounded-xl disabled:opacity-50"
                >
                  Dispute bhejo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};