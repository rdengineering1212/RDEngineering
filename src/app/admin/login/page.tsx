"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Invalid credentials");
        return;
      }
      toast.success("Welcome back!");
      router.push("/admin/dashboard");
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-2xl p-8 shadow-2xl border border-border/40 text-white relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-24 h-24 bg-secondary/5 rounded-full blur-2xl" />
          <div className="text-center mb-8 relative z-10">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-white">Admin Login</h1>
            <p className="text-sm text-gray-400 mt-1">RD Engineering Admin Panel</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 text-sm p-3 rounded-lg mb-6 relative z-10">
              <ShieldAlert className="h-4 w-4" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
              <Input {...register("username")} placeholder="Enter username" />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <Input {...register("password")} type="password" placeholder="Enter password" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

