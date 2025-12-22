import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Grid3X3, LayoutGrid, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { sectorsData, Sector, SubCategory } from "@/data/sectorsData";

const SectorsBrowse = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredSectors = sectorsData.filter(sector =>
    sector.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSectorClick = (sector: Sector) => {
    setSelectedSector(sector);
    setIsModalOpen(true);
  };

  const handleSubCategoryClick = (subCategory: SubCategory) => {
    if (selectedSector) {
      navigate(`/sectors/${selectedSector.id}/${subCategory.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-teal/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 glass-panel border-b border-border/30">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(-1)}
                  className="shrink-0"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Browse Sectors</h1>
                  <p className="text-sm text-muted-foreground">50 Industries • Choose a sector to explore demos</p>
                </div>
              </div>
              
              <div className="relative max-w-xs w-full hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sectors..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Mobile Search */}
            <div className="relative mt-3 sm:hidden">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sectors..."
                className="pl-10"
              />
            </div>
          </div>
        </header>

        {/* Sectors Grid */}
        <main className="container mx-auto px-4 py-6">
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.02 }
              }
            }}
          >
            {filteredSectors.map((sector, index) => {
              const Icon = sector.icon;
              return (
                <motion.div
                  key={sector.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <Card
                    className="group cursor-pointer glass-panel border-border/30 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                    onClick={() => handleSectorClick(sector)}
                  >
                    <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-primary/20 to-neon-teal/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-neon-teal/30 transition-all duration-300">
                        <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <span className="text-xs md:text-sm font-medium text-foreground line-clamp-2">
                        {sector.name}
                      </span>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {filteredSectors.length === 0 && (
            <div className="text-center py-12">
              <Grid3X3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No sectors found matching "{searchQuery}"</p>
            </div>
          )}
        </main>
      </div>

      {/* Sub-Category Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md glass-panel border-border/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedSector && (
                <>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-neon-teal/20 flex items-center justify-center">
                    <selectedSector.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span>{selectedSector.name}</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">Choose a sub-category to view demos:</p>
            
            <div className="grid gap-3">
              {selectedSector?.subCategories.map((subCategory, index) => {
                const SubIcon = subCategory.icon;
                return (
                  <motion.button
                    key={subCategory.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleSubCategoryClick(subCategory)}
                    className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary border border-border/30 hover:border-primary/50 transition-all duration-200 text-left group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-teal/20 to-primary/20 flex items-center justify-center group-hover:from-neon-teal/30 group-hover:to-primary/30 transition-all">
                      <SubIcon className="w-5 h-5 text-neon-teal" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{subCategory.name}</p>
                      <p className="text-xs text-muted-foreground">9 demos available</p>
                    </div>
                    <LayoutGrid className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </motion.button>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SectorsBrowse;
