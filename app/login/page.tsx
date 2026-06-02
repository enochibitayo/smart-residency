"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2, AlertCircle, Lock, Mail } from "lucide-react";
import { supabase } from "../../lib/supabase"; // Adjust path if your lib folder is located elsewhere

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      // 1. Authenticate the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error("Authentication failed. Please check your network.");
      }

      // 2. Fetch the user's role from the profiles table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        throw new Error("User profile not found in the system.");
      }

      // 3. Smart Routing Matrix based on RBAC
      if (profile.role === "student") {
        router.push("/student");
      } else {
        // Admins, DSAs, Porters, and Supervisors share the master admin shell
        router.push("/admin");
      }

    } catch (error: any) {
      setErrorMessage(error.message || "Invalid login credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        
        {/* Branding Header */}
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          <div className="bg-surface p-4 rounded-2xl shadow-sm border border-gray-100 mb-4">
            <ShieldCheck className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-text-main tracking-tight">KU Smart Residency</h1>
          <p className="text-sm text-text-muted mt-2 font-medium tracking-wide uppercase">Authentication Gateway</p>
        </div>

        {/* Login Card */}
        <div className="bg-surface rounded-2xl shadow-xl border border-gray-100 p-8">
          
          {errorMessage && (
            <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-start space-x-3 text-danger">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="text-sm font-bold">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">
                University Email / Matric ID
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@kingsuniversity.edu.ng"
                  className="w-full pl-10 pr-4 py-3 bg-background border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-text-main transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block">
                  Password
                </label>
                <a href="#" className="text-xs font-bold text-primary hover:text-primary/70 transition-colors">
                  Forgot?
                </a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-background border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-text-main transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition-all flex items-center justify-center shadow-md disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Secure Sign In"
              )}
            </button>
            <div className="mt-6 text-center pt-6 border-t border-gray-100">
            <p className="text-sm text-text-muted">
              First time here?{' '}
              <a href="/signup" className="font-bold text-primary hover:underline">
                Register your account
              </a>
            </p>
          </div>
          </form>
        </div>

        {/* Hackathon Demo Footer */}
        <p className="text-center text-xs font-medium text-text-muted mt-8">
          Secured by Supabase Identity Engine &copy; 2026
        </p>
      </div>
    </div>
  );
}