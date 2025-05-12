import { Trans } from "react-i18next";
import { Button } from "../../../../components/ui/button";
import { useModal } from "../../../../hooks/useModal";
import { useAuth } from "../../hooks/useAuth";
import { router } from "@/router";

export const LogoutView = () => {
  const { signOut } = useAuth();
  const { closeModal } = useModal();

  const handleSignOut = async () => {
    await signOut();
    closeModal();
    router.navigate("/auth");
  };

  const handleClose = () => {
    closeModal();
  };

  return (
    <div className="flex flex-col">
      <Button onClick={handleSignOut}>
        <Trans i18nKey="logoutView_text_title" />
      </Button>
      <Button variant="link" onClick={handleClose}>
        <Trans i18nKey="logoutView_button_cancel" />
      </Button>
    </div>
  );
};
