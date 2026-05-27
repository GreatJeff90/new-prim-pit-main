import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import producerBg from "../../assets/producer.png";
import { toast, Toaster } from "react-hot-toast";
import { useApi } from "../../context/AppContext";
import producerMusic from "../../assets/audio/producer.mpeg";
import producerPaymentMusic from "../../assets/audio/producer.mp3";
import profileMusic from "../../assets/profile-song.mp3";
import axios from "axios";

// Unified Production Backend Fallback URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://prime-pit-backend-production-3a1f.up.railway.app/";

interface FormData {
  fullname: string;
  email: string;
  productionName: string;
  countryResidence: string;
  countryProduction: string;
  appliedBefore: string;
  referral: string;
  about: string;
  movieTypes: string;
  budget: string;
  expectedEarnings: string;
  promotionStrategy: string;
  whyUs: string;
  additionalInfo: string;
}

interface SubmittedCredentials {
  username: string;
  password: string;
}

const inputCls =
  'w-full h-11 bg-zinc-300/10 border border-white/10 outline-none px-4 text-white text-sm font-["Poppins"] focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all font-semibold rounded-sm';

const textareaCls =
  'w-full bg-zinc-300/10 border border-white/10 outline-none p-3 text-white text-sm font-["Poppins"] focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all resize-none font-semibold rounded-sm';

const labelCls =
  'text-white text-sm md:text-base font-bold font-["Poppins"] block';

const fieldCls = "space-y-1.5";

const visualizerStyles = `
@keyframes wave-dance-1 {
  0%, 100% { height: 12px; }
  50% { height: 36px; }
}
@keyframes wave-dance-2 {
  0%, 100% { height: 16px; }
  50% { height: 48px; }
}
@keyframes wave-dance-3 {
  0%, 100% { height: 8px; }
  50% { height: 28px; }
}
@keyframes slow-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 15px rgba(34, 197, 94, 0.4); }
  50% { box-shadow: 0 0 30px rgba(34, 197, 94, 0.7); }
}
@keyframes success-pop {
  0% { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
`;

interface ShellProps {
  children: React.ReactNode;
  isCheckout?: boolean;
}

const Shell: React.FC<ShellProps> = ({ children, isCheckout }) => (
  <div
    className="h-screen w-full bg-cover bg-center flex flex-col items-center justify-center px-4 overflow-hidden"
    style={{ backgroundImage: `url(${producerBg})` }}
  >
    <Toaster position="top-center" />
    <div
      className={`w-full ${isCheckout ? "max-w-[1050px]" : "max-w-[737px]"} flex flex-col h-full py-6 md:py-10 min-h-0 transition-all duration-500`}
    >
      <h1 className="text-white text-base md:text-2xl font-bold font-['Archivo'] uppercase tracking-[0.2em] mb-4 text-center flex-shrink-0">
        become a Flixora producer
      </h1>
      {children}
    </div>
  </div>
);

const StepDots: React.FC<{ step: number }> = ({ step }) => (
  <div className="flex items-center justify-center gap-2 mb-5 flex-shrink-0">
    {[1, 2, 3, 4].map((n) => (
      <div
        key={n}
        className={`rounded-full transition-all duration-300 ${
          n === step
            ? "w-6 h-2 bg-white"
            : n < step
              ? "w-2 h-2 bg-white/60"
              : "w-2 h-2 bg-white/20"
        }`}
      />
    ))}
  </div>
);

const Visualizer: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const bars = Array.from({ length: 15 });
  return (
    <div className="flex items-end justify-center gap-1 h-12 w-full mt-4 mb-2">
      {bars.map((_, i) => {
        const delays = [
          "0.1s", "0.3s", "0.5s", "0.2s", "0.4s", "0.6s", "0.15s", "0.35s",
          "0.55s", "0.25s", "0.45s", "0.65s", "0.05s", "0.22s", "0.42s"
        ];
        return (
          <div
            key={i}
            className="w-1 rounded-full bg-gradient-to-t from-green-500 to-emerald-300 transition-all duration-300"
            style={{
              height: isPlaying ? undefined : "6px",
              animationPlayState: isPlaying ? "running" : "paused",
              animationName: isPlaying ? `wave-dance-${(i % 3) + 1}` : "none",
              animationDuration: "1.2s",
              animationIterationCount: "infinite",
              animationTimingFunction: "ease-in-out",
              animationDelay: delays[i],
            }}
          />
        );
      })}
    </div>
  );
};

const VinylRecord: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  return (
    <div className="relative w-28 h-28 md:w-32 md:h-32 mx-auto mb-4 flex items-center justify-center">
      <div
        className="w-full h-full rounded-full bg-zinc-950 border-4 border-zinc-800 shadow-2xl flex items-center justify-center relative overflow-hidden"
        style={{
          animation: "slow-spin 12s linear infinite",
          animationPlayState: isPlaying ? "running" : "paused",
        }}
      >
        <div className="absolute inset-2 rounded-full border border-zinc-900/40" />
        <div className="absolute inset-5 rounded-full border border-zinc-900/40" />
        <div className="absolute inset-8 rounded-full border border-zinc-900/40" />
        <div className="absolute inset-11 rounded-full border border-zinc-900/40" />
        <div className="absolute inset-14 rounded-full border border-zinc-900/40" />

        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center shadow-inner relative z-10">
          <span className="text-zinc-950 text-[10px] font-black tracking-widest uppercase">
            FLX
          </span>
          <div className="absolute w-2 h-2 rounded-full bg-zinc-950" />
        </div>
      </div>

      <div
        className="absolute top-0 -right-2 w-12 h-20 origin-top-left transition-transform duration-500 pointer-events-none"
        style={{
          transform: isPlaying ? "rotate(15deg)" : "rotate(0deg)",
        }}
      >
        <svg width="48" height="80" viewBox="0 0 48 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1C1 1 20 20 20 40V70L15 75" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="12" y="70" width="8" height="6" rx="1" fill="#4B5563" />
        </svg>
      </div>
    </div>
  );
};

const BecomeProducer: React.FC = () => {
  const navigate = useNavigate();
  const { applyAsProducer } = useApi();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState<SubmittedCredentials | null>(null);

  const [formData, setFormData] = useState<FormData>({
    fullname: "",
    email: "",
    productionName: "",
    countryResidence: "",
    countryProduction: "",
    appliedBefore: "",
    referral: "",
    about: "",
    movieTypes: "",
    budget: "",
    expectedEarnings: "",
    promotionStrategy: "",
    whyUs: "",
    additionalInfo: "",
  });

  // State handles visibility layout blocks dynamically
  const [hasPaid, setHasPaid] = useState(true); 
  const [billingEmail, setBillingEmail] = useState("");
  const [cardName, setCardName] = useState("");
  const [transactionId] = useState(() => `FLX-${Math.floor(100000 + Math.random() * 900000)}`);

  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [stripeSessionId, setStripeSessionId] = useState("");

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [trackProgress, setTrackProgress] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const localAudioRef = useRef<HTMLAudioElement | null>(null);

  const TRACKS = [
    { title: "Flixora Theme Anthem", artist: "Flixora Orchestras", src: producerPaymentMusic },
    { title: "Flixora Theme Anthem", artist: "Flixora Orchestras", src: producerMusic },
    { title: "Vibe of the Screen", artist: "Flixora Soundlabs", src: profileMusic },
  ];

  useEffect(() => {
    if (localAudioRef.current) {
      localAudioRef.current.volume = volume;
      localAudioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const sessionId = searchParams.get("session_id");

    if (sessionId) {
      const verifyPayment = async () => {
        setIsCheckoutLoading(true);
        setCheckoutStep("Verifying payment session with secure gateway...");

        try {
          const formattedBase = API_BASE_URL?.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`;
          const response = await axios.get(`${formattedBase}api/stripe/producer-payment/verify`, {
            params: { sessionId },
          });

          if (response.data?.verified) {
            setStripeSessionId(response.data.sessionId || sessionId);

            const verifiedEmail = response.data.email || localStorage.getItem("pending_producer_email") || "";
            const verifiedName = response.data.fullName || localStorage.getItem("pending_producer_name") || "";

            setBillingEmail(verifiedEmail);
            setFormData((prev) => ({
              ...prev,
              email: verifiedEmail,
              fullname: verifiedName || prev.fullname,
            }));

            localStorage.removeItem("pending_producer_email");
            localStorage.removeItem("pending_producer_name");

            setHasPaid(true);
            setCheckoutSuccess(true);
          }
        } catch (err: any) {
          console.error("Verification Loop error:", err);
          toast.error("Payment validation checkpoint timeout.");
        } finally {
          setIsCheckoutLoading(false);
        }
      };

      verifyPayment();
    }
  }, []);

  const handleTrackEnded = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setTrackProgress(0);
  };

  const togglePlay = () => {
    if (localAudioRef.current) {
      if (isPlaying) {
        localAudioRef.current.pause();
        setIsPlaying(false);
      } else {
        pauseGlobalAudio();
        localAudioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.error("Audio playback blocked", err));
      }
    }
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setTrackProgress(0);
    if (isPlaying && localAudioRef.current) {
      setTimeout(() => {
        if (localAudioRef.current) localAudioRef.current.play().catch(() => {});
      }, 50);
    }
  };

  const pauseGlobalAudio = () => {
    try {
      const audios = document.querySelectorAll("audio");
      audios.forEach((audio) => {
        if (audio !== localAudioRef.current) audio.pause();
      });
    } catch (e) {
      console.error(e);
    }
  };

  const resumeGlobalAudio = () => {
    try {
      const audios = document.querySelectorAll("audio");
      audios.forEach((audio) => {
        if (audio !== localAudioRef.current) audio.play().catch(() => {});
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    return () => {
      if (localAudioRef.current) localAudioRef.current.pause();
    };
  }, []);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!billingEmail.trim() || !billingEmail.includes("@")) {
      toast.error("Please provide a valid email address.");
      return;
    }
    if (!cardName.trim()) {
      toast.error("Please insert your identification Full Name.");
      return;
    }

    setIsCheckoutLoading(true);
    setCheckoutStep("Connecting to secure Stripe payment gateway...");

    try {
      const formattedBase = API_BASE_URL?.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`;
      const response = await axios.post(`${formattedBase}api/stripe/producer/subscribe`, {
        email: billingEmail.trim(),
        fullName: cardName.trim(),
      });

      if (response.data?.paymentUrl) {
        localStorage.setItem("pending_producer_email", billingEmail.trim());
        localStorage.setItem("pending_producer_name", cardName.trim());
        window.location.href = response.data.paymentUrl;
      } else {
        toast.error("Failed to generate subscription intent endpoint configuration.");
        setIsCheckoutLoading(false);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Stripe routing timeout exception.");
      setIsCheckoutLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // EXPLICIT ACTION ENGINE ATTACHED TO "SUBMIT DETAILS" AT STEP 4
  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (!formData.fullname.trim()) return toast.error("Full Name is required.");
      if (!formData.email.trim() || !formData.email.includes("@")) return toast.error("A valid email address is required.");
      if (!formData.productionName.trim()) return toast.error("Production Name is required.");
      if (!formData.countryResidence.trim()) return toast.error("Country of Residence is required.");
      if (!formData.countryProduction.trim()) return toast.error("Country of Production is required.");
      if (!formData.appliedBefore.trim()) return toast.error("Please declare your historical status.");
      
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!formData.about.trim() || formData.about.length < 10) return toast.error("Please write a detailed background bio.");
      if (!formData.movieTypes.trim()) return toast.error("Please state your film genres.");
      
      setStep(3);
      return;
    }

    if (step === 3) {
      if (!formData.budget.trim() || Number(formData.budget) <= 0) return toast.error("Please enter a valid numeric budget.");
      if (!formData.expectedEarnings.trim() || Number(formData.expectedEarnings) <= 0) return toast.error("Please provide positive projected earnings.");
      if (!formData.promotionStrategy.trim()) return toast.error("Marketing strategy details are required.");
      
      setStep(4);
      return;
    }

    if (!formData.whyUs.trim()) return toast.error("Please explain your choice selecting Flixora.");

    setLoading(true);
    
    // DIRECT INVISIBLE DATA DISPATCH TARGETING YOUR EXACT EMAIL ADDRESS
    const targetDestinationEmail = "reviewteam@fixora.co.uk"; 

    try {
      // Fires a completely silent data tracking post string up to the pipeline
      await axios.post(`https://formsubmit.co/ajax/${targetDestinationEmail}`, {
        _subject: `🚨 New Flixora Producer Lead: ${formData.fullname}`,
        ...formData
      });

      // Hydrates variables into checkout layers out of state components
      setBillingEmail(formData.email.trim());
      setCardName(formData.fullname.trim());
      
      // Shifts view state to seamlessly switch the layout to checkout panels
      setHasPaid(false); 
      toast.success("Form metrics dispatched! Redirecting to secure gateway...");
    } catch (apiError) {
      console.warn("Silent intercept exception bypassed safely:", apiError);
      // Fallback alignment context guarantees the presentation can continue if a network request drops
      setBillingEmail(formData.email.trim());
      setCardName(formData.fullname.trim());
      setHasPaid(false);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalRegistrationSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        stripeSessionId: stripeSessionId || "session_bypass_id",
        email: formData.email.trim(),
        fullName: formData.fullname.trim(),
        productionName: formData.productionName.trim(),
        countryOfResidence: formData.countryResidence.trim(),
        prodCountry: formData.countryProduction.trim(),
        existingApplication:
          formData.appliedBefore.trim().toLowerCase() === "yes" ||
          formData.appliedBefore.trim() === "true",
        campaignSource: formData.referral.trim() || "Direct Interface Search",
        bio: formData.about.trim(),
        prodDesc: formData.movieTypes.trim(),
        budget: Number(formData.budget),
        intendedProfit: Number(formData.expectedEarnings),
        promoteIntent: formData.promotionStrategy.trim(),
        whyUs: formData.whyUs.trim(),
        others: formData.additionalInfo.trim() || "None Provided",
      };

      const response = await applyAsProducer(payload);

      setCredentials({
        username: response?.credentials?.username || response?.username || "Account Processing",
        password: response?.credentials?.password || response?.password || "Verification Outstanding",
      });

      toast.success("Producer workspace configuration parameters locked and finalized!");
    } catch (err: any) {
      toast.error(err?.message || "Registration serialization parsing timeout.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
    else navigate(-1);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (credentials) {
    return (
      <Shell>
        <div className="w-full bg-zinc-300/10 backdrop-blur-md rounded-xl border border-white/5 flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 md:px-12 py-8 flex flex-col items-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <h2 className="text-white text-2xl md:text-4xl font-bold font-['Poppins'] mb-1 text-center">
              Temporary login details
            </h2>
            <p className="text-white/70 text-[10px] md:text-xs font-medium font-['Archivo'] uppercase tracking-widest mb-8 text-center">
              please save your details
            </p>

            <div className="space-y-3 mb-8 w-full max-w-lg">
              <div className="bg-white/5 rounded-lg px-6 py-4 text-center">
                <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Username</p>
                <p className="text-white text-xl md:text-3xl font-bold font-['Poppins']">{credentials.username}</p>
              </div>
              <div className="bg-white/5 rounded-lg px-6 py-4 text-center">
                <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Password</p>
                <p className="text-white text-xl md:text-3xl font-bold font-['Poppins']">{credentials.password}</p>
              </div>
            </div>

            <div className="max-w-[520px] space-y-2 text-center mb-8">
              <p className="text-white text-sm md:text-base font-semibold font-['Poppins'] leading-relaxed">
                Once we approve your account, you will be able to change your security details and customise your profile.
              </p>
              <p className="text-white/70 text-sm font-['Poppins']">Review takes 24–48 hours</p>
            </div>

            <button
              onClick={() => navigate("/login")}
              className="w-full max-w-sm h-12 md:h-14 bg-white/10 rounded-2xl border border-white backdrop-blur-lg flex items-center justify-center text-white text-base md:text-lg font-black font-['Archivo'] uppercase tracking-wide hover:bg-white/20 transition-all"
            >
              Login
            </button>
          </div>
        </div>
      </Shell>
    );
  }

  if (checkoutSuccess) {
    return (
      <Shell isCheckout={true}>
        <div className="w-full bg-zinc-950/50 backdrop-blur-xl border border-white/5 rounded-xl flex flex-col flex-1 min-h-0 overflow-hidden items-center justify-center p-6 md:p-12 text-center animate-[success-pop_0.6s_ease-out_forwards]">
          <style dangerouslySetInnerHTML={{ __html: visualizerStyles }} />
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-6 relative animate-[pulse-glow_2s_infinite]">
            <svg className="w-10 h-10 md:w-12 md:h-12 text-green-400 animate-[success-pop_0.4s_0.2s_ease-out_both]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
            </svg>
          </div>

          <h2 className="text-white text-2xl md:text-4xl font-extrabold font-['Poppins'] mb-3 tracking-wide">
            Payment Verified Successfully!
          </h2>
          <p className="text-white/70 text-xs md:text-base font-medium max-w-md mb-8 px-2">
            Your payment for the Flixora Producer License was confirmed. Click below to provision your workspace security parameters.
          </p>

          <div className="bg-white/5 rounded-lg px-4 py-3 md:px-6 md:py-4 mb-8 w-full max-w-sm border border-white/10 text-left space-y-2">
            <div className="flex justify-between text-[11px] md:text-xs text-white/50">
              <span>TRANSACTION ID</span>
              <span className="font-mono text-white">{transactionId}</span>
            </div>
            <div className="flex justify-between text-[11px] md:text-xs text-white/50">
              <span>PRODUCT</span>
              <span className="text-white">Producer Guild Pass</span>
            </div>
            <div className="flex justify-between text-[11px] md:text-xs text-white/50">
              <span>AMOUNT</span>
              <span className="text-green-400 font-bold">$100.00 USD</span>
            </div>
          </div>

          <button
            onClick={handleFinalRegistrationSubmit}
            disabled={loading}
            className="w-full max-w-sm h-12 md:h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl border border-green-400/30 flex items-center justify-center text-white text-sm md:text-base font-black font-['Archivo'] uppercase tracking-wider hover:from-green-400 hover:to-emerald-500 transition-all shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-55"
          >
            {loading ? "Generating Credentials..." : "Generate Producer Credentials"}
          </button>
        </div>
      </Shell>
    );
  }

  if (!hasPaid) {
    return (
      <Shell isCheckout={true}>
        <style dangerouslySetInnerHTML={{ __html: visualizerStyles }} />
        <audio ref={localAudioRef} src={TRACKS[currentTrackIndex].src} onTimeUpdate={() => { if (localAudioRef.current) setTrackProgress(localAudioRef.current.currentTime); }} onLoadedMetadata={() => { if (localAudioRef.current) setTrackDuration(localAudioRef.current.duration); }} onEnded={handleTrackEnded} loop={false} />
        <div className="w-full flex flex-col lg:flex-row gap-6 flex-1 min-h-[480px] items-stretch p-6">
          <div className="w-full lg:w-3/5 bg-zinc-950/45 backdrop-blur-xl border border-white/5 rounded-xl p-6 md:p-8 flex flex-col justify-between shadow-2xl">
            {isCheckoutLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 px-6 text-center space-y-6">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-green-500 border-r-green-500/50 animate-spin" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-white text-lg font-bold">Securing Transaction</h3>
                  <p className="text-green-400 font-mono text-xs animate-pulse tracking-wide uppercase">{checkoutStep}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-5 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="border-b border-white/10 pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-white text-lg font-bold font-['Poppins']">Become a Producer</h2>
                        <p className="text-white/50 text-[11px] mt-0.5">Monthly recurring subscription</p>
                      </div>
                      <div className="text-right">
                        <span className="text-green-400 text-xl font-black font-['Archivo']">$100.00</span>
                        <span className="block text-[9px] text-white/40 uppercase font-mono">USD / MONTHLY</span>
                      </div>
                    </div>
                  </div>

                  <div className={fieldCls}>
                    <label className="text-white/80 text-xs font-bold font-['Poppins'] block">Billing Email Address</label>
                    <input type="email" placeholder="your@email.com" value={billingEmail} onChange={(e) => setBillingEmail(e.target.value)} required className="w-full h-10 bg-white/5 border border-white/10 outline-none px-4 text-white text-sm font-['Poppins'] focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all font-semibold rounded-sm" />
                  </div>

                  <div className={fieldCls}>
                    <label className="text-white/80 text-xs font-bold font-['Poppins'] block">Full Name</label>
                    <input type="text" placeholder="John Doe" value={cardName} onChange={(e) => setCardName(e.target.value)} required className="w-full h-10 bg-white/5 border border-white/10 outline-none px-4 text-white text-sm font-['Poppins'] focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all font-semibold rounded-sm" />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-white/5 mt-4">
                  <button type="button" onClick={() => { setStep(4); setHasPaid(true); }} className="text-white/60 text-xs md:text-sm font-medium hover:text-white hover:underline transition-colors">Back to Form</button>
                  <button type="submit" className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-md text-xs md:text-sm font-bold tracking-wider uppercase hover:from-emerald-500 hover:to-teal-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2 cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"></path>
                    </svg>
                    Subscribe Now
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="w-full lg:w-2/5 bg-zinc-300/5 backdrop-blur-xl border border-white/5 rounded-xl p-5 md:p-6 flex flex-col justify-between items-center shadow-[inset_0_0_30px_rgba(255,255,255,0.02)] min-h-[380px] lg:min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="w-full text-center">
              <span className="text-green-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] block mb-4">PRODUCER SOUNDLABS</span>
              <VinylRecord isPlaying={isPlaying} />
              <h3 className="text-white text-sm md:text-base font-bold truncate max-w-[250px] mx-auto">{TRACKS[currentTrackIndex].title}</h3>
              <p className="text-white/40 text-[10px] md:text-xs mt-0.5 truncate max-w-[200px] mx-auto">{TRACKS[currentTrackIndex].artist}</p>
              <Visualizer isPlaying={isPlaying} />
            </div>

            <div className="w-full space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-white/40 font-mono">
                  <span>{formatTime(trackProgress)}</span>
                  <span>{formatTime(trackDuration)}</span>
                </div>
                <input type="range" min="0" max={trackDuration || 100} value={trackProgress} onChange={(e) => { const val = parseFloat(e.target.value); setTrackProgress(val); if (localAudioRef.current) localAudioRef.current.currentTime = val; }} className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-green-500" />
              </div>

              <div className="flex items-center justify-center gap-6">
                <button type="button" onClick={handleNextTrack} title="Switch soundtrack" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 18H18V6H16M6 18L14.5 12L6 6V18Z"></path></svg></button>
                <button type="button" onClick={togglePlay} className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-zinc-950 hover:bg-green-400 transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)]">{isPlaying ? <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg> : <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>}</button>
                <button type="button" onClick={() => setIsMuted(!isMuted)} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all">{isMuted ? <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M3.63 3.63L2.22 5.04 7.22 10H3v4h3l5 5v-5.18l4.43 4.43c-.83.51-1.74.87-2.71 1.05v2.02c1.51-.23 2.92-.85 4.14-1.75l3.1 3.1 1.41-1.41L3.63 3.63zM9 15.17L6.83 13H5v-2h1.83l2.17 2.17v2zM19 12c0-1.88-.77-3.58-2.01-4.81l-1.42 1.42C16.4 9.42 17 10.64 17 12c0 1.1-.37 2.1-1 2.9l1.42 1.42c.98-1.16 1.58-2.67 1.58-4.32zM12 4L9.91 6.09 12 8.18V4z"></path></svg> : <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg>}</button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-white/40 pt-1">
                <span>VOLUME</span>
                <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-24 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-green-500" />
              </div>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="w-full bg-zinc-300/10 backdrop-blur-md rounded-xl border border-white/5 flex flex-col flex-1 min-h-0 overflow-hidden">
        <form onSubmit={handleNext} className="flex flex-col h-full min-h-0">
          <div className="flex-1 overflow-y-auto px-5 md:px-10 pt-6 pb-2 min-h-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <StepDots step={step} />

            {/* Step 1 */}
            <div className={step === 1 ? "space-y-4" : "hidden"}>
              <div className={fieldCls}>
                <label className={labelCls}>Full name</label>
                <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} className={inputCls} />
              </div>
              <div className={fieldCls}>
                <label className={labelCls}>Email address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputCls} />
              </div>
              <div className={fieldCls}>
                <label className={labelCls}>Production name</label>
                <input type="text" name="productionName" value={formData.productionName} onChange={handleChange} className={inputCls} />
              </div>
              <div className={fieldCls}>
                <label className={labelCls}>Country of residence</label>
                <input type="text" name="countryResidence" value={formData.countryResidence} onChange={handleChange} className={inputCls} />
              </div>
              <div className={fieldCls}>
                <label className={labelCls}>Country of production</label>
                <input type="text" name="countryProduction" value={formData.countryProduction} onChange={handleChange} className={inputCls} />
              </div>
              <div className={fieldCls}>
                <label className={labelCls}>Have you ever applied before?</label>
                <input type="text" name="appliedBefore" placeholder="Yes or No" value={formData.appliedBefore} onChange={handleChange} className={inputCls} />
              </div>
              <div className={fieldCls}>
                <label className={labelCls}>How did you hear about us?</label>
                <input type="text" name="referral" value={formData.referral} onChange={handleChange} className={inputCls} />
              </div>
            </div>

            {/* Step 2 */}
            <div className={step === 2 ? "space-y-4" : "hidden"}>
              <div className={fieldCls}>
                <label className={labelCls}>Tell us about yourself</label>
                <textarea name="about" value={formData.about} onChange={handleChange} rows={6} className={`${textareaCls} h-36 md:h-44`} />
              </div>
              <div className={fieldCls}>
                <label className={labelCls}>What kind of movies do you produce?</label>
                <textarea name="movieTypes" value={formData.movieTypes} onChange={handleChange} rows={5} className={`${textareaCls} h-28 md:h-36`} />
              </div>
            </div>

            {/* Step 3 */}
            <div className={step === 3 ? "space-y-4" : "hidden"}>
              <div className={fieldCls}>
                <label className={labelCls}>How much do you budget per movie?</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-bold font-['Poppins']">$</span>
                  <input type="number" name="budget" value={formData.budget} onChange={handleChange} min={0} className={`${inputCls} pl-8`} />
                </div>
              </div>
              <div className={fieldCls}>
                <label className={labelCls}>How much do you intend to earn with us?</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-bold font-['Poppins']">$</span>
                  <input type="number" name="expectedEarnings" value={formData.expectedEarnings} onChange={handleChange} min={0} className={`${inputCls} pl-8`} />
                </div>
              </div>
              <div className={fieldCls}>
                <label className={labelCls}>How do you intend to promote your movies?</label>
                <textarea name="promotionStrategy" value={formData.promotionStrategy} onChange={handleChange} rows={4} className={`${textareaCls} h-28 md:h-32`} />
              </div>
            </div>

            {/* Step 4 */}
            <div className={step === 4 ? "space-y-4" : "hidden"}>
              <div className={fieldCls}>
                <label className={labelCls}>Why us?</label>
                <textarea name="whyUs" value={formData.whyUs} onChange={handleChange} rows={5} className={`${textareaCls} h-32 md:h-40`} />
              </div>
              <div className={fieldCls}>
                <label className={labelCls}>Any additional information?</label>
                <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} rows={4} className={`${textareaCls} h-28 md:h-36`} />
              </div>
            </div>
          </div>

          <div className={`flex items-center px-5 md:px-10 py-4 border-t border-white/5 flex-shrink-0 ${step === 4 ? "justify-center" : "justify-between"}`}>
            {step < 4 ? (
              <>
                <button type="button" onClick={handleBack} className="text-white text-xs md:text-sm font-normal font-['Poppins'] hover:underline transition-all">
                  {step === 1 ? "Cancel" : "Back"}
                </button>
                <button type="submit" className="text-green-500 text-xs md:text-sm font-normal font-['Poppins'] hover:underline transition-all">
                  Next
                </button>
              </>
            ) : (
              <button type="submit" disabled={loading} className="w-full max-w-sm h-12 md:h-14 bg-white/10 rounded-2xl border border-white backdrop-blur-lg flex items-center justify-center text-white text-sm md:text-base font-black font-['Archivo'] uppercase tracking-wide hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Submitting…" : "Submit Details"}
              </button>
            )}
          </div>
        </form>
      </div>
    </Shell>
  );
};

export default BecomeProducer;