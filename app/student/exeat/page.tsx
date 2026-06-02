"use client";

import { useState } from "react";
import { MapPin, Calendar, FileText, CheckCircle, Clock } from "lucide-react";

export default function ExeatPage() {
  // This state simulates the database submission for our UI phase
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // In Phase 4, this function will insert the data into Supabase
  };

  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-6 rounded-b-3xl shadow-md">
        <h1 className="text-2xl font-bold">Request Exeat</h1>
        <p className="text-sm opacity-80 mt-1">Digital approval workflow</p>
      </header>

      <div className="p-6">
        {isSubmitted ? (
          // Success / Pending State
          <div className="bg-surface p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center mt-4">
            <div className="w-16 h-16 bg-warning/10 text-warning rounded-full flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-text-main">Request Pending</h2>
            <p className="text-sm text-text-muted mt-2 mb-6">
              Your exeat request to <strong>Lagos</strong> is awaiting approval from the hostel porter.
            </p>
            <div className="w-full bg-background rounded-lg p-4 border border-gray-100 text-left">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Ticket ID</p>
              <p className="font-bold text-text-main">#EX-2050</p>
            </div>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="mt-6 text-primary text-sm font-bold hover:underline"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          // The Request Form
          <form onSubmit={handleSubmit} className="space-y-5 mt-2">
            <div className="bg-surface p-6 rounded-2xl shadow-sm border border-gray-50 space-y-4">
              
              {/* Destination */}
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-text-muted" />
                  <input
                    type="text"
                    required
                    placeholder="e.g., Lagos, Ikeja"
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm text-text-main"
                  />
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Reason for Leaving</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-5 w-5 text-text-muted" />
                  <select
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm text-text-main appearance-none"
                  >
                    <option value="" disabled selected>Select a reason...</option>
                    <option value="medical">Medical Visit</option>
                    <option value="family">Family Event</option>
                    <option value="official">Official School Assignment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Dates Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Departure</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
                    <input
                      type="date"
                      required
                      className="w-full pl-9 pr-2 py-2 bg-background border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm text-text-main"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Return</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
                    <input
                      type="date"
                      required
                      className="w-full pl-9 pr-2 py-2 bg-background border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm text-text-main"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-md flex items-center justify-center space-x-2"
            >
              <CheckCircle className="h-5 w-5" />
              <span>SUBMIT EXEAT REQUEST</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}