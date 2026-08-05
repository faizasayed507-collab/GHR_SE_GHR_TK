import React, { useState } from 'react';
import { Seller } from '../types';
import { ShieldCheck, MapPin, Star, Sparkles, ChevronRight, X, HeartHandshake, Award } from 'lucide-react';

interface FeaturedHomepreneursProps {
  sellers: Seller[];
  onSelectSeller: (seller: Seller) => void;
}

export const FeaturedHomepreneurs: React.FC<FeaturedHomepreneursProps> = ({
  sellers,
  onSelectSeller,
}) => {
  const [activeStorySeller, setActiveStorySeller] = useState<Seller | null>(null);

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-rose-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Artisan Spotlight</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
            Homepreneurs of the Week
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Meet the Pakistani women crafting stories of heritage, dignity, and passion from home.
          </p>
        </div>
      </div>

      {/* Horizontal Scroll Cards */}
      <div className="flex gap-6 overflow-x-auto pb-4 pt-1 no-scrollbar snap-x">
        {sellers.map((seller) => (
          <div
            key={seller.id}
            className="snap-start shrink-0 w-72 sm:w-80 bento-card overflow-hidden flex flex-col justify-between group"
          >
            {/* Top Cover & Avatar */}
            <div className="relative h-28 bg-[#F5EFEA] overflow-hidden">
              <img
                src={seller.coverImage}
                alt={seller.shopName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4A3F35]/70 to-transparent" />

              <div className="absolute bottom-2 left-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 backdrop-blur-md text-emerald-300 text-[10px] font-semibold border border-emerald-400/30">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Verified Homepreneur</span>
              </div>

              <div className="absolute -bottom-4 right-4 w-14 h-14 rounded-full border-2 border-white overflow-hidden shadow-md bg-white">
                <img
                  src={seller.avatar}
                  alt={seller.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 pt-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-[#4A3F35] text-base group-hover:text-[#D4AF37] transition-colors">
                    {seller.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#4A3F35] bg-[#FFF9F5] px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                    <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                    <span>{seller.rating}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#8C7B6C] mt-1">
                  <span className="font-semibold text-[#D4AF37]">{seller.homeBusinessName || seller.shopName}</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <MapPin className="w-3 h-3 text-[#A69689]" />
                    {seller.city}
                  </span>
                </div>

                <div className="mt-3 inline-block px-3 py-1 rounded-full bg-[#FBF7F4] text-[#8C7B6C] text-[11px] font-medium border border-[#F2E8E1]">
                  Specialty: <strong className="text-[#4A3F35]">{seller.craftSpecialty}</strong>
                </div>

                <p className="text-xs text-[#6B5E53] mt-2.5 line-clamp-2 leading-relaxed">
                  "{seller.story}"
                </p>
              </div>

              {/* Action */}
              <div className="mt-4 pt-3 border-t border-[#F2E8E1] flex items-center justify-between">
                <button
                  onClick={() => setActiveStorySeller(seller)}
                  className="text-xs font-semibold text-[#D4AF37] hover:text-[#AA820A] flex items-center gap-1 group/btn"
                >
                  <span>Read Story</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => onSelectSeller(seller)}
                  className="px-3.5 py-1.5 bg-[#4A3F35] hover:bg-[#382F27] text-white text-xs font-medium rounded-xl transition-colors shadow-xs"
                >
                  View Creations
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Story Modal */}
      {activeStorySeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-rose-100">
            <div className="relative h-44 bg-stone-900">
              <img
                src={activeStorySeller.coverImage}
                alt={activeStorySeller.shopName}
                className="w-full h-full object-cover opacity-80"
              />
              <button
                onClick={() => setActiveStorySeller(null)}
                className="absolute top-3 right-3 p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute -bottom-6 left-6 flex items-end gap-3">
                <img
                  src={activeStorySeller.avatar}
                  alt={activeStorySeller.name}
                  className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-lg"
                />
              </div>
            </div>

            <div className="p-6 pt-8 space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold font-serif text-stone-900">
                    {activeStorySeller.name}
                  </h3>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Verified Since {activeStorySeller.verificationDate}</span>
                  </div>
                </div>
                <p className="text-xs font-semibold text-rose-800 mt-0.5">
                  {activeStorySeller.shopName} • {activeStorySeller.city}, Pakistan
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 py-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
                <div>
                  <span className="block text-xs text-stone-500 font-medium">Rating</span>
                  <span className="text-sm font-bold text-stone-900 flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    {activeStorySeller.rating}
                  </span>
                </div>
                <div className="border-x border-stone-200">
                  <span className="block text-xs text-stone-500 font-medium">Orders Sold</span>
                  <span className="text-sm font-bold text-stone-900">
                    {activeStorySeller.totalSales}+
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-stone-500 font-medium">Crafted Since</span>
                  <span className="text-sm font-bold text-stone-900">
                    {activeStorySeller.joinedYear}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-rose-700" />
                  <span>The Homepreneur's Story</span>
                </h4>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-rose-50/50 p-3.5 rounded-xl border border-rose-100">
                  "{activeStorySeller.story}"
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setActiveStorySeller(null)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const s = activeStorySeller;
                    setActiveStorySeller(null);
                    onSelectSeller(s);
                  }}
                  className="px-5 py-2 bg-rose-900 hover:bg-rose-800 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
                >
                  Explore {activeStorySeller.shopName}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
