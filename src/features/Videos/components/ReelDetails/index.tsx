import { cn } from "@/lib/utils";
import { ReelDescription } from "./ReelDescription";
import { useCurrentReel } from "../../hooks/useCurrentReel";
import { ReelAvatar } from "./ReelAvatar";
import { ReelCreatorName } from "./ReelCreatorName";
import { ReelLink } from "./ReelLink";
import { useCopyShareableLink } from "../../hooks/reel-actions/useCopyShareableLink";
import { ReelInteractions } from "../ReelInteractions";
import { useDeviceType } from "@/hooks/useDeviceType";

export const ReelDetails = ({
  className,
  locked = false,
}: {
  className?: string;
  locked?: boolean;
}) => {
  const { isMobile } = useDeviceType();
  const { reel } = useCurrentReel();
  const { copyShareableLink } = useCopyShareableLink();

  return (
    <div className={cn("z-10 w-screen md:w-full", className)}>
      <div className="flex flex-col gap-2.5 text-white md:text-black md:bg-black/5 rounded-3xl md:p-5 w-full">
        <div className="w-full flex justify-between items-end">
          <div className="flex flex-col md:flex-row justify-evenly gap-1.5 md:gap-3">
            <ReelAvatar reel={reel} />
            <ReelCreatorName creator={reel?.creator} />
          </div>
          {isMobile && (
            <ReelInteractions
              locked={locked}
              className="text-white z-10 pb-2"
            />
          )}
        </div>

        {reel?.description && <ReelDescription text={reel.description} />}

        {reel?.link && (
          <ReelLink
            url={reel.link}
            onClick={() => copyShareableLink(reel.link)}
          />
        )}
      </div>
    </div>
  );
};
