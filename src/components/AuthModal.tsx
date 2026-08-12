import React, { useState } from 'react';
import { UserAccount, UserRole } from '../types';
import {
  X,
  ShoppingBag,
  Store,
  Lock,
  Phone,
  User,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  MapPin,
  Building2,
  Eye,
  EyeOff
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  initialRole?: UserRole;
  onAuthSuccess: (user: UserAccount) => void;
  existingAccounts: UserAccount[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  initialRole = 'buyer',
  onAuthSuccess,
  existingAccounts,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [signupStep, setSignupStep] = useState<'role' | 'details'>('role');

  // Form Fields
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [shopName, setShopName] = useState('');
  const [city, setCity] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setName('');
    setEmailOrPhone('');
    setPassword('');
    setShopName('');
    setCity('');
    setErrorMessage('');
  };

  const handleSwitchMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setSignupStep('role');
    resetForm();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone || !password) {
      setErrorMessage('Please enter your mobile number or email and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsSubmitting(false);

      // Search accounts
      const matched = existingAccounts.find(
        (acc) =>
          acc.emailOrPhone.toLowerCase().trim() === emailOrPhone.toLowerCase().trim()
      );

      if (matched) {
        if (matched.password && matched.password !== password) {
          setErrorMessage('Incorrect password. Please try again.');
          return;
        }
        onAuthSuccess(matched);
        onClose();
      } else {
        setErrorMessage('Account not found. Please switch to the New Registration tab.');
      }
    }, 400);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !emailOrPhone.trim() || !password) {
      setErrorMessage('Please fill in your Full Name, Mobile/Email, and Password.');
      return;
    }

    if (selectedRole === 'seller' && (!shopName.trim() || !city.trim())) {
      setErrorMessage('Please provide your Shop Name and City to list your Studio.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsSubmitting(false);
      const newUser: UserAccount = {
        id: 'usr_' + Date.now(),
        name: name.trim(),
        emailOrPhone: emailOrPhone.trim(),
        password,
        role: selectedRole,
        shopName: selectedRole === 'seller' ? shopName.trim() : undefined,
        city: selectedRole === 'seller' ? city.trim() : undefined,
        avatar:
          selectedRole === 'seller'
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
            : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      };

      onAuthSuccess(newUser);
      onClose();
    }, 500);
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

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              {mode === 'login' ? <User className="w-6 h-6" /> : selectedRole === 'seller' ? <Store className="w-6 h-6" /> : <ShoppingBag className="w-6 h-6" />}
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#D4AF37] bg-white/10 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
                Ghar Se Ghar Tak Account
              </span>
              <h2 className="text-xl font-bold font-serif text-white mt-1">
                {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
              </h2>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="mt-4 flex rounded-xl bg-black/20 p-1 border border-white/10">
            <button
              type="button"
              onClick={() => handleSwitchMode('login')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mode === 'login' ? 'bg-[#D4AF37] text-white shadow-xs' : 'text-[#F2E8E1] hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('signup')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mode === 'signup' ? 'bg-[#D4AF37] text-white shadow-xs' : 'text-[#F2E8E1] hover:text-white'
              }`}
            >
              New Registration
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
              {errorMessage}
            </div>
          )}

          {/* LOGIN MODE */}
          {mode === 'login' && (
            <div className="space-y-5">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A3F35] uppercase tracking-wider mb-1">
                    Mobile Number or Email
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder="0300-1234567 or email@domain.pk"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FBF7F4] border border-[#F2E8E1] rounded-xl text-xs sm:text-sm text-[#4A3F35] focus:outline-none focus:border-[#D4AF37]"
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
                      className="w-full pl-10 pr-10 py-2.5 bg-[#FBF7F4] border border-[#F2E8E1] rounded-xl text-xs sm:text-sm text-[#4A3F35] focus:outline-none focus:border-[#D4AF37]"
                    />
                    <Lock className="w-4 h-4 text-[#A69689] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A69689] hover:text-[#4A3F35]"
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
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Account'}</span>
                </button>
              </form>
            </div>
          )}

          {/* SIGNUP MODE */}
          {mode === 'signup' && (
            <div className="space-y-5">
              {/* Step 1: Role Selection */}
              {signupStep === 'role' ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-serif font-bold text-[#4A3F35]">
                      Step 1 of 2: Select Your Account Type
                    </h3>
                    <p className="text-xs text-[#8C7B6C] mt-0.5">
                      Choose how you want to use Ghar Se Ghar Tak.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Buyer Role Option */}
                    <button
                      type="button"
                      onClick={() => setSelectedRole('buyer')}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        selectedRole === 'buyer'
                          ? 'border-[#D4AF37] bg-[#FFF9F5] ring-2 ring-[#D4AF37]/30'
                          : 'border-[#F2E8E1] bg-[#FBF7F4] hover:border-[#D4AF37]/50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="p-2 bg-[#D4AF37]/20 text-[#4A3F35] rounded-xl">
                            <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                          </div>
                          {selectedRole === 'buyer' && (
                            <CheckCircle2 className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
                          )}
                        </div>
                        <h4 className="font-bold text-[#4A3F35] text-sm">I want to Buy</h4>
                        <p className="text-[11px] text-[#8C7B6C] mt-1 leading-relaxed">
                          Browse & purchase authentic handmade products with 100% Escrow Protection.
                        </p>
                      </div>
                      <span className="mt-3 text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                        Buyer Experience
                      </span>
                    </button>

                    {/* Seller Role Option */}
                    <button
                      type="button"
                      onClick={() => setSelectedRole('seller')}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        selectedRole === 'seller'
                          ? 'border-[#D4AF37] bg-[#FFF9F5] ring-2 ring-[#D4AF37]/30'
                          : 'border-[#F2E8E1] bg-[#FBF7F4] hover:border-[#D4AF37]/50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="p-2 bg-[#4A3F35] text-white rounded-xl">
                            <Store className="w-5 h-5 text-[#D4AF37]" />
                          </div>
                          {selectedRole === 'seller' && (
                            <CheckCircle2 className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
                          )}
                        </div>
                        <h4 className="font-bold text-[#4A3F35] text-sm">I want to Sell</h4>
                        <p className="text-[11px] text-[#8C7B6C] mt-1 leading-relaxed">
                          Open your Homepreneur Studio, list creations & earn directly with 0% commission.
                        </p>
                      </div>
                      <span className="mt-3 text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                        Artisan Seller Center
                      </span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSignupStep('details')}
                    className="w-full py-3 bg-[#4A3F35] hover:bg-[#382F27] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Continue as {selectedRole === 'buyer' ? 'Buyer' : 'Homepreneur Artisan'}</span>
                    <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                  </button>
                </div>
              ) : (
                /* Step 2: User Account Details */
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-serif font-bold text-[#4A3F35]">
                        Step 2 of 2: {selectedRole === 'seller' ? 'Artisan Studio Registration' : 'Buyer Profile Details'}
                      </h3>
                      <p className="text-xs text-[#8C7B6C] mt-0.5">
                        Registering as <strong className="text-[#D4AF37] uppercase">{selectedRole}</strong>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSignupStep('role')}
                      className="text-[11px] text-[#D4AF37] font-semibold hover:underline"
                    >
                      Change Role
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4A3F35] uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Fatima Zahra or Zainab Bibi"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FBF7F4] border border-[#F2E8E1] rounded-xl text-xs sm:text-sm text-[#4A3F35] focus:outline-none focus:border-[#D4AF37]"
                      />
                      <User className="w-4 h-4 text-[#A69689] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4A3F35] uppercase tracking-wider mb-1">
                      Mobile Number or Email
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        placeholder="0300-1234567 or artisan@studio.pk"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FBF7F4] border border-[#F2E8E1] rounded-xl text-xs sm:text-sm text-[#4A3F35] focus:outline-none focus:border-[#D4AF37]"
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
                        placeholder="Set a password"
                        className="w-full pl-10 pr-10 py-2.5 bg-[#FBF7F4] border border-[#F2E8E1] rounded-xl text-xs sm:text-sm text-[#4A3F35] focus:outline-none focus:border-[#D4AF37]"
                      />
                      <Lock className="w-4 h-4 text-[#A69689] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A69689] hover:text-[#4A3F35]"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Extra Fields if Seller */}
                  {selectedRole === 'seller' && (
                    <div className="p-3.5 bg-[#FFF9F5] border border-[#D4AF37]/30 rounded-2xl space-y-3">
                      <span className="text-[11px] font-bold text-[#4A3F35] uppercase tracking-wider block flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Artisan Workshop Information</span>
                      </span>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#4A3F35] mb-1">
                          Studio / Shop Name
                        </label>
                        <input
                          type="text"
                          value={shopName}
                          onChange={(e) => setShopName(e.target.value)}
                          placeholder="e.g. Lahore Gota & Kundan Studio"
                          className="w-full px-3 py-2 bg-white border border-[#F2E8E1] rounded-xl text-xs text-[#4A3F35] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#4A3F35] mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Lahore, Multan, Peshawar, Karachi"
                          className="w-full px-3 py-2 bg-white border border-[#F2E8E1] rounded-xl text-xs text-[#4A3F35] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#4A3F35] hover:bg-[#382F27] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                    <span>
                      {isSubmitting
                        ? 'Creating Account...'
                        : `Create ${selectedRole === 'seller' ? 'Seller Studio' : 'Buyer'} Account`}
                    </span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FBF7F4] border-t border-[#F2E8E1] flex items-center justify-between text-xs">
          <span className="text-[#8C7B6C]">
            {mode === 'login' ? "Don't have an account?" : 'Already registered?'}
          </span>
          <button
            onClick={() => handleSwitchMode(mode === 'login' ? 'signup' : 'login')}
            className="text-[#D4AF37] font-bold hover:underline"
          >
            {mode === 'login' ? 'Register Account' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};
