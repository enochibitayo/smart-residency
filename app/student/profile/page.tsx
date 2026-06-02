"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, BookOpen, Mail, ShieldCheck, LogOut, Loader2 } from "lucide-react";
import { supabase } from "../../../lib/supabase";

export default function StudentProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // 1. Get the current auth session
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          router.push("/login");
          return;
        }
        
        setEmail(user.email || "");

        // 2. Fetch their specific profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;
        
        setProfile(profileData);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-background min-h-screen items-center justify-center pb-20">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-text-muted font-bold text-sm">Loading Identity...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background min-h-screen pb-20">
      
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-6 rounded-b-3xl shadow-md flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-sm opacity-80 mt-1">Manage your identity & session</p>
        </div>
        <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-inner">
          <User className="h-6 w-6 text-white" />
        </div>
      </header>

      <div className="p-6 space-y-6 mt-4">
        
        {/* Identity Card */}
        <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center space-x-4 bg-primary/5">
            <div className="h-14 w-14 rounded-full bg-primary/20 text-primary flex items-center justify-center font-extrabold text-xl shadow-inner">
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-main">{profile?.full_name || "Unknown Resident"}</h2>
              <span className="inline-flex mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-success/10 text-success uppercase tracking-wider">
                Active Resident
              </span>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-50 rounded-lg text-text-muted">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Matriculation Number</p>
                <p className="text-sm font-semibold text-text-main">{profile?.matric_number || "Not assigned"}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-50 rounded-lg text-text-muted">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">University Email</p>
                <p className="text-sm font-semibold text-text-main truncate">{email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-50 rounded-lg text-text-muted">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">System Role</p>
                <p className="text-sm font-semibold text-text-main capitalize">{profile?.role || "Student"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security / Action Area */}
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-between p-4 bg-danger/10 text-danger rounded-xl font-bold hover:bg-danger/20 transition-colors border border-danger/20 shadow-sm disabled:opacity-50"
        >
          <span className="flex items-center">
            {isLoggingOut ? <Loader2 className="h-5 w-5 mr-3 animate-spin" /> : <LogOut className="h-5 w-5 mr-3" />}
            Secure Sign Out
          </span>
          <span className="opacity-50 text-xl">&rarr;</span>
        </button>

      </div>
    </div>
  );
}