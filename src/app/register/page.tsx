"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, User, Mail, Lock, KeyRound } from "lucide-react";
import { useUser } from "@/components/user-provider";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegisterPage() {
  const { register } = useUser();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    if (password.length < 6) {
      setError("密码长度至少为 6 位");
      return;
    }

    if (register(name, email, password)) {
      router.push("/");
    } else {
      setError("该邮箱已被注册");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
          <UserPlus className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold">注册</h1>
        <p className="mt-2 text-sm text-muted-foreground">创建账号，开启科技之旅</p>
      </div>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="姓名"
            required
            className="w-full rounded-lg border bg-background pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="邮箱"
            required
            className="w-full rounded-lg border bg-background pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="密码（至少6位）"
            required
            className="w-full rounded-lg border bg-background pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="确认密码"
            required
            className="w-full rounded-lg border bg-background pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full gap-2">
          <UserPlus className="h-4 w-4" />
          注册
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        已有账号？
        <Link href="/login" className="text-primary hover:underline">
          立即登录
        </Link>
      </p>
    </div>
  );
}
