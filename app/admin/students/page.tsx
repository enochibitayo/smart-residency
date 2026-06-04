"use client";

import { useEffect, useState } from "react";
import { Users, Search, Loader2, BookOpen, MoreVertical } from "lucide-react";
import { supabase } from "../../../lib/supabase"; 

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Fetch all students from the profiles table
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("role", "student")
          .order("full_name", { ascending: true });

        if (error) throw error;
        if (data) setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Filter students based on the search bar
  const filteredStudents = students.filter(student => 
    student.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.matric_number?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col pb-10">
      
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main uppercase tracking-tight">Student Directory</h1>
          <p className="text-sm text-text-muted mt-1">Manage and view all registered residents.</p>
        </div>
        
        <div className="relative group w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name or matric..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text-main"
          />
        </div>
      </div>

      {/* Dynamic Data Table */}
      <div className="bg-surface rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
            <p className="text-sm font-bold text-text-muted">Loading Student Records...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-text-muted">
            <Users className="h-12 w-12 mb-2 opacity-20" />
            <p className="text-sm font-medium">No students found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background border-b border-gray-200 text-xs uppercase tracking-wider text-text-muted">
                  <th className="px-6 py-4 font-bold">Resident Name</th>
                  <th className="px-6 py-4 font-bold">Matric Number</th>
                  <th className="px-6 py-4 font-bold">System Role</th>
                  <th className="px-6 py-4 font-bold">Registration Date</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {student.full_name ? student.full_name.charAt(0).toUpperCase() : "S"}
                        </div>
                        <span className="text-sm font-bold text-text-main">{student.full_name || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm font-medium text-text-main">
                        <BookOpen className="h-4 w-4 mr-2 text-text-muted" />
                        {student.matric_number || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-success/10 text-success uppercase tracking-wider">
                        {student.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted font-medium">
                      {new Date(student.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-text-muted hover:text-primary transition-colors p-1 rounded">
                        <MoreVertical className="h-5 w-5" />
                      </button>
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