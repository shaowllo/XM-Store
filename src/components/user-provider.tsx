"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface StoredUser extends User {
  password: string;
}

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_KEY = "xmstore-user";
const USERS_KEY = "xmstore-users";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load user", e);
    }
  }, []);

  const login = useCallback((email: string, password: string) => {
    try {
      const users: StoredUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      const found = users.find((u) => u.email === email && u.password === password);
      if (found) {
        const { password: _, ...userWithoutPassword } = found;
        setUser(userWithoutPassword);
        localStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));
        return true;
      }
    } catch (e) {
      console.error("Login failed", e);
    }
    return false;
  }, []);

  const register = useCallback((name: string, email: string, password: string) => {
    try {
      const users: StoredUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      if (users.find((u) => u.email === email)) {
        return false;
      }
      const newUser: StoredUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        password,
      };
      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));
      return true;
    } catch (e) {
      console.error("Register failed", e);
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
  }, []);

  return (
    <UserContext.Provider value={{ user, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
