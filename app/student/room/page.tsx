"use client";

import { useEffect, useState } from "react";
import { DoorClosed, User, AlertTriangle, Loader2, Info } from "lucide-react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase"; 

export default function StudentRoomPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [roomInfo, setRoomInfo] = useState<any>(null);
  const [occupants, setOccupants] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  const fetchRoomDetails = async () => {
    try {
      // 1. Authenticate the active student
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Not authenticated");
      
      setCurrentUserId(user.id);

      // 2. Find which room this student is allocated to
      const { data: allocation, error: allocError } = await supabase
        .from("allocations")
        .select(`room_id, rooms (id, block, room_number, capacity)`)
        .eq("student_id", user.id)
        .single();

      if (allocError || !allocation) {
        setRoomInfo(null);
        setIsLoading(false);
        return; 
      }

      // Handle Supabase join object safely
      const roomData = Array.isArray(allocation.rooms) ? allocation.rooms[0] : allocation.rooms;
      setRoomInfo(roomData);

      // 3. Fetch all students sharing this exact room (Fixed Query)
      const { data: roomOccupants } = await supabase
        .from("allocations")
        .select(`student_id, profiles (full_name)`)
        .eq("room_id", allocation.room_id);

      if (roomOccupants) {
        setOccupants(roomOccupants);
      }

    } catch (error) {
      console.error("Error fetching room details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchRoomDetails();

    // 4. LIVE FEED SUBSCRIPTION
    const channel = supabase
      .channel('live-student-room')
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'allocations' }, 
        () => {
          // Instantly refresh the UI if a roommate is added or removed
          fetchRoomDetails(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Helper function to extract initials
  const getInitials = (name: string) => {
    if (!name) return "S";
    const parts = name.split(" ");
    return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-background items-center justify-center pb-20">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-text-muted font-bold text-sm">Syncing Allocation Data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background min-h-screen pb-20">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-6 rounded-b-3xl shadow-md">
        <h1 className="text-2xl font-bold">My Allocation</h1>
        <p className="text-sm opacity-80 mt-1">Current residency details</p>
      </header>

      <div className="p-6 space-y-6">
        
        {!roomInfo ? (
          // PENDING STATE
          <div className="bg-surface p-8 rounded-2xl shadow-sm border border-warning/20 flex flex-col items-center text-center mt-4">
            <div className="w-16 h-16 bg-warning/10 text-warning rounded-full flex items-center justify-center mb-4">
              <Info className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-text-main">Allocation Pending</h2>
            <p className="text-sm text-text-muted mt-2">
              You have not been assigned to a hostel room yet. The Dean of Student Affairs office will run the allocation engine soon.
            </p>
          </div>
        ) : (
          // ASSIGNED STATE
          <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-success/10 p-6 flex flex-col items-center justify-center border-b border-gray-100">
              <div className="w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center mb-3 shadow-inner">
                <DoorClosed className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-extrabold text-text-main">Room {roomInfo.room_number}</h2>
              <p className="text-sm font-bold text-success uppercase tracking-wider mt-1">{roomInfo.block}</p>
            </div>
            
            <div className="p-6">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
                Roommates ({occupants.length}/{roomInfo.capacity})
              </h3>
              <ul className="space-y-3">
                {/* 1. Map through actual occupants */}
                {occupants.map((occ) => {
                  const isMe = occ.student_id === currentUserId;
                  const profileData = Array.isArray(occ.profiles) ? occ.profiles[0] : occ.profiles;
                  const fullName = profileData?.full_name || "Unknown Resident";
                  
                  return (
                    <li key={occ.student_id} className="flex items-center space-x-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                        isMe ? "bg-primary/10 text-primary" : "bg-gray-100 text-text-muted"
                      }`}>
                        {getInitials(fullName)}
                      </div>
                      <span className={`text-sm ${isMe ? "font-bold text-text-main" : "font-medium text-text-main"}`}>
                        {fullName} {isMe && "(You)"}
                      </span>
                    </li>
                  );
                })}

                {/* 2. Dynamically render empty bed spaces */}
                {Array.from({ length: Math.max(0, roomInfo.capacity - occupants.length) }).map((_, index) => (
                  <li key={`empty-${index}`} className="flex items-center space-x-3 opacity-50">
                    <div className="h-10 w-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-text-muted shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-text-muted italic">Empty Bed Space</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Quick Action */}
        {roomInfo && (
          <Link 
            href="/student/complaints"
            className="w-full bg-surface border border-gray-200 p-4 rounded-xl flex items-center justify-between hover:border-warning transition-colors shadow-sm"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-warning/10 text-warning rounded-lg">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <span className="text-sm font-bold text-text-main">Report Room Issue</span>
            </div>
            <span className="text-text-muted">&rarr;</span>
          </Link>
        )}
      </div>
    </div>
  );
}