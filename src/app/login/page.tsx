"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/user-provider";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (login(email, password)) {
      router.push("/");
    } else {
      setError("邮箱或密码错误");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <h1 className="text-2xl font-bold text-center">登录</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="邮箱"
          required
          className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="密码"
          required
          className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full">
          登录
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        还没有账号？
        <Link href="/register" className="text-primary hover:underline">
          立即注册
        </Link>
      </p>
    </div>
  );
}
