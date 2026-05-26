import  { useState } from "react";
import golden from "../../assets/golden.png";
import naira from "../../assets/naira-sign.png";
import { useApi } from "../../context/AppContext";

const GameCard = () => {
  const { initializeAccessBankPayment } = useApi();
  const [loading, setLoading] = useState(false);

  const handlePlayNowClick = async () => {
    const email = sessionStorage.getItem("email") || "";
    // if (!email) {
    //   alert("Please log in or sign up to continue.");
    //   return;
    // }

    try {
      setLoading(true);
      const response = await initializeAccessBankPayment(email);
      if (response?.paymentUrl) {
        window.location.href = response.paymentUrl;
      }
    } catch (error) {
      console.error("Failed to initiate payment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="text-white p-6 shadow-lg max-w-[850px] w-full"
      style={{
        height: "320px",
        borderRadius: "50px",
        borderImageSource:
          "linear-gradient(13.31deg, #000000 8.76%, #606164 54.18%, rgba(201, 201, 201, 0.91) 90.27%)",
        borderImageSlice: 1,
        background: "#071B24",
        opacity: 1,
        marginTop: "55px",
      }}
    >
      <div className="flex justify-between items-center h-full">
        <div className="max-w-md">
          <h2 className="text-4xl font-semibold">THE GOLDEN NUMBER</h2>
          <p className="text-sm mt-2 text-slate-300">
            This is a game that rewards you with cash prizes when you hit a golden number
          </p>
          <button
            className="mt-6 text-white rounded-full flex items-center justify-center gap-2"
            style={{
              width: "239px",
              height: "56px",
              borderRadius: "73px",
              background:
                "linear-gradient(90.98deg, #071B24 2.6%, rgba(13, 32, 40, 0.987386) 23.43%, rgba(87, 87, 87, 0.838542) 95.65%)",
              opacity: 1,
            }}
            onClick={handlePlayNowClick}
            disabled={loading}
          >
            {loading ? "Processing..." : "Play now"}
            {!loading && <img src={naira} alt="Naira" className="w-4 h-4 object-contain" />}
            {!loading && "100"}
          </button>
        </div>

        {/* Larger golden image */}
        <img
          src={golden}
          alt="Golden Number"
          className="h-[400px] w-[400px] object-contain ml-20"
        />
      </div>
    </div>
  );
};

export default GameCard;
