import React, { useState, useEffect } from 'react';
import { UserAccount, UserRole, VerificationStatus } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
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
  FileText,
  Upload,
  Clock,
  RefreshCw,
  Mail,
  Home,
  BadgeCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';

interface AuthScreenProps {
  onAuthSuccess: (user: UserAccount) => void;
  existingAccounts: UserAccount[];
}

const PAKISTAN_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Multan',
  'Peshawar',
  'Rawalpindi',
  'Faisalabad',
  'Quetta',
  'Gujranwala',
  'Sialkot',
  'Hyderabad',
  'Abbottabad',
  'Sargodha',
  'Bahawalpur',
  'Sukkur',
  'Larkana'
];

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onAuthSuccess,
  existingAccounts,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('buyer');
  const [signupStep, setSignupStep] = useState<'role' | 'details' | 'otp'>('role');

  // Shared Login Fields
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Buyer Signup Fields
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmailOrPhone, setBuyerEmailOrPhone] = useState('');
  const [buyerPassword, setBuyerPassword] = useState('');
  const [showBuyerPassword, setShowBuyerPassword] = useState(false); // FIXED: Added missing state
  const [buyerAddress, setBuyerAddress] = useState('');

  // Seller Signup Fields
  const [sellerFullName, setSellerFullName] = useState('');
  const [sellerCnic, setSellerCnic] = useState('');
  const [sellerCnicImage, setSellerCnicImage] = useState<string | null>(null);
  const [sellerAddress, setSellerAddress] = useState('');
  const [sellerCity, setSellerCity] = useState('Multan');
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [sellerPassword, setSellerPassword] = useState('');
  const [showSellerPassword, setShowSellerPassword] = useState(false); // FIXED: Added missing state
  const [sellerBusinessName, setSellerBusinessName] = useState('');
  const [sellerBio, setSellerBio] = useState('');

  // OTP Verification State
  const [otpCode, setOtpCode] = useState('');
  const [otpTimer, setOtpTimer] = useState(300); // 5 minutes
  const [resendCooldown, setResendCooldown] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [otpSentMessage, setOtpSentMessage] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP Timer effect
  useEffect(() => {
    let timer: any;
    if (signupStep === 'otp' && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [signupStep, otpTimer]);

  // Resend cooldown timer effect
  useEffect(() => {
    let timer: any;
    if (signupStep === 'otp' && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [signupStep, resendCooldown]);

  const resetAllForms = () => {
    setLoginEmailOrPhone('');
    setLoginPassword('');
    setBuyerName('');
    setBuyerEmailOrPhone('');
    setBuyerPassword('');
    setBuyerAddress('');
    setSellerFullName('');
    setSellerCnic('');
    setSellerCnicImage(null);
    setSellerAddress('');
    setSellerCity('Multan');
    setSellerPhone('');
    setSellerEmail('');
    setSellerPassword('');
    setSellerBusinessName('');
    setSellerBio('');
    setOtpCode('');
    setErrorMessage('');
    setOtpSentMessage('');
  };

  const handleSwitchMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setSignupStep('role');
    setErrorMessage('');
  };

  // CNIC Formatting Helper (XXXXX-XXXXXXX-X)
  const handleCnicChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 13);
    let formatted = raw;
    if (raw.length > 5 && raw.length <= 12) {
      formatted = `${raw.slice(0, 5)}-${raw.slice(5)}`;
    } else if (raw.length > 12) {
      formatted = `${raw.slice(0, 5)}-${raw.slice(5, 12)}-${raw.slice(12)}`;
    }
    setSellerCnic(formatted);
  };

  // CNIC Image Upload Handler
  const handleCnicImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('CNIC image size should be under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSellerCnicImage(reader.result as string);
        setErrorMessage('');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmailOrPhone.trim() || !loginPassword) {
      setErrorMessage('Please enter your Phone/Email and Password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsSubmitting(false);

      const searchKey = loginEmailOrPhone.toLowerCase().trim();
      const matched = existingAccounts.find(
        (acc) =>
          acc.emailOrPhone?.toLowerCase().trim() === searchKey ||
          acc.email?.toLowerCase().trim() === searchKey ||
          acc.phone?.trim() === searchKey
      );

      if (matched) {
        if (matched.password && matched.password !== loginPassword) {
          setErrorMessage('Incorrect password. Please verify and try again.');
          return;
        }
        onAuthSuccess(matched);
      } else {
        setErrorMessage(
          'No registered account found with these credentials. Please click "Sign Up" to register.'
        );
      }
    }, 450);
  };

  // Generate & Send Real OTP to Seller Email
  const sendRealEmailOtp = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signInWithOtp({
          email: sellerEmail.trim(),
        });
        if (error) {
          console.warn('Supabase Auth OTP warning:', error.message);
        }
      }

      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: sellerEmail.trim() }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to dispatch email verification code.');
      }

      setOtpSentMessage(`Verification code sent to ${sellerEmail.trim()}`);

      setOtpTimer(300);
      setResendCooldown(30);
      setIsResendDisabled(true);
      setOtpCode('');
      setSignupStep('otp');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error sending OTP to email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Seller Signup Form Submission -> Triggers OTP
  const handleSellerFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerFullName.trim()) {
      setErrorMessage('Please enter your Full Name as per CNIC.');
      return;
    }
    const rawCnic = sellerCnic.replace(/\D/g, '');
    if (rawCnic.length !== 13) {
      setErrorMessage('Please enter a valid 13-digit CNIC number (XXXXX-XXXXXXX-X).');
      return;
    }
    if (!sellerCnicImage) {
      setErrorMessage('Please upload a clear front image of your CNIC for identity verification.');
      return;
    }
    if (!sellerPhone.trim() || sellerPhone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid Pakistani phone number (e.g., 0300-1234567).');
      return;
    }
    if (!sellerEmail.trim() || !sellerEmail.includes('@')) {
      setErrorMessage('Please enter a valid Email Address.');
      return;
    }
    if (!sellerPassword || sellerPassword.length < 6) {
      setErrorMessage('Please choose a password at least 6 characters long.');
      return;
    }
    if (!sellerBusinessName.trim()) {
      setErrorMessage('Please enter your Home Business Name (e.g. Multani Dhaaga Crafts).');
      return;
    }
    if (!sellerAddress.trim()) {
      setErrorMessage('Please enter your complete Home Address.');
      return;
    }

    sendRealEmailOtp();
  };

  // Verify Real Email OTP Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpTimer <= 0) {
      setErrorMessage('Verification code has expired. Please click "Resend Code".');
      return;
    }

    if (!otpCode || otpCode.trim().length !== 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.verifyOtp({
          email: sellerEmail.trim(),
          token: otpCode.trim(),
          type: 'email',
        });
        if (error) {
          console.warn('Supabase verifyOtp note:', error.message);
        }
      }

      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: sellerEmail.trim(), code: otpCode.trim() }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Invalid verification code. Please check your inbox and try again.');
      }

      const verificationStatus: VerificationStatus = 'Pending Admin Review';

      const newSeller: UserAccount = {
        id: 'usr_seller_' + Date.now(),
        name: sellerFullName.trim(),
        email: sellerEmail.trim(),
        phone: sellerPhone.trim(),
        emailOrPhone: sellerEmail.trim() || sellerPhone.trim(),
        password: sellerPassword,
        role: 'seller',
        cnicNumber: sellerCnic,
        cnicImage: sellerCnicImage || undefined,
        address: sellerAddress.trim(),
        city: sellerCity,
        homeBusinessName: sellerBusinessName.trim(),
        shopName: sellerBusinessName.trim(),
        bio: sellerBio.trim() || `Handcrafted creations by ${sellerFullName} from home.`,
        verificationStatus: verificationStatus,
        phoneVerified: true,
        emailVerified: true,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
        createdAt: new Date().toISOString(),
      };

      onAuthSuccess(newSeller);
    } catch (err: any) {
      setErrorMessage(err.message || 'OTP verification failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Buyer Signup Form Submission
  const handleBuyerSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim()) {
      setErrorMessage('Please enter your Full Name.');
      return;
    }
    if (!buyerEmailOrPhone.trim()) {
      setErrorMessage('Please enter your Email or Phone Number.');
      return;
    }
    if (!buyerPassword || buyerPassword.length < 6) {
      setErrorMessage('Please choose a password at least 6 characters long.');
      return;
    }
    if (!buyerAddress.trim()) {
      setErrorMessage('Please enter your Delivery Address (House/Street, Area, City).');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsSubmitting(false);

      const newBuyer: UserAccount = {
        id: 'usr_buyer_' + Date.now(),
        name: buyerName.trim(),
        emailOrPhone: buyerEmailOrPhone.trim(),
        password: buyerPassword,
        role: 'buyer',
        address: buyerAddress.trim(),
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
        createdAt: new Date().toISOString(),
      };

      onAuthSuccess(newBuyer);
    }, 500);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-[#FAF6F2] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 selection:bg-[#D4AF37] selection:text-white">
      {/* Top Branding Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#4A3F35] text-xs font-bold tracking-wide uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Ghar Ka Hunar, Aap Ke Ghar Tak</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#4A3F35] tracking-tight">
          Ghar Se Ghar Tak
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-[#8C7B6C] max-w-sm mx-auto font-medium">
          Pakistan's Escrow Network for Homepreneurs & Women Artisans.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 shadow-2xl border border-[#F2E8E1] rounded-3xl sm:px-10 relative overflow-hidden">
          {/* Accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4A3F35] via-[#D4AF37] to-[#4A3F35]" />

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-2xl bg-[#FBF7F4] p-1.5 border border-[#F2E8E1] mb-6">
            <button
              type="button"
              onClick={() => handleSwitchMode('login')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-[#4A3F35] text-white shadow-md'
                  : 'text-[#8C7B6C] hover:text-[#4A3F35]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('signup')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                mode === 'signup'
                  ? 'bg-[#4A3F35] text-white shadow-md'
                  : 'text-[#8C7B6C] hover:text-[#4A3F35]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl font-medium flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* MODE 1: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#4A3F35] uppercase tracking-wider mb-1">
                  Mobile Number or Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={loginEmailOrPhone}
                    onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                    placeholder="0300-1234567 or email@domain.pk"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FBF7F4] border border-[#F2E8E1] rounded-xl text-xs sm:text-sm text-[#4A3F35] focus:outline-none focus:border-[#D4AF37]"
                  />
                  <Phone className="w-4 h-4 text-[#A69689] absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#4A3F35] uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#FBF7F4] border border-[#F2E8E1] rounded-xl text-xs sm:text-sm text-[#4A3F35] focus:outline-none focus:border-[#D4AF37]"
                  />
                  <Lock className="w-4 h-4 text-[#A69689] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A69689] hover:text-[#4A3F35]"
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#4A3F35] hover:bg-[#382F27] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>{isSubmitting ? 'Authenticating Account...' : 'Sign In'}</span>
              </button>

              <div className="pt-3 text-center border-t border-[#F2E8E1]">
                <p className="text-xs text-[#8C7B6C]">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('signup')}
                    className="text-[#D4AF37] font-bold hover:underline"
                  >
                    Register now
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* MODE 2: SIGNUP */}
          {mode === 'signup' && (
            <div className="space-y-5">
              {/* STEP 1: ROLE SELECTION */}
              {signupStep === 'role' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase bg-[#FFF9F5] px-3 py-1 rounded-full border border-[#D4AF37]/30">
                      Step 1 of 2
                    </span>
                    <h3 className="text-base font-serif font-bold text-[#4A3F35] mt-1.5">
                      Select Account Type
                    </h3>
                    <p className="text-xs text-[#8C7B6C] mt-0.5">
                      Choose whether you want to purchase or sell handcrafted items.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    {/* Buyer Option */}
                    <button
                      type="button"
                      onClick={() => setSelectedRole('buyer')}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        selectedRole === 'buyer'
                          ? 'border-[#D4AF37] bg-[#FFF9F5] ring-2 ring-[#D4AF37]/30'
                          : 'border-[#F2E8E1] bg-[#FBF7F4] hover:border-[#D4AF37]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2.5 bg-[#D4AF37]/20 text-[#4A3F35] rounded-xl">
                          <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                        </div>
                        {selectedRole === 'buyer' && (
                          <CheckCircle2 className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#4A3F35] text-sm">I want to Buy</h4>
                        <p className="text-[11px] text-[#8C7B6C] mt-1 leading-relaxed">
                          Browse authentic artisan products & buy with Bank Escrow protection.
                        </p>
                      </div>
                    </button>

                    {/* Seller Option */}
                    <button
                      type="button"
                      onClick={() => setSelectedRole('seller')}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        selectedRole === 'seller'
                          ? 'border-[#D4AF37] bg-[#FFF9F5] ring-2 ring-[#D4AF37]/30'
                          : 'border-[#F2E8E1] bg-[#FBF7F4] hover:border-[#D4AF37]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2.5 bg-[#4A3F35] text-white rounded-xl">
                          <Store className="w-5 h-5 text-[#D4AF37]" />
                        </div>
                        {selectedRole === 'seller' && (
                          <CheckCircle2 className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#4A3F35] text-sm">I want to Sell</h4>
                        <p className="text-[11px] text-[#8C7B6C] mt-1 leading-relaxed">
                          Register your Home Business, pass CNIC verification & list handmade items.
                        </p>
                      </div>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSignupStep('details')}
                    className="w-full py-3 bg-[#4A3F35] hover:bg-[#382F27] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-2"
                  >
                    <span>Continue as {selectedRole === 'buyer' ? 'Buyer' : 'Homepreneur'}</span>
                    <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                  </button>
                </div>
              )}

              {/* STEP 2: BUYER DETAILS FORM */}
              {signupStep === 'details' && selectedRole === 'buyer' && (
                <form onSubmit={handleBuyerSignupSubmit} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F2E8E1] pb-2">
                    <div>
                      <span className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase">
                        Buyer Registration
                      </span>
                      <h3 className="text-sm font-serif font-bold text-[#4A3F35]">
                        Delivery & Account Profile
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSignupStep('role')}
                      className="text-[11px] text-[#D4AF37] font-semibold hover:underline"
                    >
                      Back
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#4A3F35] uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="e.g. Ayesha Khan"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FBF7F4] border border-[#F2E8E1] rounded-xl text-xs sm:text-sm text-[#4A3F35] focus:outline-none focus:border-[#D4AF37]"
                      />
                      <User className="w-4 h-4 text-[#A69689] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#4A3F35] uppercase tracking-wider mb-1">
                      Mobile Number or Email
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={buyerEmailOrPhone}
                        onChange={(e) => setBuyerEmailOrPhone(e.target.value)}
                        placeholder="0300-1234567 or ayesha@domain.pk"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FBF7F4] border border-[#F2E8E1] rounded-xl text-xs sm:text-sm text-[#4A3F35] focus:outline-none focus:border-[#D4AF37]"
                      />
                      <Phone className="w-4 h-4 text-[#A69689] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#4A3F35] uppercase tracking-wider mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showBuyerPassword ? 'text' : 'password'}
                        value={buyerPassword}
                        onChange={(e) => setBuyerPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 bg-[#FBF7F4] border border-[#F2E8E1] rounded-xl text-xs sm:text-sm text-[#4A3F35] focus:outline-none focus:border-[#D4AF37]"
                      />
                      <Lock className="w-4 h-4 text-[#A69689] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <button
                        type="button"
                        onClick={() => setShowBuyerPassword((prev) => !prev)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A69689] hover:text-[#4A3F35]"
                        aria-label={showBuyerPassword ? 'Hide password' : 'Show password'}
                      >
                        {showBuyerPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#4A3F35] uppercase tracking-wider mb-1">
                      Delivery Address (House/Street, Area, City)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={buyerAddress}
                        onChange={(e) => setBuyerAddress(e.target.value)}
                        placeholder="House 42, Street 10, DHA Phase 5, Lahore"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FBF7F4] border border-[#F2E8E1] rounded-xl text-xs text-[#4A3F35] focus:outline-none focus:border-[#D4AF37]"
                      />
                      <MapPin className="w-4 h-4 text-[#A69689] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#4A3F35] hover:bg-[#382F27] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                    <span>{isSubmitting ? 'Registering...' : 'Complete Buyer Registration'}</span>
                  </button>
                </form>
              )}

              {/* STEP 2: SELLER DETAILS FORM */}
              {signupStep === 'details' && selectedRole === 'seller' && (
                <form onSubmit={handleSellerFormSubmit} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F2E8E1] pb-2">
                    <div>
                      <span className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase">
                        Homepreneur Registration
                      </span>
                      <h3 className="text-sm font-serif font-bold text-[#4A3F35]">
                        Home Business & Verification Details
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSignupStep('role')}
                      className="text-[11px] text-[#D4AF37] font-semibold hover:underline"
                    >
                      Back
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#4A3F35] uppercase tracking-wider mb-1">
                        Full Name (as per CNIC)
                      </label>
                      <input
                        type="text"
                        value={sellerFullName}
                        onChange={(e) => setSellerFullName(e.target.value)}
                        placeholder="e.g. Fatima Zahra"
                        className="w-full px-3 py-2 bg-[#FBF7F4] border border-[#F2E8E1] rounded-xl text-xs text-[#4A3F35] focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#4A3F35] uppercase tracking-wider mb-1">
                        CNIC Number
                      </label>
                      <input
                        type="text"
                        value={sellerCnic}
                        onChange={(e) => handleCnicChange(e.target.value)}
                        placeholder="36302-1234567-8"
                        maxLength={15}
                        className="w-full px-3 py-2 bg-[#FBF7F4] border border-[#F2E8E1] rounded-xl text-xs text-[#4A3F35] focus:outline-none focus:border-[#D4AF37] font-mono"
                      />
                    </div>
                  </div>

                  {/* CNIC Upload Section */}
                  <div className="p-3 bg-[#FFF9F5] border border-[#D4AF37]/30 rounded-2xl">
                    <label className="block text-[11px] font-bold text-[#4A3F35] uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>CNIC Front Image Upload</span>
                      <span className="text-[10px] text-[#D4AF37] font-normal">Required for verification</span>
                    </label>

                    {sellerCnicImage ? (
                      <div className="relative rounded-xl overflow-hidden border border-[#D4AF37] h-28 bg-black/5 flex items-center justify-center">
                        <img src={sellerCnicImage} alt="CNIC Front" className="h-full object-contain" />
                        <button
                          type="button"
                          onClick={() => setSellerCnicImage(null)}
                          className="absolute top-2 right-2 bg-rose-600 text-white p-1 rounded-full text-xs font-bold shadow hover:bg-rose-700"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-[#D4AF37]/50 rounded-xl cursor-pointer hover:bg-[#FBF7F4] transition-colors">
                        <Upload className="w-6 h-6 text-[#D4AF37] mb-1" />
                        <span className="text-xs text-[#8C7B6C] font-medium">Click to upload CNIC Front</span>
                        <input type="file" accept="image/*" onChange={handleCnicImageUpload} className="hidden" />
                      </label>
                    )}
                  </div>

                  {/* Business & Contact info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#4A3F35] uppercase tracking-wider mb-1">
                        Home Business Name
                      </label>
                      <input
                        type="text"
                        value={sellerBusinessName}
                        onChange={(e) => setSellerBusinessName(e.target.value)}
                        placeholder="e.g. Multani Dhaaga Crafts"
                        className="w-full px-3 py-2 bg-[#FBF7F4] border border-[#F2E8E1] rounded-xl text-xs text-[#4A3F35] focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#4A3F35] uppercase tracking-wider mb-1">
                        City
                      </label>
                      <select
                        value={sellerCity}
                        onChange={(e) => setSellerCity(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FBF7F4] border border-[#F2E8E1] rounded-xl text-xs text-[#4A3F35] focus:outline-none focus:border-[#D4AF37]"
                      >
                        {PAKISTAN_CITIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#4A3F35] uppercase tracking-wider mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={sellerPhone}
                        onChange={(e) => setSellerPhone(e.target.value)}
                        placeholder="0300-1234567"
                        className="w-full px-3 py-2 bg-[#FBF7F4] border border-[#F2E8E1] rounded-xl text-xs text-[#4A3F35] focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#4A3F35] uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={sellerEmail}
                        onChange={(e) => setSellerEmail(e.target.value)}
                        placeholder="seller@domain.com"
                        className="w-full px-3 py-2 bg-[#FBF7F4] border border-[#F2E8E1] rounded-xl text-xs text-[#4A3F35] focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#4A3F35] uppercase tracking-wider mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showSellerPassword ? 'text' : 'password'}
                        value={sellerPassword}
                        onChange={(e) => setSellerPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2 bg-[#FBF7F4] border border-[#F2E8E1] rounded-xl text-xs text-[#4A3F35] focus:outline-none focus:border-[#D4AF37]"
                      />
                      <Lock className="w-4 h-4 text-[#A69689] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <button
                        type="button"
                        onClick={() => setShowSellerPassword((prev) => !prev)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A69689] hover:text-[#4A3F35]"
                        aria-label={showSellerPassword ? 'Hide password' : 'Show password'}
                      >
                        {showSellerPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#4A3F35] uppercase tracking-wider mb-1">
                      Complete Address
                    </label>
                    <input
                      type="text"
                      value={sellerAddress}
                      onChange={(e) => setSellerAddress(e.target.value)}
                      placeholder="House No., Street, Sector/Area, City"
                      className="w-full px-3 py-2 bg-[#FBF7F4] border border-[#F2E8E1] rounded-xl text-xs text-[#4A3F35] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#4A3F35] hover:bg-[#382F27] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-2"
                  >
                    <Mail className="w-4 h-4 text-[#D4AF37]" />
                    <span>{isSubmitting ? 'Sending Code...' : 'Verify Email & Continue'}</span>
                  </button>
                </form>
              )}

              {/* STEP 3: OTP VERIFICATION STEP */}
              {signupStep === 'otp' && (
                <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
                  <div className="p-4 bg-[#FFF9F5] border border-[#D4AF37]/30 rounded-2xl">
                    <Mail className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                    <h3 className="font-serif font-bold text-[#4A3F35] text-base">Enter Verification Code</h3>
                    <p className="text-xs text-[#8C7B6C] mt-1">{otpSentMessage || `Code sent to ${sellerEmail}`}</p>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="• • • • • •"
                      maxLength={6}
                      className="w-48 mx-auto text-center tracking-[0.5em] text-xl font-bold py-2 bg-[#FBF7F4] border border-[#D4AF37] rounded-xl text-[#4A3F35] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#8C7B6C] px-4">
                    <span>Expires in: {formatTimer(otpTimer)}</span>
                    <button
                      type="button"
                      disabled={isResendDisabled}
                      onClick={sendRealEmailOtp}
                      className="text-[#D4AF37] font-bold disabled:opacity-50 hover:underline"
                    >
                      Resend Code {resendCooldown > 0 && `(${resendCooldown}s)`}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#4A3F35] hover:bg-[#382F27] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                    <span>{isSubmitting ? 'Verifying...' : 'Complete & Submit Registration'}</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};