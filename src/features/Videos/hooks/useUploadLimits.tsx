import { useAuth } from "@/features/Auth/hooks/useAuth";
import { getMyVideosCount } from "@/features/Profile/services/callable";
import { logError } from "@/services/logging";
import { useEffect, useState } from "react";

export const useUploadLimits = () => {
  const { user } = useAuth();
  const [draftsUnderLimit, setDraftsUnderLimit] = useState(true);
  const [scheduledUnderLimit, setScheduledUnderLimit] = useState(true);
  const [archivedUnderLimit, setArchivedUnderLimit] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchVideoCounts = async () => {
      try {
        const { data } = await getMyVideosCount();
        const { drafts, scheduled, archived } = data;

        const maxDrafts =
          Number(import.meta.env.VITE_MAX_DRAFTS_REELS_PER_USER) || 500;
        const maxScheduled =
          Number(import.meta.env.VITE_MAX_SCHEDULED_REELS_PER_USER) || 500;
        const maxArchived =
          Number(import.meta.env.VITE_MAX_ARCHIVED_REELS_PER_USER) || 100;

        setDraftsUnderLimit(drafts < maxDrafts);
        setScheduledUnderLimit(scheduled < maxScheduled);
        setArchivedUnderLimit(archived < maxArchived);
      } catch (error) {
        logError("Failed to fetch video counts", error);
      }
    };

    fetchVideoCounts();
  }, [user?.uid]);

  return {
    draftsUnderLimit,
    scheduledUnderLimit,
    archivedUnderLimit,
  };
};
