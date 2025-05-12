import { useVideoUpload } from "../hooks/useVideoUpload";
import { FaCircleExclamation } from "react-icons/fa6";
import CircularProgress from "@/components/ui/circular-progress";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useDeviceType } from "@/hooks/useDeviceType";
import "@/styles/animations/dot-loader.css";

interface VideoUploadProps {
  onUploadSuccess?: () => void;
}

export const VideoUpload = ({ onUploadSuccess }: VideoUploadProps) => {
  const {
    progress,
    uploadId,
    isUploading,
    isCancelling,
    uploadError,
    handleFileChange,
    handleFileDrop,
    cancelReelUpload,
  } = useVideoUpload(onUploadSuccess);
  const { t } = useTranslation();
  const { isMobile } = useDeviceType();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadButtonClick = () => {
    if (fileInputRef.current && !isUploading) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full mx-auto md:gap-5">
      <input
        id="hidden-input-element"
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept=".mov, .avi, .mp4"
        disabled={isUploading}
      />
      <label
        htmlFor="hidden-input-element"
        className={cn(
          "rounded-3xl h-[340px] md:h-[400px] px-[50px] flex flex-col items-center justify-center relative cursor-pointer",
          {
            "cursor-not-allowed": isUploading,
            "transition-colors duration-200": !isUploading,
          }
        )}
        onDrop={isUploading ? undefined : handleFileDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          // Native CSS properties don't support the customization of border-style. Therefore, we use a trick with an SVG image inside background-image property.
          backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='24' ry='24' stroke='%2300000029' stroke-width='3' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
        }}
      >
        {uploadError && (
          <div className="text-red text-sm md:text-[15px] text-center font-semibold bg-red-t10 px-3 py-1.5 rounded-full flex gap-1.5 items-center absolute top-8 md:top-12">
            <FaCircleExclamation />
            <p>{uploadError}</p>
          </div>
        )}
        {!isUploading && (
          <div className="flex flex-col gap-3 md:gap-6 items-center">
            <img src="/icon/video-upload.svg" className="size-14" />
            <div className="text-sm font-semibold  text-mediumBlue text-center leading-[18px] -tracking-[0.14px]">
              <p>{t("reelUpload_modal_maxSize", { maxSize: 1 })}</p>
              <p>{t("reelUpload_modal_maxDuration", { maxDuration: 10 })}</p>
            </div>
          </div>
        )}

        {isUploading && (
          <>
            {progress === 100 ? (
              <div className="dot-loader" />
            ) : (
              <CircularProgress
                width={isMobile ? 47 : 72}
                percentage={progress}
                strokeWidth={isMobile ? 4.67 : 5}
              />
            )}
          </>
        )}
      </label>
      {isUploading ? (
        <Button
          onClick={cancelReelUpload}
          // Disable button when the cancellation is in progress or when the uploadId is not fetched
          disabled={isCancelling || !uploadId || progress === 100}
        >
          {t("reelUpload_button_cancel")}
        </Button>
      ) : (
        <Button onClick={handleUploadButtonClick}>
          {t("reelUpload_button_upload")}
        </Button>
      )}
    </div>
  );
};
