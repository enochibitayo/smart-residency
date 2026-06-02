"use client";

import { useState } from "react";
import { Check, X, Search, Filter, MapPin } from "lucide-react";

type RequestStatus = "Pending" | "Approved" | "Rejected";

export default function ExeatApprovalPage() {
  const [activeTab, setActiveTab] = useState<RequestStatus>("Pending");
  
  // Interactive mock data for the presentation
  const [requests, setRequests] = useState([
    { id: 2050, name: "Oyebode Precious", matric: "CSC/2022/004", reason: "Tech Conference", destination: "Lagos", departure: "10 Jun 2026", return: "14 Jun 2026", status: "Pending" as RequestStatus },
    { id: 2051, name: "Tobi Bankole", matric: "CSC/21/0104", reason: "Medical Visit", destination: "Ibadan", departure: "12 Jun 2026", return: "15 Jun 2026", status: "Pending" as RequestStatus },
    { id: 2052, name: "Mary Johnson", matric: "BCH/22/0451", reason: "Family Event", destination: "Abuja", departure: "08 Jun 2026", return: "10 Jun 2026", status: "Approved" as RequestStatus },
    { id: 2053, name: "David Yakubu", matric: "MTH/23/0088", reason: "Personal", destination: "Osogbo", departure: "05 Jun 2026", return: "06 Jun 2026", status: "Rejected" as RequestStatus },
  ]);

  const filteredRequests = requests.filter(req => req.status === activeTab);

  const handleAction = (id: number, newStatus: RequestStatus) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main uppercase tracking-tight">Exeat Requests</h1>
          <p className="text-sm text-text-muted mt-1">Review and manage student leave applications.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search ID or Name..." 
              className="pl-9 pr-4 py-2 bg-surface border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary w-64"
            />
          </div>
          <button className="px-4 py-2 bg-surface border border-gray-200 text-text-main rounded-lg text-sm font-semibold hover:border-primary transition-colors flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Main Card container */}
      <div className="bg-surface rounded-xl shadow-sm border border-gray-200 flex flex-col flex-1 overflow-hidden">
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6 pt-4 space-x-8">
          {(["Pending", "Approved", "Rejected"] as RequestStatus[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold transition-all relative ${
                activeTab === tab ? "text-primary" : "text-text-muted hover:text-text-main"
              }`}
            >
              {tab}
              <span className="ml-2 px-2 py-0.5 rounded-full bg-background text-xs border border-gray-100">
                {requests.filter(r => r.status === tab).length}
              </span>
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-background border-b border-gray-200 text-xs uppercase tracking-wider text-text-muted">
                <th className="px-6 py-4 font-bold">Student</th>
                <th className="px-6 py-4 font-bold">Reason & Destination</th>
                <th className="px-6 py-4 font-bold">Departure</th>
                <th className="px-6 py-4 font-bold">Return</th>
                <th className="px-6 py-4 font-bold">Status</th>
                {activeTab === "Pending" && <th className="px-6 py-4 font-bold text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                          {req.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-main">{req.name}</p>
                          <p className="text-xs text-text-muted">{req.matric}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-text-main">{req.reason}</p>
                      <p className="text-xs text-text-muted flex items-center mt-0.5">
                        <MapPin className="h-3 w-3 mr-1" /> {req.destination}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-text-main">{req.departure}</td>
                    <td className="px-6 py-4 text-sm font-medium text-text-main">{req.return}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        req.status === "Approved" ? "bg-success/10 text-success" :
                        req.status === "Rejected" ? "bg-danger/10 text-danger" :
                        "bg-warning/10 text-warning"
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    
                    {/* Action Buttons (Only show on Pending tab) */}
                    {activeTab === "Pending" && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => handleAction(req.id, "Approved")}
                            className="p-1.5 border border-success text-success rounded hover:bg-success hover:text-white transition-colors"
                            title="Approve"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleAction(req.id, "Rejected")}
                            className="p-1.5 border border-danger text-danger rounded hover:bg-danger hover:text-white transition-colors"
                            title="Reject"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                    <p className="text-sm">No {activeTab.toLowerCase()} requests found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}