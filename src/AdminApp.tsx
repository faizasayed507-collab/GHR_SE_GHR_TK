import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { UserAccount, VerificationStatus } from './types';
import { AdminPanel } from './components/SellerDashboard/AdminPanel';

const toAccount = (p: any): UserAccount => ({
  id: p.id,
  name: p.name,
  email: p.email || undefined,
  phone: p.phone || undefined,
  emailOrPhone: p.email || p.phone || '',
  role: p.role,
  cnicNumber: p.cnic_number || undefined,
  address: p.address || undefined,
  city: p.city || undefined,
  homeBusinessName: p.home_business_name || undefined,
  shopName: p.home_business_name || undefined,
  verificationStatus: p.verification_status,
  createdAt: p.created_at,
});

export default function AdminApp() {
  const [stage, setStage] = useState<'loading' | 'login' | 'panel'>('loading');
  const [adminId, setAdminId] = useState('');
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const loadSellers = async () => {
    if (!supabase) return;
    const { data, error: err } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'seller')
      .order('created_at', { ascending: false });
    if (err) {
      setError('Could not load sellers: ' + err.message);
      return;
    }
    setAccounts((data || []).map(toAccount));
  };

  const enterIfAdmin = async (userId: string): Promise<boolean> => {
    if (!supabase) return false;
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, account_status')
      .eq('id', userId)
      .single();
    if (profile && profile.role === 'admin' && profile.account_status === 'active') {
      setAdminId(userId);
      await loadSellers();
      setStage('panel');
      return true;
    }
    await supabase.auth.signOut();
    return false;
  };

  useEffect(() => {
    (async () => {
      if (!supabase) {
        setStage('login');
        return;
      }
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const ok = await enterIfAdmin(data.session.user.id);
        if (!ok) setStage('login');
      } else {
        setStage('login');
      }
    })();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError('Server connection is not configured.');
      return;
    }
    setBusy(true);
    setError('');
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (err || !data.user) {
      setError('Incorrect email or password.');
      setBusy(false);
      return;
    }
    const ok = await enterIfAdmin(data.user.id);
    if (!ok) setError('Incorrect email or password.');
    setBusy(false);
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    setAccounts([]);
    setPassword('');
    setStage('login');
  };

  const handleUpdateStatus = async (accountId: string, status: VerificationStatus) => {
    if (!supabase) return;
    const { error: err } = await supabase
      .from('profiles')
      .update({ verification_status: status })
      .eq('id', accountId);
    if (err) {
      alert('Update failed: ' + err.message);
      return;
    }
    await supabase.from('activity_log').insert({
      actor_id: adminId,
      action: 'seller_verification_' + status.toLowerCase().replace(/\s+/g, '_'),
      target_type: 'profile',
      target_id: accountId,
      details: { status },
    });
    await loadSellers();
  };

  if (stage === 'loading') {
    return <div className="min-h-screen flex items-center justify-center text-sm">Loading...</div>;
  }

  if (stage === 'panel') {
    return (
      <AdminPanel
        accounts={accounts}
        sellers={[]}
        onUpdateAccountStatus={handleUpdateStatus}
        onClose={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F2] flex items-center justify-center p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white w-full max-w-sm p-8 rounded-3xl shadow-xl border border-[#F2E8E1] space-y-4"
      >
        <h1 className="text-xl font-serif font-bold text-[#4A3F35] text-center">Admin Login</h1>
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
            {error}
          </div>
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Admin email"
          className="w-full px-3 py-2.5 bg-[#FBF7F4] border border-[#F2E8E1] rounded-xl text-sm"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-3 py-2.5 bg-[#FBF7F4] border border-[#F2E8E1] rounded-xl text-sm"
        />
        <button
          type="submit"
          disabled={busy}
          className="w-full py-3 bg-[#4A3F35] text-white font-bold text-sm rounded-xl"
        >
          {busy ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}