import { Roles } from "@/features/Auth/types";
import { AuthGuard } from "@/features/Auth/components/guards/AuthGuard.tsx";
import {
  preloadMyReels,
  preloadCreatorReels,
  preloadCuratedReels,
  preloadPreviewReel,
  preloadSavedReels,
  preloadBlockedReel,
} from "@/preloaders/reels.tsx";
import { Spinner } from "@/components/ui/spinner";

export default [
  // ** VIDEO LAYOUT
  {
    path: "/",
    hydrateFallbackElement: <Spinner fullScreen />,
    lazy: async () => {
      const module = await import("@/layouts/VideoLayout.tsx");
      return { Component: module.default };
    },
    children: [
      // ** CREATOR REELS PAGES (Draft, Scheduled, Active)
      {
        path: "/my-profile/:type/:id",
        element: <AuthGuard role={[Roles.CREATOR]} />,
        children: [
          {
            path: "/my-profile/:type/:id",
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import("@/pages/ReelPage.tsx");
              return { Component: module.default, loader: preloadMyReels };
            },
          },
        ],
      },
      // ** USERS HOME PAGE (Curated EduClip Feed)
      {
        path: "/home/:id",
        element: <AuthGuard role={[Roles.USER]} />,
        children: [
          {
            index: true,
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import("@/pages/ReelPage.tsx");
              return { Component: module.default, loader: preloadCuratedReels };
            },
          },
        ],
      },
      {
        path: "/saved/:id",
        element: <AuthGuard role={[Roles.USER]} />,
        children: [
          {
            index: true,
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import("@/pages/ReelPage.tsx");
              return { Component: module.default, loader: preloadSavedReels };
            },
          },
        ],
      },
      // ** CREATOR REEL FEED PAGE
      {
        path: "/:username/:id",
        element: <AuthGuard role={[Roles.USER]} />,
        children: [
          {
            path: "/:username/:id",
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import("@/pages/ReelPage.tsx");
              return { Component: module.default, loader: preloadCreatorReels };
            },
          },
        ],
      },
      // ** PREVIEW REEL PAGE (during uploading)
      {
        path: "/preview",
        element: <AuthGuard role={[Roles.CREATOR]} />,
        children: [
          {
            path: "/preview/:id",
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import("@/pages/ReelPage.tsx");
              return { Component: module.default, loader: preloadPreviewReel };
            },
          },
        ],
      },
      // ** REMOVED(BLOCKED) REEL PAGE
      {
        path: "/removed",
        element: <AuthGuard role={[Roles.CREATOR]} />,
        children: [
          {
            path: "/removed/:id",
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import("@/pages/ReelPage.tsx");
              return { Component: module.default, loader: preloadBlockedReel };
            },
          },
        ],
      },
    ],
  }
];