"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Lock, ShieldAlert, Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsSubmitting(true);
    setError("");
    try {
      const email = data.username.includes("@")
        ? data.username
        : "rdengineering1212@gmail.com";

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: data.password,
      });

      if (authError) {
        setError(authError.message || "Invalid credentials");
        return;
      }

      if (authData.session) {
        document.cookie = `sb-access-token=${authData.session.access_token}; path=/; max-age=${authData.session.expires_in}; SameSite=Lax; Secure`;
        toast.success("Welcome back!");
        router.push("/admin/dashboard");
      } else {
        setError("Could not create session");
      }
    } catch (err: any) {
      setError(err.message || "Connection error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasUsername = watch("username")?.length > 0;
  const hasPassword = watch("password")?.length > 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#080F1C] font-body">
      {/* Background Graphic Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `linear-gradient(rgba(212,175,55,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.4) 1px, transparent 1px)`,
            backgroundSize: "60px 60px"
          }}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#0A1628]/80 backdrop-blur-xl rounded-[24px] p-8 md:p-10 shadow-2xl border border-white/10 text-white relative overflow-hidden">
          
          <div className="text-center mb-8 relative z-10">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="relative h-16 w-16 mx-auto mb-6"
            >
              <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-full animate-ping opacity-75" />
              <div className="relative h-full w-full rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8962B] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20 border border-[#D4AF37]/50">
                <Lock className="h-7 w-7 text-[#080F1C]" strokeWidth={2.5} />
              </div>
            </motion.div>
            <h1 className="text-2xl font-heading font-black text-white tracking-tight">Admin Portal</h1>
            <p className="text-sm font-medium text-gray-400 mt-2 uppercase tracking-widest">RD Engineering</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="flex items-center gap-3 bg-red-500/10 text-red-400 border border-red-500/20 text-sm p-4 rounded-xl relative z-10 font-medium">
                  <ShieldAlert className="h-5 w-5 shrink-0" /> {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Username</label>
              <div className="relative group">
                <input 
                  {...register("username")} 
                  placeholder="Enter your username" 
                  className={`w-full bg-white/5 border ${errors.username ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-white/10 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20'} rounded-xl px-4 py-3.5 text-white placeholder:text-gray-500 transition-all duration-300 outline-none focus:ring-4`}
                />
              </div>
              <AnimatePresence>
                {errors.username && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-1 ml-1 font-medium">{errors.username.message}</motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <input 
                  {...register("password")} 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password" 
                  className={`w-full bg-white/5 border ${errors.password ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-white/10 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20'} rounded-xl pl-4 pr-12 py-3.5 text-white placeholder:text-gray-500 transition-all duration-300 outline-none focus:ring-4`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-1 ml-1 font-medium">{errors.password.message}</motion.p>
                )}
              </AnimatePresence>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || !hasUsername || !hasPassword}
              className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all duration-300 shadow-xl flex items-center justify-center gap-2
                ${isSubmitting || !hasUsername || !hasPassword 
                  ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5' 
                  : 'bg-[#D4AF37] text-[#080F1C] hover:bg-[#E2BE4B] hover:shadow-[#D4AF37]/20 border border-[#D4AF37]'}`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Authenticating
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-500 font-medium">
          <p>© {new Date().getFullYear()} RD Engineering. Secure Access Only.</p>
        </div>
      </motion.div>
    </div>
  );
}
