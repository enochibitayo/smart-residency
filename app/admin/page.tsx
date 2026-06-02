"use client";

import { Users, DoorClosed, FileWarning, MapPin, TrendingUp, LayoutDashboard } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20 md:pb-0">
      
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-text-main">Dashboard Overview</h1>
        <p className="text-sm text-text-muted">Live metrics and system status.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Students Card */}
        <div className="bg-surface p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-primary/10 text-primary rounded-lg">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-text-muted font-medium">Total Students</p>
            <h2 className="text-2xl font-bold text-text-main">1,240</h2>
            <p className="text-xs text-success flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +12 this week
            </p>
          </div>
        </div>

        {/* Room Availability Card */}
        <div className="bg-surface p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-success/10 text-success rounded-lg">
            <DoorClosed className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-text-muted font-medium">Available Rooms</p>
            <h2 className="text-2xl font-bold text-text-main">48</h2>
            <p className="text-xs text-text-muted mt-1">Out of 320 total rooms</p>
          </div>
        </div>

        {/* Pending Complaints Card */}
        <div className="bg-surface p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-danger/10 text-danger rounded-lg">
            <FileWarning className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-text-muted font-medium">Pending Complaints</p>
            <h2 className="text-2xl font-bold text-text-main">14</h2>
            <p className="text-xs text-danger flex items-center mt-1">
              Requires immediate action
            </p>
          </div>
        </div>

        {/* Pending Exeats Card */}
        <div className="bg-surface p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-warning/10 text-warning rounded-lg">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-text-muted font-medium">Exeat Requests</p>
            <h2 className="text-2xl font-bold text-text-main">8</h2>
            <p className="text-xs text-warning flex items-center mt-1">
              Awaiting DSA approval
            </p>
          </div>
        </div>

      </div>

      {/* Real-Time Tracking Preview */}
      <div className="bg-surface border border-gray-100 rounded-xl shadow-sm p-6 mt-6">
        <h2 className="text-lg font-bold text-text-main mb-4">System Activity Feed</h2>
        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-200 rounded-lg">
          <LayoutDashboard className="h-10 w-10 text-gray-300 mb-3" />
          <h3 className="text-text-main font-semibold">Real-Time Tables Initializing...</h3>
          <p className="text-text-muted text-sm max-w-md mt-2">
            The full Room Allocation engine and Exeat Approval workflow will be wired up to the database in the next phase.
          </p>
        </div>
      </div>

    </div>
  );
}