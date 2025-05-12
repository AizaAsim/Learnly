/* eslint react-refresh/only-export-components: 0 */
import { lazy, StrictMode, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Spinner } from "./components/ui/spinner";
import { ErrorBoundary } from "./ErrorBoundary";
import "@/styles/globals.css";

// Lazy load the whole app for faster initial load (First Contentful Paint)
const App = lazy(() => import("./App"));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<Spinner fullScreen />}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </StrictMode>
);
