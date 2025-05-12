import { firestore } from "@/services/firebase";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

interface ExtendedDocumentData extends DocumentData {
  id: string;
  path: string;
}

interface FirestoreError {
  message: string;
}

interface ReturnType<T> {
  document: T | null;
  loading: boolean;
  error: FirestoreError | null;
}

export const useDocumentOnce = <T extends DocumentData>(
  collectionName: string,
  docId: string
): ReturnType<T> => {
  const [document, setDocument] = useState<(T & ExtendedDocumentData) | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const docRef = doc(firestore, collectionName, docId);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const docData = docSnapshot.data() as T;
          const data: T & ExtendedDocumentData = {
            id: docSnapshot.id,
            path: docSnapshot.ref.path,
            ...docData,
          };
          setDocument(data);
        } else {
          setError({ message: "Document does not exist" });
        }
      } catch (err) {
        let message = "Something went wrong";
        if (err instanceof Error) message = err.message;
        setError({ message: message });
      } finally {
        setLoading(false);
      }
    })();
  }, [collectionName, docId]);

  return { document, loading, error };
};
