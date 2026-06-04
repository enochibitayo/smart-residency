"use client";

import { useEffect, useState } from "react";
import { Search, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { supabase } from "../../../lib/supabase";

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"Pending" | "Resolved">("Pending");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchComplaints = async () => {
    try {
      // Correct relational join syntax to pull the student's details
      const { data, error } = await supabase
        .from("complaints")
        .select(`*, profiles (full_name, matric_number)`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setComplaints(data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 1. Fetch initial data on page load
    fetchComplaints();

    // 2. Subscribe to LIVE database changes via WebSockets
    const channel = supabase
      .channel('live-complaints')
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'complaints' }, 
        (payload) => {
          // Instantly refresh the table when a new request arrives or is updated
          fetchComplaints(); 
        }
      )
      .subscribe();

    // 3. Clean up the connection when leaving the page
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleResolve = async (id: string) => {
    try {
      const { error } = await supabase
        .from("complaints")
        .update({ status: "Resolved", escalation_stage: "Closed" })
        .eq("id", id);
        
      if (error) throw error;
      
      // Optimistically update the UI for a snappy feel
      setComplaints(complaints.map(c => c.id === id ? { ...c, status: "Resolved" } : c));
    } catch (error) {
      console.error("Error resolving complaint:", error);
    }
  };

  // Filter based on active tab and search query
  const filteredComplaints = complaints.filter(c => 
    c.status === activeTab &&
    (
      c.category?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.profiles?.matric_number?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main uppercase tracking-tight">Maintenance Issues</h1>
          <p className="text-sm text-text-muted mt-1">Track and resolve student room complaints.</p>
        </div>
        <div className="relative group w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search category or name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text-main"
          />
        </div>
      </div>

      {/* Main Data Card */}
      <div className="bg-surface rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden min-h-[400px]">
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6 pt-2">
          {(["Pending", "Resolved"] as const).map((tab) => {
            const count = complaints.filter(c => c.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-4 text-sm font-bold border-b-2 transition-colors flex items-center space-x-2 ${
                  activeTab === tab ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text-main"
                }`}
              >
                <span>{tab}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Table Content */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
            <p className="text-sm font-bold text-text-muted">Syncing Tickets...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-text-muted text-sm font-medium">
            No {activeTab.toLowerCase()} tickets found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background border-b border-gray-200 text-xs uppercase tracking-wider text-text-muted">
                  <th className="px-6 py-4 font-bold">Ticket Details</th>
                  <th className="px-6 py-4 font-bold">Reported By</th>
                  <th className="px-6 py-4 font-bold text-center">Priority</th>
                  <th className="px-6 py-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredComplaints.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-text-main">{ticket.category}</p>
                      <p className="text-xs text-text-muted mt-1 truncate max-w-xs">{ticket.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-text-main">{ticket.profiles?.full_name || "Unknown Resident"}</p>
                      <p className="text-xs text-text-muted">{ticket.profiles?.matric_number || "No Matric Number"}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center space-x-1 text-xs font-bold ${
                        ticket.priority === 'High' ? 'text-danger' : 
                        ticket.priority === 'Medium' ? 'text-warning' : 'text-success'
                      }`}>
                        {ticket.priority === 'High' && <AlertTriangle className="h-3 w-3" />}
                        <span>{ticket.priority}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {ticket.status === "Pending" ? (
                        <button 
                          onClick={() => handleResolve(ticket.id)} 
                          className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-md text-xs font-bold transition-colors flex items-center justify-end ml-auto shadow-sm"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" /> Resolve
                        </button>
                      ) : (
                        <span className="text-xs text-text-muted font-medium bg-gray-50 px-2 py-1 rounded-md border border-gray-100">Closed</span>
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