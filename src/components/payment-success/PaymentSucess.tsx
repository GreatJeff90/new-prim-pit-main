import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      // After payment, navigate to game-loading
      navigate("/game-loading", { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-t-blue-500 border-white rounded-full animate-spin mb-4" />
        <p className="text-lg font-medium">Processing your payment...</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
