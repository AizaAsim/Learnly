import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "react-i18next";
import { useThumbnail } from "../hooks/useThumbnail";
import { useVideoUploadModals } from "../hooks/useVideoUploadModals";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { setSelectedThumbnail } from "@/store/reducers/reelUploadReducer";
import { AppDispatch } from "@/store";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";

export const VideoCover = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { openReviewReel } = useVideoUploadModals();
  const { selectedThumbnail, thumbnails } = useThumbnail();
  const [cover, setCover] = useState(selectedThumbnail);

  const handleSave = () => {
    if (!cover) return;
    dispatch(setSelectedThumbnail(cover));
    openReviewReel();
  };

  return (
    <div className="flex flex-col gap-4 max-w-[327px]md:max-w-full mx-auto">
      {cover ? (
        <img
          src={cover.url}
          className="w-[292px] h-[382px] object-cover rounded-3xl bg-gradient-to-tr from-grayscale-4 to-grayscale-12 mx-auto"
        />
      ) : (
        <div className="w-[292px] h-[382px] rounded-3xl bg-gradient-to-tr from-grayscale-4 to-grayscale-12 animate-pulse mx-auto">
          <Spinner />
        </div>
      )}
      <motion.div
        className="flex justify-center"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {thumbnails.map((thumbnail, index) => (
          <motion.img
            key={thumbnail.time}
            src={thumbnail.url}
            className={cn(
              "size-16 object-cover bg-gradient-to-tr from-grayscale-4 to-grayscale-12",
              {
                "rounded-l-xl": index === 0,
                "rounded-r-xl": index === thumbnails.length - 1,
                "shadow-[0_0_0_4px_#FFD762] rounded-lg z-10":
                  thumbnail.time === cover?.time,
              }
            )}
            onClick={() => setCover(thumbnail)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: { opacity: 1, scale: 1 },
            }}
          />
        ))}
      </motion.div>

      <div className="flex flex-col gap-4">
        <Button onClick={handleSave} disabled={!cover}>
          {t("reelUpload_button_save")}
        </Button>
        <Button variant="ghost" size="none" onClick={openReviewReel}>
          {t("reelUpload_button_cancel")}
        </Button>
      </div>
    </div>
  );
};
