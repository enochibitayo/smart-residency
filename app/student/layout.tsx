"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, DoorClosed, MapPin, FileWarning, User } from "lucide-react";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // These map directly to the bottom navigation icons in your UI design
  const navItems = [
    { name: "Home", href: "/student", icon: Home },
    { name: "Room", href: "/student/room", icon: DoorClosed },
    { name: "Track", href: "/student/exeat", icon: MapPin }, // Using exeat route for tracking demo
    { name: "Complaint", href: "/student/complaints", icon: FileWarning },
    { name: "Profile", href: "/student/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0 md:flex">
      
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md mx-auto bg-surface min-h-screen shadow-sm relative overflow-y-auto">
        {children}
      </main>

      {/* Mobile Bottom Navigation (Pinned to bottom) */}
      <nav className="fixed bottom-0 w-full max-w-md left-1/2 -translate-x-1/2 bg-surface border-t border-gray-100 flex justify-around items-center h-16 px-2 z-50 rounded-t-xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
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
  );
}