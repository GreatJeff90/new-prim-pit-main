import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Hero from "./components/hero/Hero";
import Navbar from "./components/navbar/Navbar";
import SignupModal from "./components/signup/SignUpModal";
import LoginModal from "./components/login/LoginModal";
import ForgotPasswordModal from "./components/login/ForgotPasswordModal";
import ResetPasswordModal from "./components/login/ResetPasswordModal";
import Profile from "./pages/profile/Profile";
import Dashboard from "./pages/dashboard/Dashboard";
import ProfileLocked from "./pages/profile-locked/ProfileLocked";
import PaymentRedirect from "./components/payment-redirect/PaymentRedirect";
import GameLoading from "./components/game-loading/GameLoading";
import PaymentSuccess from "./components/payment-success/PaymentSucess";
import Game from "./pages/game/Game";
import ProfileDashboard from "./pages/dashboard/profile-dashboard/ProfileDashboard";
import DashboardLayout from "./components/dashboard-layout/DashboardLayout";
import Earnings from "./pages/dashboard/earnings/Earnings";
import Withdraw from "./pages/dashboard/withdraw/Withdraw";
import Upload from "./pages/dashboard/upload/Upload";
import UploadDetails from "./pages/dashboard/upload/UploadDetails";
import UploadFinal from "./pages/dashboard/upload/UploadFinal";
import Messaging from "./pages/dashboard/messages/Messaging";
import BecomeProducer from "./pages/become-producer/BecomeProducer";
import GlobalAudio from "./components/audio/GlobalAudio";
import { useApi } from "./context/AppContext";
import { useHeadphoneDetection } from "./hooks/useHeadphoneDetection";
import HeadPhone from "./components/audio/HeadPhone";
import { Movies } from "./pages/stream/Movies";
import MovieDetails from "./pages/stream/MovieDetails";
import Upgrade from "./pages/upgrade/Upgrade";
import RecentlyWatched from "./pages/dashboard/profile-dashboard/RecentlyWatched";
import WatchMovie from "./pages/stream/watch/WatchMovie";
// Placeholder components

const Friends = () => <div className="text-white p-10">Friends Page</div>;

const App = () => {
  const { isAuthFlowActive } = useApi();
  const { headphoneConnected, isChecking } = useHeadphoneDetection();
  const [headphoneScreenDismissed, setHeadphoneScreenDismissed] = useState(
    () => sessionStorage.getItem("headphone_dismissed") === "true",
  );
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const showHeadphoneScreen =
    location.pathname === "/" &&
    !isChecking &&
    headphoneConnected === false &&
    !headphoneScreenDismissed;
  if (isChecking && location.pathname === "/") {
    return <div className="w-full h-screen bg-black" />;
  }

  const dismissHeadphoneScreen = () => {
    sessionStorage.setItem("headphone_dismissed", "true");
    setHeadphoneScreenDismissed(true);
  };
  if (showHeadphoneScreen) {
    return (
      <HeadPhone
        onSkip={dismissHeadphoneScreen}
        headphoneConnected={headphoneConnected}
        onConnect={async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              audio: true,
            });
            stream.getTracks().forEach((track) => track.stop());
            toast.success("Audio route connected successfully!", {
              style: {
                background: "#333",
                color: "#fff",
                borderRadius: "10px",
                border: "1px solid #555",
              },
            });
          } catch (e) {
            console.warn("Audio hardware connection bypassed:", e);
          } finally {
            dismissHeadphoneScreen();
          }
        }}
      />
    );
  }

  const handleSignupClose = () => {
    setShowSignup(false);
    navigate("/");
  };

  const closeAllModals = () => {
    setShowLogin(false);
    setShowSignup(false);
    setShowForgotModal(false);
    setShowResetModal(false);
    navigate("/");
  };

  const switchToLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const switchToSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const switchToForgot = () => {
    setShowLogin(false);
    setShowForgotModal(true);
  };

  const hideNavbar =
    [
      "/profile",
      "/game-loading",
      "/profile-locked",
      "/dashboard",
      "/dashboard/profile-dashboard",
      "/dashboard/message",
      "/dashboard/friends",
      "/dashboard/earnings",
      "/dashboard/withdraw",
      "/dashboard/upload",
      "/dashboard/upload-details",
      "/dashboard/upload-final",
      "/dashboard/recently-watched",
      "/payment-success",
      "/suceessful-payment",
      "/game",
      "/in-game",
      "/become-producer",
      "/stream-movies",
      "/upgrade",
      "/watch",
      "/upload",
      "/upload-details",
      "/upload-final",
    ].includes(location.pathname) ||
    location.pathname.startsWith("/stream-movies/");

  return (
    <div className="overflow-x-hidden">
      <GlobalAudio
        currentPath={location.pathname}
        anyModalOpen={
          isAuthFlowActive ||
          showSignup ||
          showLogin ||
          showForgotModal ||
          showResetModal
        }
      />
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Hero />} />
        <Route
          path="/sign-up"
          element={
            <SignupModal
              show={true}
              onClose={handleSignupClose}
              onSwitchToLogin={switchToLogin}
              onSuccess={() => {}}
            />
          }
        />
        <Route
          path="/login"
          element={
            <LoginModal
              show={true}
              onClose={closeAllModals}
              onSwitchToSignup={switchToSignup}
              onSwitchToForgot={switchToForgot}
              onSuccess={() => {}}
            />
          }
        />
        <Route path="/profile-locked" element={<ProfileLocked />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/payment-success" element={<PaymentRedirect />} />
        <Route path="/suceessful-payment" element={<PaymentSuccess />} />
        <Route path="/game-loading" element={<GameLoading />} />
        <Route path="/game" element={<Game />} />
        <Route path="/become-producer" element={<BecomeProducer />} />
        <Route path="/stream-movies" element={<Movies />} />
        <Route path="/stream-movies/:id" element={<MovieDetails />} />
        <Route path="/upgrade" element={<Upgrade />} />
        <Route path="/watch/:id" element={<WatchMovie />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/upload-details" element={<UploadDetails />} />
        <Route path="/upload-final" element={<UploadFinal />} />

        {/* Dashboard Routes with Shared Layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="withdraw" element={<Withdraw />} />
          <Route path="profile-dashboard" element={<ProfileDashboard />} />
          <Route path="message" element={<Messaging />} />
          <Route path="friends" element={<Friends />} />
          <Route path="recently-watched" element={<RecentlyWatched />} />
        </Route>
      </Routes>

      <ForgotPasswordModal
        show={showForgotModal}
        onClose={closeAllModals}
        onSuccess={() => {
          setShowForgotModal(false);
          setShowResetModal(true);
        }}
      />

      <ResetPasswordModal
        show={showResetModal}
        onClose={closeAllModals}
        onSuccess={() => {
          setShowResetModal(false);
          setShowLogin(true);
        }}
      />
    </div>
  );
};

export default App;
