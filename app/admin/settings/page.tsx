"use client";

import { Save, Sliders, ShieldCheck, CheckCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  // 1. Define the state for all our settings
  const [capacity, setCapacity] = useState(4);
  const [sortPriority, setSortPriority] = useState("Academic Level");
  const [requireSync, setRequireSync] = useState(true);
  const [autoReject, setAutoReject] = useState(true);

  // 2. Button animation states
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 3. Load saved settings when the page opens
  useEffect(() => {
    const savedSettings = localStorage.getItem("smartResidencySettings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setCapacity(parsed.capacity);
      setSortPriority(parsed.sortPriority);
      setRequireSync(parsed.requireSync);
      setAutoReject(parsed.autoReject);
    }
    setIsLoaded(true);
  }, []);

  // 4. The function that actually SAVES the data 100%
  const handleSave = () => {
    setIsSaving(true);
    
    // Create the settings object
    const settingsToSave = {
      capacity,
      sortPriority,
      requireSync,
      autoReject
    };

    // Save to browser's permanent local storage
    localStorage.setItem("smartResidencySettings", JSON.stringify(settingsToSave));

    // Simulate a slight network delay for premium SaaS feel
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      
      // Reset the button back to normal after 3 seconds
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    }, 800);
  };

  // Prevent flickering before settings load
  if (!isLoaded) return <div className="h-full flex items-center justify-center p-12 text-text-muted">Loading configurations...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-text-main uppercase tracking-tight">System Settings</h1>
        <p className="text-sm text-text-muted mt-1">Configure global parameters and hostel rules.</p>
      </div>

      <div className="bg-surface border border-text-muted/20 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Section 1 */}
        <div className="p-6 border-b border-text-muted/10">
          <div className="flex items-center space-x-2 mb-4">
            <Sliders className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-text-main">Allocation Engine Rules</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Default Room Capacity</label>
              <input 
                type="number" 
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full px-4 py-2 bg-background border border-text-muted/20 rounded-lg text-sm focus:outline-none focus:border-primary text-text-main" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Automatic Sorting Priority</label>
              <select 
                value={sortPriority}
                onChange={(e) => setSortPriority(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-text-muted/20 rounded-lg text-sm focus:outline-none focus:border-primary text-text-main"
              >
                <option value="Academic Level">Academic Level (100L first)</option>
                <option value="Randomized">Randomized</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="p-6 border-b border-text-muted/10">
          <div className="flex items-center space-x-2 mb-4">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-text-main">Exeat Workflow</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={requireSync}
                onChange={(e) => setRequireSync(e.target.checked)}
                className="w-4 h-4 rounded border-text-muted/30 text-primary focus:ring-primary cursor-pointer" 
              />
              <span className="text-sm font-medium text-text-main group-hover:text-primary transition-colors">Require Portal Sync (Verified Parent Phone Numbers)</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={autoReject}
                onChange={(e) => setAutoReject(e.target.checked)}
                className="w-4 h-4 rounded border-text-muted/30 text-primary focus:ring-primary cursor-pointer" 
              />
              <span className="text-sm font-medium text-text-main group-hover:text-primary transition-colors">Auto-reject exeat requests after 6:00 PM</span>
            </label>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 bg-background flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isSaving || isSaved}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center shadow-sm transition-all duration-300 ${
              isSaved 
                ? "bg-success text-white" 
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : isSaved ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Saved Successfully
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Configuration
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}