import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Building2,
  LayoutDashboard,
  Users,
  Receipt,
  Package,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Bell,
  Search,
  Menu,
  LogOut,
  User,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MenuItem {
  title: string;
  icon: React.ElementType;
  path?: string;
  children?: { title: string; path: string }[];
}

const menuItems: MenuItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/multi-branch" },
  {
    title: "Branch Management",
    icon: Building2,
    children: [
      { title: "All Branches", path: "/multi-branch/branches" },
      { title: "Add Branch", path: "/multi-branch/branches/add" },
      { title: "Branch Admins", path: "/multi-branch/branches/admins" },
    ],
  },
  {
    title: "Employees",
    icon: Users,
    children: [
      { title: "All Employees", path: "/multi-branch/employees" },
      { title: "Roles & Access", path: "/multi-branch/employees/roles" },
    ],
  },
  {
    title: "Billing",
    icon: Receipt,
    children: [
      { title: "All Invoices", path: "/multi-branch/billing" },
      { title: "Create Invoice", path: "/multi-branch/billing/create" },
      { title: "Consolidated", path: "/multi-branch/billing/consolidated" },
    ],
  },
  {
    title: "Inventory",
    icon: Package,
    children: [
      { title: "Stock Overview", path: "/multi-branch/inventory" },
      { title: "Low Stock Alerts", path: "/multi-branch/inventory/alerts" },
    ],
  },
  { title: "Reports", icon: BarChart3, path: "/multi-branch/reports" },
  { title: "Settings", icon: Settings, path: "/multi-branch/settings" },
];

const branches = [
  { id: "hq", name: "Head Office", location: "Mumbai" },
  { id: "br1", name: "Branch 1", location: "Delhi" },
  { id: "br2", name: "Branch 2", location: "Bangalore" },
  { id: "br3", name: "Branch 3", location: "Chennai" },
];

export default function MultiBranchLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["Branch Management"]);
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const location = useLocation();

  const toggleMenu = (title: string) => {
    setExpandedMenus((prev) =>
      prev.includes(title) ? prev.filter((m) => m !== title) : [...prev, title]
    );
  };

  const isActive = (path: string) => location.pathname === path;
  const isParentActive = (children?: { path: string }[]) =>
    children?.some((c) => location.pathname.startsWith(c.path));

  return (
    <div className="min-h-screen bg-[hsl(225,30%,96%)] flex w-full">
      {/* Sidebar with Blue Gradient */}
      <aside
        className={cn(
          "flex flex-col transition-all duration-300 fixed h-full z-40",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
        style={{
          background: 'linear-gradient(180deg, hsl(225, 70%, 50%) 0%, hsl(235, 75%, 55%) 50%, hsl(250, 80%, 58%) 100%)'
        }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-white/10">
          <Building2 className="h-8 w-8 text-white flex-shrink-0" />
          {!sidebarCollapsed && (
            <div className="ml-3">
              <span className="font-bold text-lg text-white">BranchPro</span>
              <p className="text-xs text-white/70">by Software Vala</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.title}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.title)}
                    className={cn(
                      "w-full flex items-center px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors",
                      isParentActive(item.children) && "bg-white/10 text-white"
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <>
                        <span className="ml-3 flex-1 text-left text-sm">
                          {item.title}
                        </span>
                        {expandedMenus.includes(item.title) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </>
                    )}
                  </button>
                  {!sidebarCollapsed && expandedMenus.includes(item.title) && (
                    <div className="bg-white/5">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={cn(
                            "block pl-12 pr-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors",
                            isActive(child.path) &&
                              "text-white bg-white/20 border-r-2 border-white"
                          )}
                        >
                          {child.title}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to={item.path!}
                  className={cn(
                    "flex items-center px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors",
                    isActive(item.path!) &&
                      "bg-white text-[hsl(225,85%,50%)] shadow-lg rounded-r-xl mr-2"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="ml-3 text-sm">{item.title}</span>
                  )}
                </NavLink>
              )}
            </div>
          ))}
        </nav>

        {/* User Section */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-white text-[hsl(225,85%,50%)]">SA</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Super Admin</p>
                <p className="text-xs text-white/70 truncate">admin@company.com</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-64"
        )}
      >
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-[hsl(225,20%,90%)] flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-[hsl(225,30%,40%)]"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Branch Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 min-w-[200px] justify-between bg-white border-[hsl(225,20%,88%)]">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-[hsl(225,85%,55%)]" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-[hsl(225,30%,20%)]">{selectedBranch.name}</p>
                      <p className="text-xs text-[hsl(225,15%,50%)]">{selectedBranch.location}</p>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-[hsl(225,15%,50%)]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px] bg-white z-50" align="start">
                <DropdownMenuLabel>Select Branch</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {branches.map((branch) => (
                  <DropdownMenuItem
                    key={branch.id}
                    onClick={() => setSelectedBranch(branch)}
                    className={cn(
                      "cursor-pointer",
                      selectedBranch.id === branch.id && "bg-[hsl(225,85%,95%)]"
                    )}
                  >
                    <div>
                      <p className="font-medium">{branch.name}</p>
                      <p className="text-xs text-[hsl(225,15%,50%)]">{branch.location}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(225,15%,50%)]" />
              <Input
                placeholder="Search..."
                className="pl-9 w-64 bg-[hsl(225,30%,97%)] border-[hsl(225,20%,90%)] focus:border-[hsl(225,85%,55%)]"
              />
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-[hsl(225,30%,40%)]" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-[hsl(0,80%,55%)] rounded-full text-[10px] text-white flex items-center justify-center">
                3
              </span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[hsl(225,85%,55%)] text-white text-sm">SA</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-[hsl(225,15%,50%)]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white z-50" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <User className="h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <Settings className="h-4 w-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 cursor-pointer text-red-600">
                  <LogOut className="h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
