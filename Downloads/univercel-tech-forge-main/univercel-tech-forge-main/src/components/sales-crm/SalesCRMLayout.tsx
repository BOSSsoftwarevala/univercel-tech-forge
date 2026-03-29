import { useState } from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Handshake, 
  CheckSquare, 
  BarChart3, 
  Settings,
  Search,
  Bell,
  ChevronDown,
  Menu,
  X,
  Zap,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useCRMAuth } from "@/hooks/useCRMAuth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SalesCRMLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "leads", label: "Leads", icon: Users, badge: 12 },
  { id: "customers", label: "Customers", icon: UserCheck },
  { id: "deals", label: "Deals", icon: Handshake, badge: 5 },
  { id: "tasks", label: "Tasks", icon: CheckSquare, badge: 8 },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

const SalesCRMLayout = ({ children, activeSection, onSectionChange }: SalesCRMLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, signOut } = useCRMAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/sales-crm/auth');
  };

  const userInitials = user?.email?.slice(0, 2).toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-[hsl(225,30%,96%)]">
      {/* Sidebar with Blue Gradient */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        className="fixed left-0 top-0 h-screen w-64 flex flex-col z-50"
        style={{
          background: 'linear-gradient(180deg, hsl(225, 70%, 50%) 0%, hsl(235, 75%, 55%) 50%, hsl(250, 80%, 58%) 100%)'
        }}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Handshake className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Sales CRM</h1>
              <p className="text-xs text-white/70">by Software Vala</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-white text-[hsl(225,85%,50%)] shadow-lg"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <Badge className={`ml-auto ${
                    isActive 
                      ? "bg-[hsl(225,85%,55%)] text-white" 
                      : "bg-white/20 text-white"
                  }`}>
                    {item.badge}
                  </Badge>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-yellow-300" />
              <div>
                <p className="text-sm font-medium text-white">Need Help?</p>
                <p className="text-xs text-white/70">Contact support</p>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-40 h-16 bg-white border-b border-[hsl(225,20%,90%)] flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-[hsl(225,30%,40%)]"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(225,15%,50%)]" />
              <Input 
                placeholder="Search leads, customers, deals..." 
                className="pl-10 bg-[hsl(225,30%,97%)] border-[hsl(225,20%,90%)] focus:bg-white focus:border-[hsl(225,85%,55%)]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative text-[hsl(225,30%,40%)]">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[hsl(0,80%,55%)] text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 pl-4 border-l border-[hsl(225,20%,90%)] cursor-pointer hover:opacity-80">
                  <Avatar className="w-9 h-9">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-[hsl(225,85%,55%)] text-white">{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-[hsl(225,30%,20%)]">{user?.email?.split('@')[0] || 'User'}</p>
                    <p className="text-xs text-[hsl(225,15%,50%)]">Sales Manager</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-[hsl(225,15%,50%)]" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SalesCRMLayout;
