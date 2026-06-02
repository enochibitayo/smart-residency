"use client";

import { DoorClosed, MapPin, FileWarning, LogOut, Bell } from "lucide-react";
import Link from "next/link";

export default function StudentDashboard() {
  return (
    <div className="flex flex-col w-full h-full">
      
      {/* Header Section */}
      <header className="bg-primary text-primary-foreground p-6 rounded-b-3xl shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm opacity-80">Welcome back,</p>
            <h1 className="text-2xl font-bold mt-1">Oyebode Precious 👋</h1>
          </div>
          <button className="relative p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-danger rounded-full border-2 border-primary"></span>
          </button>
        </div>

        {/* Current Room Card */}
        <div className="mt-6 bg-surface text-text-main p-4 rounded-xl shadow-sm flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-warning/20 text-warning rounded-lg">
              <DoorClosed className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-text-muted font-semibold uppercase tracking-wider">Hostel</p>
              <p className="font-bold text-lg">Block B</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-muted font-semibold uppercase tracking-wider">Room</p>
            <p className="font-bold text-lg">204</p>
          </div>
        </div>
      </header>

      {/* Quick Actions Section */}
      <div className="p-6 mt-2">
        <h2 className="text-sm font-bold text-text-main mb-4 uppercase tracking-wider">Quick Actions</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Action 1 */}
          <Link href="/student/room" className="bg-surface p-4 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center text-center gap-3 hover:border-primary/30 transition-all">
            <div className="p-3 bg-primary/10 text-primary rounded-full">
              <DoorClosed className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold text-text-main">Smart Room<br/>Allocation</span>
          </Link>

          {/* Action 2 */}
          <Link href="/student/exeat" className="bg-surface p-4 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center text-center gap-3 hover:border-success/30 transition-all">
            <div className="p-3 bg-success/10 text-success rounded-full">
              <MapPin className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold text-text-main">Real-Time<br/>Tracking</span>
          </Link>

          {/* Action 3 */}
          <Link href="/student/complaints" className="bg-surface p-4 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center text-center gap-3 hover:border-danger/30 transition-all">
            <div className="p-3 bg-danger/10 text-danger rounded-full">
              <FileWarning className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold text-text-main">Lodge<br/>Complaint</span>
          </Link>

          {/* Action 4 */}
          <Link href="/student/exeat" className="bg-surface p-4 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center text-center gap-3 hover:border-warning/30 transition-all">
            <div className="p-3 bg-warning/10 text-warning rounded-full">
              <LogOut className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold text-text-main">Request<br/>Exeat</span>
          </Link>
        </div>
      </div>
    </div>
  );
}