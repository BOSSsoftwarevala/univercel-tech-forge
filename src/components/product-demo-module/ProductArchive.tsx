import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Archive, 
  Search, 
  RotateCcw, 
  Trash2,
  Package,
  Monitor,
  Filter
} from "lucide-react";

const archivedItems = [
  { 
    type: "product",
    name: "OldPOS System v1.0", 
    archivedDate: "2024-01-15",
    archivedBy: "Admin",
    reason: "Replaced by RetailMaster Pro"
  },
  { 
    type: "product",
    name: "BasicInventory", 
    archivedDate: "2023-12-01",
    archivedBy: "Admin",
    reason: "Discontinued"
  },
  { 
    type: "demo",
    name: "RetailMaster Demo - Ghana", 
    archivedDate: "2024-02-20",
    archivedBy: "System",
    reason: "License expired"
  },
  { 
    type: "demo",
    name: "FoodServe Demo - Test", 
    archivedDate: "2024-02-18",
    archivedBy: "Admin",
    reason: "Test demo removed"
  },
  { 
    type: "product",
    name: "SimpleBooking v2.0", 
    archivedDate: "2023-11-10",
    archivedBy: "Admin",
    reason: "Merged with HotelHub"
  },
];

export const ProductArchive = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Archive</h1>
          <p className="text-muted-foreground">View and manage archived products and demos</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search archive..." className="pl-9 w-[250px]" />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Archived Products", value: archivedItems.filter(i => i.type === "product").length, icon: Package },
          { label: "Archived Demos", value: archivedItems.filter(i => i.type === "demo").length, icon: Monitor },
          { label: "Total Archived", value: archivedItems.length, icon: Archive },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Archived List */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="w-5 h-5 text-muted-foreground" />
            Archived Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {archivedItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50 opacity-80 hover:opacity-100 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    {item.type === "product" ? (
                      <Package className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Monitor className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{item.name}</div>
                    <div className="text-sm text-muted-foreground">{item.reason}</div>
                    <div className="text-xs text-muted-foreground">
                      Archived on {item.archivedDate} by {item.archivedBy}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="capitalize">
                    {item.type}
                  </Badge>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="gap-1">
                      <RotateCcw className="w-3 h-3" />
                      Restore
                    </Button>
                    <Button size="sm" variant="ghost" className="gap-1 text-red-400">
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-amber-500/10 border-amber-500/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Archive className="w-5 h-5 text-amber-400 mt-0.5" />
            <div>
              <div className="font-medium text-foreground">Archive Policy</div>
              <div className="text-sm text-muted-foreground mt-1">
                Archived items are kept for 90 days before permanent deletion. 
                Restore items within this period to recover all data.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
