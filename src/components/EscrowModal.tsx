import React from 'react';
import { ShieldCheck, Lock, PackageCheck, Wallet, X, CheckCircle2, ArrowRight } from 'lucide-react';

interface EscrowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EscrowModal: React.FC<EscrowModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A3F35]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#D4AF37]/30 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4A3F35] via-[#382F27] to-[#4A3F35] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#D4AF37]/20 rounded-2xl border border-[#D4AF37]/40 text-[#D4AF37]">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#D4AF37]">
                100% Safe Escrow Guarantee
              </span>
              <h2 className="text-xl font-bold font-serif">How Escrow Protects You</h2>
            </div>
          </div>
          <p className="text-[#F2E8E1] text-sm mt-1">
            Buy authentic home-crafted items with zero risk. Your money stays locked safely until you inspect your parcel!
          </p>
        </div>

        {/* Steps Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Step 1 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FFF9F5] border border-[#F2E8E1]">
            <div className="p-2.5 bg-[#D4AF37]/20 text-[#4A3F35] rounded-xl shrink-0 font-bold text-sm">
              01
            </div>
            <div>
              <div className="flex items-center gap-2 font-semibold text-[#4A3F35] text-sm">
                <Lock className="w-4 h-4 text-[#D4AF37]" />
                <span>Payment Locked in Escrow Vault</span>
              </div>
              <p className="text-xs text-[#8C7B6C] mt-1 leading-relaxed">
                When you order, your payment (JazzCash, EasyPaisa, or Bank) is securely locked in our regulated Escrow account. The seller is notified but hasn’t received the money yet.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FFF9F5] border border-[#F2E8E1]">
            <div className="p-2.5 bg-[#D4AF37]/20 text-[#4A3F35] rounded-xl shrink-0 font-bold text-sm">
              02
            </div>
            <div>
              <div className="flex items-center gap-2 font-semibold text-[#4A3F35] text-sm">
                <PackageCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>Homepreneur Crafts & Ships Order</span>
              </div>
              <p className="text-xs text-[#8C7B6C] mt-1 leading-relaxed">
                Our verified artisan handcrafts your item with love and dispatches it via tracked courier (TCS, M&P, or Leopards).
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FFF9F5] border border-[#F2E8E1]">
            <div className="p-2.5 bg-[#D4AF37]/20 text-[#4A3F35] rounded-xl shrink-0 font-bold text-sm">
              03
            </div>
            <div>
              <div className="flex items-center gap-2 font-semibold text-[#4A3F35] text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>48-Hour Buyer Inspection Window</span>
              </div>
              <p className="text-xs text-[#8C7B6C] mt-1 leading-relaxed">
                You receive the package at your doorstep and inspect the quality. If there is any defect or mismatch, request a 100% full refund instantly.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FFF9F5] border border-[#F2E8E1]">
            <div className="p-2.5 bg-[#D4AF37]/20 text-[#4A3F35] rounded-xl shrink-0 font-bold text-sm">
              04
            </div>
            <div>
              <div className="flex items-center gap-2 font-semibold text-[#4A3F35] text-sm">
                <Wallet className="w-4 h-4 text-[#D4AF37]" />
                <span>Payment Released to Artisan</span>
              </div>
              <p className="text-xs text-[#8C7B6C] mt-1 leading-relaxed">
                Once you approve (or after 48h without issue), funds are released to the homepreneur’s wallet so they can buy raw materials for their next creation!
              </p>
            </div>
          </div>

          {/* Trust Banner */}
          <div className="p-4 bg-[#FFF9F5] rounded-2xl border border-[#D4AF37]/30 text-[#4A3F35] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#D4AF37] shrink-0" />
              <div className="text-xs">
                <span className="font-bold block text-[#4A3F35]">100% Money-Back Guarantee</span>
                <span className="text-[#8C7B6C]">Supported by JazzCash & Bank Escrow Protocols</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FBF7F4] border-t border-[#F2E8E1] flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#4A3F35] hover:bg-[#382F27] text-white text-sm font-medium rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Understood, Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
