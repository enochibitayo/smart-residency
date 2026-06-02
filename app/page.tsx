"use client";

import Link from "next/link";
import { Shield, GraduationCap, LayoutDashboard } from "lucide-react";

export default function RootPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl text-center space-y-6">
        
        {/* App Logo Emblem */}
        <div className="inline-flex w-20 h-24 bg-surface flex-col items-center justify-center rounded-b-full border-t-8 border-primary mx-auto shadow-md">
          <Shield className="h-8 w-8 text-primary mt-2" />
          <span className="text-primary font-bold text-xs mb-2">SR</span>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-text-main tracking-tight sm:text-5xl">
            SMART RESIDENCY SYSTEM
          </h1>
          <p className="text-xl text-text-muted max-w-md mx-auto">
            Digitized hostel management, live tracking, and instant automated workflows.
          </p>
        </div>

        {/* Portal Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto pt-6">
          
          {/* Student Entrance */}
          <Link 
            href="/login" 
            className="group flex flex-col items-center text-center p-6 bg-surface border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-primary transition-all duration-200 cursor-pointer"
          >
            <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-primary mb-4">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h2 className="text-lg font-bold text-text-main group-hover:text-primary transition-colors">
              Student App Portal
            </h2>
            <p className="text-sm text-text-muted mt-1">
              Access room allocation data, request electronic exeats, and check live statuses.
            </p>
          </Link>

          {/* Admin Entrance */}
          <Link 
            href="/admin" 
            className="group flex flex-col items-center text-center p-6 bg-surface border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-primary transition-all duration-200 cursor-pointer"
          >
            <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-primary mb-4">
              <LayoutDashboard className="h-8 w-8" />
            </div>
            <h2 className="text-lg font-bold text-text-main group-hover:text-primary transition-colors">
              Admin Web Center
            </h2>
            <p className="text-sm text-text-muted mt-1">
              Manage room rules, run the allocation engine, and approve exeat requests.
            </p>
          </Link>

        </div>

        {/* Quick Access Helper for Hackathon Judges */}
        <div className="pt-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning border border-warning/20">
            Hackathon MVP Testing Mode Active
          </span>
        </div>

      </div>
    </div>
  );
}