import React, { useState, useEffect } from "react";
import { BsBank, BsCreditCard } from "react-icons/bs";
import { useApi, WithdrawalRecord } from "../../../context/AppContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Withdraw: React.FC = () => {
  const { getProducerEarnings, withdrawEarnings, getWithdrawalsHistory } = useApi();
  const navigate = useNavigate();

  // Selected Options
  const [selectedMethod, setSelectedMethod] = useState<"bank" | "card" | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "GBP">("USD");

  // Balance & History states
  const [availableBalance, setAvailableBalance] = useState<number>(0);
  const [currencyCode, setCurrencyCode] = useState<string>("USD");
  const [withdrawalsHistory, setWithdrawalsHistory] = useState<WithdrawalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Bank Form Fields
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [sortCode, setSortCode] = useState("");
  const [iban, setIban] = useState("");

  // Card Form Fields
  const [cardNetwork, setCardNetwork] = useState<"Visa" | "Mastercard" | "AMEX">("Visa");
  const [last4, setLast4] = useState("");
  const [cardName, setCardName] = useState("");

  const countries = [
    "Nigeria",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
  ];

  const fetchWithdrawData = async () => {
    try {
      setLoading(true);
      const dashboard = await getProducerEarnings();
      if (dashboard) {
        setAvailableBalance(dashboard.currentEarning);
        setCurrencyCode(dashboard.currency || "USD");
      }
      const history = await getWithdrawalsHistory(1, 10);
      if (history && history.records) {
        setWithdrawalsHistory(history.records);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to load withdrawal details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawData();
  }, []);

  const handleSubmitWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod) {
      toast.error("Please select a withdrawal payment method.");
      return;
    }
    if (!selectedCountry) {
      toast.error("Please select your country of settlement.");
      return;
    }
    if (availableBalance <= 0) {
      toast.error("You have no available balance to withdraw.");
      return;
    }

    const payload: any = {
      method: selectedMethod === "bank" ? "bank_transfer" : "debit_card",
      country: selectedCountry,
      currency: selectedCurrency,
    };

    if (selectedMethod === "bank") {
      if (!bankName.trim() || !accountNumber.trim() || !accountName.trim()) {
        toast.error("Please fill in all required bank details.");
        return;
      }
      payload.bankDetails = {
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        accountName: accountName.trim(),
        ...(routingNumber.trim() ? { routingNumber: routingNumber.trim() } : {}),
        ...(sortCode.trim() ? { sortCode: sortCode.trim() } : {}),
        ...(iban.trim() ? { iban: iban.trim() } : {}),
      };
    } else {
      if (!cardName.trim() || last4.trim().length !== 4 || isNaN(Number(last4))) {
        toast.error("Please fill in valid card holder details and 4-digit Last 4.");
        return;
      }
      payload.cardDetails = {
        last4: last4.trim(),
        cardNetwork,
      };
    }

    try {
      setSubmitting(true);
      const res = await withdrawEarnings(payload);
      toast.success(res.message || "Withdrawal request submitted successfully!");
      // Reset form and reload
      setSelectedMethod(null);
      setSelectedCountry("");
      setBankName("");
      setAccountNumber("");
      setAccountName("");
      setRoutingNumber("");
      setSortCode("");
      setIban("");
      setLast4("");
      setCardName("");
      await fetchWithdrawData();
    } catch (err: any) {
      toast.error(err.message || "Withdrawal submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const getCurrencySymbol = (code: string) => {
    if (code === "GBP") return "£";
    return "$";
  };

  return (
    <div className="flex-1 flex flex-col p-6 md:p-12 min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#0d0d15] via-[#12121f] to-[#0d0d15] font-[Poppins] text-white overflow-y-auto">
      {/* Top Header */}
      <div className="flex justify-between items-center w-full max-w-5xl mx-auto mb-10">
        <h1 className="text-white font-bold text-2xl md:text-3xl lg:text-[32px] tracking-wide animate-fade-in">
          Withdraw Funds
        </h1>
        <button 
          onClick={() => navigate("/dashboard/earnings")}
          className="text-white/60 hover:text-white text-sm font-semibold flex items-center gap-2 cursor-pointer transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Earnings
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-t-emerald-500 border-white rounded-full animate-spin mb-4" />
          <p className="text-white/60">Loading withdrawal settings...</p>
        </div>
      ) : (
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side: Options & Form */}
            <form onSubmit={handleSubmitWithdrawal} className="lg:col-span-2 flex flex-col gap-6 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl animate-fade-in">
              <h2 className="text-white font-bold text-lg md:text-xl tracking-wide border-b border-white/5 pb-4">
                Withdrawal Settlement Request
              </h2>

              {/* Currency Selection */}
              <div className="flex flex-col gap-3">
                <span className="text-white/70 font-semibold text-sm">Select Base Currency</span>
                <div className="flex gap-4">
                  {(["USD", "GBP"] as const).map((curr) => (
                    <button
                      key={curr}
                      type="button"
                      onClick={() => setSelectedCurrency(curr)}
                      className={`flex-1 py-3 rounded-xl border text-sm font-bold tracking-wider transition-all duration-300 cursor-pointer ${
                        selectedCurrency === curr
                          ? "bg-purple-600/30 border-purple-500 text-white shadow-[0_4px_20px_rgba(147,51,234,0.2)]"
                          : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                      }`}
                    >
                      {curr === "USD" ? "USD ($)" : "GBP (£)"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Method Selection */}
              <div className="flex flex-col gap-3">
                <span className="text-white/70 font-semibold text-sm">Select Settlement Method</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Bank card */}
                  <div
                    onClick={() => setSelectedMethod("bank")}
                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border transition-all duration-300 ${
                      selectedMethod === "bank"
                        ? "bg-[#2e386b] border-emerald-500 shadow-lg"
                        : "bg-[#252530] border-white/10 hover:bg-[#2a2a35]"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-emerald-400">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <span className="text-white font-bold text-sm tracking-wide">Bank transfer</span>
                  </div>

                  {/* Debit card */}
                  <div
                    onClick={() => setSelectedMethod("card")}
                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border transition-all duration-300 ${
                      selectedMethod === "card"
                        ? "bg-[#2e386b] border-emerald-500 shadow-lg"
                        : "bg-[#252530] border-white/10 hover:bg-[#2a2a35]"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-emerald-400">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <span className="text-white font-bold text-sm tracking-wide">Debit Card</span>
                  </div>
                </div>
              </div>

              {/* Country Selection */}
              <div className="flex flex-col gap-3">
                <span className="text-white/70 font-semibold text-sm">Settlement Destination Country</span>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full bg-[#3a3a45] text-white/95 px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500 shadow-lg appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select settlement country</option>
                  {countries.map((c) => (
                    <option key={c} value={c} className="bg-[#1f1f29] text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bank Details Fields */}
              {selectedMethod === "bank" && (
                <div className="flex flex-col gap-4 border-t border-white/5 pt-4 animate-fade-in">
                  <h3 className="text-white/80 font-bold text-sm">Settlement Bank Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-white/55 text-xs">Bank Name *</span>
                      <input
                        type="text"
                        placeholder="e.g. GTBank"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="bg-[#242430] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-white/55 text-xs">Account Name *</span>
                      <input
                        type="text"
                        placeholder="e.g. John Doe"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        className="bg-[#242430] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <span className="text-white/55 text-xs">Account Number *</span>
                      <input
                        type="text"
                        placeholder="Enter bank account number"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="bg-[#242430] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-white/55 text-xs">Routing Number (Optional)</span>
                      <input
                        type="text"
                        placeholder="Routing transit code"
                        value={routingNumber}
                        onChange={(e) => setRoutingNumber(e.target.value)}
                        className="bg-[#242430] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-white/55 text-xs">Sort Code (Optional)</span>
                      <input
                        type="text"
                        placeholder="Bank sort code"
                        value={sortCode}
                        onChange={(e) => setSortCode(e.target.value)}
                        className="bg-[#242430] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <span className="text-white/55 text-xs">IBAN Number (Optional)</span>
                      <input
                        type="text"
                        placeholder="International bank account number"
                        value={iban}
                        onChange={(e) => setIban(e.target.value)}
                        className="bg-[#242430] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Debit Card Fields */}
              {selectedMethod === "card" && (
                <div className="flex flex-col gap-4 border-t border-white/5 pt-4 animate-fade-in">
                  <h3 className="text-white/80 font-bold text-sm">Settlement Card Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-white/55 text-xs">Cardholder Full Name *</span>
                      <input
                        type="text"
                        placeholder="e.g. John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="bg-[#242430] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-white/55 text-xs">Card Network *</span>
                      <select
                        value={cardNetwork}
                        onChange={(e: any) => setCardNetwork(e.target.value)}
                        className="bg-[#242430] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 appearance-none cursor-pointer"
                      >
                        <option value="Visa">Visa</option>
                        <option value="Mastercard">Mastercard</option>
                        <option value="AMEX">American Express</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <span className="text-white/55 text-xs">Debit Card Last 4 Digits *</span>
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="e.g. 4242"
                        value={last4}
                        onChange={(e) => setLast4(e.target.value)}
                        className="bg-[#242430] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Action */}
              {selectedMethod && selectedCountry && (
                <div className="w-full flex justify-end mt-4 pt-4 border-t border-white/5">
                  <button
                    type="submit"
                    disabled={submitting || availableBalance <= 0}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-sm md:text-base px-8 py-3.5 rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer tracking-wider flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Submit Withdrawal Request"
                    )}
                  </button>
                </div>
              )}
            </form>

            {/* Right side: Available Balance Display */}
            <div className="flex flex-col gap-6">
              <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900/60 border border-indigo-500/20 rounded-2xl p-6 shadow-2xl backdrop-blur-xl text-center">
                <span className="text-indigo-300 font-semibold text-sm uppercase tracking-wider mb-2 block">Available balance</span>
                <p className="text-white font-bold text-3xl md:text-4xl tracking-wider py-4">
                  {getCurrencySymbol(currencyCode)} {availableBalance.toFixed(2)}
                </p>
                <div className="text-xs text-white/50 leading-relaxed border-t border-white/5 pt-4">
                  All available earnings will be withdrawn upon submitting this request. Supported payout settlement base currencies: **USD and GBP**.
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-xl text-sm flex flex-col gap-4">
                <h3 className="text-white font-bold tracking-wide">Withdrawal Guideline</h3>
                <ul className="list-disc list-inside text-white/60 space-y-2 leading-relaxed">
                  <li>Minimum payout limit: **$0.01**</li>
                  <li>Settlements are verified and processed within 1-3 business days.</li>
                  <li>Card settlements are supported on standard Visa, Mastercard, and AMEX card networks.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Past Payout Settlements History */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl animate-fade-in">
            <h2 className="text-white font-bold text-lg md:text-xl tracking-wide mb-6">Past Payout Settlements History</h2>

            {withdrawalsHistory.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-white/10 rounded-xl bg-black/20">
                <svg className="w-10 h-10 text-white/20 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16V15m0 1v-4" />
                </svg>
                <p className="text-white/40 text-sm">No payout settlements recorded yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-white/50 text-xs uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Settlement ID</th>
                      <th className="pb-3 font-semibold">Amount</th>
                      <th className="pb-3 font-semibold">Payment Method</th>
                      <th className="pb-3 font-semibold">Destination</th>
                      <th className="pb-3 font-semibold">Settled Status</th>
                      <th className="pb-3 font-semibold">Requested Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {withdrawalsHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 text-white/80 font-mono text-xs">{item.id}</td>
                        <td className="py-4 text-white font-bold">
                          {getCurrencySymbol(item.currency)} {item.amount.toFixed(2)}
                        </td>
                        <td className="py-4 capitalize text-white/80">{item.method.replace("_", " ")}</td>
                        <td className="py-4 text-white/80">{item.country}</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            item.status === "completed" || item.status === "approved"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : item.status === "failed"
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 text-white/60">
                          {new Date(item.createdAt).toLocaleDateString(undefined, {
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Withdraw;
