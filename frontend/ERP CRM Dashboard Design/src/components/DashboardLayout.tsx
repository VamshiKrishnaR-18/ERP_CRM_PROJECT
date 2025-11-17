import { ReactNode, useState } from "react";
import { Button } from "./ui/button";
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Settings,
  Menu,
  X,
  Bell,
  Search
} from "lucide-react";
import { Input } from "./ui/input";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: Users, label: "Customers", active: false },
    { icon: ShoppingCart, label: "Sales", active: false },
    { icon: Package, label: "Inventory", active: false },
    { icon: BarChart3, label: "Reports", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

  return (
    <div className="flex h-screen bg-zinc-950">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 bg-zinc-900 border-r border-zinc-800 overflow-hidden`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-zinc-50">ERP Suite</h2>
              <p className="text-zinc-500 text-sm">Enterprise</p>
            </div>
          </div>
        </div>

        <nav className="px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                item.active
                  ? "bg-zinc-800 text-zinc-50"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-50"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm flex items-center justify-between px-6">
          <div className="flex items-center gap-4 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-zinc-400 hover:text-zinc-50"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                placeholder="Search customers, orders, products..."
                className="pl-10 bg-zinc-800 border-zinc-700 text-zinc-50 placeholder:text-zinc-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="relative text-zinc-400 hover:text-zinc-50">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-violet-600 rounded-full"></span>
            </Button>
            
            <div className="flex items-center gap-3 pl-3 border-l border-zinc-800">
              <div className="text-right">
                <p className="text-sm text-zinc-50">John Anderson</p>
                <p className="text-xs text-zinc-500">Admin</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <span className="text-sm">JA</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
