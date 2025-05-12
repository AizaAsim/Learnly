import { sentryCreateBrowserRouter } from "../lib/sentry";
import routes from "@/router/routes";
import config from "@/router/config";

export const router = sentryCreateBrowserRouter(routes, config);
