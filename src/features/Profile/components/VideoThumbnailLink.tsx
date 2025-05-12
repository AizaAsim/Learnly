import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
type Props = {
  src?: string;
  text?: string;
  className?: string;
};

export const VideoThumbnailLink = ({ src, text, className }: Props) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      className={cn("relative bg-grayscale-40", {
        "animate-pulse": !imgLoaded,
      })}
    >
      <motion.img
        src={src}
        alt={`video thumbnail`}
        className={cn("w-full h-full object-fill", className)}
        animate={{ opacity: imgLoaded ? 1 : 0 }}
        onLoad={() => setImgLoaded(true)}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 0.95, borderRadius: "14px" }}
        transition={{ bounce: 0 }}
      />
      <p className="w-full text-center absolute top-1/2 left-1/2 -translate-x-1/2 text-md text-white opacity-90">
        {text}
      </p>
    </div>
  );
};
