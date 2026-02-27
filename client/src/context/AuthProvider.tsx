import React, { useState, useEffect } from "react";
import { api } from "../lib/api";
import { AuthContext, type User } from "./AuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = async (username: string, email: string, password: string) => {
    await api.post("/auth/signup", { username, email, password });
  };

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });

    const { accessToken, user: userData } = res.data;

    localStorage.setItem("accessToken", accessToken);
    setUser(userData);
  };

  const logout = async () => {
    await api.post("/auth/logout");
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const res = await api.get("/me");
          setUser(res.data);
        } catch {
          localStorage.removeItem("accessToken");
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Show loading spinner while checking auth state
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
