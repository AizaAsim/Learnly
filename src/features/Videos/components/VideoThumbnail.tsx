import { cn } from "@/lib/utils";
import { ReelData } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { Clock, Play } from "lucide-react";
import { ComponentProps, useMemo, useState } from "react";
import { motion } from "framer-motion";

interface Props extends ComponentProps<"div"> {
  video: ReelData;
  to?: string;
  locked: boolean;
  imageClassname?: string;
}

export const VideoThumbnail = ({
  video,
  imageClassname,
  className,
  locked,
  ...props
}: Props) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  const formattedScheduledAt = useMemo(() => {
    const scheduledFor = new Timestamp(
      video?.scheduledAt?._seconds ?? 0,
      0
    )?.toMillis();
    if (!scheduledFor) return "";
    return formatDistanceToNow(scheduledFor);
  }, [video]);

  const display = useMemo(() => {
    return (
      !locked &&
      (video.scheduledAt && video.scheduledAt._seconds * 1000 > Date.now() ? (
        <>
          <Clock size="12" className="ml-3 mr-2" />
          <p>{formattedScheduledAt}</p>
        </>
      ) : (
        <>
          <Play size="12" className="ml-3 mr-2" />
          <p>{video.views ?? 0}</p>
        </>
      ))
    );
  }, [formattedScheduledAt, video.scheduledAt, video.views, locked]);

  return (
    <div
      className={cn(
        "relative bg-grayscale-40 aspect-[9/16]",
        {
          "animate-pulse": !imgLoaded,
        },
        className
      )}
      {...props}
    >
      <motion.img
        src={video.thumbnail}
        alt={`video thumbnail`}
        className={cn("w-full h-full object-fill", imageClassname)}
        animate={{ opacity: imgLoaded ? 1 : 0 }}
        onLoad={() => setImgLoaded(true)}
        onError={() => setImgLoaded(true)}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 0.95, borderRadius: "14px" }}
        transition={{ bounce: 0 }}
      />
      {imgLoaded && locked && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#00000029] backdrop-blur-[19px]">
          <div className="w-[52px] h-[52px] bg-white opacity-15 rounded-full backdrop-blur-xl flex items-center justify-center" />
          <img
            src="/icon/lock.svg"
            alt="lock"
            className="absolute opacity-70 drop-shadow-md"
          />
        </div>
      )}
      <div className="absolute bottom-2 text-white flex items-center justify-start text-xs">
        {display}
      </div>
    </div>
  );
};
