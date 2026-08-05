import React from 'react';
import { ShoppingBag, Search, ShieldCheck, User, LogOut, UserPlus } from 'lucide-react';
import { UserAccount } from '../types';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenEscrowModal: () => void;
  savedCount: number;
  currentUser: UserAccount | null;
  onOpenAuthModal: (mode?: 'login' | 'signup') => void;
  onLogout: () => void;
  onOpenAdminPanel?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
  onOpenEscrowModal,
  savedCount,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onOpenAdminPanel,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F2E8E1] shadow-xs">
      {/* Top micro announcement bar */}
      <div className="bg-[#4A3F35] text-white py-1.5 px-4 text-xs font-medium flex items-center justify-between border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-center sm:text-left">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span>
              <strong className="text-[#D4AF37]">100% Escrow Protection:</strong> Money is released only after you approve delivery!
            </span>
          </div>
          <button
            onClick={onOpenEscrowModal}
            className="hidden sm:inline-flex items-center gap-1 text-[#D4AF37] hover:text-white underline text-xs font-medium"
          >
            How Escrow Works?
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#AA820A] flex items-center justify-center text-white font-serif font-bold text-xl shadow-sm border border-[#D4AF37]/30">
              G
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#D4AF37] tracking-tight leading-none">
                  Ghar Se Ghar Tak
                </h1>
                <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF0F0] text-[#D4AF37] border border-[#F8D7DA]">
                  Pakistani Homepreneurs
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#A69689] font-medium uppercase tracking-widest mt-0.5">
                Ghar ka hunar, aap ke ghar tak
              </p>
            </div>
          </div>

          {/* Search Bar (Buyer mode) */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search Kurta, Kundan Jewellery, Perfume, Hampers..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#FBF7F4] pl-10 pr-4 py-2 text-xs sm:text-sm rounded-full border border-[#F2E8E1] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-[#4A3F35] placeholder-[#A69689]"
            />
            <Search className="w-4 h-4 text-[#A69689] absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A69689] hover:text-[#4A3F35] text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Controls: User Auth Status & Cart */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Admin CNIC Portal Trigger */}
            {onOpenAdminPanel && (
              <button
                onClick={onOpenAdminPanel}
                className="px-2.5 py-1.5 bg-[#4A3F35] hover:bg-[#382F27] text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-bold rounded-full transition-all shadow-xs flex items-center gap-1.5"
                title="Admin CNIC Verification Review Portal"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden lg:inline">Admin CNIC Review</span>
              </button>
            )}

            {/* User Auth Info / Account Action */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-[#FBF7F4] border border-[#F2E8E1] pl-3 pr-1.5 py-1 rounded-full">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#4A3F35]">
                  <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="max-w-[100px] truncate">{currentUser.name}</span>
                  <span className="text-[9px] uppercase px-1.5 py-0.2 rounded-md bg-[#FFF9F5] border border-[#D4AF37]/30 text-[#D4AF37] font-semibold">
                    {currentUser.role}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1 text-[#8C7B6C] hover:text-rose-700 hover:bg-rose-50 rounded-full transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="px-3 py-1.5 text-xs font-bold text-[#4A3F35] hover:text-[#D4AF37] transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuthModal('signup')}
                  className="px-3 py-1.5 bg-[#4A3F35] hover:bg-[#382F27] text-white text-xs font-bold rounded-full transition-all shadow-xs flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="hidden sm:inline">Register</span>
                </button>
              </div>
            )}

            {/* Escrow Trigger button (Mobile) */}
            <button
              onClick={onOpenEscrowModal}
              className="sm:hidden p-2 text-[#8C7B6C] hover:text-[#4A3F35] rounded-xl hover:bg-[#FBF7F4]"
              title="Escrow Protection Info"
            >
              <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 bg-white border border-[#F2E8E1] rounded-full text-[#4A3F35] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all shadow-xs flex items-center justify-center"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden relative">
          <input
            type="text"
            placeholder="Search Kurta, Kundan, Perfumes, Hampers..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#FBF7F4] pl-10 pr-4 py-2 text-xs rounded-full border border-[#F2E8E1] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-[#4A3F35] placeholder-[#A69689]"
          />
          <Search className="w-4 h-4 text-[#A69689] absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>
    </header>
  );
};

