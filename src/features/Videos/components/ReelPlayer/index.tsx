import { useAuth } from "@/features/Auth/hooks/useAuth";
import { MuxPlayerRefAttributes } from "@mux/mux-player-react";
import MuxPlayer from "@mux/mux-player-react/lazy";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import useVideoTokens from "../../hooks/useVideoTokens";
import { ReelData } from "@/types";
import { cn } from "@/lib/utils";
import "@/styles/mux.css";

export const ReelPlayer = forwardRef<
  MuxPlayerRefAttributes,
  {
    reel: ReelData;
    onVideoLoaded?: () => void;
    onProgressChange?: (progress: number) => void;
  }
>(({ reel, onVideoLoaded, onProgressChange }, ref) => {
  useImperativeHandle(ref, () => playerRef.current as MuxPlayerRefAttributes);

  const { user } = useAuth();
  const playerRef = useRef<MuxPlayerRefAttributes | null>(null);

  const playbackId = useMemo(() => {
    return reel.playbackIds?.[0]?.id;
  }, [reel]);

  const tokens = useVideoTokens(playbackId);

  const handleTimeUpdate = useCallback(() => {
    if (playerRef.current) {
      const currentTime = playerRef.current.currentTime;
      const duration = playerRef.current.duration;
      const calculatedProgress = (currentTime / duration) * 100;
      onProgressChange && onProgressChange(calculatedProgress);
    }
  }, [onProgressChange]);

  return (
    tokens && (
      <div className="relative xs:h-screen xs:w-screen sm:w-full sm:h-full flex flex-col items-center justify-start">
        <MuxPlayer
          ref={playerRef}
          streamType="on-demand"
          playbackId={playbackId}
          tokens={tokens}
          disableTracking={false}
          metadataViewerUserId={user?.uid}
          onTimeUpdate={handleTimeUpdate}
          autoPlay={true}
          onLoadedData={onVideoLoaded}
          forwardSeekOffset={1}
          backwardSeekOffset={1}
          loop
        />
        <img
          src="/img/overlay.png"
          className={cn("absolute w-full h-full inset-0 pointer-events-none")}
        />
      </div>
    )
  );
});

export default ReelPlayer;
