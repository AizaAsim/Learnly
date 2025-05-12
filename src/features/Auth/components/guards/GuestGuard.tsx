import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";
import { useModal } from "@/hooks/useModal";

export const GuestGuard = () => {
  const { isLoggedIn, user } = useAuth();
  const { closeModal } = useModal();

  // Close the modal on login
  useEffect(() => {
    if (user?.role) {
      closeModal();
    }
  }, [user?.role, closeModal]);

  return isLoggedIn ? <Navigate to={`/home`} /> : <Outlet />;
};
