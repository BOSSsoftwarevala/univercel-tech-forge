import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronDown, X } from 'lucide-react';

const DemoFilterBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTech, setSelectedTech] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const categories = [
    'All Categories', 'Education', 'Real Estate', 'E-Commerce', 'Healthcare', 
    'Restaurant', 'Finance', 'Fitness', 'Travel', 'Logistics'
  ];

  const techStacks = [
    'All Tech', 'React', 'Vue.js', 'Angular', 'Node.js', 
    'Laravel', 'Django', 'Spring Boot', 'PHP'
  ];

  const levels = ['All Levels', 'Basic', 'Advanced', 'Prime'];

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedTech('');
    setSelectedLevel('');
  };

  const hasFilters = searchQuery || selectedCategory || selectedTech || selectedLevel;

  return (
    <section className="relative py-4 sm:py-6 md:py-8">
      {/* Background */}
      <div className="absolute inset-0 bg-[hsl(220,20%,6%)]" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl sm:rounded-2xl bg-[hsl(220,20%,8%)] border border-[hsl(210,100%,55%)/0.2] p-3 sm:p-4"
        >
          {/* Main Filter Row */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3 md:gap-4">
            {/* Search Input */}
            <div className="flex-1 min-w-0 sm:min-w-[180px] md:min-w-[200px] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search demos..."
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-xl bg-input 
                         border border-primary/20 text-foreground text-sm sm:text-base
                         placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                         transition-colors"
              />
              {searchQuery && (
                <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded
                               bg-primary/20 text-primary text-xs">
                  Searching...
                </span>
              )}
            </div>

            {/* Category Dropdown */}
            <div className="relative flex-1 sm:flex-none sm:min-w-[140px] md:min-w-[160px]">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none px-3 sm:px-4 py-2.5 sm:py-3 pr-8 sm:pr-10 rounded-xl text-sm sm:text-base
                         bg-popover border border-primary/20
                         text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                         transition-colors cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat === 'All Categories' ? '' : cat} 
                          className="bg-popover text-foreground">
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Tech Stack Dropdown - Hidden on mobile */}
            <div className="relative hidden md:block min-w-[140px]">
              <select
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value)}
                className="w-full appearance-none px-4 py-3 pr-10 rounded-xl text-sm
                         bg-popover border border-primary/20
                         text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                         transition-colors cursor-pointer"
              >
                {techStacks.map((tech) => (
                  <option key={tech} value={tech === 'All Tech' ? '' : tech}
                          className="bg-popover text-foreground">
                    {tech}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Level Dropdown - Hidden on mobile */}
            <div className="relative hidden lg:block min-w-[130px]">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full appearance-none px-4 py-3 pr-10 rounded-xl text-sm
                         bg-popover border border-primary/20
                         text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                         transition-colors cursor-pointer"
              >
                {levels.map((level) => (
                  <option key={level} value={level === 'All Levels' ? '' : level}
                          className="bg-popover text-foreground">
                    {level}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* More Filters Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl
                       border border-primary/30 text-primary text-sm sm:text-base
                       hover:bg-primary/10 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">More</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            {/* Clear Filters */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-3 rounded-xl
                         text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          {/* Expanded Filters */}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-primary/10"
            >
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground mr-2">Quick filters:</span>
                {['Trending', 'New Arrivals', 'Most Viewed', 'Top Rated', 'Free Trial'].map((filter) => (
                  <button
                    key={filter}
                    className="px-3 py-1.5 rounded-lg text-sm bg-primary/10
                             text-primary border border-primary/20
                             hover:bg-primary/20 transition-colors"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default DemoFilterBar;
