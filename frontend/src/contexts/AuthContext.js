import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import jwtDecode from "jwt-decode";

const AuthContext = createContext(null);

const LOCAL_STORAGE_TOKEN_KEY = "sb_access_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  });

  const [user, setUser] = useState(() => {
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!token) {
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
      setUser(null);
      return;
    }

    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
    try {
      setUser(jwtDecode(token));
    } catch {
      setUser(null);
    }
  }, [token]);

  const login = useCallback((accessToken) => {
    setToken(accessToken);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
