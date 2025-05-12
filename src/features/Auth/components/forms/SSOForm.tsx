import { Button } from "@/components/ui/button";
import { FaApple } from "react-icons/fa";
import { Trans } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";
import { Role } from "../../types";
import SvgIcon from "@/components/ui/svg-icon";
import GoogleIcon from "/icon/google.svg";

export const SSOForm = ({ role }: { role?: Role }) => {
  const { signInWithGoogle, isLoading } = useAuth();
  return (
    <div className="flex flex-col gap-3">
      <Button
        className={classes.ssoButton}
        variant="outline"
        disabled={isLoading}
        onClick={() => signInWithGoogle(role)}
      >
        <SvgIcon
          src={GoogleIcon}
          className={classes.ssoButtonIcon}
          strokeWidth="0"
        />
        <Trans i18nKey="ssoForm_button_google" />
      </Button>
      <Button
        className={classes.ssoButton}
        variant="outline"
        disabled={isLoading}
        onClick={() => signInWithGoogle(role)}
      >
        <FaApple className={classes.ssoButtonIcon} size={20} />
        <span className="relative -left-1">
          <Trans i18nKey="ssoForm_button_apple" />
        </span>
      </Button>
    </div>
  );
};

const classes = {
  ssoButton: "relative",
  ssoButtonIcon: "absolute left-6",
};
