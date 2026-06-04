"use client";

import { useEffect, useState } from "react";
import { Users, DoorClosed, AlertTriangle, MapPin, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    availableBeds: 0,
    totalBeds: 0,
    pendingComplaints: 0,
    pendingExeats: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // 1. Fetch Total Active Students
        const { count: studentCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "student");

        // 2. Fetch Bed Availability (Instead of whole rooms)
        const { data: rooms } = await supabase.from("rooms").select("capacity");
        const { count: occupiedBeds } = await supabase.from("allocations").select("*", { count: "exact", head: true });

        let totalBedsCount = 0;
        if (rooms) {
          rooms.forEach(room => {
            totalBedsCount += room.capacity;
          });
        }
        
        const availableBedsCount = totalBedsCount - (occupiedBeds || 0);

        // 3. Fetch Pending Complaints
        const { count: complaintCount } = await supabase
          .from("complaints")
          .select("*", { count: "exact", head: true })
          .eq("status", "Pending");

        // 4. Fetch Pending Exeats
        const { count: exeatCount } = await supabase
          .from("exeats")
          .select("*", { count: "exact", head: true })
          .eq("status", "Pending");

        setStats({
          totalStudents: studentCount || 0,
          availableBeds: availableBedsCount,
          totalBeds: totalBedsCount,
          pendingComplaints: complaintCount || 0,
          pendingExeats: exeatCount || 0,
        });

      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial Fetch
    fetchDashboardStats();
    
    // Live Feed Subscription for the Dashboard Stats
    const channels = supabase.channel('admin-dashboard-stats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'allocations' }, () => fetchDashboardStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'complaints' }, () => fetchDashboardStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'exeats' }, () => fetchDashboardStats())
      .subscribe();

    return () => {
      supabase.removeChannel(channels);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-sm font-bold text-text-muted">Syncing Live Metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full">
      <div>
        <h1 className="text-2xl font-bold text-text-main uppercase tracking-tight">Dashboard Overview</h1>
        <p className="text-sm text-text-muted mt-1">Live metrics synced from Supabase Database.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        
        {/* Total Students Card */}
        <div className="bg-surface border border-gray-100 rounded-xl p-6 shadow-sm flex items-center space-x-4 transition-all hover:shadow-md">
          <div className="p-4 bg-primary/10 text-primary rounded-xl">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Total Students</p>
            <h3 className="text-2xl font-extrabold text-text-main leading-tight">{stats.totalStudents}</h3>
            <p className="text-xs font-bold text-success mt-1 flex items-center">
              <span className="mr-1">↗</span> Active in system
            </p>
          </div>
        </div>

        {/* Available Beds Card (Corrected Metric) */}
        <div className="bg-surface border border-gray-100 rounded-xl p-6 shadow-sm flex items-center space-x-4 transition-all hover:shadow-md">
          <div className="p-4 bg-success/10 text-success rounded-xl">
            <DoorClosed className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Available Beds</p>
            <h3 className="text-2xl font-extrabold text-text-main leading-tight">{stats.availableBeds}</h3>
            <p className="text-xs font-medium text-text-muted mt-1">Out of {stats.totalBeds} total beds</p>
          </div>
        </div>

        {/* Pending Complaints Card */}
        <div className="bg-surface border border-gray-100 rounded-xl p-6 shadow-sm flex items-center space-x-4 transition-all hover:shadow-md">
          <div className="p-4 bg-danger/10 text-danger rounded-xl">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Pending Complaints</p>
            <h3 className="text-2xl font-extrabold text-text-main leading-tight">{stats.pendingComplaints}</h3>
            {stats.pendingComplaints === 0 ? (
              <p className="text-xs font-bold text-success mt-1">All clear</p>
            ) : (
              <p className="text-xs font-bold text-danger mt-1">Requires attention</p>
            )}
          </div>
        </div>

        {/* Exeat Requests Card */}
        <div className="bg-surface border border-gray-100 rounded-xl p-6 shadow-sm flex items-center space-x-4 transition-all hover:shadow-md">
          <div className="p-4 bg-warning/10 text-warning rounded-xl">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Exeat Requests</p>
            <h3 className="text-2xl font-extrabold text-text-main leading-tight">{stats.pendingExeats}</h3>
            <p className="text-xs font-medium text-warning mt-1">Awaiting DSA approval</p>
          </div>
        </div>
      </div>

      {/* System Status Banner */}
      <div className="mt-6 bg-surface border border-success/20 rounded-xl p-6 shadow-sm flex items-start space-x-4">
        <div className="p-2 bg-success/10 text-success rounded-full shrink-0">
          <CheckCircle className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-text-main">Database Engine Active</h3>
          <p className="text-sm text-text-muted mt-1">
            The Smart Residency backend is fully connected. Allocations, Exeats, and Complaints are updating in real-time.
          </p>
        </div>
      </div>

    </div>
  );
}