import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BsFilm, BsImage, BsUpload, BsX } from "react-icons/bs";
import logoIcon from "../../../assets/F.png";
import { useApi } from "../../../context/AppContext";

//Local preview state shape
interface Previews {
  movie: string | null;
  trailer: string | null;
  bts: string | null;
  poster: string | null;
}

const Upload: React.FC = () => {
  const navigate = useNavigate();

  const {
    btsFile,
    setBtsFile,
    trailerFile,
    setTrailerFile,
    movieFile,
    setMovieFile,
    posterFile,
    setPosterFile,
  } = useApi();

  const [previews, setPreviews] = useState<Previews>({
    movie: null,
    trailer: null,
    bts: null,
    poster: null,
  });

  // Generic handler - updates context file + generates a local object URL preview
  const handleFileChange = useCallback(
    (key: keyof Previews, setter: (f: File | null) => void) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setter(file);

        // Revoke old preview to avoid memory leaks, then create new one
        setPreviews((prev) => {
          if (prev[key]) URL.revokeObjectURL(prev[key]!);
          return { ...prev, [key]: URL.createObjectURL(file) };
        });

        // Reset input so the same file can be re-selected after clearing
        e.target.value = "";
      },
    [],
  );

  const clearFile = useCallback(
    (key: keyof Previews, setter: (f: File | null) => void) => {
      setter(null);
      setPreviews((prev) => {
        if (prev[key]) URL.revokeObjectURL(prev[key]!);
        return { ...prev, [key]: null };
      });
    },
    [],
  );

  const handleNext = () => {
    if (!movieFile || !trailerFile || !posterFile) {
      alert(
        "Please upload the main movie video, trailer, and poster to proceed.",
      );
      return;
    }
    navigate("/upload-details");
  };

  return (
    <div className="flex-1 flex flex-col p-6 md:p-10 min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#0d0d15] via-[#12121f] to-[#0d0d15] font-[Poppins] text-white select-none">
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center mb-8 md:mb-10">
        <img
          src={logoIcon}
          onClick={() => navigate("/dashboard")}
          alt="Logo"
          className="h-10 w-14 object-contain opacity-80 cursor-pointer"
        />
        <button
          onClick={handleNext}
          className="text-white font-bold text-base md:text-lg tracking-wide hover:text-white/70 transition-colors cursor-pointer"
        >
          Next
        </button>
      </div>

      {/* 2×2 Upload Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-10 lg:gap-y-14 gap-x-10 w-full max-w-5xl mx-auto flex-1 relative">
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px border-t border-dashed border-white/15 pointer-events-none -translate-y-1/2" />
        <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 w-px border-l border-dashed border-white/15 pointer-events-none -translate-x-1/2" />

        {/* Q1: BTS */}
        <UploadZone
          label="Upload bts"
          sublabel="(for copyright claims)"
          accept="video/mp4,video/*"
          file={btsFile}
          previewUrl={previews.bts}
          maxLabel="max 200mb"
          icon="film"
          fileTypeLabel="mp4 bts"
          onChange={handleFileChange("bts", setBtsFile)}
          onClear={() => clearFile("bts", setBtsFile)}
        />

        {/* Q2: Trailer */}
        <UploadZone
          label="Upload movie trailer"
          accept="video/mp4,video/*"
          file={trailerFile}
          previewUrl={previews.trailer}
          maxLabel="max 500mb"
          icon="film"
          fileTypeLabel="mp4 trailer"
          onChange={handleFileChange("trailer", setTrailerFile)}
          onClear={() => clearFile("trailer", setTrailerFile)}
        />

        {/* Q3: Full movie */}
        <div className="flex flex-col gap-3 z-10">
          <div className="flex items-baseline gap-3">
            <h2 className="text-white font-bold text-lg md:text-xl tracking-wide">
              Upload full movie / short movie.
            </h2>
          </div>
          <UploadZoneInner
            accept="video/mp4,video/*"
            file={movieFile}
            previewUrl={previews.movie}
            maxLabel="max 10Gb"
            icon="film"
            fileTypeLabel="mp4 movie"
            onChange={handleFileChange("movie", setMovieFile)}
            onClear={() => clearFile("movie", setMovieFile)}
          />
          <div className="flex justify-end pr-1">
            <span className="text-white/60 text-xs tracking-wide">
              min of 30 min long
            </span>
          </div>
        </div>

        {/* Q4: Poster / Banner */}
        <UploadZone
          label="Upload movie banner"
          accept="image/*"
          file={posterFile}
          previewUrl={previews.poster}
          maxLabel="max 100mb"
          icon="image"
          fileTypeLabel="jpg, png etc banner"
          onChange={handleFileChange("poster", setPosterFile)}
          onClear={() => clearFile("poster", setPosterFile)}
        />
      </div>
    </div>
  );
};

//  Shared prop types
interface ZoneProps {
  accept: string;
  file: File | null;
  previewUrl: string | null;
  maxLabel: string;
  icon: "film" | "image";
  fileTypeLabel: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

interface UploadZoneProps extends ZoneProps {
  label: string;
  sublabel?: string;
}

// Wrapper with label
function UploadZone({ label, sublabel, ...rest }: UploadZoneProps) {
  return (
    <div className="flex flex-col gap-3 z-10">
      <div className="flex items-baseline gap-2">
        <h2 className="text-white font-bold text-lg md:text-xl tracking-wide">
          {label}
        </h2>
        {sublabel && (
          <span className="text-white/60 text-xs tracking-wide">
            {sublabel}
          </span>
        )}
      </div>
      <UploadZoneInner {...rest} />
    </div>
  );
}

// Core upload zone with preview
function UploadZoneInner({
  accept,
  file,
  previewUrl,
  maxLabel,
  icon,
  fileTypeLabel,
  onChange,
  onClear,
}: ZoneProps) {
  const isImage = icon === "image";
  const hasFile = !!file;

  return (
    <div
      className="relative w-full h-52 md:h-60 rounded-xl border overflow-hidden shadow-lg transition-all group
      bg-[#1e1e28] hover:bg-[#232330] border-white/5 hover:border-white/15 hover:shadow-xl"
    >
      {/* Empty state: clickable upload area */}
      {!hasFile && (
        <>
          <input
            type="file"
            accept={accept}
            onChange={onChange}
            className="absolute inset-0 opacity-0 cursor-pointer z-20"
          />
          <div className="flex flex-col items-center justify-center h-full gap-3 pointer-events-none">
            {isImage ? (
              <BsImage className="w-9 h-9 md:w-10 md:h-10 text-white group-hover:scale-110 transition-transform" />
            ) : (
              <BsFilm className="w-9 h-9 md:w-10 md:h-10 text-white group-hover:scale-110 transition-transform" />
            )}
            <p className="text-white font-medium text-sm md:text-base tracking-wide">
              <span className="text-[#10b981] font-bold">Upload</span>{" "}
              {fileTypeLabel}
            </p>
            <BsUpload className="w-5 h-5 md:w-6 md:h-6 text-white/70 group-hover:text-white transition-colors" />
          </div>
          <span className="absolute bottom-3 right-4 text-white/35 text-xs tracking-wider pointer-events-none">
            {maxLabel}
          </span>
        </>
      )}

      {/* Filled state: preview */}
      {hasFile && previewUrl && (
        <>
          {isImage ? (
            // IMAGE PREVIEW — fills the zone
            <img
              src={previewUrl}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            // VIDEO PREVIEW native player, muted autoplay so thumbnail shows
            <video
              src={previewUrl}
              className="absolute inset-0 w-full h-full object-cover"
              muted
              playsInline
              preload="metadata"
              // Seek to 1s so a frame shows as thumbnail
              onLoadedMetadata={(e) => {
                (e.target as HTMLVideoElement).currentTime = 1;
              }}
            />
          )}

          {/* Dark overlay with file info */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

          {/* Filename badge - bottom left */}
          <div className="absolute bottom-3 left-3 right-10 pointer-events-none">
            <p className="text-white text-xs font-semibold truncate drop-shadow">
              <span className="text-[#10b981]">✓ </span>
              {file.name}
            </p>
            <p className="text-white/40 text-[10px] mt-0.5">
              {(file.size / (1024 * 1024)).toFixed(1)} MB
            </p>
          </div>

          {/* Clear / re-select button -- top right */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="absolute top-2 right-2 z-30 w-7 h-7 rounded-full bg-black/60 hover:bg-red-600/80 flex items-center justify-center transition-colors backdrop-blur-sm"
            title="Remove file"
          >
            <BsX className="w-4 h-4 text-white" />
          </button>

          {/* Re-upload input - always available even when filled */}
          <input
            type="file"
            accept={accept}
            onChange={onChange}
            className="absolute inset-0 opacity-0 cursor-pointer z-20"
            title="Click to replace"
          />
        </>
      )}
    </div>
  );
}

export default Upload;
