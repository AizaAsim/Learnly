import { HttpsError } from "firebase-functions/v2/https";
import { MeiliSearch } from "meilisearch";
import { IndexDataMap, IndexNames, SearchOptions } from "../types/meliSearch";
import { logError } from "./logging";
import { AppError } from "../shared/classes/AppError";

export const getMeiliSearchClient = () => {
  const { MEILISEARCH_URL, MEILISEARCH_API_KEY } = process.env;

  if (!MEILISEARCH_URL || !MEILISEARCH_API_KEY) {
    logError("MEILISEARCH_URL or MEILISEARCH_API_KEY is not set.");
    throw new HttpsError(
      "internal",
      "MEILISEARCH_URL or MEILISEARCH_API_KEY is not set."
    );
  }

  return new MeiliSearch({
    host: MEILISEARCH_URL,
    apiKey: MEILISEARCH_API_KEY,
  });
};

const retrieveIndex = async (client: MeiliSearch, indexName: string) => {
  try {
    const index = await client.getIndex(indexName);
    return index;
  } catch (error) {
    if ((error as { code: string }).code === "index_not_found") {
      return null;
    }
    throw error;
  }
};

export const createIndex = async <T extends IndexNames>(
  client: MeiliSearch,
  indexName: T,
  filterableAttributes?: (keyof IndexDataMap[T])[]
) => {
  try {
    const index = client.index(indexName);
    if (filterableAttributes) {
      await index.updateFilterableAttributes(filterableAttributes as string[]);
    }
    return index;
  } catch (error) {
    logError(`Error creating index: ${indexName}`);
    throw error;
  }
};

const getOrCreateIndex = async <T extends IndexNames>(
  client: MeiliSearch,
  indexName: T,
  filterableAttributes?: (keyof IndexDataMap[T])[]
) => {
  let index = await retrieveIndex(client, indexName);
  if (!index) {
    index = await createIndex(client, indexName, filterableAttributes);
  }
  return index;
};

export const upsertIndexWithDocuments = async <T extends IndexNames>(
  indexName: T,
  data: IndexDataMap[T][],
  filterableAttributes?: (keyof IndexDataMap[T])[]
) => {
  const client = getMeiliSearchClient();
  const index = await getOrCreateIndex(client, indexName, filterableAttributes);
  return index.updateDocuments(data);
};

export const removeDocumentFromIndex = async (
  indexName: IndexNames,
  objectId: string
) => {
  const client = getMeiliSearchClient();
  const index = await retrieveIndex(client, indexName);
  if (!index) {
    throw new AppError("Index not found.", 404);
  }
  const result = await index.deleteDocument(objectId);
  return result;
};

export const search = async (data: SearchOptions) => {
  const { index, query, limit, filter, offset } = data;
  try {
    const client = getMeiliSearchClient();
    const reults = await client
      .index(index)
      .search(query, { limit, offset, filter });
    return reults;
  } catch (error) {
    logError(`Error searching index: ${index}`, error);
    throw new AppError("Failed to search index", 503);
  }
};

export const retrieveDocument = async <T extends IndexNames>(
  indexName: T,
  documentId: string
): Promise<IndexDataMap[T]> => {
  const client = getMeiliSearchClient();
  const index = await retrieveIndex(client, indexName);
  if (!index) {
    throw new AppError("Index not found.", 404);
  }
  const doc = await index.getDocument<IndexDataMap[T]>(documentId);
  return doc;
};
