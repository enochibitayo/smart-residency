"use client";

import { useEffect, useState } from "react";
import { Wand2, Download, MoreVertical, CheckCircle, Loader2, DoorClosed, Users, Server, Sliders } from "lucide-react";
import { supabase } from "../../../lib/supabase"; 

export default function RoomAllocationPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAllocating, setIsAllocating] = useState(false);
  const [allocationSuccess, setAllocationSuccess] = useState(false);
  const [activeRule, setActiveRule] = useState("Loading Rule...");
  const [stats, setStats] = useState({ totalBeds: 0, occupiedBeds: 0, availableBeds: 0 });

  const fetchRoomData = async () => {
    try {
      const { data: roomsData } = await supabase.from("rooms").select("*");
      const { data: allocationsData } = await supabase.from("allocations").select("room_id");

      if (roomsData) {
        let total = 0;
        let occupied = allocationsData?.length || 0;

        const mappedRooms = roomsData.map(room => {
          total += room.capacity;
          const occupiedCount = allocationsData?.filter(a => a.room_id === room.id).length || 0;
          return {
            ...room,
            occupied: occupiedCount,
            available: room.capacity - occupiedCount,
            status: occupiedCount >= room.capacity ? "Full" : "Available"
          };
        });

        // Perfect Alphanumeric Sorting (Block A -> K)
        mappedRooms.sort((a, b) => {
          const blockCompare = a.block.localeCompare(b.block);
          if (blockCompare !== 0) return blockCompare;
          return a.room_number.localeCompare(b.room_number, undefined, { numeric: true });
        });

        setRooms(mappedRooms);
        setStats({ totalBeds: total, occupiedBeds: occupied, availableBeds: total - occupied });
      }

      // Check current settings rule safely
      try {
        const savedSettings = localStorage.getItem("smartResidencySettings");
        if (savedSettings && savedSettings !== "undefined") {
          setActiveRule(JSON.parse(savedSettings).sortPriority);
        } else {
          setActiveRule("Academic Level");
        }
      } catch (e) {
        setActiveRule("Academic Level");
      }

    } catch (error) {
      console.error("Error fetching room data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomData();
  }, []);

  const handleAutoAllocate = async () => {
    setIsAllocating(true);
    
    try {
      // 1. Fetch unallocated students (Removed strict role filter for demo safety)
      const { data: allStudents, error: studentErr } = await supabase
        .from("profiles")
        .select("id, matric_number");
      
      if (studentErr) throw new Error(`Profile Fetch Error: ${studentErr.message}`);

      const { data: currentAllocations, error: allocErr } = await supabase
        .from("allocations")
        .select("student_id");

      if (allocErr) throw new Error(`Allocations Fetch Error: ${allocErr.message}`);
      
      const allocatedIds = new Set(currentAllocations?.map(a => a.student_id) || []);
      let unallocatedStudents = allStudents?.filter(s => !allocatedIds.has(s.id)) || [];

      if (unallocatedStudents.length === 0) {
        alert("All registered users have already been assigned to a room!");
        setIsAllocating(false);
        return;
      }

      // 2. Safely read the rule from local storage
      let settings = { sortPriority: "Academic Level" };
      try {
        const saved = localStorage.getItem("smartResidencySettings");
        if (saved && saved !== "undefined") {
          settings = JSON.parse(saved);
        }
      } catch (e) {
        console.warn("Could not parse settings, defaulting to Academic Level");
      }

      // 3. The Smart Sorting Engine
      if (settings.sortPriority === "Randomized") {
        unallocatedStudents.sort(() => Math.random() - 0.5);
      } else {
        // Safe string extraction for Academic Level
        unallocatedStudents.sort((a, b) => {
          const getYear = (matric: any) => {
            if (!matric) return 0;
            const match = String(matric).match(/\/(20\d{2}|\d{2})\//); 
            if (match) return parseInt(match[1].length === 2 ? "20" + match[1] : match[1]);
            return 0;
          };
          return getYear(b.matric_number) - getYear(a.matric_number);
        });
      }

      // 4. The Distribution Loop
      let studentIndex = 0;
      const newAllocations = [];

      for (const room of rooms) {
        if (room.available > 0) {
          let slotsToFill = room.available;
          
          while (slotsToFill > 0 && studentIndex < unallocatedStudents.length) {
            newAllocations.push({
              student_id: unallocatedStudents[studentIndex].id,
              room_id: room.id
            });
            studentIndex++;
            slotsToFill--;
          }
        }
      }

      // 5. Insert new allocations securely
      if (newAllocations.length > 0) {
        const { error: insertErr } = await supabase.from("allocations").insert(newAllocations);
        if (insertErr) throw new Error(`Database Insert Error: ${insertErr.message}`);
        
        await fetchRoomData();
      }

      setAllocationSuccess(true);
      setTimeout(() => setAllocationSuccess(false), 3000);

    } catch (error: any) {
      console.error("Allocation Algorithm Error:", error);
      // This will pop up a clean alert showing EXACTLY what failed if it ever breaks again
      alert(`Engine Failed:\n\n${error.message || JSON.stringify(error)}`);
    } finally {
      setIsAllocating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col pb-8">
      
      {/* Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main uppercase tracking-tight">Room Allocation Engine</h1>
          <p className="text-sm text-text-muted mt-1">Manage {rooms.length} rooms and run automated student sorting.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg border border-primary/20">
            <Sliders className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Rule: {activeRule}</span>
          </div>
          <button 
            onClick={handleAutoAllocate}
            disabled={isAllocating || isLoading}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold flex items-center transition-all shadow-md ${
              allocationSuccess 
                ? "bg-success text-white" 
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {isAllocating ? (
              <><Wand2 className="h-4 w-4 mr-2 animate-spin" /> Sorting Students...</>
            ) : allocationSuccess ? (
              <><CheckCircle className="h-4 w-4 mr-2" /> Allocation Complete</>
            ) : (
              <><Wand2 className="h-4 w-4 mr-2" /> Run Auto-Allocator</>
            )}
          </button>
        </div>
      </div>

      {/* Live Capacity Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface p-4 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 bg-primary/10 text-primary rounded-lg"><Server className="h-5 w-5" /></div>
          <div>
            <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Total Bed Spaces</p>
            <h3 className="text-lg font-extrabold text-text-main">{stats.totalBeds}</h3>
          </div>
        </div>
        <div className="bg-surface p-4 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 bg-danger/10 text-danger rounded-lg"><Users className="h-5 w-5" /></div>
          <div>
            <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Occupied Beds</p>
            <h3 className="text-lg font-extrabold text-text-main">{stats.occupiedBeds}</h3>
          </div>
        </div>
        <div className="bg-surface p-4 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 bg-success/10 text-success rounded-lg"><DoorClosed className="h-5 w-5" /></div>
          <div>
            <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Available Slots</p>
            <h3 className="text-lg font-extrabold text-text-main">{stats.availableBeds}</h3>
          </div>
        </div>
      </div>

      {/* Scrollable Data Table Card */}
      <div className="bg-surface rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : rooms.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-text-muted">
            <DoorClosed className="h-12 w-12 mb-2 opacity-20" />
            <p>No rooms found in database. Please run the SQL injection script.</p>
          </div>
        ) : (
          <div className="overflow-auto flex-1 relative max-h-[60vh] scrollbar-thin scrollbar-thumb-gray-200">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-surface z-10 shadow-sm">
                <tr className="bg-gray-50/90 backdrop-blur-sm border-b border-gray-200 text-xs uppercase tracking-wider text-text-muted">
                  <th className="px-6 py-4 font-bold">Hostel Block</th>
                  <th className="px-6 py-4 font-bold">Room No.</th>
                  <th className="px-6 py-4 font-bold text-center">Capacity</th>
                  <th className="px-6 py-4 font-bold text-center">Occupied</th>
                  <th className="px-6 py-4 font-bold text-center">Available</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-text-main">{room.block}</td>
                    <td className="px-6 py-4 text-sm font-bold text-text-main">{room.room_number}</td>
                    <td className="px-6 py-4 text-sm text-text-muted text-center">{room.capacity}</td>
                    <td className="px-6 py-4 text-sm text-text-main font-semibold text-center">{room.occupied}</td>
                    <td className="px-6 py-4 text-sm text-text-main font-semibold text-center">{room.available}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                        room.status === "Available" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                      }`}>
                        {room.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-text-muted hover:text-primary transition-colors p-1 rounded">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}