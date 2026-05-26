import { ChangeEvent, KeyboardEvent, useId, useRef, useState } from "react";
import image from "./image.svg";
import line32 from "./line-32.svg";
import line33 from "./line-33.svg";
import line34 from "./line-34.svg";
import media1 from "./media-1.svg";
import media12 from "./media-1-2.svg";
import media13 from "./media-1-3.svg";
import vector from "./vector.svg";
import vector2 from "./vector-2.svg";
import vector3 from "./vector-3.svg";
import vector4 from "./vector-4.svg";

type UploadCardProps = {
  title: string;
  subtitle?: string;
  helperText?: string;
  uploadPrefix: string;
  uploadText: string;
  maxText: string;
  accept?: string;
  iconSrc: string;
  uploadIconSrc: string;
  containerClassName: string;
  titleClassName: string;
  subtitleClassName?: string;
  iconWrapperClassName: string;
  uploadTextClassName: string;
  uploadIconWrapperClassName: string;
  maxTextClassName: string;
  inputId: string;
  ariaLabel: string;
  onFileSelect: (fileName: string) => void;
  selectedFileName?: string;
};

const UploadCard = ({
  title,
  subtitle,
  helperText,
  uploadPrefix,
  uploadText,
  maxText,
  accept,
  iconSrc,
  uploadIconSrc,
  containerClassName,
  titleClassName,
  subtitleClassName,
  iconWrapperClassName,
  uploadTextClassName,
  uploadIconWrapperClassName,
  maxTextClassName,
  inputId,
  ariaLabel,
  onFileSelect,
  selectedFileName,
}: UploadCardProps): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleActivate = () => {
    inputRef.current?.click();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleActivate();
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    onFileSelect(file?.name ?? "");
  };

  return (
    <>
      <div className={titleClassName}>{title}</div>
      {subtitle ? <div className={subtitleClassName}>{subtitle}</div> : null}
      <div
        className={containerClassName}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        onClick={handleActivate}
        onKeyDown={handleKeyDown}
      >
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={handleChange}
        />
        <div className={iconWrapperClassName}>
          <img
            className="flex-1 w-[39.42px]"
            alt=""
            src={iconSrc}
            aria-hidden="true"
          />
        </div>
        <p className={uploadTextClassName}>
          <span className="text-[#07ff39]">{uploadPrefix}</span>
          <span className="text-white">{uploadText}</span>
        </p>
        <div className={uploadIconWrapperClassName}>
          <img
            className="flex-1 w-[32.5px]"
            alt=""
            src={uploadIconSrc}
            aria-hidden="true"
          />
        </div>
        <div className={maxTextClassName}>{maxText}</div>
      </div>
      {helperText ? (
        <p className="absolute top-[964px] left-[513px] [font-family:'Poppins-Medium',Helvetica] font-medium text-white text-[15px] tracking-[0] leading-[normal]">
          {helperText}
        </p>
      ) : null}
      {selectedFileName ? <p className="sr-only">{selectedFileName}</p> : null}
    </>
  );
};

export const Dashboard = (): JSX.Element => {
  const btsId = useId();
  const trailerId = useId();
  const movieId = useId();
  const bannerId = useId();

  const [selectedFiles, setSelectedFiles] = useState({
    bts: "",
    trailer: "",
    movie: "",
    banner: "",
  });

  return (
    <main className="bg-[#1d1e22] overflow-hidden w-full min-w-[1440px] h-[1024px] relative">
      <div
        className="absolute top-[-50px] left-[-328px] w-[207px] h-[50px]"
        aria-hidden="true"
      >
        <div className="absolute w-[26.57%] h-full top-0 left-[36.71%] rounded-[30px] bg-[linear-gradient(180deg,rgba(57,57,57,1)_0%,rgba(29,30,34,1)_100%)]" />
        <div className="absolute w-[26.57%] h-full top-0 left-0 rounded-[30px] bg-[linear-gradient(180deg,rgba(57,57,57,1)_0%,rgba(29,30,34,1)_100%)]" />
        <div className="absolute w-[26.57%] h-full top-0 left-[73.43%] rounded-[30px] bg-[linear-gradient(180deg,rgba(57,57,57,1)_0%,rgba(29,30,34,1)_100%)]" />
      </div>
      <div
        className="absolute w-[4.93%] h-[6.74%] top-[2.15%] left-0 bg-[url(/letter-f-made-with-foil-holographic-birthday-ballo-1.png)] bg-cover bg-[50%_50%]"
        aria-hidden="true"
      />
      <button
        type="button"
        className="absolute top-[39px] left-[1305px] [font-family:'Poppins-SemiBold',Helvetica] font-semibold text-white text-2xl tracking-[0] leading-[normal]"
        aria-label="Go to next step"
      >
        Next
      </button>
      <img
        className="top-[158px] left-[704px] w-px h-[866px] absolute object-cover"
        alt=""
        src={line32}
        aria-hidden="true"
      />
      <img
        className="top-[507px] left-px w-[699px] h-px absolute object-cover"
        alt=""
        src={line33}
        aria-hidden="true"
      />
      <img
        className="top-[507px] left-[705px] w-[735px] h-[5px] absolute object-cover"
        alt=""
        src={line34}
        aria-hidden="true"
      />
      <section aria-label="Media uploads">
        <UploadCard
          title="Upload bts"
          subtitle="(for copyright claims)"
          uploadPrefix="Upload"
          uploadText=" mp4 bts"
          maxText="max 200mb"
          accept="video/mp4"
          iconSrc={media1}
          uploadIconSrc={vector}
          containerClassName="absolute top-52 left-9 w-[644px] h-[286px] bg-[#d9d9d917] rounded-[7px] border border-dashed border-[#ffffff1f]"
          titleClassName="absolute top-[158px] left-[46px] [font-family:'Poppins-SemiBold',Helvetica] font-semibold text-white text-2xl tracking-[0] leading-[normal]"
          subtitleClassName="absolute top-[169px] left-[194px] [font-family:'Poppins-SemiBold',Helvetica] font-semibold text-white text-sm tracking-[0] leading-[normal]"
          iconWrapperClassName="absolute top-[297px] left-[334px] w-[43px] h-[34px] flex"
          uploadTextClassName="absolute top-[337px] left-[293px] [font-family:'Poppins-SemiBold',Helvetica] font-semibold text-transparent text-base tracking-[0] leading-[normal]"
          uploadIconWrapperClassName="absolute top-[367px] left-[338px] w-[39px] h-[33px] flex"
          maxTextClassName="absolute top-[459px] left-[537px] [font-family:'Poppins-SemiBold',Helvetica] font-semibold text-[#ffffffb0] text-base tracking-[0] leading-[normal]"
          inputId={btsId}
          ariaLabel="Upload BTS mp4 file"
          onFileSelect={(fileName) =>
            setSelectedFiles((prev) => ({ ...prev, bts: fileName }))
          }
          selectedFileName={selectedFiles.bts}
        />
        <UploadCard
          title="Upload movie trailer"
          uploadPrefix="Upload"
          uploadText=" mp4 trailer"
          maxText="max 500mb"
          accept="video/mp4"
          iconSrc={media12}
          uploadIconSrc={vector2}
          containerClassName="absolute top-52 left-[750px] w-[644px] h-[286px] bg-[#d9d9d917] rounded-[7px] border border-dashed border-[#ffffff1f]"
          titleClassName="absolute top-[158px] left-[734px] [font-family:'Poppins-SemiBold',Helvetica] font-semibold text-white text-2xl tracking-[0] leading-[normal]"
          iconWrapperClassName="absolute top-[297px] left-[1048px] w-[43px] h-[34px] flex"
          uploadTextClassName="absolute top-[337px] left-[994px] [font-family:'Poppins-SemiBold',Helvetica] font-semibold text-transparent text-base tracking-[0] leading-[normal]"
          uploadIconWrapperClassName="absolute top-[367px] left-[1052px] w-[39px] h-[33px] flex"
          maxTextClassName="absolute top-[459px] left-[1251px] [font-family:'Poppins-SemiBold',Helvetica] font-semibold text-[#ffffffb0] text-base tracking-[0] leading-[normal]"
          inputId={trailerId}
          ariaLabel="Upload movie trailer mp4 file"
          onFileSelect={(fileName) =>
            setSelectedFiles((prev) => ({ ...prev, trailer: fileName }))
          }
          selectedFileName={selectedFiles.trailer}
        />
        <UploadCard
          title="Upload full movie / short movie."
          helperText="min of 30 mint long"
          uploadPrefix="Upload"
          uploadText=" mp4 movie"
          maxText="max 10Gb"
          accept="video/mp4"
          iconSrc={media13}
          uploadIconSrc={vector3}
          containerClassName="absolute top-[609px] left-9 w-[644px] h-[304px] bg-[#d9d9d917] rounded-[7px] border border-dashed border-[#ffffff1f]"
          titleClassName="absolute top-[540px] left-[46px] [font-family:'Poppins-SemiBold',Helvetica] font-semibold text-white text-2xl tracking-[0] leading-[normal]"
          iconWrapperClassName="absolute top-[716px] left-[334px] w-[43px] h-[34px] flex"
          uploadTextClassName="absolute top-[756px] left-[280px] [font-family:'Poppins-SemiBold',Helvetica] font-semibold text-transparent text-base tracking-[0] leading-[normal]"
          uploadIconWrapperClassName="absolute top-[786px] left-[338px] w-[39px] h-[33px] flex"
          maxTextClassName="absolute top-[878px] left-[537px] [font-family:'Poppins-SemiBold',Helvetica] font-semibold text-[#ffffffb0] text-base tracking-[0] leading-[normal]"
          inputId={movieId}
          ariaLabel="Upload full movie or short movie mp4 file"
          onFileSelect={(fileName) =>
            setSelectedFiles((prev) => ({ ...prev, movie: fileName }))
          }
          selectedFileName={selectedFiles.movie}
        />
        <UploadCard
          title="Upload movie banner"
          uploadPrefix="Upload"
          uploadText=" Jef, Png etc banner"
          maxText="max 100mb"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          iconSrc={image}
          uploadIconSrc={vector4}
          containerClassName="absolute top-[609px] left-[750px] w-[644px] h-[295px] bg-[#d9d9d917] rounded-[7px] border border-dashed border-[#ffffff1f]"
          titleClassName="absolute top-[540px] left-[720px] [font-family:'Poppins-SemiBold',Helvetica] font-semibold text-white text-2xl tracking-[0] leading-[normal]"
          iconWrapperClassName="absolute top-[696px] left-[1044px] w-14 h-[38px] flex"
          uploadTextClassName="absolute top-[749px] left-[965px] [font-family:'Poppins-SemiBold',Helvetica] font-semibold text-transparent text-base tracking-[0] leading-[normal]"
          uploadIconWrapperClassName="absolute top-[777px] left-[1052px] w-[39px] h-[33px] flex"
          maxTextClassName="absolute top-[869px] left-[1251px] [font-family:'Poppins-SemiBold',Helvetica] font-semibold text-[#ffffffb0] text-base tracking-[0] leading-[normal]"
          inputId={bannerId}
          ariaLabel="Upload movie banner image"
          onFileSelect={(fileName) =>
            setSelectedFiles((prev) => ({ ...prev, banner: fileName }))
          }
          selectedFileName={selectedFiles.banner}
        />
      </section>
    </main>
  );
};
