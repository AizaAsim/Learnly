import { useState, useCallback, useEffect } from "react";
import { firestore } from "@/services/firebase";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { ReelData } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

type InteractionType = "like" | "bookmark";

export const useVideoInteractions = (reel: ReelData) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(reel?.likesCount || 0);
  const [bookmarkCount, setBookmarkCount] = useState(reel?.bookmarksCount || 0);

  const checkInteractionStatus = useCallback(async () => {
    if (!user || !reel) return;

    const likeQuery = query(
      collection(firestore, "likes"),
      where("userId", "==", user.uid),
      where("videoId", "==", reel.id),
      limit(1)
    );
    const bookmarkQuery = query(
      collection(firestore, "bookmarks"),
      where("userId", "==", user.uid),
      where("videoId", "==", reel.id),
      limit(1)
    );

    const [likeSnapshot, bookmarkSnapshot] = await Promise.all([
      getDocs(likeQuery),
      getDocs(bookmarkQuery),
    ]);

    if (likeSnapshot.size > 0) {
      const likeDoc = likeSnapshot.docs[0];
      setIsLiked(!likeDoc.data().deleted);
      setLikeCount(reel.likesCount || 0);
    } else {
      setIsLiked(false);
      setLikeCount(0);
    }

    if (bookmarkSnapshot.size > 0) {
      const bookmarkDoc = bookmarkSnapshot.docs[0];
      setIsBookmarked(!bookmarkDoc.data().deleted);
      setBookmarkCount(reel.bookmarksCount || 0);
    } else {
      setIsBookmarked(false);
      setBookmarkCount(0);
    }
  }, [reel, user]);

  useEffect(() => {
    checkInteractionStatus();
  }, [checkInteractionStatus]);

  const handleInteraction = useCallback(
    async (type: InteractionType) => {
      if (!user || !reel) return;

      const collectionName = type === "like" ? "likes" : "bookmarks";
      const isInteracted = type === "like" ? isLiked : isBookmarked;
      const interactionId = `${user.uid}_${reel.id}`;
      const docRef = doc(firestore, collectionName, interactionId);

      if (isInteracted) {
        await setDoc(
          docRef,
          {
            deleted: true,
            updatedAt: Timestamp.now(),
          },
          { merge: true }
        );
        type === "like" ? setIsLiked(false) : setIsBookmarked(false);
        type === "like"
          ? setLikeCount((prev) => prev - 1)
          : setBookmarkCount((prev) => prev - 1);
      } else {
        const interactionInfo = {
          videoId: reel.id,
          userId: user.uid,
          creatorId: reel.creatorId,
          target: `reels/${reel.id}`,
          deleted: false,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        await setDoc(docRef, interactionInfo);
        if (type === "like") {
          setIsLiked(true);
          setLikeCount((prev) => prev + 1);
        } else {
          setIsBookmarked(true);
          setBookmarkCount((prev) => prev + 1);
        }
      }
      if (type === "bookmark") {
        const toastMsg = isBookmarked
          ? t("videoPlayer_toast_bookmark_removed")
          : t("videoPlayer_toast_bookmark_added");
        toast({
          text: toastMsg,
          variant: "success",
        });
      }
    },
    [user, reel, isLiked, isBookmarked, t, toast]
  );

  const handleLike = useCallback(
    () => handleInteraction("like"),
    [handleInteraction]
  );
  const handleBookmark = useCallback(
    () => handleInteraction("bookmark"),
    [handleInteraction]
  );

  return {
    isLiked,
    isBookmarked,
    handleLike,
    handleBookmark,
    likeCount,
    bookmarkCount,
  };
};
