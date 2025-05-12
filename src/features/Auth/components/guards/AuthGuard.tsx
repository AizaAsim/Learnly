import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Role, Roles } from "../../types";
import { useAuth } from "../../hooks/useAuth";
import { lazy } from "react";
import { Spinner } from "@/components/ui/spinner";
import { EnsureNames } from "@/components/logical/EnsureNames";
import { useActiveStripeModal } from "@/features/Stripe/hooks/useActiveStripeModal";
import { EnsureEmail } from "@/components/logical/EnsureEmail";

// We're loading this lazily in the auth guard to avoid loading it on every page
// and because it's not needed until the user is authenticated.
const NotificationListener = lazy(() =>
  import("@/components/logical/NotificationListener.tsx").then((module) => ({
    default: module.default,
  }))
);

export const AuthGuard = ({ role = Roles.USER }: { role?: Role | Role[] }) => {
  const { user, isAuthLoading } = useAuth();
  const location = useLocation();
  useActiveStripeModal();

  if (isAuthLoading) return <Spinner fullScreen />;

  if (!user || !user.role) {
    return <Navigate to="/" />;
  }

  const hasCorrectRole = Array.isArray(role)
    ? role.includes(user.role)
    : role === user.role;

  if (!hasCorrectRole) {
    return <Navigate to="/" />;
  }

  if (user.isBlocked && location.pathname !== "/block") {
    return <Navigate to="/block" />;
  }

  return (
    <>
      <NotificationListener />
      <EnsureNames />
      <EnsureEmail />
      <Outlet />
    </>
  );
};
