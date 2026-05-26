import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { useApi, EarningsDashboardData, EarningRecord } from "../../../context/AppContext";
import { toast } from "react-hot-toast";

const Earnings: React.FC = () => {
  const { getProducerEarnings, getEarningsHistory } = useApi();
  const [dashboardData, setDashboardData] = useState<EarningsDashboardData | null>(null);
  const [earningsHistory, setEarningsHistory] = useState<EarningRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const limit = 5; // Display 5 records per page in history list

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await getProducerEarnings();
        setDashboardData(data);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Failed to load earnings stats.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setHistoryLoading(true);
        const data = await getEarningsHistory(currentPage, limit);
        if (data) {
          setEarningsHistory(data.records || []);
          setTotalRecords(data.total || 0);
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, [currentPage]);

  const currencySymbol = (currency: string) => {
    if (currency === "GBP") return "£";
    return "$";
  };

  const currentSymbol = dashboardData ? currencySymbol(dashboardData.currency) : "$";
  const totalPages = Math.ceil(totalRecords / limit);

  return (
    <div className="flex-1 flex flex-col p-6 md:p-12 min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#0d0d15] via-[#12121f] to-[#0d0d15] font-[Poppins] text-white overflow-y-auto">
      {/* Top Action Row */}
      <div className="w-full flex justify-between items-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 px-2 sm:px-0">
        {/* Hamburger Menu - Mobile Only */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-[#10b981] hover:text-[#059669] transition-colors p-2 -ml-2"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <HiX className="w-6 h-6" />
          ) : (
            <HiMenu className="w-6 h-6" />
          )}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:block ml-auto">
          <Link
            to="/dashboard/upload"
            className="text-[#10b981] hover:text-[#059669] font-bold text-sm sm:text-base md:text-lg tracking-wide transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          >
            Create upload
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 md:hidden z-40">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeMobileMenu}
          />
          {/* Mobile Menu Panel */}
          <div className="absolute top-0 right-0 h-screen w-64 bg-[#12121f] border-l border-white/10 shadow-2xl z-50 pt-6 px-6 animate-slide-in-right">
            <div className="flex flex-col gap-6">
              <Link
                to="/dashboard/upload"
                onClick={closeMobileMenu}
                className="text-[#10b981] hover:text-[#059669] font-bold text-base tracking-wide transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer py-3 px-4 rounded-lg hover:bg-white/5"
              >
                Create upload
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Top Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full max-w-5xl mx-auto mb-6 sm:mb-8 md:mb-10 gap-4 sm:gap-0 px-2 sm:px-0">
        <h1 className="text-white font-bold text-2xl md:text-3xl lg:text-[32px] tracking-wide animate-fade-in">
          Earning Dashboard
        </h1>
        <Link 
          to="/dashboard/withdraw" 
          className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm md:text-base px-6 py-3 rounded-xl shadow-2xl hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer tracking-wider inline-block text-center"
        >
          Request Withdrawal
        </Link>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-t-purple-500 border-white rounded-full animate-spin mb-4" />
          <p className="text-white/60">Fetching your earnings dashboard...</p>
        </div>
      ) : (
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-10">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full animate-fade-in">
            {/* Current Earning Card */}
            <div className="flex flex-col bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl hover:border-purple-500/30 transition-all duration-300 backdrop-blur-xl group hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white/60 font-semibold text-sm tracking-wide group-hover:text-purple-400 transition-colors">Current Earning</h3>
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16V15m0 1v-4" />
                  </svg>
                </div>
              </div>
              <p className="text-white font-bold text-2xl lg:text-[28px] tracking-wider">
                {currentSymbol} {dashboardData?.currentEarning.toFixed(2) || "0.00"}
              </p>
              <span className="text-[10px] text-emerald-400 font-medium mt-2">Available for immediate payout</span>
            </div>

            {/* Total Earnings Card */}
            <div className="flex flex-col bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl hover:border-indigo-500/30 transition-all duration-300 backdrop-blur-xl group hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white/60 font-semibold text-sm tracking-wide group-hover:text-indigo-400 transition-colors">Total All-Time</h3>
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <p className="text-white font-bold text-2xl lg:text-[28px] tracking-wider">
                {currentSymbol} {dashboardData?.totalEarnings.toFixed(2) || "0.00"}
              </p>
              <span className="text-[10px] text-indigo-300 font-medium mt-2">Total revenue streams generated</span>
            </div>

            {/* Total Withdrawal Card */}
            <div className="flex flex-col bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl hover:border-pink-500/30 transition-all duration-300 backdrop-blur-xl group hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white/60 font-semibold text-sm tracking-wide group-hover:text-pink-400 transition-colors">Total Withdrawn</h3>
                <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
              </div>
              <p className="text-white font-bold text-2xl lg:text-[28px] tracking-wider">
                {currentSymbol} {dashboardData?.totalWithdrawal.toFixed(2) || "0.00"}
              </p>
              <span className="text-[10px] text-pink-300 font-medium mt-2">Successfully settled to bank/card</span>
            </div>

            {/* Total Viewers Card */}
            <div className="flex flex-col bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl hover:border-blue-500/30 transition-all duration-300 backdrop-blur-xl group hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white/60 font-semibold text-sm tracking-wide group-hover:text-blue-400 transition-colors">Unique Viewers</h3>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
              <p className="text-white font-bold text-2xl lg:text-[28px] tracking-wider">
                {dashboardData?.totalViewers || "0"}
              </p>
              <span className="text-[10px] text-blue-300 font-medium mt-2">Organic viewers watching streams</span>
            </div>
          </div>

          {/* Earnings History Table */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl animate-fade-in">
            <h2 className="text-white font-bold text-lg md:text-xl tracking-wide mb-6">Earnings Transaction History</h2>

            {historyLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-t-purple-500 border-white rounded-full animate-spin mb-3" />
                <p className="text-white/50 text-sm">Loading transactions...</p>
              </div>
            ) : earningsHistory.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-white/10 rounded-xl bg-black/20">
                <svg className="w-10 h-10 text-white/20 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-white/40 text-sm">No transaction records found yet.</p>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-white/50 text-xs uppercase tracking-wider">
                        <th className="pb-3 font-semibold">Record ID</th>
                        <th className="pb-3 font-semibold">Source Channel</th>
                        <th className="pb-3 font-semibold">Amount</th>
                        <th className="pb-3 font-semibold">Settled Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {earningsHistory.map((record) => (
                        <tr key={record.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 text-white/80 font-mono text-xs">{record.id}</td>
                          <td className="py-4 font-semibold text-white">{record.source}</td>
                          <td className="py-4 text-emerald-400 font-bold">
                            +{currencySymbol(record.currency)} {record.amount.toFixed(2)}
                          </td>
                          <td className="py-4 text-white/60">
                            {new Date(record.createdAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10 text-sm text-white/60">
                    <span>
                      Showing Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:hover:bg-white/10 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:hover:bg-white/10 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Earnings;
