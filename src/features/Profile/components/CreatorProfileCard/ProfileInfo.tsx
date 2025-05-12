import { useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useBio } from "../../hooks/useBio";
import { logError } from "@/services/logging";
import { useDeviceType } from "@/hooks/useDeviceType";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { cn } from "@/lib/utils";

interface ProfileInfoProps {
  displayName: string;
  bio: string | null;
  username: string;
  isOwner: boolean;
}

export const ProfileInfo = ({
  displayName,
  bio,
  username,
  isOwner,
}: ProfileInfoProps) => {
  const { isMobile } = useDeviceType();
  const { toast } = useToast();
  const { isBioExpanded, isBioLengthExceeding, toggleBioExpansion } =
    useBio(bio);
  const [, copy] = useCopyToClipboard();

  const handleCopyUsername = useCallback(async () => {
    const text = `${import.meta.env.VITE_BASE_URL}/${username}`;
    const success = await copy(text);
    if (success) {
      toast({
        text: "Copied!",
        variant: "blur",
        duration: 2000,
      });
    } else {
      logError("Failed to copy username");
    }
  }, [copy, toast, username]);

  return (
    <div className="w-[272px] md:w-auto mx-auto flex flex-col gap-2.5 md:gap-4 justify-center items-center">
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex justify-center items-center">
          <h3 className="font-bold text-primaryBlue text-lg leading-6 md:text-3xl md:leading-7 md:-tracking-[0.22px]">
            {displayName}
          </h3>
        </div>
        {isOwner && username && (
          <div
            className="flex gap-1 justify-center items-center cursor-pointer"
            onClick={handleCopyUsername}
          >
            <img src="/icon/link.svg" alt="link" className="md:h-5 md:w-5" />
            <p className="font-semibold text-dark-T50 text-[13px] md:text-[15px] leading-[16px] md:leading-5 -tracking-[0.195px] md:-tracking-[0.225px] text-center">
              learnly.com/{username}
            </p>
          </div>
        )}
      </div>
      {bio && (
        <div>
          <p
            className={cn(
              "mb-1 text-[13px] md:text-base text-center font-medium text-dark-T80 leading-4 md:leading-6 -tracking-[0.26px] max-w-[290px] md:max-w-[442px] mx-auto flex items-center gap-1",
              isBioExpanded && "flex-col"
            )}
          >
            {isBioExpanded || !isBioLengthExceeding
              ? bio
              : `${bio.substring(0, isMobile ? 32 : 47)}...`}
            {isBioLengthExceeding && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleBioExpansion}
                className="text-dark-T30 text-[13px] md:text-base font-semibold leading-4 md:leading-[22px] h-auto p-0 hover:bg-transparent focus:text-dark-T30"
              >
                {isBioExpanded ? "less" : "See more"}
              </Button>
            )}
          </p>
        </div>
      )}
    </div>
  );
};
