import {
  forwardRef,
  lazy,
  MouseEvent,
  Suspense,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ReelData } from "@/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Mousewheel } from "swiper/modules";
import { Swiper as SwiperType } from "swiper/types";
import "swiper/css";
import "swiper/css/mousewheel";
import "swiper/css/keyboard";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { MuxPlayerRefAttributes } from "@mux/mux-player-react";
import { Spinner } from "@/components/ui/spinner";
import { SlideControls } from "../../types";

interface ReelListProps {
  reels: ReelData[];
  index?: number;
  onMouseMove?: (e: MouseEvent) => void;
  onMouseOver?: (e: MouseEvent) => void;
  onMouseEnter?: (e: MouseEvent) => void;
  onMouseLeave?: (e: MouseEvent) => void;
}

const ReelPlayer = lazy(
  async () => import("@/features/Videos/components/ReelPlayer")
);

export const ReelList = forwardRef<SlideControls, ReelListProps>(
  (
    { reels, index = 0, onMouseMove, onMouseOver, onMouseEnter, onMouseLeave },
    ref
  ) => {
    const [swiper, setSwiper] = useState<SwiperType | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const playerRefs = useRef<MuxPlayerRefAttributes[]>([]);
    const [currentIndex, setCurrentIndex] = useState(index);

    // Functions to the ref
    useImperativeHandle(ref, () => ({
      nextSlide: () => {
        if (swiper) swiper.slideNext();
      },
      previousSlide: () => {
        if (swiper) swiper.slidePrev();
      },
    }));

    // Load the correct reel on initial render
    useEffect(() => {
      if (index > 0 && swiper) {
        swiper.slideTo(index, 0);
      }
    }, [index, swiper]);

    const addRefToRefsArray = useCallback((el: MuxPlayerRefAttributes | null) => {
      if (!el) return;
      if (!playerRefs.current.find((p) => p === el)) {
        playerRefs.current.push(el);
      }
    }, []);

    const pausePreviousPlayer = useCallback(() => {
      if (playerRefs.current[currentIndex]) {
        playerRefs.current[currentIndex].pause();
        playerRefs.current[currentIndex].currentTime = 0;
      }
    }, [currentIndex]);

    const playCurrentPlayer = useCallback((swiper: SwiperType) => {
      if (playerRefs.current[swiper?.activeIndex]) {
        playerRefs.current[swiper?.activeIndex].play();
      }
    }, []);

    // Update the url when the reel changes
    const updateReelIdInUrl = useCallback(
      (swiper: SwiperType) => {
        const r = reels[swiper.activeIndex];
        const urlWithoutId = location.pathname
          .split("/")
          .slice(0, -1)
          .join("/");
        const idFromUrl = location.pathname.split("/").pop();
        if (idFromUrl === r.id) return;
        const newUrl = `${urlWithoutId}/${r.id}`;
        navigate(newUrl, { replace: true });
      },
      [location.pathname, navigate, reels]
    );

    const handleSlideChange = (swiper: SwiperType) => {
      updateReelIdInUrl(swiper);
      pausePreviousPlayer();
      playCurrentPlayer(swiper);
      setCurrentIndex(swiper.activeIndex);
    }

    return (
      <Suspense fallback={<Spinner />}>
        <Swiper
          className={cn(
            "bg-transparent min-h-screen max-h-screen aspect-[9/16]"
          )}
          // Core props
          onSwiper={setSwiper}
          initialSlide={index}
          navigation={false}
          pagination={false}
          direction="vertical"
          spaceBetween={0}
          autoHeight={true}
          slidesPerView={1}
          slidesPerGroup={1}
          preventInteractionOnTransition={true}
          // Input method props
          modules={[Mousewheel, Keyboard]}
          keyboard={true}
          mousewheel={{
            enabled: true,
            forceToAxis: true,
            thresholdDelta: 5,
            thresholdTime: 350,
          }}
          // Mobile device props
          nested={true}
          allowTouchMove={true}
          simulateTouch={true}
          lazyPreloadPrevNext={1}
          passiveListeners={true}
          // Event Handlers
          onSlideChange={handleSlideChange}
          onMouseMove={onMouseMove}
          onMouseOver={onMouseOver}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {reels.length > 0 &&
            reels.map((reel) => (
              <SwiperSlide key={reel.id}>
                <ReelPlayer ref={addRefToRefsArray} reel={reel} />
              </SwiperSlide>
            ))}
        </Swiper>
      </Suspense>
    );
  }
);

export default ReelList;
