import { AppLayout } from "@/layouts/AppLayout.tsx";
import { Spinner } from "@/components/ui/spinner";

import authRoutes from "./routes/auth.tsx";
import mainRoutes from "./routes/main.tsx";
import reelsRoutes from "./routes/reels.tsx";
import errorRoutes from "./routes/error.tsx";

export default [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      ...authRoutes,
      {
        path: "/",
        lazy: async () => {
          const module = await import("@/layouts/LoggedInLayout.tsx");
          return { Component: module.default };
        },// Brings in stuff that user + creator need
        hydrateFallbackElement: <Spinner fullScreen />,
        children: [
          ...mainRoutes,
          ...reelsRoutes
        ],
      },
      // Error catchall needs to be last
      errorRoutes,
    ],
  },
];
