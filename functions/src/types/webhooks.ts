export type VideoAssetWebhookEvent = {
  type: string;
  id: string;
  created_at: string;
  object: {
    type: string;
    id: string;
  };
  environment: {
    name: string;
    id: string;
  };
  data: { [key: string]: unknown };
};
