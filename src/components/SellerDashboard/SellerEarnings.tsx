import React, { useState } from 'react';
import { Seller, Order, WalletTransaction } from '../../types';
import { Wallet, ShieldCheck, ArrowDownRight, Clock, CheckCircle2, Building, CreditCard, X, ArrowUpRight } from 'lucide-react';

interface SellerEarningsProps {
  seller: Seller;
  orders: Order[];
}

export const SellerEarnings: React.FC<SellerEarningsProps> = ({ seller, orders }) => {
  const releasedEarnings = orders
    .filter((o) => o.status === 'Payment Released')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingEscrowEarnings = orders
    .filter((o) => o.status === 'In Escrow' || o.status === 'Shipped' || o.status === 'Pending' || o.status === 'Delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const [availableBalance, setAvailableBalance] = useState<number>(releasedEarnings || 14500);
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);
  const [withdrawMethod, setWithdrawMethod] = useState<'JazzCash' | 'EasyPaisa' | 'Bank Transfer'>('JazzCash');
  const [accountTitle, setAccountTitle] = useState<string>(seller.name);
  const [accountNumber, setAccountNumber] = useState<string>('0300-9876543');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(5000);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([
    {
      id: 'tx-1',
      date: '2026-07-25',
      description: 'Escrow Released for Order #GSGT-9830',
      amount: 3600,
      type: 'escrow_release',
      status: 'Completed',
    },
    {
      id: 'tx-2',
      date: '2026-07-20',
      description: 'Cashout to JazzCash (0300-9876543)',
      amount: 10000,
      type: 'withdrawal',
      status: 'Completed',
      method: 'JazzCash',
    },
    {
      id: 'tx-3',
      date: '2026-07-28',
      description: 'Escrow Locked for Order #GSGT-9842',
      amount: 4850,
      type: 'escrow_hold',
      status: 'In Escrow',
    },
  ]);

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0 || withdrawAmount > availableBalance) return;

    setAvailableBalance((prev) => prev - withdrawAmount);

    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      description: `Cashout to ${withdrawMethod} (${accountNumber})`,
      amount: withdrawAmount,
      type: 'withdrawal',
      status: 'Completed',
      method: withdrawMethod,
    };

    setTransactions((prev) => [newTx, ...prev]);
    setShowWithdrawModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200">
        <h1 className="text-xl font-serif font-bold text-stone-900">
          Studio Wallet & Cashout
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Withdraw your released escrow earnings directly to your JazzCash, EasyPaisa, or Bank account with zero fee.
        </p>
      </div>

      {/* Main Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Available Balance Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-950 via-rose-900 to-amber-950 text-white shadow-xl border border-amber-500/30 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                Available for Cashout
              </span>
              <Wallet className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-3xl font-serif font-bold text-amber-50 mt-2">
              Rs. {availableBalance.toLocaleString()}
            </div>
            <span className="text-[11px] text-rose-200 mt-1 block">
              100% Escrow Released & Ready
            </span>
          </div>

          <button
            onClick={() => setShowWithdrawModal(true)}
            disabled={availableBalance <= 0}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-rose-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Withdraw to JazzCash / Bank</span>
          </button>
        </div>

        {/* Funds in Escrow */}
        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
              <span>Locked in Escrow Vault</span>
              <ShieldCheck className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-2xl font-serif font-bold text-amber-800 mt-2">
              Rs. {pendingEscrowEarnings.toLocaleString()}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Funds automatically unlock when buyers confirm parcel arrival.
            </p>
          </div>

          <div className="pt-3 border-t border-stone-100 text-[11px] font-medium text-stone-600">
            Pending Orders: <strong>{orders.filter((o) => o.status !== 'Payment Released').length} items</strong>
          </div>
        </div>

        {/* Lifetime Revenue */}
        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
              <span>Lifetime Revenue</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-2xl font-serif font-bold text-stone-900 mt-2">
              Rs. {(releasedEarnings + 24000).toLocaleString()}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Total sales earned on Ghar Se Ghar Tak marketplace.
            </p>
          </div>

          <div className="pt-3 border-t border-stone-100 text-[11px] font-medium text-stone-600">
            Commission Rate: <strong className="text-emerald-700">0% Special Homepreneur Promo</strong>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
        <h2 className="text-base font-serif font-bold text-stone-900">
          Wallet Transaction History
        </h2>

        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl ${
                    tx.type === 'withdrawal'
                      ? 'bg-rose-100 text-rose-800'
                      : tx.type === 'escrow_release'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {tx.type === 'withdrawal' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-stone-900">{tx.description}</div>
                  <div className="text-stone-400 text-[10px]">{tx.date}</div>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`font-serif font-bold text-sm ${
                    tx.type === 'withdrawal' ? 'text-rose-900' : 'text-emerald-700'
                  }`}
                >
                  {tx.type === 'withdrawal' ? '-' : '+'} Rs. {tx.amount.toLocaleString()}
                </div>
                <span className="text-[10px] text-stone-500 font-medium">
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-rose-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-serif font-bold text-stone-900">
                Withdraw Available Earnings
              </h3>
              <button onClick={() => setShowWithdrawModal(false)} className="text-stone-400 hover:text-stone-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Select Payout Method *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['JazzCash', 'EasyPaisa', 'Bank Transfer'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setWithdrawMethod(m)}
                      className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                        withdrawMethod === m
                          ? 'border-rose-900 bg-rose-50 text-rose-950 ring-2 ring-rose-300'
                          : 'border-stone-200 bg-stone-50 text-stone-700'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Account Title (as on CNIC/Bank) *
                </label>
                <input
                  type="text"
                  value={accountTitle}
                  onChange={(e) => setAccountTitle(e.target.value)}
                  required
                  className="w-full bg-stone-50 px-3 py-2 text-xs rounded-xl border border-stone-200 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {withdrawMethod === 'Bank Transfer' ? 'Bank Name & IBAN *' : 'Mobile Account Number *'}
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                  className="w-full bg-stone-50 px-3 py-2 text-xs rounded-xl border border-stone-200 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Amount in PKR (Max Rs. {availableBalance.toLocaleString()}) *
                </label>
                <input
                  type="number"
                  max={availableBalance}
                  min={500}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  required
                  className="w-full bg-stone-50 px-3 py-2 text-xs rounded-xl border border-stone-200 font-bold text-rose-950 font-serif text-lg"
                />
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant cashout. Zero fee for homepreneurs.</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 text-stone-600 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-900 hover:bg-rose-800 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Confirm Cashout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
