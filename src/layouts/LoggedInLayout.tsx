import { BannerProvider } from "@/contexts/BannerContext";
import { Outlet } from "react-router-dom";

export function LoggedInLayout() {
  return (
    <BannerProvider>
      <Outlet />
    </BannerProvider>
  );
}

export default LoggedInLayout;