import { useAuth } from "@/features/Auth/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { Roles } from "../features/Auth/types";
import { NoContentDisplay } from "@/components/NoContentDisplay";
import { Earnings } from "@/features/Insights/components/Earnings";
import { PreloadReelData } from "@/features/Videos/types";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function HomePage() {
  const { id } = useLoaderData() as PreloadReelData;
  const { currentRole } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentRole === Roles.USER && id) navigate(`/home/${id}`);
  }, [currentRole, id, navigate]);

  return currentRole === Roles.USER && !id ? (
    <NoContentDisplay
      text={t("homePage_noContent_text")}
      iconSrc="/icon/video.svg"
      textClassName="w-[197px]"
    />
  ) : (
    <Earnings />
  );
}

export default HomePage;
