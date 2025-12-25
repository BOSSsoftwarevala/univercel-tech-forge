import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Clock, Plus } from "lucide-react";
import { toast } from "sonner";

const MMSchedules = () => {
  const [schedules] = useState([
    { id: "SCH001", campaign: "Summer Sale 2025", startDate: "2025-06-01", endDate: "2025-06-30", timeWindow: "09:00 - 21:00", frequencyCap: "3/day", status: "active" },
    { id: "SCH002", campaign: "Festival Promo", startDate: "2025-07-10", endDate: "2025-07-20", timeWindow: "00:00 - 23:59", frequencyCap: "5/day", status: "scheduled" },
    { id: "SCH003", campaign: "Flash Sale", startDate: "2025-06-15", endDate: "2025-06-15", timeWindow: "12:00 - 18:00", frequencyCap: "2/hour", status: "scheduled" },
    { id: "SCH004", campaign: "Weekend Boost", startDate: "2025-06-07", endDate: "2025-06-08", timeWindow: "10:00 - 22:00", frequencyCap: "4/day", status: "completed" },
  ]);

  const handleSchedule = () => {
    toast.info("Schedule request submitted for approval");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Campaign Schedules</h2>
        <Button onClick={handleSchedule} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Schedule
        </Button>
      </div>

      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-emerald-400 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Campaign Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-slate-800/50 rounded-lg flex items-center justify-center text-slate-500 mb-6">
            Calendar view placeholder
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-emerald-400 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time Windows & Frequency Caps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-400">Campaign</TableHead>
                <TableHead className="text-slate-400">Start Date</TableHead>
                <TableHead className="text-slate-400">End Date</TableHead>
                <TableHead className="text-slate-400">Time Window</TableHead>
                <TableHead className="text-slate-400">Frequency Cap</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id} className="border-slate-700/50">
                  <TableCell className="text-white font-medium">{schedule.campaign}</TableCell>
                  <TableCell className="text-slate-300">{schedule.startDate}</TableCell>
                  <TableCell className="text-slate-300">{schedule.endDate}</TableCell>
                  <TableCell className="text-slate-300">{schedule.timeWindow}</TableCell>
                  <TableCell className="text-emerald-400">{schedule.frequencyCap}</TableCell>
                  <TableCell>
                    <Badge className={
                      schedule.status === "active" ? "bg-emerald-500/20 text-emerald-400" :
                      schedule.status === "scheduled" ? "bg-blue-500/20 text-blue-400" :
                      "bg-slate-500/20 text-slate-400"
                    }>
                      {schedule.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MMSchedules;
