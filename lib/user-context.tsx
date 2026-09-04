"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface User {
  name: string;
}

interface UserContextValue {
  user: User | null;
  login: (u: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Lectura de localStorage pospuesta al montaje para no romper la hidratación SSR.
    try {
      const stored = JSON.parse(localStorage.getItem("av_user") || "null");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(stored);
    } catch {
      setUser(null);
    }
  }, []);

  const login = (u: User | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem("av_user", JSON.stringify(u));
    } else {
      localStorage.removeItem("av_user");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("av_user");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser debe usarse dentro de UserProvider");
  return ctx;
}
