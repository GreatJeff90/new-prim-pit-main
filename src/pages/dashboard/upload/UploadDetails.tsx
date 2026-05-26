import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsUpload } from "react-icons/bs";
import logoIcon from "../../../assets/F.png";
import { useApi } from "../../../context/AppContext";

const UploadDetails: React.FC = () => {
  const navigate = useNavigate();
  const { movieMetadata, setMovieMetadata, subtitleFile, setSubtitleFile } =
    useApi();
  const handleInputChange = (field: string, value: any) => {
    setMovieMetadata((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSubtitleFile(e.target.files[0]);
      e.target.value = "";
    }
  };

  const handleNextValidation = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!movieMetadata.title.trim()) {
      alert("Movie Title is required.");
      return;
    }
    if (!movieMetadata.aboutMovie.trim()) {
      alert("Please provide a short description 'About movie'.");
      return;
    }
    if (!movieMetadata.price) {
      alert("Please specify a stream price.");
      return;
    }
    if (
      movieMetadata.scheduleType === "premier" &&
      !movieMetadata.scheduleDate
    ) {
      alert("Please select a premier date from the calendar.");
      return;
    }
    if (!movieMetadata.scheduleType) {
      alert(
        "Please select whether the movie is premiering or showing immediately.",
      );
      return;
    }

    navigate("/upload-final");
  };

  return (
    <div className="flex-1 flex flex-col p-6 md:p-10 min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#0d0d15] via-[#12121f] to-[#0d0d15] font-[Poppins] text-white select-none">
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center mb-8 md:mb-10">
        <img
          src={logoIcon}
          alt="Logo"
          onClick={() => navigate("/dashboard")}
          className="h-8 w-8 object-contain opacity-80 cursor-pointer"
        />
        <div className="flex gap-20">
          <Link
            to="/upload"
            className="text-white hover:text-[#059669] font-bold text-base md:text-lg tracking-wide transition-colors cursor-pointer"
          >
            Back
          </Link>
          <button
            onClick={handleNextValidation}
            className="text-white hover:text-[#059669] font-bold text-base md:text-lg tracking-wide transition-colors cursor-pointer bg-transparent border-none outline-none"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 w-full max-w-5xl mx-auto py-2">
        {/* Left Column */}
        <div className="lg:col-span-6 flex flex-col gap-8">
          {/* Movie Title */}
          <div className="flex flex-col gap-2">
            <label className="text-white font-bold text-base md:text-lg tracking-wide">
              Movie Title
            </label>
            <input
              type="text"
              value={movieMetadata.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full bg-[#353540] text-white px-5 py-3.5 rounded border border-white/5 focus:outline-none focus:border-[#10b981] shadow-inner transition-colors hover:bg-[#3a3a45]"
            />
          </div>

          {/* Casts */}
          <div className="flex flex-col gap-3">
            <label className="text-white font-bold text-base md:text-lg tracking-wide">
              Name of casts
            </label>
            <input
              type="text"
              placeholder="Producer (s):"
              value={movieMetadata.producer}
              onChange={(e) => handleInputChange("producer", e.target.value)}
              className="w-full bg-[#353540] text-white placeholder:text-white/60 font-semibold px-5 py-3.5 rounded border border-white/5 focus:outline-none focus:border-[#10b981] shadow-inner transition-colors hover:bg-[#3a3a45]"
            />
            <input
              type="text"
              placeholder="Major cast 1:"
              value={movieMetadata.majorCast1}
              onChange={(e) => handleInputChange("majorCast1", e.target.value)}
              className="w-full bg-[#353540] text-white placeholder:text-white/60 font-semibold px-5 py-3.5 rounded border border-white/5 focus:outline-none focus:border-[#10b981] shadow-inner transition-colors hover:bg-[#3a3a45]"
            />
            <input
              type="text"
              placeholder="Major cast 2:"
              value={movieMetadata.majorCast2}
              onChange={(e) => handleInputChange("majorCast2", e.target.value)}
              className="w-full bg-[#353540] text-white placeholder:text-white/60 font-semibold px-5 py-3.5 rounded border border-white/5 focus:outline-none focus:border-[#10b981] shadow-inner transition-colors hover:bg-[#3a3a45]"
            />
            <input
              type="text"
              placeholder="Minor cast 1:"
              value={movieMetadata.minorCast1}
              onChange={(e) => handleInputChange("minorCast1", e.target.value)}
              className="w-full bg-[#353540] text-white placeholder:text-white/60 font-semibold px-5 py-3.5 rounded border border-white/5 focus:outline-none focus:border-[#10b981] shadow-inner transition-colors hover:bg-[#3a3a45]"
            />
            <div className="flex flex-col gap-1">
              <span className="text-white/40 text-xs px-1">optional</span>
              <input
                type="text"
                placeholder="Minor cast 2:"
                value={movieMetadata.minorCast2}
                onChange={(e) =>
                  handleInputChange("minorCast2", e.target.value)
                }
                className="w-full bg-[#353540] text-white placeholder:text-white/60 font-semibold px-5 py-3.5 rounded border border-white/5 focus:outline-none focus:border-[#10b981] shadow-inner transition-colors hover:bg-[#3a3a45]"
              />
            </div>
          </div>

          {/* About movie */}
          <div className="flex flex-col gap-2">
            <label className="text-white font-bold text-base md:text-lg tracking-wide">
              About movie
            </label>
            <textarea
              rows={5}
              value={movieMetadata.aboutMovie}
              onChange={(e) => handleInputChange("aboutMovie", e.target.value)}
              className="w-full bg-[#353540] text-white p-4 rounded border border-white/5 focus:outline-none focus:border-[#10b981] shadow-inner resize-none transition-colors hover:bg-[#3a3a45]"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-6 flex flex-col gap-8">
          {/* Price */}
          <div className="flex flex-col gap-2">
            <label className="text-white font-bold text-base md:text-lg tracking-wide">
              How much are you selling per stream?
            </label>
            <div className="relative w-full">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white font-bold text-lg">
                $
              </span>
              <input
                type="number"
                step="0.01"
                value={movieMetadata.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                className="w-full bg-[#353540] text-white pl-10 pr-20 py-3.5 rounded border border-white/5 focus:outline-none focus:border-[#10b981] shadow-inner transition-colors hover:bg-[#3a3a45] font-semibold"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-xs font-medium">
                max $2
              </span>
            </div>
          </div>

          {/* Schedule */}
          <div className="flex flex-col gap-3">
            <label className="text-white font-bold text-base md:text-lg tracking-wide">
              Premiering or showing immediately?
            </label>
            <div className="w-full mt-auto relative">
              <div className="">
                {movieMetadata.scheduleDate
                  ? new Date(movieMetadata.scheduleDate).toLocaleDateString(
                      undefined,
                      { dateStyle: "medium" },
                    )
                  : "Set Date"}
              </div>
              {/* Hidden Native Input Element */}
              <input
                id="hidden-date-picker"
                type="date"
                value={movieMetadata.scheduleDate || ""}
                min={new Date().toISOString().split("T")[0]}
                onClick={(e) => e.stopPropagation()} // Stop bubbling loop
                onChange={(e) =>
                  handleInputChange("scheduleDate", e.target.value)
                }
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                style={{ colorScheme: "dark" }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(["premiering", "immediate"] as const).map((type) => (
                <div
                  key={type}
                  onClick={() => handleInputChange("scheduleType", type)}
                  className={`flex items-center justify-between p-4 bg-[#353540] rounded cursor-pointer border transition-all ${
                    movieMetadata.scheduleType === type
                      ? "border-[#10b981] bg-[#3a3a48] shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                      : "border-white/5 hover:border-white/20 hover:bg-[#3a3a45]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 border flex items-center justify-center transition-colors shrink-0 ${
                        movieMetadata.scheduleType === type
                          ? "bg-[#10b981] border-[#10b981]"
                          : "border-white/40"
                      }`}
                    >
                      {movieMetadata.scheduleType === type && (
                        <span className="text-white text-[10px] font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-white font-bold text-sm tracking-wide capitalize">
                      {type === "premiering"
                        ? "Premiering"
                        : "Showing immediately"}
                    </span>
                  </div>
                  {type === "premiering" && (
                    <span
                      onClick={() => {
                        const dateInput = document.getElementById(
                          "hidden-date-picker",
                        ) as HTMLInputElement;
                        if (dateInput) {
                          try {
                            dateInput.showPicker();
                          } catch (err) {
                            dateInput.focus();
                          }
                        }
                      }}
                      className="text-white/60 text-xs font-medium"
                    >
                      Set date
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Age restriction */}
          <div className="flex flex-col gap-3">
            <label className="text-white font-bold text-base md:text-lg tracking-wide">
              Any age restrictions?
            </label>
            <div className="flex items-center gap-8">
              {["13+", "16", "18+"].map((age) => (
                <div
                  key={age}
                  onClick={() => handleInputChange("ageRestriction", age)}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <div
                    className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                      movieMetadata.ageRestriction === age
                        ? "bg-[#10b981] border-[#10b981]"
                        : "border-white/40 group-hover:border-white"
                    }`}
                  >
                    {movieMetadata.ageRestriction === age && (
                      <span className="text-white text-[10px] font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <span className="text-white font-bold text-sm tracking-wide">
                    {age}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-white/50 text-xs leading-relaxed mt-1 max-w-md">
              Please do not upload porn or any extremely sexual content — it
              goes against our community guidelines and could result in
              suspension or termination of account.
            </p>
          </div>

          {/* Additional copyright file */}
          <div className="flex flex-col gap-2">
            <label className="text-white font-bold text-base md:text-lg tracking-wide">
              Upload any additional copyright files that's not BTS
            </label>
            <span className="text-white/40 text-xs">optional</span>

            <div className="relative w-full h-40 bg-[#1e1e28] hover:bg-[#232330] rounded-xl border border-white/5 hover:border-white/15 flex flex-col items-center justify-center cursor-pointer shadow-lg transition-all group mt-1">
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-20"
              />
              <div className="flex flex-col items-center gap-2.5 pointer-events-none z-10">
                <p className="text-white font-medium text-sm tracking-wide">
                  <span className="text-[#10b981] font-bold">Upload</span> file
                </p>
                <BsUpload className="w-5 h-5 text-white/60 group-hover:text-white group-hover:scale-110 transition-all" />
                {subtitleFile && (
                  <span className="text-xs text-[#10b981] font-medium max-w-[180px] truncate">
                    ✓ {subtitleFile.name}
                  </span>
                )}
              </div>
              <span className="absolute bottom-3 right-4 text-white/30 text-xs pointer-events-none">
                Max 50mb
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full border-b border-dashed border-white/15 mt-4" />
        </div>
      </div>
    </div>
  );
};

export default UploadDetails;
