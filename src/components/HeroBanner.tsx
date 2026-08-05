import React from 'react';
import { ShieldCheck, Sparkles, Heart, CheckCircle2, ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  onOpenEscrowModal: () => void;
  onExploreClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onOpenEscrowModal, onExploreClick }) => {
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Bento Hero Card */}
        <div className="lg:col-span-8 bento-card rose-gradient p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="px-3.5 py-1 bg-white/70 backdrop-blur-xs rounded-full text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] border border-white">
                Ghar ka hunar, aap ke ghar tak
              </span>
              <span className="px-3.5 py-1 bg-white/70 backdrop-blur-xs rounded-full text-[10px] font-bold uppercase tracking-wider text-[#4A3F35] border border-white flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Verified Artisans
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#4A3F35] leading-tight tracking-tight">
              Empowering <br />
              <span className="italic text-[#D4AF37]">Home Artisans</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#6B5E53] leading-relaxed max-w-xl font-medium">
              Support verified Pakistani homepreneurs. Shop hand-stitched silk kurtas, Mughal Kundan jewellery, organic attars, and bespoke gift hampers with total payment security.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onExploreClick}
                className="px-6 py-3 bg-[#4A3F35] hover:bg-[#382F27] text-white text-xs sm:text-sm font-semibold rounded-2xl transition-all shadow-sm flex items-center gap-2"
              >
                <span>Explore Artisan Creations</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </button>

              <button
                onClick={onOpenEscrowModal}
                className="px-5 py-3 bg-white/80 hover:bg-white text-[#D4AF37] border border-[#D4AF37]/30 text-xs sm:text-sm font-semibold rounded-2xl transition-all flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>How Escrow Works</span>
              </button>
            </div>
          </div>

          <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/30 blur-2xl pointer-events-none" />
        </div>

        {/* Side Bento Feature Card */}
        <div className="lg:col-span-4 bento-card p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#A69689]">
                Escrow Security Vault
              </span>
              <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
            </div>

            <h3 className="font-serif text-xl font-bold text-[#4A3F35]">
              Safe Escrow Promise
            </h3>
            <p className="text-xs text-[#8C7B6C] leading-relaxed">
              Your money is held in a protected bank vault until you inspect parcel arrival.
            </p>
          </div>

          <ul className="space-y-3 text-xs border-t border-[#F2E8E1] pt-4 text-[#4A3F35]">
            <li className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Payment Protection</span>
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">100% Safe</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Homepreneurs</span>
              </span>
              <span className="text-[10px] bg-[#FFF0F0] text-[#D4AF37] px-2 py-0.5 rounded-full font-bold">CNIC Verified</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Artisan Revenue</span>
              </span>
              <span className="text-[10px] bg-[#F5EFEA] text-[#8C7B6C] px-2 py-0.5 rounded-full font-bold">0% Cut</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
