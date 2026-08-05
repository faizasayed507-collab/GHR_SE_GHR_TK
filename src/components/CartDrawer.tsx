import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, ShieldCheck, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onUpdateNote: (productId: string, note: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateNote,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const totalAmount = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl border-l border-rose-100">
        {/* Header */}
        <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-rose-900" />
            <h2 className="text-base font-serif font-bold text-stone-900">
              Shopping Cart ({items.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
              <p className="text-sm font-serif font-bold text-stone-700">Your cart is empty</p>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explore handcrafted clothes, Kundan jewelry, attars, and gift hampers from Pakistan’s homepreneurs!
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2 bg-rose-900 text-amber-100 text-xs font-bold rounded-xl"
              >
                Start Browsing
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 flex gap-3 relative"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  className="w-16 h-16 rounded-lg object-cover border border-stone-200 shrink-0"
                />

                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between pr-6">
                    <h3 className="text-xs font-serif font-bold text-stone-900 line-clamp-1">
                      {item.product.title}
                    </h3>
                  </div>

                  <div className="text-[11px] text-stone-500 font-medium">
                    Artisan: <strong className="text-stone-800">{item.product.seller.shopName}</strong>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-bold text-rose-950 font-serif">
                      Rs. {(item.product.price * item.quantity).toLocaleString()}
                    </span>

                    {/* Quantity Selector */}
                    <div className="flex items-center border border-stone-200 rounded-md overflow-hidden bg-white text-xs">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-stone-600 hover:bg-stone-100 font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 font-bold text-stone-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-stone-600 hover:bg-stone-100 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Optional Custom Gift Note */}
                  <input
                    type="text"
                    placeholder="Custom note for artisan (e.g., gift card text)..."
                    value={item.customNote || ''}
                    onChange={(e) => onUpdateNote(item.product.id, e.target.value)}
                    className="w-full mt-2 bg-white px-2.5 py-1 text-[11px] rounded border border-stone-200 focus:outline-none focus:ring-1 focus:ring-rose-400 text-stone-700 placeholder-stone-400"
                  />
                </div>

                <button
                  onClick={() => onRemoveItem(item.product.id)}
                  className="absolute top-3 right-3 text-stone-400 hover:text-rose-700 p-1"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex items-center gap-2 text-[11px] text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Payment is held in <strong>Escrow</strong> until package is inspected.</span>
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <span className="text-xs text-stone-500 font-medium">Subtotal</span>
              <span className="text-xl font-serif font-bold text-stone-900">
                Rs. {totalAmount.toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3 bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 hover:from-rose-800 text-amber-100 text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Checkout via Safe Escrow</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
