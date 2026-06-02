"use client";

import { useState } from "react";
import { Wrench, Camera, AlertTriangle, CheckCircle, MapPin, ImageIcon } from "lucide-react";

export default function ComplaintsPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // In Phase 4, this pushes the complaint to the Supabase 'complaints' table
  };

  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-6 rounded-b-3xl shadow-md">
        <h1 className="text-2xl font-bold">Lodge Complaint</h1>
        <p className="text-sm opacity-80 mt-1">Report maintenance issues</p>
      </header>

      <div className="p-6">
        {isSubmitted ? (
          // Success / Pending State
          <div className="bg-surface p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center mt-4 transition-all">
            <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-text-main">Complaint Submitted!</h2>
            <p className="text-sm text-text-muted mt-2 mb-6">
              Your issue has been logged and sent to the maintenance team.
            </p>
            <div className="w-full bg-background rounded-lg p-4 border border-gray-100 text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-text-muted uppercase tracking-wider">Ticket ID</span>
                <span className="font-bold text-text-main">#1040</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-text-muted uppercase tracking-wider">Status</span>
                <span className="font-bold text-warning">Pending</span>
              </div>
            </div>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="mt-6 text-primary text-sm font-bold hover:underline"
            >
              Lodge Another Complaint
            </button>
          </div>
        ) : (
          // The Complaint Form
          <form onSubmit={handleSubmit} className="space-y-5 mt-2">
            <div className="bg-surface p-6 rounded-2xl shadow-sm border border-gray-50 space-y-5">
              
              {/* Issue Category */}
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Issue Category</label>
                <div className="relative">
                  <Wrench className="absolute left-3 top-3 h-5 w-5 text-text-muted" />
                  <select
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm text-text-main appearance-none"
                  >
                    <option value="" disabled selected>Select category...</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="furniture">Carpentry / Furniture</option>
                    <option value="cleaning">Cleaning / Hygiene</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the issue in detail..."
                  className="w-full p-3 bg-background border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm text-text-main resize-none"
                ></textarea>
              </div>

              {/* Upload Evidence (Mockup for Hackathon) */}
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Upload Evidence</label>
                <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer">
                  <Camera className="h-8 w-8 text-text-muted mb-2" />
                  <span className="text-sm font-medium text-text-main">Tap to add photo</span>
                  <span className="text-xs text-text-muted mt-1">JPG, PNG (Max 5MB)</span>
                </div>
              </div>

              {/* Location (Read-only for MVP to show integration) */}
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-text-muted opacity-50" />
                  <input
                    type="text"
                    readOnly
                    value="Block B, Room 204"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-text-muted cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Priority Level */}
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Priority Level</label>
                <div className="relative">
                  <AlertTriangle className="absolute left-3 top-3 h-5 w-5 text-danger" />
                  <select
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-danger/30 rounded-lg focus:outline-none focus:border-danger focus:ring-1 focus:ring-danger text-sm text-text-main appearance-none"
                  >
                    <option value="high" className="text-danger">High (Emergency)</option>
                    <option value="medium" selected>Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-md flex items-center justify-center space-x-2"
            >
              <CheckCircle className="h-5 w-5" />
              <span>SUBMIT COMPLAINT</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}