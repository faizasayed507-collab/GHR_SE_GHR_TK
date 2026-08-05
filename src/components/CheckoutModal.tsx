import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import { ShieldCheck, X, CheckCircle2, Lock, ArrowRight, Wallet, Building, CreditCard, Sparkles, MapPin, Phone, User } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onPlaceOrder: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onPlaceOrder,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('0300-1234567');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [customerCity, setCustomerCity] = useState<string>('Lahore');
  const [paymentMethod, setPaymentMethod] = useState<'JazzCash' | 'EasyPaisa' | 'Bank Transfer' | 'Card Escrow'>('JazzCash');
  const [escrowAgreed, setEscrowAgreed] = useState<boolean>(true);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const totalAmount = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handleDetailsNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerAddress.trim()) return;
    setStep('payment');
  };

  const handleConfirmOrder = () => {
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `GSGT-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      customerName,
      customerPhone,
      customerAddress,
      customerCity,
      items: [...items],
      totalAmount,
      status: 'In Escrow',
      paymentMethod,
      escrowReleaseDate: 'Funds held in Escrow until buyer confirms delivery',
      trackingNumber: `TCS-${Math.floor(100000 + Math.random() * 900000)}`,
      courierName: 'TCS Express Courier',
    };

    setPlacedOrder(newOrder);
    onPlaceOrder(newOrder);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/65 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-rose-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-serif font-bold">
              {step === 'success' ? 'Order Confirmed!' : 'Safe Escrow Checkout'}
            </h2>
          </div>
          {step !== 'success' && (
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {step === 'details' && (
            <form onSubmit={handleDetailsNext} className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-900 uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-rose-700" />
                <span>1. Delivery Destination</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g., Ayesha Ahmed"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="w-full bg-stone-50 pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Phone (JazzCash/EasyPaisa) *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="0300-1234567"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        required
                        className="w-full bg-stone-50 pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
                      />
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      City *
                    </label>
                    <select
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      className="w-full bg-stone-50 px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium"
                    >
                      <option value="Lahore">Lahore</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Multan">Multan</option>
                      <option value="Peshawar">Peshawar</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Quetta">Quetta</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Complete Street Address *
                  </label>
                  <textarea
                    placeholder="House/Flat number, Street, Area/Sector..."
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    required
                    rows={2}
                    className="w-full bg-stone-50 p-3 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[11px] font-bold text-stone-500 uppercase block mb-2">
                  Order Items ({items.length})
                </span>
                <div className="space-y-1.5 text-xs">
                  {items.map((it) => (
                    <div key={it.product.id} className="flex justify-between text-stone-700">
                      <span className="truncate max-w-[220px]">
                        {it.quantity}x {it.product.title}
                      </span>
                      <span className="font-bold">
                        Rs. {(it.product.price * it.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900 text-sm">
                    <span>Total Amount</span>
                    <span className="text-rose-950 font-serif">Rs. {totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-rose-900 hover:bg-rose-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Continue to Escrow Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 'payment' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-900 uppercase tracking-wider">
                <Lock className="w-4 h-4 text-rose-700" />
                <span>2. Select Safe Escrow Method</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'JazzCash', title: 'JazzCash Mobile', icon: <Wallet className="w-4 h-4 text-rose-700" />, desc: 'Instant OTP lock' },
                  { id: 'EasyPaisa', title: 'EasyPaisa Wallet', icon: <Wallet className="w-4 h-4 text-emerald-600" />, desc: 'Instant OTP lock' },
                  { id: 'Bank Transfer', title: 'Bank IBAN (Meezan/HBL)', icon: <Building className="w-4 h-4 text-blue-600" />, desc: 'Direct Escrow transfer' },
                  { id: 'Card Escrow', title: 'Credit / Debit Card', icon: <CreditCard className="w-4 h-4 text-purple-600" />, desc: 'Visa / Mastercard' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === m.id
                        ? 'border-rose-900 bg-rose-50/60 ring-2 ring-rose-300'
                        : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {m.icon}
                      <span className="text-xs font-bold text-stone-900">{m.title}</span>
                    </div>
                    <span className="text-[10px] text-stone-500 block mt-1">{m.desc}</span>
                  </button>
                ))}
              </div>

              {/* Escrow Agreement Check */}
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={escrowAgreed}
                    onChange={(e) => setEscrowAgreed(e.target.checked)}
                    className="mt-0.5 rounded text-rose-900 focus:ring-rose-400"
                  />
                  <div className="text-xs text-amber-950">
                    <span className="font-bold block">100% Escrow Protection Guarantee</span>
                    <span>
                      My payment of <strong>Rs. {totalAmount.toLocaleString()}</strong> will be safely locked in Escrow. The artisan will only receive funds after I receive and inspect the parcel.
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStep('details')}
                  className="px-4 py-3 text-stone-600 hover:text-stone-900 text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  disabled={!escrowAgreed}
                  onClick={handleConfirmOrder}
                  className="flex-1 py-3 bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 hover:from-rose-800 text-amber-100 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Confirm & Pay via Escrow</span>
                </button>
              </div>
            </div>
          )}

          {step === 'success' && placedOrder && (
            <div className="py-4 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border-2 border-emerald-300 shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Payment Locked in Escrow
                </span>
                <h3 className="text-xl font-serif font-bold text-stone-900 mt-2">
                  Thank You, {placedOrder.customerName}!
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Your order <strong>#{placedOrder.orderNumber}</strong> has been transmitted to the artisan.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-left space-y-2 text-xs">
                <div className="flex justify-between border-b border-stone-200 pb-2 font-semibold text-stone-800">
                  <span>Tracking Number:</span>
                  <span className="text-rose-900 font-mono font-bold">{placedOrder.trackingNumber}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Address:</span>
                  <span className="font-medium text-stone-800">{placedOrder.customerCity}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Escrow Status:</span>
                  <span className="text-emerald-700 font-bold">In Escrow Vault</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors"
              >
                Return to Shop
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
