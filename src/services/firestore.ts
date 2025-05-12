import {
  DocumentData,
  Query,
  getDocs,
  query,
  QueryConstraint,
  DocumentReference,
  getDoc,
  where,
} from "firebase/firestore";

class Firestore {
  private commonQueryConstraints: QueryConstraint[] = [
    where("deletedAt", "==", null),
  ];
  private exclusionFields: string[] = ["deletedAt"];

  private applyCommonConstraints = (
    q: Query<DocumentData>,
    ignoreExclusions: boolean = false
  ): Query<DocumentData> => {
    return ignoreExclusions ? q : query(q, ...this.commonQueryConstraints);
  };

  private isExcluded = (docData: DocumentData): boolean => {
    return this.exclusionFields.some((field) => docData[field] != null);
  };

  getDocuments = async (
    q: Query<DocumentData>,
    ignoreExclusions: boolean = false
  ) => {
    const constrainedQuery = this.applyCommonConstraints(q, ignoreExclusions);
    const querySnapshot = await getDocs(constrainedQuery);
    // Filter out documents based on exclusion fields if not ignoring exclusions
    const filteredDocs = ignoreExclusions
      ? querySnapshot.docs
      : querySnapshot.docs.filter((doc) => !this.isExcluded(doc.data()));
    return { filteredDocs, querySnapshot };
  };

  getDocument = async (
    docRef: DocumentReference<DocumentData>,
    ignoreExclusions: boolean = false
  ) => {
    const docSnapshot = await getDoc(docRef);
    if (
      docSnapshot.exists() &&
      (ignoreExclusions || !this.isExcluded(docSnapshot.data()))
    ) {
      return docSnapshot.data();
    } else {
      return null; // Document is either excluded or does not exist
    }
  };
}

export default Firestore;
