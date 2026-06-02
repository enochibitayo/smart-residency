"use client";

import { Search, Filter, MoreVertical, GraduationCap } from "lucide-react";
import { useState } from "react";

export default function StudentsPage() {
  const [students] = useState([
    { id: 1, name: "Oyebode Precious", matric: "CSC/2022/004", level: "400L", room: "Block B - 204", status: "Active" },
    { id: 2, name: "Tobi Bankole", matric: "CSC/21/0104", level: "300L", room: "Block B - 204", status: "Active" },
    { id: 3, name: "Mary Johnson", matric: "BCH/22/0451", level: "200L", room: "Block C - 305", status: "On Exeat" },
    { id: 4, name: "David Yakubu", matric: "MTH/23/0088", level: "100L", room: "Unallocated", status: "Pending" },
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main uppercase tracking-tight">Student Directory</h1>
          <p className="text-sm text-text-muted mt-1">Manage all registered residents.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
            <input type="text" placeholder="Search by name or matric..." className="pl-9 pr-4 py-2 bg-surface border border-text-muted/20 rounded-lg text-sm focus:outline-none focus:border-primary w-64" />
          </div>
          <button className="px-4 py-2 bg-surface border border-text-muted/20 text-text-main rounded-lg text-sm font-semibold hover:border-primary transition-colors flex items-center">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-xl shadow-sm border border-text-muted/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background border-b border-text-muted/10 text-xs uppercase tracking-wider text-text-muted">
                <th className="px-6 py-4 font-bold">Student Profile</th>
                <th className="px-6 py-4 font-bold">Level</th>
                <th className="px-6 py-4 font-bold">Current Room</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-text-muted/10">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-primary/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <GraduationCap className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-main">{student.name}</p>
                        <p className="text-xs text-text-muted">{student.matric}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-text-main">{student.level}</td>
                  <td className="px-6 py-4 text-sm font-medium text-text-main">{student.room}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                      student.status === "Active" ? "bg-success/10 text-success" :
                      student.status === "On Exeat" ? "bg-warning/10 text-warning" : "bg-text-muted/10 text-text-muted"
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-text-muted hover:text-primary transition-colors"><MoreVertical className="h-5 w-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}