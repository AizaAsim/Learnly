import { AuthTitle } from "@/components/layout/AuthTitle";
import { Trans, useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { VerificationForm } from "@/features/Auth/components/forms/VerificationForm";
import { VerificationContext } from "@/features/Auth/types";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { useDispatch } from "react-redux";
import { updateEmail } from "@/store/reducers/creatorProfileReducer";

const NewEmailVerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isLoading, verifyOtpForUpdateEmail } = useAuth();
  const email = location.state?.email;

  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate("/my-profile");
    }
  }, [email, navigate]);

  const handleOtpOnComplete = useCallback(
    async (otp: string) => {
      try {
        const result = await verifyOtpForUpdateEmail(email, otp);
        if (result?.isVerified) {
          dispatch(updateEmail(email));
          navigate("/my-profile");
        }
        setIsError(result?.isVerified ? false : true);
      } catch (e) {
        setIsError(true);
      }
    },
    [dispatch, email, navigate, verifyOtpForUpdateEmail]
  );

  if (!email) return null;

  return (
    <div className=" bg-white flex flex-col items-center">
      <AuthTitle
        title={t("newEmail_title_verify")}
        description={
          <Trans
            i18nKey={"newEmail_description_verify"}
            components={{
              strong: (
                <span className="text-ellipsis whitespace-nowrap overflow-hidden font-semibold" />
              ),
            }}
            values={{
              email: email,
            }}
          />
        }
      />
      <VerificationForm
        onComplete={handleOtpOnComplete}
        isError={isError}
        recipient={email}
        isVerifying={isLoading}
        context={VerificationContext.NEW_EMAIL}
      />
    </div>
  );
};

export default NewEmailVerificationPage;
