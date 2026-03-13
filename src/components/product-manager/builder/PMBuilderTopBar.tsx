import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Share2, MoreHorizontal, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

interface PMBuilderTopBarProps {
  productName: string;
  onSave: () => void;
  onPublish: () => void;
  isSaving?: boolean;
  isDraft?: boolean;
}

const PMBuilderTopBar = ({ productName, onSave, onPublish, isSaving, isDraft = true }: PMBuilderTopBarProps) => {
  const navigate = useNavigate();

  return (
    <div className="h-14 border-b border-border/60 bg-background flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <span className="text-emerald-400 text-sm font-bold">P</span>
          </div>
          <span className="font-semibold text-sm text-foreground">{productName || 'Untitled Product'}</span>
          {isDraft && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">Draft</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 text-xs gap-1.5"
          onClick={onSave}
          disabled={isSaving}
        >
          <Save className="w-3.5 h-3.5" />
          {isSaving ? 'Saving...' : 'Save Draft'}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="h-8 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
              Publish
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onPublish}>Publish to Marketplace</DropdownMenuItem>
            <DropdownMenuItem>Publish to Demo</DropdownMenuItem>
            <DropdownMenuItem>Export Package</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default PMBuilderTopBar;
