import JBLT510WirelessBluetoothHeadphoneBlue4 from "../../assets/jbl.svg";

interface HeadPhoneProps {
  onSkip?: () => void;
  onConnect?: () => void;
  headphoneConnected?: boolean | null;
  isChecking?: boolean;
}

export const HeadPhone = ({
  onSkip,
  onConnect,
  headphoneConnected,
}: HeadPhoneProps): JSX.Element => {
  const detected = headphoneConnected === true;

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[linear-gradient(90deg,rgba(0,0,0,0.9)_0%,rgba(81,127,164,0.87)_100%)] flex flex-col items-center justify-center px-4">
      {/* Background Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[258px] rounded-[50%] bg-[#acc5f7] blur-[120px] sm:blur-[150px]"
      />

      <header className="absolute top-0 inset-x-0 p-6 sm:p-8 flex justify-end z-20 md:hidden">
        <button
          onClick={onSkip}
          aria-label="Skip headphone connection"
          type="button"
          className="[font-family:'Roboto-Light',Helvetica] font-light text-white text-lg sm:text-xl tracking-[-0.25px]"
        >
          Skip
        </button>
      </header>

      <section
        aria-labelledby="connect-headphone-title"
        className="relative z-10 flex flex-col items-center text-center space-y-8 sm:space-y-10 w-full max-w-md mt-10"
      >
        <h1
          id="connect-headphone-title"
          className="[font-family:'Roboto-Black',Helvetica] font-black text-white text-2xl sm:text-3xl tracking-[-0.25px] transition-all"
        >
          {detected ? "Headphones Ready" : "Connect a Headphone"}
        </h1>

        <div className="relative flex flex-col items-center justify-center space-y-6 py-6 px-5 bg-black/25 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl w-full max-w-sm">
          <img
            className={`h-[120px] w-[120px] sm:h-[150px] sm:w-[150px] object-contain drop-shadow-2xl transition-transform duration-500 ${
              detected ? "scale-105" : "animate-pulse"
            }`}
            alt="Blue JBL wireless headphones"
            src={JBLT510WirelessBluetoothHeadphoneBlue4}
          />
          
          {detected ? (
            <p
              role="status"
              aria-live="polite"
              className="[font-family:'Open_Sans-ExtraBold',Helvetica] font-extrabold text-green-400 text-sm sm:text-base tracking-[-0.25px] flex items-center justify-center gap-1.5"
            >
              <svg className="w-5 h-5 text-green-400 animate-bounce" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
              </svg>
              Headphones detected!
            </p>
          ) : (
            <p
              role="status"
              aria-live="polite"
              className="[font-family:'Open_Sans-ExtraBold',Helvetica] font-extrabold text-amber-400 text-sm sm:text-base tracking-[-0.25px]"
            >
              Awaiting audio connection
            </p>
          )}

          <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
            {detected 
              ? "Your earpiece has been detected successfully. You are ready to experience Flixora's immersive spatial soundtracks."
              : "Flixora possesses high-fidelity background music that may cause noise to your surroundings. An earpiece, earpod, or headphones are advised."
            }
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4 w-full">
          <button
            onClick={onConnect}
            aria-label="Connect headphones"
            type="button"
            className="h-[55px] w-[240px] transition-all hover:scale-[1.03] active:scale-[0.97]"
          >
            <div className={`h-full w-full rounded-full border flex items-center justify-center font-bold text-sm tracking-wide backdrop-blur-sm transition-all duration-300 ${
              detected 
                ? "bg-green-500/20 border-green-500 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.3)]" 
                : "bg-white/10 border-white/20 text-white hover:bg-white/20"
            }`}>
              {detected ? "Enter Flixora" : "I have connected my earpiece"}
            </div>
          </button>
          
          <button
            onClick={onSkip}
            aria-label="Skip headphone connection"
            type="button"
            className="hidden md:block [font-family:'Roboto-Light',Helvetica] font-light text-white/50 hover:text-white text-base tracking-[-0.25px] transition-colors"
          >
            Skip warning
          </button>
        </div>
      </section>
    </main>
  );
};

export default HeadPhone;
