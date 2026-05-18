import React, { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearHrToken, getHrToken } from "@/lib/authStorage";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Archive,
  Inbox,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/hr/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/hr/jobs", label: "All jobs", icon: Briefcase },
  { to: "/hr/jobs/new", label: "Create job", icon: PlusCircle },
  { to: "/hr/jobs?status=archived", label: "Archived", icon: Archive },
  { to: "/hr/applications", label: "Applications", icon: Inbox },
];

const HrLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!getHrToken()) {
      navigate("/hr/login", { replace: true });
    }
  }, [navigate]);

  const logout = () => {
    clearHrToken();
    navigate("/hr/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-[#f0f4f8]">
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-56 flex-col border-r border-gray-200 bg-[#082952] text-white shadow-lg">
        <div className="border-b border-white/10 px-4 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60">SINU</p>
          <p className="text-lg font-bold leading-tight">HR Admin</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/hr/dashboard"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10"
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start gap-3 text-white/90 hover:bg-white/10 hover:text-white"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>
      <div className="relative z-0 flex flex-1 flex-col pl-56">
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HrLayout;
