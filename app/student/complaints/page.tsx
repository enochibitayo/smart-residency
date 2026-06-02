"use client";

import { useState } from "react";
import { Wrench, Camera, AlertTriangle, CheckCircle, MapPin, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "../../../lib/supabase"; // Ensure this path is correct

export default function ComplaintsPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form State
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // 1. Authenticate the active student
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error("You must be securely logged in to submit a ticket.");
      }

      // 2. Push to the Supabase Database
      const { error: insertError } = await supabase
        .from("complaints")
        .insert([
          {
            student_id: user.id,
            category: category,
            description: description,
            priority: priority,
            status: "Pending",
            escalation_stage: "Porter Assigned"
          }
        ]);

      if (insertError) throw insertError;

      // 3. Trigger Success UI
      setIsSubmitted(true);
      
      // Clear form for the next submission
      setCategory("");
      setDescription("");
      setPriority("medium");

    } catch (error: any) {
      setErrorMessage(error.message || "Failed to submit complaint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background min-h-screen pb-20">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-6 rounded-b-3xl shadow-md">
        <h1 className="text-2xl font-bold">Lodge Complaint</h1>
        <p className="text-sm opacity-80 mt-1">Report maintenance issues</p>
      </header>

      <div className="p-6">
        {isSubmitted ? (
          // Success / Pending State
          <div className="bg-surface p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center mt-4 transition-all animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-text-main">Complaint Submitted!</h2>
            <p className="text-sm text-text-muted mt-2 mb-6">
              Your issue has been securely logged and sent to the maintenance team.
            </p>
            <div className="w-full bg-background rounded-lg p-4 border border-gray-100 text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-text-muted uppercase tracking-wider">Status</span>
                <span className="font-bold text-warning">Pending Review</span>
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
          // The Live Complaint Form
          <form onSubmit={handleSubmit} className="space-y-5 mt-2">
            
            {errorMessage && (
              <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-start space-x-3 text-danger">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <p className="text-sm font-bold">{errorMessage}</p>
              </div>
            )}

            <div className="bg-surface p-6 rounded-2xl shadow-sm border border-gray-50 space-y-5">
              
              {/* Issue Category */}
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Issue Category</label>
                <div className="relative group">
                  <Wrench className="absolute left-3 top-3 h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors" />
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-background border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-text-main text-sm transition-all"
                    required
                  >
                    <option value="" disabled>Select category...</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Carpentry/Furniture">Carpentry / Furniture</option>
                    <option value="Health/Emergency">Health / Emergency</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Description</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue in detail..."
                  className="w-full p-4 bg-background border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm text-text-main resize-none transition-all"
                ></textarea>
              </div>

              {/* Upload Evidence (Mockup for Hackathon) */}
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Upload Evidence</label>
                <div className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
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
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-text-muted cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Priority Level */}
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Priority Level</label>
                <div className="relative group">
                  <AlertTriangle className="absolute left-3 top-3 h-5 w-5 text-danger" />
                  <select
                    required
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-background border border-danger/30 rounded-xl focus:outline-none focus:border-danger focus:ring-1 focus:ring-danger/20 text-sm text-text-main appearance-none transition-all"
                  >
                    <option value="High" className="text-danger">High (Emergency)</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-md flex items-center justify-center disabled:opacity-70"
            >
              {isSubmitting ? (
                <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Submitting Ticket...</>
              ) : (
                <><CheckCircle className="h-5 w-5 mr-2" /> SUBMIT COMPLAINT</>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}