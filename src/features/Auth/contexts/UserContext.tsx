import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { User } from "firebase/auth";
import { AppUser, Role, UserContextType, UserDoc } from "../types";
import { auth, firestore } from "@/services/firebase";
import { doc, DocumentSnapshot, onSnapshot } from "firebase/firestore";

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [isRoleLoading, setIsRoleLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const clearError = () => {
    setError("");
  };

  useEffect(() => {
    setIsUserLoading(true);
    // Set and clear the user and role states based on the auth state
    const unsub = auth.onAuthStateChanged(async (user: User | null) => {
      if (user) {
        setUser(user);
      } else {
        // Clear the user and role states if the user is not authenticated
        setUser(null);
        setRole(null);
        setUserDoc(null);
        // Clear the loading states (handled below if the user is authenticated)
        setIsRoleLoading(false);
        setIsUserLoading(false);
      }
    });

    return unsub;
  }, []);

  // Force refresh the user role custom claim
  const refreshRole = useCallback(async () => {
    if (!user) return;
    setIsRoleLoading(true);
    try {
      const token = await user.getIdTokenResult(true);
      const r = token?.claims.role as Role;
      setRole(r);
    } catch (e) {
      let message = "Error occurred retrieving token.";
      if (e instanceof Error) message = e.message;
      setError(message);
      setRole(null);
    } finally {
      setIsRoleLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user?.uid) return;

    const userDocRef = doc(firestore, "users", user.uid);
    const userPrivateDocRef = doc(
      firestore,
      "users",
      user.uid,
      "private",
      "info"
    );

    // Function to update userDoc state and check for token refresh
    const handleUserDocsUpdate = async (
      snap: DocumentSnapshot<Partial<UserDoc>>
    ) => {
      setIsUserLoading(true);
      try {
        if (snap.exists()) {
          const userData = snap.data();
          setUserDoc((curr) => ({ ...curr, ...userData }) as UserDoc);
          await refreshRole();
        }
      } catch (e) {
        let message = "Error occurred updating user.";
        if (e instanceof Error) message = e.message;
        setError(message);
      } finally {
        setIsUserLoading(false);
      }
    };

    // Real-time listener for user document
    const unsubUser = onSnapshot(userDocRef, handleUserDocsUpdate);
    const unsubPrivateUser = onSnapshot(
      userPrivateDocRef,
      handleUserDocsUpdate
    );

    // Clean up listeners on unmount
    return () => {
      unsubUser();
      unsubPrivateUser();
    };
  }, [refreshRole, user?.uid]);

  // Construct the AppUser object to be used in the context
  const appUser = useMemo(() => {
    return {
      ...user,
      role,
      displayName: userDoc?.displayName,
      username: userDoc?.username,
      avatar_url: userDoc?.avatar_url,
      bio: userDoc?.bio,
      isBlocked: userDoc?.isBlocked,
    } as AppUser;
  }, [user, role, userDoc]);

  return (
    <UserContext.Provider
      value={{
        user: appUser,
        error,
        setError,
        clearError,
        isAuthLoading: isUserLoading || isRoleLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
