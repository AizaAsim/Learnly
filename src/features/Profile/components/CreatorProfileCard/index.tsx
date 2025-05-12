import { useAuth } from "@/features/Auth/hooks/useAuth";
import { cn } from "@/lib/utils";
import { AppDispatch } from "@/store";
import { fetchCreatorProfile } from "@/store/reducers/creatorProfileReducer";
import {
  selectCancelAtPeriodEnd,
  selectCreatorAccountDeleted,
  selectCreatorProfileData,
  selectCreatorProfileLoading,
  selectIsPastDue,
  selectIsSubscribed,
} from "@/store/selectors/creatorProfileSelectors";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { ProfileActions } from "./ProfileActions";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileInfo } from "./ProfileInfo";
import { ProfileStats } from "./ProfileStats";
import { ProfileAddOnActions } from "./ProfileAddOnActions";
import { ErrorDisplay } from "@/components/ErrorDisplay";

interface CreatorProfileCardProps {
  className?: string;
  username?: string;
}

const CreatorProfileCard = ({
  className,
  username,
}: CreatorProfileCardProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const profileData = useSelector(selectCreatorProfileData);
  const cancelAtPeriodEnd = useSelector(selectCancelAtPeriodEnd);
  const profileLoading = useSelector(selectCreatorProfileLoading);
  const isSubscribed = useSelector(selectIsSubscribed);
  const isPastDue = useSelector(selectIsPastDue);
  const isCreatorAccountDeleted = useSelector(selectCreatorAccountDeleted);
  const { user } = useAuth();

  const [bio, setBio] = useState(profileData?.bio);


  const isOwner = useMemo(
    () => user?.uid === profileData?.id,
    [user, profileData]
  );

  useEffect(() => {
    if (profileData?.bio) setBio(profileData.bio);
  }, [profileData?.bio, setBio]);

  useEffect(() => {
    if (username) dispatch(fetchCreatorProfile(username));
  }, [dispatch, username]);

  if (profileLoading) {
    return <LoadingSkeleton className={className} />;
  }

  if (!profileData) {
    return (
      <div className="mt-16">
        <ErrorDisplay type="404" />
      </div>
    );
  }

  return (
    <div className={cn("text-center", className)}>
      <div className="flex gap-5 justify-between items-center md:flex-row">
        <ProfileAvatar avatar_url={profileData.avatar_url} isOwner={isOwner} className="md:h-[270px] md:w-[200px] md:rounded-sm" />
        <div className="flex flex-col items-center md:gap-4 gap-2.5 mt-3 md:mt-6 md:mb-6">
          <ProfileInfo
            displayName={profileData.displayName}
            bio={profileData?.bio}
            username={profileData?.username || ""}
            isOwner={isOwner}
          />
          {isOwner && <ProfileAddOnActions addOnType="bio" bio={bio || null} />}
          <ProfileStats counts={profileData.counts} />
          {/* {(isOwner || connectedSocials.length > 0) && (
          <div className="mt-1">
            <ProfileSocials
              socials={connectedSocials} // TODO: Replace with actual data
            />
            {isOwner && (
              <ProfileAddOnActions
                connectedSocials={connectedSocials}
                setConnectedSocials={setConnectedSocials}
                addOnType="socials"
              />
            )}
          </div>
        )} */}
          <div className="max-w-[261px]">
            <ProfileActions
              id={profileData.id}
              isSubscribed={isSubscribed}
              subscriptionPrice={profileData.subscriptionPrice}
              isSubscriptionActivated={profileData.isSubscriptionActivated}
              isOwner={isOwner}
              cancelAtPeriodEnd={cancelAtPeriodEnd || false}
              isPastDue={isPastDue}
              isCreatorAccountDeleted={isCreatorAccountDeleted}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreatorProfileCard;
