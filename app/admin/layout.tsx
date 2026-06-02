"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  DoorClosed, 
  Users, 
  FileWarning, 
  MapPin, 
  BarChart, 
  Settings, 
  LogOut,
  Bell,
  Search,
  ShieldCheck
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const desktopNavItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Room Allocation", href: "/admin/allocations", icon: DoorClosed },
    { name: "Students", href: "/admin/students", icon: Users },
    { name: "Complaints", href: "/admin/complaints", icon: FileWarning },
    { name: "Exeat Requests", href: "/admin/exeats", icon: MapPin },
    { name: "Reports", href: "/admin/reports", icon: BarChart },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  // Mobile nav shows only the most critical actions to fit the screen
  const mobileNavItems = [
    { name: "Home", href: "/admin", icon: LayoutDashboard },
    { name: "Rooms", href: "/admin/allocations", icon: DoorClosed },
    { name: "Exeats", href: "/admin/exeats", icon: MapPin },
    { name: "Issues", href: "/admin/complaints", icon: FileWarning },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      
      {/* DESKTOP SIDEBAR (Hidden on mobile) */}
      <aside className="hidden md:flex flex-col w-64 bg-primary text-primary-foreground shadow-xl z-50">
        <div className="p-6 flex items-center space-x-3 mb-2">
          <div className="bg-surface text-primary p-2 rounded-lg flex items-center justify-center shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm leading-none tracking-wide">SMART RESIDENCY</span>
            <span className="font-medium text-[10px] text-primary-foreground/70 tracking-widest mt-1">ADMIN WEB</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto scrollbar-hide">
          {desktopNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (pathname === '/admin' && item.href === '/admin');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                  isActive ? "bg-success text-white shadow-md shadow-success/20" : "text-primary-foreground/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-primary-foreground/60"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-primary-foreground/10">
          <Link href="/login" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-primary-foreground/70 hover:bg-danger/90 hover:text-white transition-colors text-sm font-medium">
            <LogOut className="h-5 w-5 text-primary-foreground/60 group-hover:text-white" />
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-background relative">
        
        {/* Top Header */}
        <header className="bg-surface border-b border-gray-100 h-16 flex items-center justify-between px-4 sm:px-8 z-10 shrink-0">
          
          {/* Mobile Brand (Shows only on mobile) */}
          <div className="md:hidden flex items-center space-x-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span className="font-bold text-primary text-sm">ADMIN</span>
          </div>
            
          {/* Desktop Search Bar */}
          <div className="hidden md:flex items-center relative group">
            <Search className="absolute left-3 h-4 w-4 text-text-muted group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search IDs, rooms, or students..." 
              className="pl-10 pr-4 py-2 bg-background/50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 w-72 transition-all"
            />
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-3 sm:space-x-5 ml-auto">
            <button className="relative p-2 text-text-muted hover:text-primary transition-colors rounded-full hover:bg-primary/5">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-danger rounded-full border border-surface"></span>
            </button>
            <div className="flex items-center space-x-3 pl-3 sm:pl-5 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="font-bold text-text-main text-sm leading-none">DSA Office</p>
              </div>
              <div className="h-9 w-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm border border-primary/20 shadow-sm">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>

        {/* MOBILE BOTTOM NAVIGATION (Hidden on desktop) */}
        <nav className="md:hidden fixed bottom-0 w-full left-0 bg-surface border-t border-gray-100 flex justify-around items-center h-16 px-2 z-50 rounded-t-xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (pathname === '/admin' && item.href === '/admin');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                  isActive ? "text-primary" : "text-text-muted hover:text-primary/70"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "fill-primary/10" : ""}`} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

      </div>
    </div>
  );
}