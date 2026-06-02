"use client";

import { Shield, Plus } from "lucide-react";
import { useState } from "react";

export default function UsersPage() {
  const [staff] = useState([
    { id: 1, name: "Dr. Adebayo", role: "DSA", access: "Full Master Access" },
    { id: 2, name: "Mrs. Olatunji", role: "Supervisor (Female)", access: "Allocation Engine" },
    { id: 3, name: "Mr. Ibrahim", role: "Supervisor (Male)", access: "Allocation Engine" },
    { id: 4, name: "Mr. Sunday", role: "Porter (Block B)", access: "Ground Operations" },
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main uppercase tracking-tight">Staff & Roles</h1>
          <p className="text-sm text-text-muted mt-1">Manage system access for university personnel.</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors flex items-center">
          <Plus className="h-4 w-4 mr-2" /> Add Staff Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((user) => (
          <div key={user.id} className="bg-surface border border-text-muted/20 p-6 rounded-xl shadow-sm hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-primary/10 text-primary rounded-lg">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-text-main">{user.name}</h3>
                  <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mt-0.5">{user.role}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-text-muted/10">
              <p className="text-xs text-text-muted">Access Level: <span className="font-bold text-primary">{user.access}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}