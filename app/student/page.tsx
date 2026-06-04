"use client";

import { useEffect, useState } from "react";
import { DoorClosed, MapPin, FileWarning, LogOut, Bell, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "../../lib/supabase"; 

export default function StudentDashboard() {
  const [profileName, setProfileName] = useState("");
  const [roomData, setRoomData] = useState<{ block: string; room: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Authenticate the active session
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) return;

        // 2. Fetch their real registration name from profiles
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
          
        if (profile) setProfileName(profile.full_name);

        // 3. Fetch their exact room assignment from the database
        const { data: allocation } = await supabase
          .from("allocations")
          .select(`
            rooms (
              block,
              room_number
            )
          `)
          .eq("student_id", user.id)
          .single();

        if (allocation && allocation.rooms) {
          // Type casting to handle Supabase relational joins
          const assignedRoom = allocation.rooms as any;
          setRoomData({ block: assignedRoom.block, room: assignedRoom.room_number });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex flex-col w-full h-full bg-background min-h-screen">
      {/* Header Section */}
      <header className="bg-primary text-primary-foreground p-6 rounded-b-3xl shadow-md transition-all">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm opacity-80">Welcome back,</p>
            {isLoading ? (
              <div className="h-8 w-48 bg-white/20 animate-pulse rounded mt-1"></div>
            ) : (
              <h1 className="text-2xl font-bold mt-1">{profileName || "Resident"} 👋</h1>
            )}
          </div>
          <button className="relative p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-danger rounded-full border-2 border-white"></span>
          </button>
        </div>

        {/* Dynamic Room Card */}
        <div className="mt-6 bg-surface text-text-main p-4 rounded-xl shadow-sm flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg flex items-center justify-center ${
              roomData ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
            }`}>
              <DoorClosed className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Hostel</p>
              <p className={`font-bold text-lg ${!roomData && "text-warning"}`}>
                {roomData ? roomData.block : "Pending"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Room</p>
            <p className={`font-bold text-lg ${!roomData && "text-warning"}`}>
              {roomData ? roomData.room : "TBD"}
            </p>
          </div>
        </div>
      </header>

      {/* Quick Actions Grid */}
      <div className="p-6 mt-2">
        <h2 className="text-sm font-bold text-text-main mb-4 uppercase tracking-wider">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/student/room" className="bg-surface p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-3 hover:border-primary/30 hover:shadow-md transition-all group">
            <div className="p-3 bg-primary/10 text-primary rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
              <DoorClosed className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold text-text-main">Smart Room<br/>Allocation</span>
          </Link>
          <Link href="/student/exeat" className="bg-surface p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-3 hover:border-success/30 hover:shadow-md transition-all group">
            <div className="p-3 bg-success/10 text-success rounded-full group-hover:bg-success group-hover:text-white transition-colors">
              <MapPin className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold text-text-main">Real-Time<br/>Tracking</span>
          </Link>
          <Link href="/student/complaints" className="bg-surface p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-3 hover:border-danger/30 hover:shadow-md transition-all group">
            <div className="p-3 bg-danger/10 text-danger rounded-full group-hover:bg-danger group-hover:text-white transition-colors">
              <FileWarning className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold text-text-main">Lodge<br/>Complaint</span>
          </Link>
          <Link href="/student/exeat" className="bg-surface p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-3 hover:border-warning/30 hover:shadow-md transition-all group">
            <div className="p-3 bg-warning/10 text-warning rounded-full group-hover:bg-warning group-hover:text-white transition-colors">
              <LogOut className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold text-text-main">Request<br/>Exeat</span>
          </Link>
        </div>
      </div>
    </div>
  );
}