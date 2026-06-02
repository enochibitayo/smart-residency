"use client";

import { useState } from "react";
import { AlertTriangle, Wrench, HeartPulse, Filter, Search, CheckCircle, Send } from "lucide-react";

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([
    { 
      id: "C-1042", 
      student: "Tobi Bankole", 
      room: "Block B - 204", 
      category: "Health Issue", 
      priority: "High", 
      description: "Severe asthma attack, needs immediate nebulizer.",
      escalation: "Routed to Health Center", 
      time: "2 mins ago",
      assigned: true // Auto-routed
    },
    { 
      id: "C-1041", 
      student: "Oyebode Precious", 
      room: "Block A - 101", 
      category: "Plumbing", 
      priority: "High", 
      description: "Main pipe burst, water flooding the entire room.",
      escalation: "Direct to Technician", 
      time: "15 mins ago",
      assigned: true // Auto-routed
    },
    { 
      id: "C-1040", 
      student: "Mary Johnson", 
      room: "Block C - 305", 
      category: "Electrical", 
      priority: "Medium", 
      description: "Ceiling fan is making a loud grinding noise.",
      escalation: "Pending DSA Review", 
      time: "2 hours ago",
      assigned: false // Needs manual assignment
    },
    { 
      id: "C-1039", 
      student: "David Yakubu", 
      room: "Block B - 112", 
      category: "Carpentry", 
      priority: "Low", 
      description: "Wardrobe door hinge is loose.",
      escalation: "Porter Assigned", 
      time: "1 day ago",
      assigned: false // Needs manual assignment
    }
  ]);

  const handleAssign = (id: string) => {
    setComplaints(complaints.map(ticket => 
      ticket.id === id ? { ...ticket, assigned: true, escalation: "Technician Dispatched" } : ticket
    ));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main uppercase tracking-tight">Issue Tracker & Routing</h1>
          <p className="text-sm text-text-muted mt-1">Smart escalation matrix for maintenance and health.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search ticket ID or room..." 
              className="pl-9 pr-4 py-2 bg-surface border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary w-64"
            />
          </div>
          <button className="px-4 py-2 bg-surface border border-gray-200 text-text-main rounded-lg text-sm font-semibold hover:border-primary transition-colors flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-surface rounded-xl shadow-sm border border-gray-200 flex flex-col flex-1 overflow-hidden">
        <div className="overflow-x-auto flex-1 p-2">
          
          <div className="grid gap-4 p-4">
            {complaints.map((ticket) => (
              <div key={ticket.id} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow bg-background/50 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 pl-8">
                
                {/* Visual Priority Indicator Line on the left */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  ticket.priority === "High" && ticket.category === "Health Issue" ? "bg-danger" :
                  ticket.priority === "High" ? "bg-warning" :
                  ticket.priority === "Medium" ? "bg-primary" : "bg-gray-300"
                }`} />

                {/* Left Section: Ticket Info */}
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl flex shrink-0 ${
                    ticket.category === "Health Issue" ? "bg-danger/10 text-danger" :
                    "bg-primary/10 text-primary"
                  }`}>
                    {ticket.category === "Health Issue" ? <HeartPulse className="h-6 w-6" /> : <Wrench className="h-6 w-6" />}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-surface border border-gray-200 text-text-muted">
                        {ticket.id}
                      </span>
                      <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${
                        ticket.priority === "High" ? "bg-danger/10 text-danger" :
                        ticket.priority === "Medium" ? "bg-warning/10 text-warning" :
                        "bg-gray-100 text-text-muted"
                      }`}>
                        {ticket.priority} Priority
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-text-main mt-1.5">{ticket.description}</h3>
                    <p className="text-sm text-text-muted mt-1">
                      Reported by <span className="font-semibold text-text-main">{ticket.student}</span> in <span className="font-semibold text-text-main">{ticket.room}</span> • {ticket.time}
                    </p>
                  </div>
                </div>

                {/* Right Section: Smart Escalation Status & Actions */}
                <div className="flex flex-col md:items-end space-y-3 min-w-[200px]">
                  
                  <div className="bg-surface border border-gray-100 px-4 py-2 rounded-lg text-right w-full">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-text-muted mb-0.5">Escalation Status</p>
                    <div className="flex items-center md:justify-end space-x-2">
                      {ticket.assigned ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-warning animate-pulse" />
                      )}
                      <span className={`text-sm font-extrabold ${
                        ticket.assigned && ticket.escalation.includes("Health") ? "text-danger" :
                        ticket.assigned ? "text-success" :
                        "text-warning"
                      }`}>
                        {ticket.escalation}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {!ticket.assigned ? (
                    <button 
                      onClick={() => handleAssign(ticket.id)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      <Send className="h-4 w-4" />
                      <span>Assign Technician</span>
                    </button>
                  ) : (
                    <button className="text-sm font-bold text-text-muted hover:text-primary transition-colors">
                      View Audit Trail &rarr;
                    </button>
                  )}

                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}