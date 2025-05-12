/**
 * Constructs the connected Stripe dashboard URL for a given account ID and optional destination path.
 * @param accountId - The ID of the Stripe account.
 * @param destinationPath - The optional destination path after the account ID(Leading slash is not required).
 * @returns The constructed URL string.
 */
export const constructStripeDashboardUrl = (
  accountId: string,
  destinationPath?: string
): string => {
  const baseUrl = `https://dashboard.stripe.com/b/${accountId}`;
  if (destinationPath) {
    return `${baseUrl}?destination=${encodeURIComponent("/" + destinationPath)}`;
  }
  return baseUrl;
};
