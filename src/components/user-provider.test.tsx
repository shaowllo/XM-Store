import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { UserProvider, useUser } from "./user-provider";
import React, { useState, useCallback } from "react";

// Mock crypto for jsdom (crypto.subtle not available)
vi.mock("@/lib/crypto", () => ({
  hashPassword: vi.fn((pw: string) => Promise.resolve(`hashed-${pw}`)),
  generateSessionToken: vi.fn(() => "mock-session-token"),
}));

// Mock useLocalStorage with proper React state
vi.mock("@/hooks/use-local-storage", () => ({
  useLocalStorage: vi.fn((_key: string, defaultValue: any) => {
    const [value, setValue] = useState(defaultValue);
    const setValueWrapped = useCallback((updater: any) => {
      setValue((prev: any) => {
        if (typeof updater === "function") return updater(prev);
        return updater;
      });
    }, []);
    const reset = useCallback(() => setValue(defaultValue), []);
    return [value, setValueWrapped, reset];
  }),
}));

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const t: Record<string, string> = {
      loginSuccess: "Welcome back, {name}!",
      loginError: "Invalid email or password",
      loginFailed: "Login failed, please try again",
      registerSuccess: "Welcome, {name}!",
      registerFailed: "Registration failed, please try again",
      emailTaken: "This email is already registered",
      logoutSuccess: "Logged out",
    };
    return t[key] || key;
  },
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), info: vi.fn(), error: vi.fn() },
}));

describe("UserProvider", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("starts with null user", () => {
    const { result } = renderHook(() => useUser(), { wrapper: UserProvider });
    expect(result.current.user).toBeNull();
  });

  it("registers a new user", async () => {
    const { result } = renderHook(() => useUser(), { wrapper: UserProvider });

    let success = false;
    await act(async () => {
      success = await result.current.register("Test User", "test@test.com", "password123");
    });

    expect(success).toBe(true);
    expect(result.current.user).not.toBeNull();
    expect(result.current.user?.name).toBe("Test User");
    expect(result.current.user?.email).toBe("test@test.com");
  });

  it("prevents registering with duplicate email", async () => {
    const { result } = renderHook(() => useUser(), { wrapper: UserProvider });

    await act(async () => {
      await result.current.register("User 1", "same@test.com", "pass1");
    });

    let success = true;
    await act(async () => {
      success = await result.current.register("User 2", "same@test.com", "pass2");
    });

    expect(success).toBe(false);
  });

  it("logs in with correct credentials", async () => {
    const { result } = renderHook(() => useUser(), { wrapper: UserProvider });

    await act(async () => {
      await result.current.register("Test User", "test@test.com", "password123");
    });

    act(() => { result.current.logout(); });
    expect(result.current.user).toBeNull();

    let success = false;
    await act(async () => {
      success = await result.current.login("test@test.com", "password123");
    });

    expect(success).toBe(true);
    expect(result.current.user?.email).toBe("test@test.com");
  });

  it("rejects login with wrong password", async () => {
    const { result } = renderHook(() => useUser(), { wrapper: UserProvider });

    await act(async () => {
      await result.current.register("Test User", "test@test.com", "correct-password");
    });
    act(() => { result.current.logout(); });

    let success = true;
    await act(async () => {
      success = await result.current.login("test@test.com", "wrong-password");
    });

    expect(success).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
