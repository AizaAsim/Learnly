import { ScrollViewContainer } from "@/components/wrapper/ScrollViewContainer";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import CreatorProfileCard from "@/features/Profile/components/CreatorProfileCard/index";
import { CreatorVideos } from "@/features/Profile/components/CreatorVideos";
import { MyVideos } from "@/features/Profile/components/MyVideos";
import { updateUsername } from "@/store/reducers/creatorProfileReducer";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AnimatedBackground } from "@/features/Profile/components/AnimatedBackground";

const ProfilePage = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isMyProfile = location.pathname === "/my-profile";

  useEffect(() => {
    if (isMyProfile && user?.username) {
      dispatch(updateUsername(user.username));
    } else if (username) {
      dispatch(updateUsername(username));
    }
  }, [isMyProfile, user?.username, username, dispatch]);

  useEffect(() => {
    const lowercaseUsername = username?.toLowerCase();
    if (username !== lowercaseUsername) {
      navigate(`/${lowercaseUsername}`, { replace: true });
    }
  }, [username, navigate]);

  return (
    <div className="min-h-screen bg-baseWhite">
      <ScrollViewContainer className="h-full flex flex-col overflow-y-auto px-4 md:px-8 pt-4 pb-16">
        {/* Profile card with animated background */}
        <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-primaryBlue to-mediumBlue mb-6 min-h-[500px] mx-auto w-full flex items-center justify-center">
          <AnimatedBackground>
            <div className="py-8 md:py-12 px-6 md:px-10 relative z-20 w-full items-center justify-center">
              <CreatorProfileCard
                username={isMyProfile ? user?.username : username}
                className="shadow-lg bg-light-T100 p-6 md:p-8 max-w-max mx-auto "
              />
            </div>
          </AnimatedBackground>
        </div>

        {/* Content area with accent borders */}
        <div className="bg-white rounded-xl shadow-sm border border-light-T30 ">
          <div className="border-b border-light-T30 py-4 px-6">
            <h2 className="text-xl font-semibold text-primaryBlue">
              {isMyProfile ? "My Content" : `${username}'s Content`}
              <span className="ml-2 text-accentGold text-sm font-normal">
                {isMyProfile ? '• Manage your videos' : '• Browse videos'}
              </span>
            </h2>
          </div>

          <div className="p-6 h-[500px]">
            {!username && <MyVideos />}
            {username && <CreatorVideos username={username} />}
          </div>
        </div>
      </ScrollViewContainer>
    </div>
  );
};

export default ProfilePage;