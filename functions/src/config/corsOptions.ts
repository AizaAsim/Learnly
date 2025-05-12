/**
 * Open CORS for all domains in development mode
 * and only for the application domain in production mode
 */
export const corsOptions = {
  /**
   * There is currently no way to check what Firebase Hosting Preview URLs
   * are available, so we will allow all domains in our staging environment.
   */
  cors: [`${process.env.APPLICATION_DOMAIN}`],
};
