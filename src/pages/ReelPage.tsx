import { lazy, ReactNode, Suspense, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { useLoaderData, useParams } from "react-router-dom";
import { PreloadReelData, SlideControls } from "@/features/Videos/types";
import "swiper/css";
import "swiper/css/mousewheel";
import "swiper/css/keyboard";
import "swiper/css/virtual";
import { ReelHeader } from "@/features/Videos/components/ReelHeader";
import { cn } from "@/lib/utils";
import { useDeviceType } from "@/hooks/useDeviceType";
import { ReelDetails } from "@/features/Videos/components/ReelDetails";
import { ReelListControls } from "@/features/Videos/components/ReelList/ReelListControls";
import { ReelInteractions } from "@/features/Videos/components/ReelInteractions";
import { motion } from "framer-motion";
import { useInactivityChecker } from "@/hooks/useInactivityChecker";
import { SubscribeButton } from "@/components/ui/subscribe-button";
import { useSubscribeModal } from "@/features/Stripe/hooks/useSubscribeModal";

const ReelList = lazy(
  async () => import("@/features/Videos/components/ReelList")
);

function FadeSpan({
  children,
  fade,
  className,
}: {
  children: ReactNode;
  fade: boolean;
  className?: string;
}) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 1 }}
      animate={{ opacity: fade ? 0 : 1 }}
      transition={{ duration: fade ? 1.75 : 0 }}
    >
      {children}
    </motion.div>
  );
}

const ReelPage = () => {
  // These are coming from the preloaders/reels.tsx file (called in the router)
  const { selector, menu } = useLoaderData() as PreloadReelData;
  const { id } = useParams();
  const { isMobile } = useDeviceType();
  const reels = useSelector(selector);
  const { openSubscribeCheckout, loading: checkoutLoading } =
    useSubscribeModal();

  const reelListRef = useRef<SlideControls>(null);

  const currentIndex = useMemo(() => {
    if (!id) return 0;
    const i = reels.findIndex((r) => r.id === id);
    return i === -1 ? 0 : i;
  }, [id, reels]);

  const reel = useMemo(() => reels[currentIndex], [reels, currentIndex]);

  const isNotSubscribed = reel.playbackIds.length === 0;

  const isInactive = useInactivityChecker();

  return (
    <div
      className={cn({
        "grid grid-cols-12": !isMobile,
      })}
    >
      <div
        className={cn({
          "inset-0 fixed": isMobile,
          "relative overflow-hidden col-span-7": !isMobile,
        })}
        style={{
          pointerEvents: "auto",
          backgroundSize: "100% auto",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "black",
          backgroundImage: !reel?.thumbnail ? "none" : `url(${reel.thumbnail})`,
        }}
      >
        {isNotSubscribed && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#00000029] backdrop-blur-2xl">
            <div className="w-[110px] h-[110px] bg-light-T16 opacity-[0.64] rounded-full backdrop-blur-[50px] flex items-center justify-center" />
            <img
              src="/icon/lock-lg.svg"
              alt="lock"
              className="absolute opacity-70 drop-shadow-md"
            />
          </div>
        )}
        <span
          className={cn("absolute inset-0", {
            "bg-black/80": !isMobile && !isNotSubscribed,
          })}
        ></span>
        <FadeSpan fade={isInactive && !isNotSubscribed}>
          <ReelHeader
            className={cn({
              "w-[58%]": !isMobile,
              "w-full": isMobile,
            })}
            // used span instead of a null because otherwise the flex justify-between will place the text in the left
            menu={isNotSubscribed ? <span /> : menu}
          />
        </FadeSpan>

        <Suspense fallback={null}>
          <ReelList ref={reelListRef} reels={reels} index={currentIndex} />
        </Suspense>

        <FadeSpan fade={isInactive && !isNotSubscribed}>
          {!isMobile && (
            <ReelListControls
              className="absolute top-[50%] right-0"
              onNext={() => reelListRef.current?.nextSlide()}
              onPrevious={() => reelListRef.current?.previousSlide()}
              hasNext={currentIndex < reels.length - 1}
              hasPrevious={currentIndex > 0}
            />
          )}
          {isMobile && (
            <>
              {/* 100px comes from the height of the tabbed links on mobile (52px) + relative position (48px) */}
              <ReelDetails
                className={cn("px-4 pb-1 fixed bottom-[100px]", {
                  // There is no tabbed links in locked reel screen
                  "bottom-20": isNotSubscribed,
                })}
                locked={isNotSubscribed}
              />
            </>
          )}
        </FadeSpan>
        {/* Show subscribe button if there is no playback id */}
        {isNotSubscribed && (
          <SubscribeButton
            subscriptionPrice={20}
            className={cn("fixed bottom-4 w-[calc(100%-32px)] mx-4 z-50", {
              "w-[calc(58%-32px)]": !isMobile,
            })}
            variant="light"
            onClick={() => openSubscribeCheckout(reel.creatorId)}
            disabled={checkoutLoading}
          />
        )}
      </div>
      {!isMobile && (
        <div className="col-span-5 bg-white">
          <ReelDetails className="p-5" />
          <ReelInteractions locked={isNotSubscribed} />
        </div>
      )}
    </div>
  );
};

export default ReelPage;
