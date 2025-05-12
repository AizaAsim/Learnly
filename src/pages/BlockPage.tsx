import { NoContentDisplay } from "@/components/NoContentDisplay";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { useEffect } from "react";
import { Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";

function BlockPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.isBlocked === false) {
      navigate("/", {
        replace: true,
      });
    }
  }, [user, navigate]);

  return (
    <NoContentDisplay
      text={
        <Trans
          i18nKey={"account_blocked"}
          components={{
            underline: <a className="underline" href="#" />,
          }}
        />
      }
      iconSrc="/icon/ban.svg"
      textClassName="w-3/4 md:w-96 max-w-96"
    />
  );
}

export default BlockPage;
