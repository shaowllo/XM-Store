"use client";

import React, { createContext, useContext, useCallback } from "react";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/use-local-storage";

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
  const [user, setUser] = useLocalStorage<User | null>(USER_KEY, null);

  const login = useCallback((email: string, password: string) => {
    try {
      const users: StoredUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      const found = users.find((u) => u.email === email && u.password === password);
      if (found) {
        const userWithoutPassword: User = {
          id: found.id,
          name: found.name,
          email: found.email,
        };
        setUser(userWithoutPassword);
        localStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));
        document.cookie = `xmstore-user=${encodeURIComponent(JSON.stringify(userWithoutPassword))}; path=/; max-age=86400`;
        toast.success(`欢迎回来，${found.name}！`);
        return true;
      }
      toast.error("邮箱或密码错误");
    } catch {
      toast.error("登录失败，请稍后重试");
    }
    return false;
  }, []);

  const register = useCallback((name: string, email: string, password: string) => {
    try {
      const users: StoredUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      if (users.find((u) => u.email === email)) {
        toast.error("该邮箱已被注册");
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
      const userWithoutPassword: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      };
      setUser(userWithoutPassword);
      localStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));
      document.cookie = `xmstore-user=${encodeURIComponent(JSON.stringify(userWithoutPassword))}; path=/; max-age=86400`;
      toast.success("注册成功！");
      return true;
    } catch {
      toast.error("注册失败，请稍后重试");
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
    document.cookie = "xmstore-user=; path=/; max-age=0";
    toast.info("已退出登录");
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
