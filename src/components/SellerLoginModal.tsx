import React, { useState } from 'react';
import { Store, Lock, Phone, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, Eye, EyeOff, X } from 'lucide-react';

interface SellerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const SellerLoginModal: React.FC<SellerLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [phoneOrEmail, setPhoneOrEmail] = useState('0300-1234567');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  
  // Safe Fallback for legacy builds
  const showSellerPassword = showPassword; 
  const setShowSellerPassword = setShowPassword;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail || !password) {
      setErrorMessage('Please enter your mobile number or email.');
      return;
    }
    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess();
    }, 600);
  };

  const handleDemoLogin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A3F35]/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#D4AF37]/30 flex flex-col max-h-[92vh]">
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
              <Store className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#D4AF37] bg-white/10 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
                Artisan Seller Center
              </span>
              <h2 className="text-xl font-bold font-serif text-white mt-1">
                Homepreneur Studio Portal
              </h2>
            </div>
          </div>
          <p className="text-[#F2E8E1] text-xs leading-relaxed mt-2">
            Log in to manage your artisanal workshop, upload new handmade creations, track escrow payouts, and manage nationwide customer orders.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Quick Demo Login Box */}
          <div className="p-4 bg-[#FFF9F5] rounded-2xl border border-[#D4AF37]/30 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#4A3F35]">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>Demo Artisan Account</span>
              </div>
              <p className="text-[11px] text-[#8C7B6C] mt-0.5">
                Multan Silk Studio (Fatima Zahra • Multan)
              </p>
            </div>
            <button
              onClick={handleDemoLogin}
              disabled={isSubmitting}
              className="px-3.5 py-1.5 bg-[#D4AF37] hover:bg-[#AA820A] text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1"
            >
              <span>Instant Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-[#F2E8E1] w-full" />
            <span className="bg-white px-3 text-[11px] text-[#A69689] uppercase tracking-wider font-semibold">
              Or Log In With Phone
            </span>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#4A3F35] uppercase tracking-wider mb-1">
                Registered Mobile Number or Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  placeholder="0300-1234567 or artisan@studio.pk"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FBF7F4] border border-[#F2E8E1] rounded-xl text-xs sm:text-sm text-[#4A3F35] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
                <Phone className="w-4 h-4 text-[#A69689] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3F35] uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-2.5 bg-[#FBF7F4] border border-[#F2E8E1] rounded-xl text-xs sm:text-sm text-[#4A3F35] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
                <Lock className="w-4 h-4 text-[#A69689] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A69689] hover:text-[#4A3F35]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#4A3F35] hover:bg-[#382F27] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Store className="w-4 h-4 text-[#D4AF37]" />
              <span>{isSubmitting ? 'Logging into Studio...' : 'Access Seller Dashboard'}</span>
            </button>
          </form>

          {/* Seller Highlights */}
          <div className="pt-2 border-t border-[#F2E8E1] space-y-2">
            <span className="text-[11px] font-bold text-[#4A3F35] uppercase tracking-wider block">
              Ghar Se Ghar Tak Artisan Guarantees
            </span>
            <ul className="grid grid-cols-2 gap-2 text-[11px] text-[#8C7B6C]">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Direct JazzCash/Bank Payouts</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>0% Listing Fees</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>TCS & Leopards Doorstep Pickup</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Verified Homepreneur Status</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FBF7F4] border-t border-[#F2E8E1] flex items-center justify-between text-xs">
          <span className="text-[#8C7B6C]">Not registered yet?</span>
          <button
            onClick={() => {
              alert('Homepreneur Application: Call our Artisan Onboarding Hotline at 0800-HUNAR (48627) or WhatsApp 0300-9876543 for instant CNIC verification.');
            }}
            className="text-[#D4AF37] font-bold hover:underline"
          >
            Apply to Sell (+0% Commission)
          </button>
        </div>
      </div>
    </div>
  );
};