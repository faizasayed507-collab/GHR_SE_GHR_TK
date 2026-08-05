import React, { useState } from 'react';
import { UserAccount, VerificationStatus, Seller } from '../types';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  X,
  Search,
  Filter,
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  AlertTriangle,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface AdminPanelProps {
  accounts: UserAccount[];
  sellers: Seller[];
  onUpdateAccountStatus: (accountId: string, status: VerificationStatus) => void;
  onClose?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  accounts,
  sellers,
  onUpdateAccountStatus,
  onClose,
}) => {
  const sellerAccounts = accounts.filter((a) => a.role === 'seller' || a.cnicNumber);

  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCnicImage, setSelectedCnicImage] = useState<{
    name: string;
    cnic: string;
    imageUrl: string;
  } | null>(null);

  const pendingCount = sellerAccounts.filter(
    (a) => a.verificationStatus === 'Pending Admin Review' || a.verificationStatus === 'Pending CNIC Verification'
  ).length;

  const verifiedCount = sellerAccounts.filter(
    (a) => a.verificationStatus === 'Verified'
  ).length;

  const rejectedCount = sellerAccounts.filter(
    (a) => a.verificationStatus === 'Rejected'
  ).length;

  const filteredAccounts = sellerAccounts.filter((acc) => {
    const status = acc.verificationStatus || 'Pending Admin Review';
    if (filterStatus !== 'All' && status !== filterStatus) {
      if (filterStatus === 'Pending Admin Review' && (status === 'Pending CNIC Verification' || status === 'Pending Admin Review')) {
        // match
      } else {
        return false;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = acc.name?.toLowerCase().includes(q);
      const matchBiz = acc.homeBusinessName?.toLowerCase().includes(q) || acc.shopName?.toLowerCase().includes(q);
      const matchCnic = acc.cnicNumber?.toLowerCase().includes(q);
      const matchEmail = acc.email?.toLowerCase().includes(q) || acc.emailOrPhone?.toLowerCase().includes(q);
      return matchName || matchBiz || matchCnic || matchEmail;
    }

    return true;
  });

  return (
    <div className="bg-[#FAF6F2] min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Banner */}
        <div className="bg-[#4A3F35] text-white p-6 rounded-3xl border border-[#D4AF37]/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#F2E8E1]">
                  Admin CNIC Verification Portal
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold border border-[#D4AF37]/30">
                  Administrator Access
                </span>
              </div>
              <p className="text-xs text-[#E2D9D0] mt-1">
                Review submitted national ID documents (CNIC) and manage Homepreneur verification badges.
              </p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#382F27] hover:bg-black/30 text-stone-200 text-xs font-bold rounded-xl border border-stone-600 transition-colors flex items-center justify-center gap-2 self-start md:self-auto"
            >
              <X className="w-4 h-4" />
              <span>Exit Admin Portal</span>
            </button>
          )}
        </div>

        {/* Overview Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-[#F2E8E1] shadow-xs">
            <div className="flex items-center justify-between text-stone-500 text-xs font-medium mb-1">
              <span>Total Sellers</span>
              <User className="w-4 h-4 text-[#4A3F35]" />
            </div>
            <div className="text-2xl font-serif font-bold text-[#4A3F35]">
              {sellerAccounts.length}
            </div>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 shadow-xs">
            <div className="flex items-center justify-between text-amber-800 text-xs font-medium mb-1">
              <span>Pending Review</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-serif font-bold text-amber-900">
              {pendingCount}
            </div>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 shadow-xs">
            <div className="flex items-center justify-between text-emerald-800 text-xs font-medium mb-1">
              <span>Verified Accounts</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-serif font-bold text-emerald-900">
              {verifiedCount}
            </div>
          </div>

          <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200 shadow-xs">
            <div className="flex items-center justify-between text-rose-800 text-xs font-medium mb-1">
              <span>Rejected CNICs</span>
              <XCircle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-serif font-bold text-rose-900">
              {rejectedCount}
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#F2E8E1] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#A69689] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search seller name, CNIC, or business..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#FBF7F4] border border-[#F2E8E1] rounded-xl text-xs text-[#4A3F35] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
            {['All', 'Pending Admin Review', 'Verified', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  filterStatus === status
                    ? 'bg-[#4A3F35] text-[#D4AF37] shadow-xs'
                    : 'bg-[#FBF7F4] text-[#8C7B6C] hover:text-[#4A3F35] border border-[#F2E8E1]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Accounts List */}
        {filteredAccounts.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-[#F2E8E1] text-center space-y-2">
            <ShieldCheck className="w-10 h-10 text-[#D4AF37] mx-auto" />
            <h3 className="font-serif font-bold text-[#4A3F35] text-base">No Accounts Found</h3>
            <p className="text-xs text-[#8C7B6C]">
              No seller accounts match your current filter or search criteria.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAccounts.map((acc) => {
              const currentStatus = acc.verificationStatus || 'Pending Admin Review';
              const hasCnicImage = Boolean(acc.cnicImage);

              return (
                <div
                  key={acc.id}
                  className="bg-white rounded-3xl border border-[#F2E8E1] p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  {/* Left Column: Account Info */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif font-bold text-[#4A3F35] text-base">
                        {acc.name}
                      </h3>
                      {acc.homeBusinessName && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FFF9F5] text-[#D4AF37] text-xs font-bold border border-[#D4AF37]/30 flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {acc.homeBusinessName}
                        </span>
                      )}

                      {/* Status Badge */}
                      {currentStatus === 'Verified' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Verified
                        </span>
                      ) : currentStatus === 'Rejected' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-300 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          Rejected
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300 flex items-center gap-1 animate-pulse">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Pending Admin Review
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-[#8C7B6C]">
                      <div className="flex items-center gap-1.5 font-mono">
                        <CreditCard className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                        <span>CNIC: <strong>{acc.cnicNumber || 'Not Provided'}</strong></span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#A69689] shrink-0" />
                        <span>{acc.phone || acc.emailOrPhone}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#A69689] shrink-0" />
                        <span>{acc.email || 'N/A'}</span>
                      </div>

                      <div className="flex items-center gap-1.5 sm:col-span-2">
                        <MapPin className="w-3.5 h-3.5 text-[#A69689] shrink-0" />
                        <span>{acc.address ? `${acc.address}, ${acc.city || 'Multan'}` : acc.city || 'Multan'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: CNIC Front Image Preview Button */}
                  <div className="shrink-0 flex items-center gap-3 bg-[#FAF6F2] p-3 rounded-2xl border border-[#F2E8E1]">
                    {hasCnicImage ? (
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-12 rounded-xl overflow-hidden bg-stone-200 border border-stone-300 shrink-0 relative group">
                          <img
                            src={acc.cnicImage}
                            alt="CNIC Front"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          onClick={() =>
                            setSelectedCnicImage({
                              name: acc.name,
                              cnic: acc.cnicNumber || 'CNIC Image',
                              imageUrl: acc.cnicImage!,
                            })
                          }
                          className="px-3 py-1.5 bg-[#4A3F35] text-white hover:bg-[#382F27] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>View CNIC Photo</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs text-amber-800 flex items-center gap-1.5 font-medium px-2 py-1">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>No CNIC photo attached</span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Admin Action Buttons */}
                  <div className="shrink-0 flex items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#F2E8E1]">
                    <button
                      onClick={() => onUpdateAccountStatus(acc.id, 'Verified')}
                      disabled={currentStatus === 'Verified'}
                      className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                        currentStatus === 'Verified'
                          ? 'bg-emerald-100 text-emerald-800 cursor-default opacity-80'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{currentStatus === 'Verified' ? 'Approved' : 'Approve CNIC'}</span>
                    </button>

                    <button
                      onClick={() => onUpdateAccountStatus(acc.id, 'Rejected')}
                      disabled={currentStatus === 'Rejected'}
                      className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                        currentStatus === 'Rejected'
                          ? 'bg-rose-100 text-rose-800 cursor-default opacity-80'
                          : 'bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300'
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      <span>{currentStatus === 'Rejected' ? 'Rejected' : 'Reject'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CNIC Lightbox Modal */}
      {selectedCnicImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="bg-[#4A3F35] p-4 text-white flex items-center justify-between border-b border-[#D4AF37]/30">
              <div>
                <h3 className="font-serif font-bold text-[#F2E8E1] text-base">
                  CNIC Document Review: {selectedCnicImage.name}
                </h3>
                <p className="text-xs text-[#E2D9D0] font-mono mt-0.5">
                  CNIC: {selectedCnicImage.cnic}
                </p>
              </div>
              <button
                onClick={() => setSelectedCnicImage(null)}
                className="text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-stone-900 flex items-center justify-center min-h-[300px]">
              <img
                src={selectedCnicImage.imageUrl}
                alt="CNIC Front Document"
                className="max-h-[70vh] w-auto object-contain rounded-xl border border-stone-700 shadow-2xl"
              />
            </div>

            <div className="p-4 bg-white flex justify-end">
              <button
                onClick={() => setSelectedCnicImage(null)}
                className="px-5 py-2 bg-[#4A3F35] text-white text-xs font-bold rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
