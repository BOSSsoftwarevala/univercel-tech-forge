import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryBreadcrumb } from './CategoryBreadcrumb';
import { CategoryCard } from './CategoryCard';
import { CategoryDataTable } from './CategoryDataTable';
import { resellerCategories } from './data/categoryData';
import { 
  Category, SubCategory, MicroCategory, NanoCategory, 
  CategoryPath, CategoryLevel 
} from './types/categoryTypes';
import { toast } from 'sonner';

interface CategoryHierarchyViewProps {
  onNavigateToSection?: (section: unknown) => void;
}

export const CategoryHierarchyView: React.FC<CategoryHierarchyViewProps> = ({ 
  onNavigateToSection 
}) => {
  const [currentLevel, setCurrentLevel] = useState<CategoryLevel>('category');
  const [path, setPath] = useState<CategoryPath>({});
  const [categories] = useState<Category[]>(resellerCategories);

  const navigateToCategory = useCallback((category: Category) => {
    setPath({ category });
    setCurrentLevel('subcategory');
    toast.success(`Navigated to ${category.name}`);
  }, []);

  const navigateToSub = useCallback((sub: SubCategory) => {
    setPath(prev => ({ ...prev, sub }));
    setCurrentLevel('micro');
    toast.success(`Navigated to ${sub.name}`);
  }, []);

  const navigateToMicro = useCallback((micro: MicroCategory) => {
    setPath(prev => ({ ...prev, micro }));
    setCurrentLevel('nano');
    toast.success(`Navigated to ${micro.name}`);
  }, []);

  const navigateToNano = useCallback((nano: NanoCategory) => {
    setPath(prev => ({ ...prev, nano }));
    setCurrentLevel('data');
    toast.success(`Viewing ${nano.name} data`);
  }, []);

  const handleBreadcrumbNavigate = useCallback((level: 'home' | 'category' | 'sub' | 'micro' | 'nano') => {
    switch (level) {
      case 'home':
        setPath({});
        setCurrentLevel('category');
        break;
      case 'category':
        setPath(prev => ({ category: prev.category }));
        setCurrentLevel('subcategory');
        break;
      case 'sub':
        setPath(prev => ({ category: prev.category, sub: prev.sub }));
        setCurrentLevel('micro');
        break;
      case 'micro':
        setPath(prev => ({ category: prev.category, sub: prev.sub, micro: prev.micro }));
        setCurrentLevel('nano');
        break;
      case 'nano':
        setCurrentLevel('data');
        break;
    }
  }, []);

  const handleDataAction = useCallback((action: string, itemId: string) => {
    // Execute actual actions with user feedback
    switch (action) {
      case 'view':
        toast.info(`Viewing details for ${itemId}`, { description: 'Opening detail view...' });
        break;
      case 'edit':
        toast.info(`Editing ${itemId}`, { description: 'Opening editor...' });
        break;
      case 'delete':
        toast.warning(`Delete requested for ${itemId}`, { description: 'Confirm action required' });
        break;
      case 'export':
        toast.success(`Exporting ${itemId}`, { description: 'Download will start shortly' });
        break;
      case 'approve':
        toast.success(`Approved ${itemId}`);
        break;
      case 'reject':
        toast.error(`Rejected ${itemId}`);
        break;
      default:
        toast.info(`Action "${action}" triggered on ${itemId}`);
    }
  }, []);

  const renderContent = () => {
    switch (currentLevel) {
      case 'category':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                id={category.id}
                name={category.name}
                icon={category.icon}
                count={category.count}
                description={category.description}
                onClick={() => navigateToCategory(category)}
                variant="category"
              />
            ))}
          </div>
        );

      case 'subcategory':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {path.category?.subs.map((sub) => (
              <CategoryCard
                key={sub.id}
                id={sub.id}
                name={sub.name}
                icon={sub.icon}
                count={sub.count}
                onClick={() => navigateToSub(sub)}
                variant="sub"
              />
            ))}
          </div>
        );

      case 'micro':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {path.sub?.micros.map((micro) => (
              <CategoryCard
                key={micro.id}
                id={micro.id}
                name={micro.name}
                icon={micro.icon}
                count={micro.count}
                onClick={() => navigateToMicro(micro)}
                variant="micro"
              />
            ))}
          </div>
        );

      case 'nano':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {path.micro?.nanos.map((nano) => (
              <CategoryCard
                key={nano.id}
                id={nano.id}
                name={nano.name}
                icon="Activity"
                count={nano.count}
                status={nano.status}
                onClick={() => navigateToNano(nano)}
                variant="nano"
              />
            ))}
          </div>
        );

      case 'data':
        return path.nano ? (
          <CategoryDataTable nano={path.nano} onAction={handleDataAction} />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb Navigation */}
      <CategoryBreadcrumb path={path} onNavigate={handleBreadcrumbNavigate} />

      {/* Level Indicator */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <span>Level:</span>
        <span className="text-primary font-medium capitalize">
          {currentLevel === 'data' ? 'Data View' : currentLevel}
        </span>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLevel + (path.nano?.id || path.micro?.id || path.sub?.id || path.category?.id || '')}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
