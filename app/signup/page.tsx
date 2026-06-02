"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Loader2, AlertCircle, Lock, Mail, User, BookOpen } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"student" | "admin" | "porter" | "supervisor">("student");
  const [matricNumber, setMatricNumber] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // 1. Create the user securely in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Registration failed. Please try again.");

      // 2. Immediately inject their details into our Profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: authData.user.id,
            role: role,
            full_name: fullName,
            matric_number: role === "student" ? matricNumber : null,
          }
        ]);

      if (profileError) {
        console.error("Profile creation error:", profileError);
        throw new Error("Account created, but profile setup failed. Contact IT.");
      }

      setSuccessMessage("Registration successful! Redirecting to login...");
      
      // Send them to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 py-12">
      <div className="w-full max-w-md">
        
        {/* Branding Header */}
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          <div className="bg-surface p-4 rounded-2xl shadow-sm border border-gray-100 mb-4">
            <ShieldCheck className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-text-main tracking-tight">System Registration</h1>
          <p className="text-sm text-text-muted mt-2 font-medium tracking-wide">Create your university residency account.</p>
        </div>

        {/* Signup Card */}
        <div className="bg-surface rounded-2xl shadow-xl border border-gray-100 p-8">
          
          {errorMessage && (
            <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-start space-x-3 text-danger">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="text-sm font-bold">{errorMessage}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-xl flex items-start space-x-3 text-success">
              <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="text-sm font-bold">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            
            {/* Account Role Toggle */}
            <div className="flex space-x-2 p-1 bg-background border border-gray-200 rounded-lg mb-6">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${role === "student" ? "bg-surface shadow-sm text-primary" : "text-text-muted"}`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole("porter")}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${role !== "student" ? "bg-surface shadow-sm text-primary" : "text-text-muted"}`}
              >
                Staff
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Full Name</label>
              <div className="relative group">
                <User className="absolute left-3 top-3 h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Oyebode Precious Isaac"
                  className="w-full pl-10 pr-4 py-3 bg-background border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary text-text-main"
                  required
                />
              </div>
            </div>

            {role === "student" && (
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Matriculation Number</label>
                <div className="relative group">
                  <BookOpen className="absolute left-3 top-3 h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={matricNumber}
                    onChange={(e) => setMatricNumber(e.target.value)}
                    placeholder="e.g. CSC/2022/004"
                    className="w-full pl-10 pr-4 py-3 bg-background border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary text-text-main"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@university.edu.ng"
                  className="w-full pl-10 pr-4 py-3 bg-background border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary text-text-main"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Create Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary text-text-main"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition-all flex items-center justify-center shadow-md disabled:opacity-70 mt-4"
            >
              {isLoading ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Registering...</> : "Create Account"}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-text-muted">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-primary hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}