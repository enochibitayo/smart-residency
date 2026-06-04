"use client";

import { useState } from "react";
import { MapPin, Calendar, FileText, Send, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "../../../lib/supabase";

export default function StudentExeatPage() {
  const [destination, setDestination] = useState("");
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState(""); // New state for typed reason
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    
    try {
      // 1. Determine the final reason to save to the database
      const finalReason = reason === "Other" ? customReason : reason;
      
      // Safety check to ensure they actually typed something if they selected "Other"
      if (reason === "Other" && customReason.trim() === "") {
        throw new Error("Please type in your specific reason.");
      }

      // 2. Get the currently logged-in student
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error("You must be logged in to submit a request.");
      }

      // 3. Insert the request into the Supabase database
      const { error: insertError } = await supabase
        .from("exeats")
        .insert([
          {
            student_id: user.id,
            destination,
            reason: finalReason, // Saves either the dropdown value or the typed value
            departure_date: departureDate,
            return_date: returnDate,
            status: "Pending"
          }
        ]);

      if (insertError) throw insertError;

      // 4. Trigger success UI & reset form
      setIsSuccess(true);
      setDestination("");
      setReason("");
      setCustomReason("");
      setDepartureDate("");
      setReturnDate("");

      setTimeout(() => setIsSuccess(false), 4000);

    } catch (error: any) {
      setErrorMessage(error.message || "Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background min-h-screen pb-20">
      
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-6 rounded-b-3xl shadow-md">
        <h1 className="text-2xl font-bold">Request Exeat</h1>
        <p className="text-sm opacity-80 mt-1">Submit a pass for DSA approval</p>
      </header>

      <div className="p-6">
        
        {/* Success Alert */}
        {isSuccess && (
          <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-xl flex items-start space-x-3 text-success animate-in fade-in slide-in-from-top-4">
            <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold">Request Submitted Successfully!</p>
              <p className="text-xs mt-1 opacity-90">Your request has been routed to the DSA office.</p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-start space-x-3 text-danger">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <p className="text-sm font-bold">{errorMessage}</p>
          </div>
        )}

        {/* The Live Form */}
        <form onSubmit={handleSubmit} className="space-y-5 bg-surface p-6 rounded-2xl shadow-sm border border-gray-100">
          
          <div>
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Destination</label>
            <div className="relative group">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Lagos, Nigeria" 
                className="w-full pl-10 pr-4 py-3 bg-background border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text-main"
                required
              />
            </div>
          </div>

          {/* Conditional Reason Section */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Reason for Leave</label>
              <div className="relative group">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors" />
                <select 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text-main text-sm appearance-none"
                  required
                >
                  <option value="" disabled>Select a reason...</option>
                  <option value="Medical Visit">Medical Visit</option>
                  <option value="Family Event">Family Event</option>
                  <option value="Official School Assignment">Official School Assignment</option>
                  <option value="Other">Other (Please specify)</option>
                </select>
              </div>
            </div>

            {/* Smoothly reveal text area if "Other" is selected */}
            {reason === "Other" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <textarea 
                  rows={2} 
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Please type your specific reason..." 
                  className="w-full p-4 bg-background border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text-main resize-none"
                  required
                ></textarea>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Departure</label>
              <div className="relative group">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-text-muted group-focus-within:text-primary transition-colors" />
                <input 
                  type="date" 
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full pl-9 pr-2 py-3 bg-background border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary transition-all text-text-main"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Return</label>
              <div className="relative group">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-text-muted group-focus-within:text-primary transition-colors" />
                <input 
                  type="date" 
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full pl-9 pr-2 py-3 bg-background border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary transition-all text-text-main"
                  required
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition-all flex items-center justify-center shadow-md disabled:opacity-70 mt-4"
          >
            {isSubmitting ? (
              <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Submitting...</>
            ) : (
              <><Send className="h-5 w-5 mr-2" /> Submit Request</>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}