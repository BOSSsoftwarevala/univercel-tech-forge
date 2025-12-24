import { useState } from "react";
import { Bell, Zap, Wallet, Search, Globe, Bot, User, ChevronDown, LogOut, Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface GlobalHeaderProps {
  userRole?: string;
  walletBalance?: number;
  notificationCount?: number;
  buzzerActive?: boolean;
  maskedUserId?: string;
  isDeveloper?: boolean;
  onPromiseClick?: () => void;
}

export function GlobalHeader({
  userRole = "super_admin",
  walletBalance = 125000,
  notificationCount = 5,
  buzzerActive = true,
  maskedUserId = "USR-****-7X9K",
  isDeveloper = false,
  onPromiseClick,
}: GlobalHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="h-16 bg-[hsl(var(--sv-navy-deep))] border-b border-[hsl(var(--sv-navy-light))] px-4 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(var(--sv-blue))] to-[hsl(var(--sv-blue-bright))] flex items-center justify-center">
            <span className="text-white font-bold text-lg">SV</span>
          </div>
          <div className="hidden md:block">
            <h1 className="text-white font-semibold text-lg leading-none">Software Vala</h1>
            <p className="text-[hsl(var(--sv-gray))] text-xs">Enterprise Platform</p>
          </div>
        </div>
      </div>

      {/* Global Search */}
      <div className="flex-1 max-w-xl mx-4 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--sv-gray))]" />
          <Input
            placeholder="Search leads, tasks, demos, users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[hsl(var(--sv-navy))] border-[hsl(var(--sv-navy-light))] text-white placeholder:text-[hsl(var(--sv-gray))] focus:border-[hsl(var(--sv-blue))]"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative text-[hsl(var(--sv-white-soft))] hover:bg-[hsl(var(--sv-navy))]">
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-[hsl(var(--sv-danger))] text-white text-xs">
              {notificationCount > 9 ? "9+" : notificationCount}
            </Badge>
          )}
        </Button>

        {/* Buzzer Alert */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative text-[hsl(var(--sv-white-soft))] hover:bg-[hsl(var(--sv-navy))]",
            buzzerActive && "animate-pulse"
          )}
        >
          <Zap className={cn("w-5 h-5", buzzerActive && "text-[hsl(var(--sv-danger))]")} />
          {buzzerActive && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-[hsl(var(--sv-danger))] rounded-full animate-ping" />
          )}
        </Button>

        {/* Promise Button (Developer only) */}
        {isDeveloper && (
          <Button
            onClick={onPromiseClick}
            className="bg-gradient-to-r from-[hsl(var(--sv-success))] to-emerald-600 text-white hover:opacity-90 gap-2"
          >
            <Shield className="w-4 h-4" />
            Promise
          </Button>
        )}

        {/* Wallet */}
        <Button variant="ghost" className="gap-2 text-[hsl(var(--sv-white-soft))] hover:bg-[hsl(var(--sv-navy))]">
          <Wallet className="w-5 h-5" />
          <span className="hidden md:inline font-medium">₹{walletBalance.toLocaleString()}</span>
        </Button>

        {/* AI Assistant */}
        <Button variant="ghost" size="icon" className="text-[hsl(var(--sv-blue-bright))] hover:bg-[hsl(var(--sv-navy))]">
          <Bot className="w-5 h-5" />
        </Button>

        {/* Language */}
        <Button variant="ghost" size="icon" className="text-[hsl(var(--sv-white-soft))] hover:bg-[hsl(var(--sv-navy))]">
          <Globe className="w-5 h-5" />
        </Button>

        {/* Masking Indicator */}
        <div className="hidden lg:flex items-center gap-1 px-2 py-1 rounded bg-[hsl(var(--sv-navy))] border border-[hsl(var(--sv-navy-light))]">
          <Shield className="w-3 h-3 text-[hsl(var(--sv-success))]" />
          <span className="text-xs text-[hsl(var(--sv-success))]">Masked</span>
        </div>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-[hsl(var(--sv-white-soft))] hover:bg-[hsl(var(--sv-navy))]">
              <div className="w-8 h-8 rounded-full bg-[hsl(var(--sv-blue))] flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[hsl(var(--sv-navy))] border-[hsl(var(--sv-navy-light))]">
            <DropdownMenuLabel className="text-[hsl(var(--sv-white-soft))]">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[hsl(var(--sv-navy-light))]" />
            <DropdownMenuItem className="text-[hsl(var(--sv-white-soft))] focus:bg-[hsl(var(--sv-navy-light))] focus:text-white cursor-pointer">
              <User className="w-4 h-4 mr-2" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[hsl(var(--sv-white-soft))] focus:bg-[hsl(var(--sv-navy-light))] focus:text-white cursor-pointer">
              <Settings className="w-4 h-4 mr-2" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[hsl(var(--sv-navy-light))]" />
            <DropdownMenuItem className="text-[hsl(var(--sv-danger))] focus:bg-[hsl(var(--sv-danger))]/20 focus:text-[hsl(var(--sv-danger))] cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
