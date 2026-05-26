import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaInstagram, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { DiApple } from "react-icons/di";
import { ImWindows8 } from "react-icons/im";
import { RiTwitterXFill } from "react-icons/ri";
import NiaraImg from "../../assets/naira-sign.png";
import Hero1 from "../../assets/heros.jpg";
import Hero2 from "../../assets/hero2.png";
import Hero3 from "../../assets/hero3.png";
import Hero4 from "../../assets/hero4.png";
import KloutoImg from "../../assets/klouto.png";
import GoldenImg from "../../assets/golden-number.png";
import CasinoImg from "../../assets/casino.jpg";
import DominanceImg from "../../assets/domimion.jpg";
import HeartImg from "../../assets/heart.png";
import SignupModal from "../signup/SignUpModal";
import InterestsModal from "../signup/InterestsModal";
import LoginModal from "../login/LoginModal";
import ForgotPasswordModal from "../login/ForgotPasswordModal";
import ResetPasswordModal from "../login/ResetPasswordModal";
import { useApi } from "../../context/AppContext";
import PcWarningModal from "../modals/PcWarningModal";

interface Slide {
  heading: string;
  subHeading: string;
  bgImage: string;
}

interface Card {
  _id: string;
  title: string;
  description: string;
  image: string;
  status: "available" | "coming soon";
}

const Hero = () => {
  const [userName, setUserName] = useState("");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showInterestsModal, setShowInterestsModal] = useState(false);
  const [showPcModal, setShowPcModal] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [cardData, setCardData] = useState<Card[]>([]);

  const navigate = useNavigate();
  const {
    initializeSubscriptionCard,
    pendingSubscription,
    setPendingSubscription,
    setIsAuthFlowActive,
    getPremiers,
  } = useApi();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsAuthFlowActive(
      showSignupModal ||
        showLoginModal ||
        showForgotModal ||
        showResetModal ||
        showInterestsModal,
    );
  }, [
    showSignupModal,
    showLoginModal,
    showForgotModal,
    showResetModal,
    showInterestsModal,
    setIsAuthFlowActive,
  ]);

  const sliderData: Slide[] = [
    {
      heading: "Join the ultimate streaming experience",
      subHeading: "Dive into Epic Blockbusters",
      bgImage: Hero1,
    },
    {
      heading: "Join the ultimate streaming experience",
      subHeading: "All movie genres, that would make you glued to the screen",
      bgImage: Hero2,
    },
    {
      heading: "Join the ultimate streaming experience",
      subHeading: "Action cartoons/ amination for all it’s lovers",
      bgImage: Hero3,
    },
    {
      heading: "Join the ultimate streaming experience",
      subHeading: "Join our producers network to earn from your movies",
      bgImage: Hero4,
    },
  ];

  // const cardData: Card[] = [
  //   {
  //     title: "The golden number",
  //     description:
  //       "This is a game that rewards you with cash prizes when you hit a golden number",
  //     image: GoldenImg,
  //     status: "coming soon",
  //   },
  //   {
  //     title: "PREMIER STORM",
  //     description: "AN EASY PLAY TO WIN GAME WITH FRIENDS. PLAY SMALL WIN BIG",
  //     image: CasinoImg,
  //     status: "coming soon",
  //   },
  //   {
  //     title: "DOMINATRIX X",
  //     description:
  //       "Highly rated erotic game, as you unveil the true sexual desires of the body.",
  //     image: DominanceImg,
  //     status: "coming soon",
  //   },
  //   {
  //     title: "DOMINATRIX X",
  //     description:
  //       "Highly rated erotic game, as you unveil the true sexual desires of the body.",
  //     image: DominanceImg,
  //     status: "coming soon",
  //   },
  //   {
  //     title: "DOMINATRIX X",
  //     description:
  //       "Highly rated erotic game, as you unveil the true sexual desires of the body.",
  //     image: DominanceImg,
  //     status: "coming soon",
  //   },
  // ];

  useEffect(() => {
    const fetchPremierCards = async () => {
      try {
        const response = await getPremiers(1, 10);

        if (!response?.data) return;

        const formattedCards: Card[] = response.data.map((movie) => ({
          _id: movie._id,
          title: movie.title,
          description:
            movie.synopsis ||
            movie.tagline ||
            "Upcoming exclusive premier movie",
          image: movie.posterImage || movie.backdropImage,
          status: "coming soon",
        }));

        setCardData(formattedCards);
      } catch (error) {
        console.error("Failed to fetch premier cards:", error);
      }
    };

    fetchPremierCards();
  }, [getPremiers]);

  useEffect(() => {
    const storedFullName = sessionStorage.getItem("fullname");
    const loggedIn = localStorage.getItem("isLoggedIn");

    if (loggedIn === "true" && storedFullName) {
      setIsLoggedIn(true);
      setUserName(storedFullName);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % sliderData.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [sliderData.length]);

  useEffect(() => {
    if (isLoggedIn && pendingSubscription) {
      const executePendingPayment = async () => {
        try {
          setIsSubscribing(true);
          const email = sessionStorage.getItem("email") || "";
          const response = await initializeSubscriptionCard(email);

          if (response?.paymentUrl) {
            window.location.href = response.paymentUrl;
          }
        } catch (error) {
          console.error("Payment error:", error);
        } finally {
          // setIsSubscribing(false);
          // setPendingSubscription(null);
        }
      };

      executePendingPayment();
    }
  }, [
    isLoggedIn,
    pendingSubscription,
    initializeSubscriptionCard,
    setPendingSubscription,
  ]);

  const closeAllModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
    setShowForgotModal(false);
    setShowResetModal(false);
  };

  const handleSignupSuccess = () => {
    setShowSignupModal(false);
    setTimeout(() => {
      setShowInterestsModal(true);
    }, 500);

    const storedFullName = sessionStorage.getItem("fullname");
    if (storedFullName) {
      setIsLoggedIn(true);
      setUserName(storedFullName);
    }
  };

  const handleInterestsComplete = (interests: string[]) => {
    console.log("User interests selected:", interests);
    setShowInterestsModal(false);
  };

  const handleSubscribeClick = async () => {
    if (!isLoggedIn) {
      setPendingSubscription({ email: "" });
      setShowSignupModal(true);
      return;
    }

    try {
      setIsSubscribing(true);
      const email = sessionStorage.getItem("email") || "";
      const response = await initializeSubscriptionCard(email);

      if (response?.paymentUrl) {
        window.location.href = response.paymentUrl;
      }
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setIsSubscribing(false);
    }
  };

  const currentSlide = sliderData[currentSlideIndex];

  return (
    <div className="w-full min-h-screen text-white flex flex-col relative overflow-hidden">
      {/* Background Slides */}
      {sliderData.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
            index === currentSlideIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${slide.bgImage})`,
            zIndex: 0,
          }}
        >
          <div
            className="absolute inset-0 bg-black bg-opacity-30"
            style={{
              backdropFilter:
                showSignupModal || showInterestsModal || showLoginModal
                  ? "blur(4px)"
                  : "none",
              WebkitBackdropFilter:
                showSignupModal || showInterestsModal || showLoginModal
                  ? "blur(4px)"
                  : "none",
            }}
          ></div>
        </div>
      ))}

      {/* Foreground Content */}
      <div className="flex-1 relative z-10 p-8">
        <div className="max-w-3xl mt-[100px] md:mt-[200px] flex flex-col items-center md:items-start text-center md:text-left mx-auto md:mx-0">
          {isLoggedIn && userName && (
            <h4 className="text-xl mb-4 w-full text-center md:text-left">
              Welcome, {userName}!
            </h4>
          )}
          <h5 className="text-sm md:text-xl font-normal uppercase mb-3 md:mb-6 tracking-wide">
            {currentSlide.heading}
          </h5>
          <h2
            className={`font-bold uppercase mb-6 tracking-wide leading-none ${
              currentSlideIndex === 1
                ? "text-3xl md:text-4xl"
                : currentSlideIndex === 3
                  ? "text-4xl md:text-5xl"
                  : "text-4xl md:text-6xl"
            }`}
            dangerouslySetInnerHTML={{ __html: currentSlide.subHeading }}
          />
        </div>
      </div>

      {/* Footer / Call to Actions */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center sm:items-start px-4 md:px-8 pb-8 relative z-20 gap-8">
        {/* Center: Start Watching, Warning & Socials grouped together */}
        <div className="flex flex-col items-center sm:items-start gap-4 flex-1 w-full sm:w-auto">
          <button
            onClick={() => navigate("/stream-movies")}
            // disabled={isSubscribing}
            className="text-sm md:text-base px-6 md:px-10 py-3 text-white bg-white/10 backdrop-blur-lg border border-white rounded-2xl cursor-pointer hover:bg-white/20 transition-all flex items-center gap-3 md:gap-5 group whitespace-nowrap"
          >
            {isSubscribing ? "Processing..." : "START WATCHING"}
          </button>

          <div className="flex flex-col items-center sm:items-start gap-3">
            <p className="font-bold text-xs md:text-sm lg:text-base uppercase tracking-tighter opacity-80 leading-tight max-w-[300px] md:max-w-[500px] text-center sm:text-left">
              THIS SITE IS ONLY FOR MOVIES NOT SKITS, TO WATCH SKITS AND SOCIAL
              INTERACTIONS DOWNLOAD KLOUTO ON APPSTORE
            </p>

            {/* Socials including Klouto moved here */}
            <div className="flex gap-6 items-center mt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-lg hover:scale-125 transition-transform duration-300"
              >
                <FaInstagram />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-lg hover:scale-125 transition-transform duration-300"
              >
                <img
                  src={KloutoImg}
                  alt="Klouto"
                  className="w-5 h-5 object-contain"
                />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-lg hover:scale-125 transition-transform duration-300"
              >
                <RiTwitterXFill />
              </a>
            </div>
          </div>
        </div>

        {/* Right: Become a Producer Card and OS Icons */}
        <div className="flex flex-col items-center sm:items-end text-white gap-6 flex-1 w-full sm:w-auto">
          <div
            onClick={() => {
              if (window.innerWidth < 1024) {
                setShowPcModal(true);
              } else {
                navigate("/become-producer");
              }
            }}
            className="bg-white/10 backdrop-blur-lg border border-white p-3 md:p-4 rounded-2xl cursor-pointer hover:bg-white/20 transition-all flex items-center gap-3 md:gap-5 group w-full sm:w-auto justify-center sm:justify-start"
          >
            <span className="text-white text-xs md:text-sm lg:text-[15px] font-medium font-['Archivo'] uppercase tracking-wide group-hover:translate-x-[-5px] transition-transform">
              Become a Flixora Producer
            </span>
            <span className="text-white text-lg md:text-xl font-black font-['Archivo'] uppercase tracking-wide">
              $100
            </span>
          </div>

          <div className="flex flex-col items-center sm:items-end">
            <span
              className="text-white text-[10px] font-[500] uppercase mb-1 opacity-50"
              style={{ fontFamily: "Archivo" }}
            >
              Only For:
            </span>
            <div className="flex gap-4">
              <a
                href="#windows-app"
                className="hover:scale-125 transition-transform duration-300"
              >
                <ImWindows8 className="text-sm" />
              </a>
              <a
                href="#iphone-app"
                className="hover:scale-125 transition-transform duration-300"
              >
                <DiApple className="text-lg" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-3 px-4 md:px-8 mb-4 mt-8 md:mt-12">
        <button
          onClick={() => {
            scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" });
          }}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/20 transition-all group"
        >
          <FaChevronLeft className="text-white text-sm md:text-base group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={() => {
            scrollRef.current?.scrollBy({ left: 400, behavior: "smooth" });
          }}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/20 transition-all group"
        >
          <FaChevronRight className="text-white text-sm md:text-base group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Video Cards */}
      <section
        ref={scrollRef}
        className="relative w-full mb-10 overflow-x-auto custom-scrollbar scroll-smooth"
      >
        <div className="inline-block min-w-full bg-black bg-opacity-30 backdrop-blur-[24px] pt-8 md:pt-10 pb-10 md:pb-12 rounded-xl px-4">
          <div className="flex gap-3 md:gap-6 justify-start items-stretch">
            {cardData.map((card, idx) => (
              <div
                key={idx}
                className="relative w-[150px] sm:w-[180px] md:w-[445px] h-[220px] sm:h-[250px] md:h-[174px] shrink-0"
              >
                <div
                  className={`absolute -top-5 left-0 text-[8px] md:text-sm font-bold uppercase mb-1 ${card.status === "available" ? "text-white" : "text-white/50"}`}
                >
                  {card.status === "available" ? "Available" : "Coming Soon"}
                </div>

                <div
                  className="card shadow-md rounded-md overflow-hidden flex flex-col md:flex-row relative h-full bg-black/20"
                  style={{
                    filter:
                      card.status === "coming soon" ? "blur(1px)" : "none",
                    opacity: card.status === "coming soon" ? 0.8 : 1,
                  }}
                >
                  <figure className="w-full md:w-2/5 h-[90px] sm:h-[110px] md:h-full relative shrink-0">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />
                  </figure>
                  <div className="w-full md:w-3/5 p-2 md:p-4 flex flex-col justify-between flex-1 min-w-0">
                    <div className="overflow-hidden">
                      <h5 className="text-white text-[7px] md:text-sm uppercase mb-0.5">
                        Rated 18
                      </h5>
                      <h2 className="text-white text-[9px] md:text-sm font-bold uppercase mb-0.5 leading-tight line-clamp-1">
                        {card.title}
                      </h2>
                      <p className="text-white text-[8px] md:text-xs uppercase mt-1 line-clamp-2 md:line-clamp-3 opacity-80">
                        {card.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-auto pt-2">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-600 flex items-center justify-center rounded-full overflow-hidden">
                          <img
                            src={HeartImg}
                            className="w-full h-full object-cover"
                            alt="likes"
                          />
                        </div>
                        <span className="text-white text-[7px] md:text-sm ml-0.5">
                          0
                        </span>
                      </div>

                      <button
                        className="text-white text-[8px] md:text-sm uppercase underline font-medium hover:opacity-80 transition-opacity whitespace-nowrap"
                        // onClick={() => navigate(`/movies/${card._id}`)}
                        // onClick={() => {
                        // if (card.status === "available") {
                        // setShowSignupModal(true);
                        //
                        //   } else {
                        //     alert("You have been added to the waitlist!");
                        //   }
                        // }}
                      >
                        {card.status === "available"
                          ? "Play Now"
                          : "jOIN WAITLIST"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Login Modal */}
      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
        onSwitchToForgot={() => {
          setShowLoginModal(false);
          setShowForgotModal(true);
        }}
      />

      {/* Signup Modal */}
      <SignupModal
        show={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
        onSuccess={handleSignupSuccess}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        show={showForgotModal}
        onClose={closeAllModals}
        onSuccess={() => {
          setShowForgotModal(false);
          setShowResetModal(true);
        }}
      />

      {/* Reset Password Modal */}
      <ResetPasswordModal
        show={showResetModal}
        onClose={closeAllModals}
        onSuccess={() => {
          setShowResetModal(false);
          setShowLoginModal(true);
        }}
      />

      {/* Interests Modal */}
      <InterestsModal
        show={showInterestsModal}
        onClose={() => setShowInterestsModal(false)}
        onComplete={handleInterestsComplete}
      />

      {/* PC Requirement Modal */}
      <PcWarningModal
        show={showPcModal}
        onClose={() => setShowPcModal(false)}
      />
    </div>
  );
};

export default Hero;
