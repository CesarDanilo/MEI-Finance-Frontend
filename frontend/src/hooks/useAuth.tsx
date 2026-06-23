import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { authStorage, type StoredUser } from "@/lib/auth-storage";
import { setUnauthorizedHandler } from "@/lib/api/client";

type AuthContextValue = {
  token: string | null;
  user: StoredUser | null;
  authenticated: boolean;
  signIn: (token: string, user: StoredUser) => void;
  signOut: () => void;
  updateUser: (user: StoredUser) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => authStorage.getToken());
  const [user, setUser] = useState<StoredUser | null>(() => authStorage.getUser());

  const signOut = useCallback(() => {
    authStorage.clear();
    setToken(null);
    setUser(null);
  }, []);

  const signIn = useCallback((nextToken: string, nextUser: StoredUser) => {
    authStorage.setToken(nextToken);
    authStorage.setUser(nextUser);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const updateUser = useCallback((nextUser: StoredUser) => {
    authStorage.setUser(nextUser);
    setUser(nextUser);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      signOut();
      window.location.assign("/auth");
    });
  }, [signOut]);

  const value = useMemo(
    () => ({
      token,
      user,
      authenticated: Boolean(token),
      signIn,
      signOut,
      updateUser,
    }),
    [token, user, signIn, signOut, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
