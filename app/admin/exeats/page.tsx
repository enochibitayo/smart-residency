"use client";

import { useEffect, useState } from "react";
import { Search, Check, X, MapPin, Loader2 } from "lucide-react";
import { supabase } from "../../../lib/supabase";

export default function AdminExeatsPage() {
  const [exeats, setExeats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"Pending" | "Approved" | "Rejected">("Pending");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchExeats = async () => {
    try {
      // Updated Relational Join Syntax
      const { data, error } = await supabase
        .from("exeats")
        .select(`*, profiles (full_name, matric_number)`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setExeats(data);
    } catch (error) {
      console.error("Error fetching exeats:", error);
    } finally {
      setIsLoading(false);
    }
  };

useEffect(() => {
    // 1. Fetch initial data on page load
    fetchExeats();

    // 2. Subscribe to LIVE database changes
    const channel = supabase
      .channel('live-exeats')
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'exeats' }, 
        (payload) => {
          // Instantly refresh the table when a new request arrives
          fetchExeats(); 
        }
      )
      .subscribe();

    // 3. Clean up the connection
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: "Approved" | "Rejected") => {
    try {
      const { error } = await supabase.from("exeats").update({ status: newStatus }).eq("id", id);
      if (error) throw error;
      setExeats(exeats.map(exeat => exeat.id === id ? { ...exeat, status: newStatus } : exeat));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredExeats = exeats.filter(exeat => 
    exeat.status === activeTab &&
    (exeat.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
     exeat.profiles?.matric_number?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main uppercase tracking-tight">Exeat Requests</h1>
          <p className="text-sm text-text-muted mt-1">Review and manage student leave applications.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search ID or Name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-surface border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary w-64"
            />
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
        <div className="flex border-b border-gray-200 px-6 pt-2">
          {(["Pending", "Approved", "Rejected"] as const).map((tab) => {
            const count = exeats.filter(e => e.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-4 text-sm font-bold border-b-2 transition-colors flex items-center space-x-2 ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text-main"}`}
              >
                <span>{tab}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 text-primary animate-spin" /></div>
        ) : filteredExeats.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-text-muted text-sm font-medium">No {activeTab.toLowerCase()} requests found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background border-b border-gray-200 text-xs uppercase tracking-wider text-text-muted">
                  <th className="px-6 py-4 font-bold">Student</th>
                  <th className="px-6 py-4 font-bold">Destination</th>
                  <th className="px-6 py-4 font-bold">Departure</th>
                  <th className="px-6 py-4 font-bold">Return</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredExeats.map((exeat) => (
                  <tr key={exeat.id} className="hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-text-main">{exeat.profiles?.full_name || "Unknown"}</p>
                      <p className="text-xs text-text-muted">{exeat.profiles?.matric_number}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-text-main">{exeat.reason}</p>
                      <p className="text-xs text-text-muted flex items-center mt-1"><MapPin className="h-3 w-3 mr-1" /> {exeat.destination}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-text-main">{new Date(exeat.departure_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm font-medium text-text-main">{new Date(exeat.return_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${exeat.status === 'Pending' ? 'bg-warning/10 text-warning' : exeat.status === 'Approved' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                        {exeat.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {exeat.status === "Pending" ? (
                        <div className="flex items-center justify-center space-x-2">
                          <button onClick={() => handleUpdateStatus(exeat.id, "Approved")} className="p-1.5 border border-success text-success rounded-md hover:bg-success hover:text-white transition-colors"><Check className="h-4 w-4" /></button>
                          <button onClick={() => handleUpdateStatus(exeat.id, "Rejected")} className="p-1.5 border border-danger text-danger rounded-md hover:bg-danger hover:text-white transition-colors"><X className="h-4 w-4" /></button>
                        </div>
                      ) : (
                        <span className="text-xs text-text-muted font-medium">Processed</span>
                      )}
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