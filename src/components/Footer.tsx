import React from 'react';
import { ShieldCheck, Heart, Sparkles, MapPin, Lock, HelpCircle } from 'lucide-react';

interface FooterProps {
  onOpenEscrowModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenEscrowModal }) => {
  return (
    <footer className="bg-[#4A3F35] text-[#F2E8E1] border-t border-[#D4AF37]/20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Trust Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-8 border-b border-white/10 text-xs">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-[#D4AF37]/20 text-[#D4AF37] rounded-2xl border border-[#D4AF37]/30 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Escrow Protection</h4>
              <p className="text-[#A69689] mt-1 leading-relaxed">
                Money stays safely locked until you inspect your parcel at home. Zero risk.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-[#D4AF37]/20 text-[#D4AF37] rounded-2xl border border-[#D4AF37]/30 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Verified Homepreneurs</h4>
              <p className="text-[#A69689] mt-1 leading-relaxed">
                CNIC and address verified women artisans crafting from Pakistan's courtyards.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-[#D4AF37]/20 text-[#D4AF37] rounded-2xl border border-[#D4AF37]/30 shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Empowering Home Crafts</h4>
              <p className="text-[#A69689] mt-1 leading-relaxed">
                100% of product prices go directly to home artisans with zero middleman cuts.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-[#D4AF37]/20 text-[#D4AF37] rounded-2xl border border-[#D4AF37]/30 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">JazzCash & Bank Escrow</h4>
              <p className="text-[#A69689] mt-1 leading-relaxed">
                Supported by JazzCash, EasyPaisa, and State Bank compliant escrow protocols.
              </p>
            </div>
          </div>
        </div>

        {/* Brand & Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs">
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#AA820A] flex items-center justify-center text-white font-serif font-bold text-base border border-[#D4AF37]">
                G
              </div>
              <span className="text-xl font-bold font-serif text-[#D4AF37]">Ghar Se Ghar Tak</span>
            </div>
            <p className="text-[#A69689] leading-relaxed max-w-sm">
              "Ghar ka hunar, aap ke ghar tak" — Pakistan’s first trust-centric escrow marketplace connecting home-based artisans with buyers nationwide.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#D4AF37]">
              <MapPin className="w-3.5 h-3.5" />
              <span>Lahore • Multan • Peshawar • Karachi • Islamabad</span>
            </div>
          </div>

          <div className="md:col-span-3 space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-[11px] text-[#D4AF37]">
              Buyer Guarantees
            </h4>
            <ul className="space-y-2 text-[#A69689]">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>100% Parcel Inspection Guarantee</span>
              </li>
              <li>Verified Homepreneur Quality</li>
              <li>Nationwide Express Delivery</li>
              <li>Support Rural Women Artisans</li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-[11px] text-[#D4AF37]">
              Escrow Security Promise
            </h4>
            <p className="text-[#A69689] leading-relaxed">
              Every order on Ghar Se Ghar Tak is protected by our automated payment vault. Your money is safe until you approve delivery.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={onOpenEscrowModal}
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#AA820A] text-white rounded-xl font-bold transition-colors inline-flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>How Escrow Works</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-white/10 text-center text-[#A69689] text-[11px] flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 Ghar Se Ghar Tak. All rights reserved.</span>
          <span className="text-[#A69689] font-medium">
            Protected by Automated Bank Vault Escrow • Safe Nationwide Shipping
          </span>
          <span className="text-[#D4AF37] font-serif italic">Ghar ka hunar, aap ke ghar tak</span>
        </div>
      </div>
    </footer>
  );
};
