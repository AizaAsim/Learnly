import { Roles } from "@/features/Auth/types";
import { AuthGuard } from "@/features/Auth/components/guards/AuthGuard.tsx";
import { GuestGuard } from "@/features/Auth/components/guards/GuestGuard.tsx";
import { Spinner } from "@/components/ui/spinner";

export default [
  {
    path: "/",
    hydrateFallbackElement: <Spinner fullScreen />,
    lazy: async () => {
      const module = await import("@/layouts/AuthLayout.tsx");
      return { Component: module.default };
    },
    children: [
      // ** Block page
      {
        path: "/block",
        element: <AuthGuard role={[Roles.CREATOR, Roles.USER]} />,
        children: [
          {
            index: true,
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import("@/pages/BlockPage.tsx");
              return { Component: module.default };
            },
          },
        ],
      },
      // ** Auth Page.tsxs
      {
        path: "/auth",
        element: <GuestGuard />,
        children: [
          {
            index: true,
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import("@/pages/auth/AuthPage.tsx");
              return { Component: module.default };
            },
          },
          {
            path: "/auth/verify",
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import(
                "@/pages/auth/AuthVerificationPage.tsx"
              );
              return { Component: module.default };
            },
          },
          {
            path: "/auth/account-recovery",
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import(
                "@/pages/auth/AccountRecoveryPage.tsx"
              );
              return { Component: module.default };
            },
          },
          {
            path: "/auth/account-recovery/method",
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import(
                "@/pages/auth/AccountRecoveryMethodPage.tsx"
              );
              return { Component: module.default };
            },
          },
          {
            path: "/auth/account-recovery/verify",
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import(
                "@/pages/auth/AccountRecoveryVerificationPage.tsx"
              );
              return { Component: module.default };
            },
          },
        ],
      },
      {
        path: "/auth/display-name",
        element: <AuthGuard role={[Roles.CREATOR]} />,
        children: [
          {
            index: true,
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import(
                "@/pages/auth/AuthNameFieldPage.tsx"
              );
              return { Component: module.default };
            },
          },
        ],
      },
      {
        path: "/auth/username",
        element: <AuthGuard role={[Roles.CREATOR]} />,
        children: [
          {
            index: true,
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import(
                "@/pages/auth/AuthNameFieldPage.tsx"
              );
              return { Component: module.default };
            },
          },
        ],
      },
      {
        path: "/auth/name",
        element: <AuthGuard role={[Roles.USER]} />,
        children: [
          {
            index: true,
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import(
                "@/pages/auth/AuthNameFieldPage.tsx"
              );
              return { Component: module.default };
            },
          },
        ],
      },
      {
        path: "/auth/socials",
        element: <AuthGuard role={[Roles.CREATOR]} />,
        children: [
          {
            index: true,
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import("@/pages/auth/SocialsPage.tsx");
              return { Component: module.default };
            },
          },
        ],
      },
      {
        path: "/auth/new-email",
        element: <AuthGuard role={[Roles.CREATOR, Roles.USER]} />,
        children: [
          {
            index: true,
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import("@/pages/auth/NewEmailPage.tsx");
              return { Component: module.default };
            },
          },
        ],
      },
      {
        path: "/auth/new-email/verify",
        element: <AuthGuard role={[Roles.CREATOR, Roles.USER]} />,
        children: [
          {
            index: true,
            hydrateFallbackElement: <Spinner fullScreen />,
            lazy: async () => {
              const module = await import(
                "@/pages/auth/NewEmailVerificationPage.tsx"
              );
              return { Component: module.default };
            },
          },
        ],
      },
    ],
  }];