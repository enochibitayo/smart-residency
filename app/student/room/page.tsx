"use client";

import { DoorClosed, User, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function StudentRoomPage() {
  return (
    <div className="flex flex-col h-full bg-background min-h-screen pb-20">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-6 rounded-b-3xl shadow-md">
        <h1 className="text-2xl font-bold">My Allocation</h1>
        <p className="text-sm opacity-80 mt-1">Current residency details</p>
      </header>

      <div className="p-6 space-y-6">
        
        {/* Main Room Card */}
        <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-success/10 p-6 flex flex-col items-center justify-center border-b border-gray-100">
            <div className="w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center mb-3 shadow-inner">
              <DoorClosed className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-extrabold text-text-main">Room 204</h2>
            <p className="text-sm font-bold text-success uppercase tracking-wider mt-1">Block B (Male Hostel)</p>
          </div>
          
          <div className="p-6">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Roommates (3/4)</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">OP</div>
                <span className="text-sm font-bold text-text-main">Oyebode Precious (You)</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-text-muted font-bold text-xs">TB</div>
                <span className="text-sm font-medium text-text-main">Tobi Bankole</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-text-muted font-bold text-xs">DY</div>
                <span className="text-sm font-medium text-text-main">David Yakubu</span>
              </li>
              <li className="flex items-center space-x-3 opacity-50">
                <div className="h-8 w-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-text-muted">
                  <User className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-text-muted italic">Empty Bed Space</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Quick Action */}
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
      </div>
    </div>
  );
}