/**
 * Bottom Navigation for Mobile
 * Fixed bottom bar with main navigation items
 */

import { memo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Grid3X3, User, Search, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface BottomNavProps {
  onMenuClick?: () => void;
}

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Grid3X3, label: 'Demos', path: '/demos' },
  { icon: Search, label: 'Sectors', path: '/sectors' },
  { icon: User, label: 'Account', path: '/settings' },
];

const BottomNavigation = memo(({ onMenuClick }: BottomNavProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;
  
  return (
    <nav className="bottom-nav safe-area-bottom">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg",
                "min-w-[64px] min-h-[48px] transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground active:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
        
        {/* Menu button */}
        <button
          onClick={onMenuClick}
          className={cn(
            "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg",
            "min-w-[64px] min-h-[48px] text-muted-foreground active:text-foreground"
          )}
        >
          <Menu className="h-5 w-5" />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </div>
    </nav>
  );
});

BottomNavigation.displayName = 'BottomNavigation';

export default BottomNavigation;
