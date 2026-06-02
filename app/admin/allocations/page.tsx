"use client";

import { useState } from "react";
import { Wand2, Settings2, Download, MoreVertical, CheckCircle } from "lucide-react";

export default function RoomAllocationPage() {
  const [isAllocating, setIsAllocating] = useState(false);
  const [allocationSuccess, setAllocationSuccess] = useState(false);

  // Mock data matching the UI requirement gathering phase
  const rooms = [
    { id: 1, block: "Block B", room: "B201", capacity: 4, occupied: 3, available: 1, status: "Available" },
    { id: 2, block: "Block B", room: "B204", capacity: 4, occupied: 4, available: 0, status: "Full" },
    { id: 3, block: "Block B", room: "B205", capacity: 4, occupied: 2, available: 2, status: "Available" },
    { id: 4, block: "Block C", room: "C101", capacity: 2, occupied: 1, available: 1, status: "Available" },
    { id: 5, block: "Block C", room: "C102", capacity: 2, occupied: 2, available: 0, status: "Full" },
    { id: 6, block: "Block A", room: "A103", capacity: 4, occupied: 2, available: 2, status: "Available" },
  ];

  // Simulating the backend algorithm for the hackathon MVP
  const handleAutoAllocate = () => {
    setIsAllocating(true);
    setTimeout(() => {
      setIsAllocating(false);
      setAllocationSuccess(true);
      setTimeout(() => setAllocationSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main uppercase tracking-tight">Room Allocation Management</h1>
          <p className="text-sm text-text-muted mt-1">Manage bed spaces and run automated student sorting.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-surface border border-gray-200 text-text-main rounded-lg text-sm font-semibold hover:border-primary transition-colors flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="px-4 py-2 bg-surface border border-gray-200 text-text-main rounded-lg text-sm font-semibold hover:border-primary transition-colors flex items-center">
            <Settings2 className="h-4 w-4 mr-2" />
            Manual Override
          </button>
          <button 
            onClick={handleAutoAllocate}
            disabled={isAllocating}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-all ${
              allocationSuccess 
                ? "bg-success text-white" 
                : "bg-success/10 text-success hover:bg-success hover:text-white border border-success/20"
            }`}
          >
            {isAllocating ? (
              <span className="flex items-center">
                <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                Allocating...
              </span>
            ) : allocationSuccess ? (
              <span className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Success
              </span>
            ) : (
              <span className="flex items-center">
                <Wand2 className="h-4 w-4 mr-2" />
                Auto Allocate Rooms
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Data Table Card */}
      <div className="bg-surface rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background border-b border-gray-200 text-xs uppercase tracking-wider text-text-muted">
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
                <tr key={room.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-text-main">{room.block}</td>
                  <td className="px-6 py-4 text-sm font-bold text-text-main">{room.room}</td>
                  <td className="px-6 py-4 text-sm text-text-muted text-center">{room.capacity}</td>
                  <td className="px-6 py-4 text-sm text-text-main font-semibold text-center">{room.occupied}</td>
                  <td className="px-6 py-4 text-sm text-text-main font-semibold text-center">{room.available}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      room.status === "Available" 
                        ? "bg-success/10 text-success" 
                        : "bg-danger/10 text-danger"
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
        
        {/* Pagination Mockup */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-text-muted">
          <span>Showing 1 to 6 of 24 rooms</span>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-background">Prev</button>
            <button className="px-3 py-1 bg-primary text-primary-foreground rounded">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-background">2</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-background">3</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-background">Next</button>
          </div>
        </div>
      </div>

    </div>
  );
}