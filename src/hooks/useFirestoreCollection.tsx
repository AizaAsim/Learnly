import { firestore } from "@/services/firebase";
import Firestore from "@/services/firestore";
import { logError } from "@/services/logging";
import {
  DocumentData,
  OrderByDirection,
  Query,
  WhereFilterOp,
  collection,
  collectionGroup,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { useCallback, useState } from "react";

interface ExtendedDocumentData extends DocumentData {
  id: string;
  path: string;
}

interface ReturnType<T> {
  documents: T[];
  loading: boolean;
  hasMore: boolean;
  fetchDocuments: () => void;
  excludeDocument: (field: string, value: string) => void;
  error: string | null;
}

type WhereClause = [string, WhereFilterOp, unknown];

interface UseFirestoreCollectionOptions {
  collectionPath: string;
  batchSize: number;
  orderByField: string;
  orderByDirection?: OrderByDirection;
  whereClauses?: WhereClause[];
  useCollectionGroup?: boolean;
  ignoreExclusions?: boolean;
}

export const useFirestoreCollection = <T extends DocumentData>({
  collectionPath,
  batchSize,
  orderByField,
  orderByDirection = "desc",
  whereClauses = [],
  useCollectionGroup = false,
  ignoreExclusions = false,
}: UseFirestoreCollectionOptions): ReturnType<T & ExtendedDocumentData> => {
  const [documents, setDocuments] = useState<(T & ExtendedDocumentData)[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [lastDoc, setLastDoc] = useState<DocumentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    if (!loading && hasMore) {
      setLoading(true);
      setError(null);
      try {
        const firestoreService = new Firestore();

        let collectionRef;
        if (useCollectionGroup)
          collectionRef = collectionGroup(firestore, collectionPath);
        else collectionRef = collection(firestore, collectionPath);

        let q: Query<DocumentData, DocumentData> = query(collectionRef);

        whereClauses.forEach(([field, op, value]) => {
          q = query(q, where(field, op, value));
        });

        if (lastDoc) {
          q = query(
            q,
            orderBy(orderByField, orderByDirection),
            startAfter(lastDoc),
            limit(batchSize)
          );
        } else {
          q = query(
            q,
            orderBy(orderByField, orderByDirection),
            limit(batchSize)
          );
        }

        const { filteredDocs, querySnapshot } =
          await firestoreService.getDocuments(q, ignoreExclusions);

        if (querySnapshot.empty) {
          setHasMore(false);
          return;
        }

        const newDocuments: (T & ExtendedDocumentData)[] = filteredDocs.map(
          (doc) => ({
            id: doc.id,
            ...(doc.data() as T),
            path: doc.ref.path,
          })
        );

        setDocuments((prevDocuments) => [...prevDocuments, ...newDocuments]);
        const lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastDoc(lastDocument);
      } catch (error) {
        logError("Error fetching data:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setError(errorMessage);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    }
  }, [
    collectionPath,
    batchSize,
    orderByField,
    orderByDirection,
    lastDoc,
    loading,
    hasMore,
    whereClauses,
    useCollectionGroup,
    ignoreExclusions,
  ]);

  // Exclude documents based on a specific field and value
  const excludeDocument = useCallback((field: string, value: string) => {
    setDocuments((prevDocuments) =>
      prevDocuments.filter((doc) => doc[field] !== value)
    );
  }, []);

  return {
    documents,
    loading,
    hasMore,
    fetchDocuments,
    excludeDocument,
    error,
  };
};
