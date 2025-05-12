import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    build: {
      manifest: true,
      assetsInlineLimit: 8192, // Bundle anything less than 8kb inline
      minify: "terser",
      minifyCss: "esbuild",
      sourcemap: true,
      terserOptions: {
        compress: true,
        mangle: true, // Lets the minifier shorten the variable names
      },
      chunkSizeWarningLimit: 425, // App + Sentry is ~415kb (adjust after removing Sentry)
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            // Force firebase sub-modules to be bundled into separate chunks
            if (id.includes("@firebase/") && !id.includes("@sentry")) {
              return `firebase/${id
                .toString()
                .split("@firebase/")[1]
                .split("/")[0]
                .toString()}`;
            }
            // Split i18n languages into separate chunks (per lang)
            if (id.includes("i18n/") && !id.includes("@sentry")) {
              return `i18n/${id
                .toString()
                .split("i18n/")[1]
                .split("/")[0]
                .toString()}`;
            }

            if (id.includes("node_modules/") && !id.includes("@sentry") && id.includes('@mux')) {
              return 'mux';
            }

            if (id.includes("node_modules/") && !id.includes("@sentry") && id.includes('react-i18next')) {
              return 'i18n';
            }

            if (id.includes("node_modules/") && !id.includes("@sentry") && id.includes('recharts')) {
              return 'recharts';
            }

            if (id.includes("node_modules/") && !id.includes("@sentry") && id.includes('swiper')) {
              return 'swiper';
            }

            if (id.includes("node_modules/") && !id.includes("@sentry") && id.includes('hls.js')) {
              return 'hls';
            }

            if (id.includes("node_modules/") && !id.includes("@sentry") && id.includes('media-chrome')) {
              return 'media-chrome';
            }

            if (id.includes("node_modules/") && !id.includes("@sentry") && id.includes('phonenumber')) {
              return 'phone';
            }


            if (id.includes("node_modules/") && !id.includes("@sentry") && id.includes('date-fns')) {
              return 'date-fns';
            }

            if (id.includes("node_modules/") && !id.includes("@sentry") && id.includes('lodash')) {
              return 'lodash';
            }

            if (id.includes("node_modules/") && !id.includes("@sentry") && id.includes('zod')) {
              return 'zod';
            }

            if (id.includes("node_modules/") && !id.includes("@sentry") && id.includes('react-hook-form')) {
              return 'react-hook-form';
            }

            if (id.includes("node_modules/") && !id.includes("@sentry") && id.includes('axios')) {
              return 'axios';
            }

            if (id.includes("node_modules/") && !id.includes("@sentry") && id.includes('stripe')) {
              return 'stripe';
            }

            if (id.includes("node_modules/") && !id.includes("@sentry") && id.includes('hash-wasm')) {
              return 'hash-wasm';
            }


            if (id.includes("node_modules/") && !id.includes("@sentry") && id.includes('tailwind-merge')) {
              return 'tailwind-merge';
            }

            if (id.includes("node_modules/") && !id.includes("@sentry") && id.includes('react-dom')) {
              return 'react-dom';
            }

            if (id.includes("node_modules/") && !id.includes("@sentry") && id.includes('react-router-dom')) {
              return 'react-router-dom';
            }

            if (id.includes("node_modules/") && !id.includes("@sentry") && id.includes('@remix-run')) {
              return '@remix-run';
            }

            if (id.includes("node_modules/") && !id.includes("@sentry") && id.includes('framer-motion')) {
              return 'framer-motion';
            }

            if (id.includes("node_modules/") && !id.includes("@sentry") && id.includes('tailwind-merge')) {
              return 'tailwind-merge';
            }

            if (id.includes("node_modules/") && !id.includes("@sentry") && id.includes('react-swipeable')) {
              return 'react-swipeable';
            }

            if (id.includes("node_modules/") && !id.includes("@sentry") && id.includes('react-day-picker')) {
              return 'react-day-picker';
            }

            if (id.includes("node_modules/") && !id.includes("@sentry") && id.includes('country-flag-icons')) {
              return 'country-flag-icons';
            }

            if (id.includes("node_modules/") && !id.includes("@sentry") && (id.includes('@radix-ui') || id.includes('@floating-ui'))) {
              return 'ui-libs';
            }
          },
        },
      },
    },
    plugins: [
      react(),
      sentryVitePlugin({
        org: env.SENTRY_ORG,
        authToken: env.SENTRY_AUTH_TOKEN,
        project: env.SENTRY_PROJECT,
        bundleSizeOptimizations: {
          excludeDebugStatements: true,
          excludeReplayShadowDom: true,
          excludeReplayWorker: true,
        },
        silent: true, // Plugin floods build output with unnecessary logs
      }),
    ],
    esbuild: {
      supported: {
        "top-level-await": true,
      },
    },
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  };
});
