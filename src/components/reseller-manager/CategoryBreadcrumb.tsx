import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryPath } from './types/categoryTypes';

interface CategoryBreadcrumbProps {
  path: CategoryPath;
  onNavigate: (level: 'home' | 'category' | 'sub' | 'micro' | 'nano') => void;
}

export const CategoryBreadcrumb: React.FC<CategoryBreadcrumbProps> = ({ path, onNavigate }) => {
  return (
    <nav className="flex items-center gap-1 text-sm mb-4 flex-wrap">
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-muted-foreground hover:text-foreground"
        onClick={() => onNavigate('home')}
      >
        <Home className="h-4 w-4" />
      </Button>

      {path.category && (
        <>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Button
            variant="ghost"
            size="sm"
            className={`h-7 px-2 ${path.sub ? 'text-muted-foreground hover:text-foreground' : 'text-foreground font-medium'}`}
            onClick={() => onNavigate('category')}
          >
            {path.category.name}
          </Button>
        </>
      )}

      {path.sub && (
        <>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Button
            variant="ghost"
            size="sm"
            className={`h-7 px-2 ${path.micro ? 'text-muted-foreground hover:text-foreground' : 'text-foreground font-medium'}`}
            onClick={() => onNavigate('sub')}
          >
            {path.sub.name}
          </Button>
        </>
      )}

      {path.micro && (
        <>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Button
            variant="ghost"
            size="sm"
            className={`h-7 px-2 ${path.nano ? 'text-muted-foreground hover:text-foreground' : 'text-foreground font-medium'}`}
            onClick={() => onNavigate('micro')}
          >
            {path.micro.name}
          </Button>
        </>
      )}

      {path.nano && (
        <>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-foreground font-medium"
            onClick={() => onNavigate('nano')}
          >
            {path.nano.name}
          </Button>
        </>
      )}
    </nav>
  );
};
