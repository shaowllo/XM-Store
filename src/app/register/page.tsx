"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { UserPlus, User, Mail, Lock, KeyRound, ArrowRight } from "lucide-react";
import { useUser } from "@/components/user-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const t = useTranslations("auth");
  const { register: registerUser } = useUser();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    const success = await registerUser(data.name, data.email, data.password);
    if (success) {
      router.push("/");
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-3xl border bg-card p-8 shadow-xl shadow-primary/5">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent mb-4">
              <UserPlus className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold">{t("register")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">Join us and start your tech journey</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-medium mb-1.5 block">{t("name")}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter your name"
                  className="pl-10 rounded-xl"
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">{t("email")}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 rounded-xl"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">{t("password")}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password (min. 6 characters)"
                  className="pl-10 rounded-xl"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">{t("confirmPassword")}</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  className="pl-10 rounded-xl"
                  {...register("confirmPassword")}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full gap-2 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              size="lg"
              disabled={isSubmitting}
            >
              <UserPlus className="h-4 w-4" />
              {t("register")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t("hasAccount")}
              <Link href="/login" className="text-primary hover:underline font-medium ml-1">
                {t("loginHere")}
                <ArrowRight className="inline h-3 w-3 ml-0.5" />
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
