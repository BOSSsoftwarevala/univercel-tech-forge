/**
 * CATEGORY SIDEBAR WRAPPER
 * 
 * Standard wrapper for all category/module sidebars
 * Includes back button to return to global sidebar
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebarStore, CategorySidebarId } from '@/stores/sidebarStore';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface CategorySidebarWrapperProps {
  categoryId: CategorySidebarId;
  title: string;
  icon: React.ElementType;
  themeColor?: string;
  children: React.ReactNode;
  className?: string;
}

export function CategorySidebarWrapper({
  categoryId,
  title,
  icon: Icon,
  themeColor = 'from-blue-500 to-indigo-600',
  children,
  className,
}: CategorySidebarWrapperProps) {
  const { 
    activeSidebar, 
    activeCategorySidebar, 
    categoryCollapsed, 
    toggleCategoryCollapsed,
    exitToGlobal,
  } = useSidebarStore();
  
  // Only render if this is the active category
  if (activeSidebar !== 'category' || activeCategorySidebar !== categoryId) {
    return null;
  }
  
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{
        x: 0,
        opacity: 1,
        width: categoryCollapsed ? 80 : 260,
      }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        // CRITICAL: Sidebar must be full-height, fixed, and never overlapped by content
        "fixed left-0 top-0 h-screen flex flex-col border-r border-border/50 bg-card/95 text-card-foreground backdrop-blur-xl z-50",
        className
      )}
    >
      {/* Header with Back Button */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          {/* Back to Global Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={exitToGlobal}
                className="h-9 w-9 rounded-lg hover:bg-secondary"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Back to Main Menu
            </TooltipContent>
          </Tooltip>
          
          {/* Title (hidden when collapsed) */}
          {!categoryCollapsed && (
            <div className="flex items-center gap-2 flex-1">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br",
                themeColor
              )}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm truncate">{title}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Collapse Toggle */}
      <button
        onClick={toggleCategoryCollapsed}
        className="absolute -right-3 top-20 flex items-center justify-center w-6 h-6 rounded-full bg-primary border-2 border-background text-primary-foreground shadow-lg z-50 hover:bg-primary/90 transition-colors"
      >
        {categoryCollapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </motion.aside>
  );
}
