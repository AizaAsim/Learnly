import { Roles } from "@/features/Auth/types";
import { AuthGuard } from "@/features/Auth/components/guards/AuthGuard.tsx";
import { GuestGuard } from "@/features/Auth/components/guards/GuestGuard.tsx";
import {
  preloadCuratedReels,
  preloadSavedReels,
} from "@/preloaders/reels.tsx";
import { Navigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";

export default [
  // ** MAIN LAYOUT
  {
    path: "/",
    hydrateFallbackElement: <Spinner fullScreen />,
    lazy: async () => {
      const module = await import("@/layouts/MainLayout.tsx");
      return { Component: module.default };
    },
    children: [
      {
        path: "/home",
        element: <AuthGuard role={[Roles.CREATOR, Roles.USER]} />,
        children: [
          {
            index: true,
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import("@/pages/HomePage.tsx");
              return {
                Component: module.default,
                loader: preloadCuratedReels,
              };
            },
          },
        ],
      },
      {
        path: "/notifications",
        element: <AuthGuard role={[Roles.CREATOR, Roles.USER]} />,
        children: [
          {
            index: true,
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import("@/pages/NotificationsPage.tsx");
              return { Component: module.default };
            },
          },
        ],
      },
      {
        path: "/add-a-reel",
        element: <AuthGuard role={[Roles.CREATOR]} />,
        children: [
          {
            index: true,
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import("@/pages/AddReelPage.tsx");
              return { Component: module.default };
            },
          },
        ],
      },
      {
        path: "/subscriptions",
        element: <AuthGuard role={[Roles.USER]} />,
        children: [
          {
            index: true,
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import("@/pages/SubscriptionsPage.tsx");
              return { Component: module.default };
            },
          },
        ],
      },
      {
        path: "/learners",
        element: <AuthGuard role={[Roles.CREATOR]} />,
        children: [
          {
            index: true,
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import("@/pages/SubscribersPage.tsx");
              return { Component: module.default };
            },
          },
        ],
      },
      {
        path: "/search",
        element: <AuthGuard role={[Roles.USER]} />,
        children: [
          {
            index: true,
            hydrateFallbackElement: <div>Loader 3</div>,
            lazy: async () => {
              const module = await import("@/pages/SearchPage.tsx");
              return { Component: module.default };
            },
          },
        ],
      },
      {
        path: "/saved",
        element: <AuthGuard role={[Roles.USER]} />,
        children: [
          {
            index: true,
            hydrateFallbackElement: <Spinner fullScreen />,
            loader: preloadSavedReels,
            lazy: async () => {
              const module = await import("@/pages/SavedReelsPage.tsx");
              return { Component: module.default };
            },
          },
        ],
      },
      {
        path: "/my-profile",
        element: <AuthGuard role={[Roles.CREATOR]} />,
        children: [
          {
            index: true,
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import("@/pages/ProfilePage.tsx");
              return { Component: module.default };
            },
          },
          {
            path: "saved",
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import("@/pages/SavedReelsPage.tsx");
              return { Component: module.default };
            },
          },
          {
            path: "draft",
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import("@/pages/DraftsPage.tsx");
              return { Component: module.default };
            },
          },
          {
            path: "scheduled",
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import("@/pages/ScheduledPage.tsx");
              return { Component: module.default };
            },
          },
          {
            path: "archived",
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import("@/pages/ArchivedPage.tsx");
              return { Component: module.default };
            },
          },
        ],
      },
      {
        path: "/settings",
        element: <AuthGuard role={[Roles.CREATOR, Roles.USER]} />,
        children: [
          {
            index: true,
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import("@/pages/SettingsPage.tsx");
              return { Component: module.default };
            },
          },
          {
            path: "notifications",
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import(
                "@/pages/NotificationSettingsPage.tsx"
              );
              return { Component: module.default };
            },
          },
          {
            path: "add-recovery-method",
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import(
                "@/pages/AddRecoveryMethodPage.tsx"
              );
              return { Component: module.default };
            },
          },
          {
            path: "payment-method",
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import(
                "@/pages/StripePaymentMethodPage.tsx"
              );
              return { Component: module.default };
            },
          },
          {
            path: "billing-history",
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import("@/pages/BillingHistoryPage.tsx");
              return { Component: module.default };
            },
          },
          {
            path: "edit-profile",
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import("@/pages/EditProfilePage.tsx");
              return { Component: module.default };
            },
          },
          {
            path: "manage-subscription",
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import(
                "@/pages/SubscriptionSettingsPage.tsx"
              );
              return { Component: module.default };
            },
          },
          {
            path: "manage-subscription/subscription-price",
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import(
                "@/pages/SubscriptionPricePage.tsx"
              );
              return { Component: module.default };
            },
          },
        ],
      },
      {
        path: "/checkout",
        element: <AuthGuard role={[Roles.USER]} />,
        children: [
          {
            index: true,
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import("@/pages/CheckoutPage.tsx");
              return { Component: module.default };
            },
          },
        ],
      },
      {
        path: "/",
        element: <GuestGuard />,
        children: [
          {
            index: true,
            element: <Navigate to="/auth" replace />,
          },
        ],
      },
      {
        path: "/:username",
        hydrateFallbackElement: <Spinner fullScreen />,
        lazy: async () => {
          const module = await import("@/pages/ProfilePage.tsx");
          return { Component: module.default };
        },
      },
    ],
  }
];