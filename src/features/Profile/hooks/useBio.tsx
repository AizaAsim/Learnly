import { useDeviceType } from "@/hooks/useDeviceType";
import { useEffect, useMemo, useState } from "react";

export const useBio = (bio: string | null) => {
  const { isMobile } = useDeviceType();

  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [isBioLengthExceeding, setIsBioLengthExceeding] = useState(false);

  const truncatedBioLength = useMemo(() => (isMobile ? 32 : 47), [isMobile]);

  useEffect(() => {
    if (bio) {
      setIsBioLengthExceeding(bio.length > truncatedBioLength);
    }
  }, [bio, truncatedBioLength]);

  const toggleBioExpansion = () => setIsBioExpanded((prev) => !prev);

  return {
    isBioExpanded,
    isBioLengthExceeding,
    toggleBioExpansion,
  };
};
