import { router } from "@/router";
import { RouterProvider } from "react-router-dom";
import { UserProvider } from "@/features/Auth/contexts/UserContext";
import { ModalProvider } from "./contexts/ModalContext";
import { Provider as ReduxStoreProvider } from "react-redux";
import { store } from "./store";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import { initSentry } from "./lib/sentry";
import "./i18n/config";

initSentry();

function App() {
  return (

    <UserProvider>
      <ReduxStoreProvider store={store}>
        <TooltipProvider>
          <ModalProvider>
            <RouterProvider router={router} />
            <Toaster />
          </ModalProvider>
        </TooltipProvider>
      </ReduxStoreProvider>
    </UserProvider>

  );
}

export default App;
