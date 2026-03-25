/**
 * ModuleBreadcrumb - Shows current navigation path with back/home buttons
 * STEP 9: Header context updates with breadcrumb
 */

import { motion } from "framer-motion";
import { ChevronRight, Home, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}

interface ModuleBreadcrumbProps {
  items: BreadcrumbItem[];
  onHome?: () => void;
  onBack?: () => void;
  showBack?: boolean;
  className?: string;
}

export const ModuleBreadcrumb = ({
  items,
  onHome,
  onBack,
  showBack = true,
  className,
}: ModuleBreadcrumbProps) => {
  if (items.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Home Button */}
      {onHome && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onHome}
          className="w-8 h-8 rounded-lg bg-secondary/50 border border-border/50 hover:border-primary/50 flex items-center justify-center transition-all group"
          title="Return to Boss Dashboard"
        >
          <Home className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
        </motion.button>
      )}

      {/* Back Button */}
      {showBack && onBack && items.length > 1 && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="w-8 h-8 rounded-lg bg-secondary/50 border border-border/50 hover:border-primary/50 flex items-center justify-center transition-all group"
          title="Go Back"
        >
          <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
        </motion.button>
      )}

      {/* Divider */}
      {(onHome || (showBack && onBack)) && (
        <div className="w-px h-5 bg-border/50 mx-1" />
      )}

      {/* Breadcrumb Trail */}
      <nav className="flex items-center gap-1">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            )}
            <motion.button
              whileHover={!item.isActive ? { scale: 1.02 } : undefined}
              onClick={item.onClick}
              disabled={item.isActive || !item.onClick}
              className={cn(
                "px-2 py-1 rounded-md text-sm transition-all",
                item.isActive
                  ? "font-semibold text-foreground cursor-default"
                  : item.onClick
                  ? "text-muted-foreground hover:text-foreground hover:bg-secondary/50 cursor-pointer"
                  : "text-muted-foreground cursor-default"
              )}
            >
              {item.label}
            </motion.button>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default ModuleBreadcrumb;
