import {
  Toast,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import SvgIcon from "./svg-icon";
import isString from "lodash-es/isString";
import { cn } from "@/lib/utils";
import { useDeviceType } from "@/hooks/useDeviceType";

export function Toaster() {
  const { toasts } = useToast();
  const { isDesktop } = useDeviceType();

  const hasSettingsSidebar =
    isDesktop && window.location.pathname.includes("/settings");

  return (
    <ToastProvider>
      {toasts.map(function ({ id, text, icon, ...props }) {
        return (
          <Toast key={id} {...props}>
            {icon &&
              (isString(icon) ? (
                <SvgIcon src={icon} width="24" height="24" strokeWidth="0" />
              ) : (
                icon
              ))}
            {text && <ToastTitle>{text}</ToastTitle>}
          </Toast>
        );
      })}
      <ToastViewport
        // Shift the toast viewport to the right if the settings sidebar is open
        className={cn({ "left-[calc(50%+185px)]": hasSettingsSidebar })}
      />
    </ToastProvider>
  );
}
