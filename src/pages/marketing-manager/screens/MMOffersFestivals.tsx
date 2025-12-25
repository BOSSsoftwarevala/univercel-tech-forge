import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sparkles, Plus } from "lucide-react";
import { toast } from "sonner";

const MMOffersFestivals = () => {
  const [festivals] = useState([
    { id: "FES001", name: "Diwali 2025", autoColor: "#FFD700", autoTheme: "Golden Sparkle", discount: "40%", sector: "All", status: "scheduled" },
    { id: "FES002", name: "Christmas 2025", autoColor: "#FF0000", autoTheme: "Red & White", discount: "30%", sector: "Retail", status: "scheduled" },
    { id: "FES003", name: "New Year 2026", autoColor: "#C0C0C0", autoTheme: "Silver Celebration", discount: "25%", sector: "All", status: "draft" },
    { id: "FES004", name: "Holi 2025", autoColor: "#FF69B4", autoTheme: "Rainbow Colors", discount: "35%", sector: "Fashion", status: "completed" },
  ]);

  const [discountSlabs] = useState([
    { tier: "Bronze", minSpend: "₹1,000", discount: "10%" },
    { tier: "Silver", minSpend: "₹5,000", discount: "15%" },
    { tier: "Gold", minSpend: "₹10,000", discount: "25%" },
    { tier: "Platinum", minSpend: "₹25,000", discount: "40%" },
  ]);

  const handleProposeOffer = () => {
    toast.info("Offer proposal submitted for approval");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Offers & Festivals</h2>
        <Button onClick={handleProposeOffer} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Propose Offer
        </Button>
      </div>

      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-emerald-400 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Festival Rules (Auto-Color, Auto-Theme)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-400">Festival</TableHead>
                <TableHead className="text-slate-400">Auto Color</TableHead>
                <TableHead className="text-slate-400">Auto Theme</TableHead>
                <TableHead className="text-slate-400">Discount</TableHead>
                <TableHead className="text-slate-400">Sector</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {festivals.map((fest) => (
                <TableRow key={fest.id} className="border-slate-700/50">
                  <TableCell className="text-white font-medium">{fest.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded border border-slate-600" 
                        style={{ backgroundColor: fest.autoColor }}
                      />
                      <span className="text-slate-300 font-mono text-sm">{fest.autoColor}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-300">{fest.autoTheme}</TableCell>
                  <TableCell className="text-emerald-400 font-semibold">{fest.discount}</TableCell>
                  <TableCell className="text-slate-300">{fest.sector}</TableCell>
                  <TableCell>
                    <Badge className={
                      fest.status === "scheduled" ? "bg-blue-500/20 text-blue-400" :
                      fest.status === "completed" ? "bg-slate-500/20 text-slate-400" :
                      "bg-yellow-500/20 text-yellow-400"
                    }>
                      {fest.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-emerald-400">Discount Slabs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {discountSlabs.map((slab) => (
              <div key={slab.tier} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
                <h4 className="text-lg font-semibold text-white">{slab.tier}</h4>
                <p className="text-slate-400 text-sm mt-1">Min: {slab.minSpend}</p>
                <p className="text-2xl font-bold text-emerald-400 mt-2">{slab.discount}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MMOffersFestivals;
