import { useDeviceType } from "@/hooks/useDeviceType";
import { useEffect, useMemo, useState } from "react";

export const useReelDescription = (description: string | null) => {
  const { isMobile } = useDeviceType();

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isDescriptionLengthExceeding, setIsDescriptionLengthExceeding] =
    useState(false);

  const truncatedDescriptionLength = useMemo(
    () => (isMobile ? 37 : 47),
    [isMobile]
  );

  useEffect(() => {
    if (description) {
      setIsDescriptionLengthExceeding(
        description.length > truncatedDescriptionLength
      );
    }
  }, [description, truncatedDescriptionLength]);

  const toggleDescriptionExpansion = () =>
    setIsDescriptionExpanded((prev) => !prev);

  return {
    isDescriptionExpanded,
    isDescriptionLengthExceeding,
    toggleDescriptionExpansion,
  };
};
