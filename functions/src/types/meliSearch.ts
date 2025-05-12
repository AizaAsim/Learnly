import { Filter } from "meilisearch";

interface Educator {
  id: string;
  username: string;
  displayName: string;
  avatar_url: string;
}

// User does not have username
type User = Omit<Educator, "username"> & {
  subscribedTo?: string[];
};

export type IndexDataMap = {
  creators: Educator;
  users: User;
};

export type IndexNames = keyof IndexDataMap;

export interface SearchOptions {
  index: IndexNames;
  query: string;
  offset: number;
  limit: number;
  filter?: Filter;
}
