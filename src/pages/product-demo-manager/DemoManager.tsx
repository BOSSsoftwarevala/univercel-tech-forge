import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MonitorPlay, Eye, Lock, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

const DemoManager = () => {
  const [viewingDemo, setViewingDemo] = useState<any>(null);

  const { data: demos, isLoading } = useQuery({
    queryKey: ["demos-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("demos")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-600">Active</Badge>;
      case "expired":
        return <Badge className="bg-amber-600">Expired</Badge>;
      case "converted":
        return <Badge className="bg-blue-600">Converted</Badge>;
      default:
        return <Badge className="bg-slate-600">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <MonitorPlay className="w-6 h-6 text-blue-400" />
            Demo Manager
          </h1>
          <p className="text-slate-400 text-sm">Read-only view of all demos</p>
        </div>
        <Badge variant="outline" className="border-amber-500/50 text-amber-400">
          <Lock className="w-3 h-3 mr-1" />
          No Edit / No Delete
        </Badge>
      </div>

      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700/50">
                  <TableHead className="text-slate-400">Demo Title</TableHead>
                  <TableHead className="text-slate-400">Category</TableHead>
                  <TableHead className="text-slate-400">Type</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400">Created</TableHead>
                  <TableHead className="text-slate-400 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-slate-400 py-8">
                      Loading demos...
                    </TableCell>
                  </TableRow>
                ) : demos?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-slate-400 py-8">
                      No demos found
                    </TableCell>
                  </TableRow>
                ) : (
                  demos?.map((demo) => (
                    <TableRow key={demo.id} className="border-slate-700/50">
                      <TableCell className="text-white font-medium">
                        {demo.title}
                      </TableCell>
                      <TableCell className="text-slate-300">{demo.category}</TableCell>
                      <TableCell className="text-slate-300">{demo.demo_type || "Standard"}</TableCell>
                      <TableCell>{getStatusBadge(demo.status)}</TableCell>
                      <TableCell className="text-slate-400 text-sm">
                        {demo.created_at ? format(new Date(demo.created_at), "MMM d, yyyy") : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewingDemo(demo)}
                            className="text-cyan-400 hover:text-cyan-300"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          {demo.url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(demo.url, "_blank")}
                              className="text-violet-400 hover:text-violet-300"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* View Demo Dialog */}
      <Dialog open={!!viewingDemo} onOpenChange={() => setViewingDemo(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <MonitorPlay className="w-5 h-5 text-blue-400" />
              Demo Details (Read Only)
            </DialogTitle>
          </DialogHeader>
          {viewingDemo && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400">Demo Title</p>
                  <p className="text-white font-medium">{viewingDemo.title}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Category</p>
                  <p className="text-white">{viewingDemo.category}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Status</p>
                  {getStatusBadge(viewingDemo.status)}
                </div>
                <div>
                  <p className="text-xs text-slate-400">Demo Type</p>
                  <p className="text-white">{viewingDemo.demo_type || "Standard"}</p>
                </div>
              </div>
              {viewingDemo.description && (
                <div>
                  <p className="text-xs text-slate-400">Description</p>
                  <p className="text-slate-300 text-sm">{viewingDemo.description}</p>
                </div>
              )}
              {viewingDemo.url && (
                <div>
                  <p className="text-xs text-slate-400">Demo URL</p>
                  <a href={viewingDemo.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-sm hover:underline">
                    {viewingDemo.url}
                  </a>
                </div>
              )}
              <div className="p-3 bg-slate-800/50 rounded-lg flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <p className="text-xs text-amber-400">This record is immutable and cannot be modified</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DemoManager;
