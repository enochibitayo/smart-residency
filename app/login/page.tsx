"use client";

import { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [role, setRole] = useState<"student" | "admin">("student");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-surface w-full max-w-md rounded-2xl shadow-lg p-8 flex flex-col items-center">
        
        {/* Logo Placeholder (Styled to match the shield silhouette in the UI) */}
        <div className="w-16 h-20 bg-background flex items-center justify-center rounded-b-full border-t-4 border-primary mb-4 shadow-sm">
          <span className="text-primary font-bold text-xl">KU</span>
        </div>

        <h1 className="text-2xl font-bold text-text-main text-center leading-tight">
          SMART RESIDENCY<br />SYSTEM
        </h1>
        <p className="text-text-muted mt-2 text-sm">Sign in to your account</p>

        {/* Role Toggle Switch */}
        <div className="bg-background flex rounded-full w-full mt-6 p-1 border border-gray-200">
          <button
            onClick={() => setRole("student")}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              role === "student"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setRole("admin")}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              role === "admin"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            Admin
          </button>
        </div>

        {/* Login Form */}
        <form className="w-full mt-8 space-y-5">
          {/* Email / ID Input */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 h-5 w-5 text-text-muted" />
            <input
              type="text"
              placeholder="Student ID / Email"
              className="w-full pl-10 pr-4 py-3 bg-surface border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-text-main placeholder-text-muted transition-colors"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-text-muted" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-10 pr-10 py-3 bg-surface border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-text-main placeholder-text-muted transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-text-muted hover:text-text-main transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between mt-4">
            <label className="flex items-center text-sm text-text-muted cursor-pointer">
              <input
                type="checkbox"
                className="mr-2 rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
              />
              Remember me
            </label>
            <a href="#" className="text-sm font-medium text-primary hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            className="w-full mt-6 bg-primary text-primary-foreground py-3.5 rounded-lg font-bold hover:opacity-90 transition-opacity shadow-md"
          >
            LOGIN
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-sm text-text-muted">
          Don't have an account?{" "}
          <a href="#" className="font-medium text-primary hover:underline">
            Contact admin
          </a>
        </p>
      </div>
    </div>
  );
}