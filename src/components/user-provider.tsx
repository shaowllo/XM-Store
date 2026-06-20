"use client";

import React, { createContext, useContext, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { hashPassword, generateSessionToken } from "@/lib/crypto";
import { useTranslations } from "next-intl";

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
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_KEY = "xmstore-user";
const USERS_KEY = "xmstore-users";
const SESSION_COOKIE = "xmstore-session";
const TOKENS_KEY = "xmstore-tokens";

function setSessionCookie(token: string) {
  document.cookie = `${SESSION_COOKIE}=${token}; path=/; max-age=86400; SameSite=Lax`;
}

function clearSessionCookie() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
}

function persistSession(token: string, userId: string) {
  const tokens: Record<string, string> = JSON.parse(localStorage.getItem(TOKENS_KEY) || "{}");
  tokens[token] = userId;
  localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
}

function removeSession(token: string) {
  const tokens: Record<string, string> = JSON.parse(localStorage.getItem(TOKENS_KEY) || "{}");
  delete tokens[token];
  localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useLocalStorage<User | null>(USER_KEY, null);
  const t = useTranslations("auth");

  const login = useCallback(async (email: string, password: string) => {
    try {
      const users: StoredUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      const hashed = await hashPassword(password);
      const found = users.find((u) => u.email === email && u.password === hashed);
      if (found) {
        const userWithoutPassword: User = {
          id: found.id,
          name: found.name,
          email: found.email,
        };
        setUser(userWithoutPassword);
        localStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));
        const token = generateSessionToken();
        persistSession(token, found.id);
        setSessionCookie(token);
        toast.success(t("loginSuccess", { name: found.name }));
        return true;
      }
      toast.error(t("loginError"));
    } catch {
      toast.error(t("loginFailed"));
    }
    return false;
  }, [setUser]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const users: StoredUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      if (users.find((u) => u.email === email)) {
        toast.error(t("emailTaken"));
        return false;
      }
      const hashed = await hashPassword(password);
      const newUser: StoredUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        password: hashed,
      };
      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      const userWithoutPassword: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      };
      setUser(userWithoutPassword);
      localStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));
      const token = generateSessionToken();
      persistSession(token, newUser.id);
      setSessionCookie(token);
      toast.success(t("registerSuccess", { name: newUser.name }));
      return true;
    } catch {
      toast.error(t("registerFailed"));
    }
    return false;
  }, [setUser]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
    // Clean up the session token
    const cookies = document.cookie.split("; ");
    const sessionCookie = cookies.find((c) => c.startsWith(`${SESSION_COOKIE}=`));
    if (sessionCookie) {
      const token = sessionCookie.split("=")[1];
      removeSession(token);
    }
    clearSessionCookie();
    toast.info(t("logoutSuccess"));
  }, [setUser]);

  const contextValue = useMemo(
    () => ({ user, login, register, logout }),
    [user, login, register, logout]
  );

  return (
    <UserContext.Provider value={contextValue}>
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
