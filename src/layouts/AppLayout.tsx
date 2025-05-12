import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  // ** Hooks
  const { isLoading } = useAuth();

  return (
    <>
      {isLoading ? (
        <div className="w-full h-dvh flex flex-col justify-center items-center">
          <Spinner fullScreen />
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
}

export default AppLayout;