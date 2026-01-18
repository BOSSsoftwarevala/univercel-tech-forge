/**
 * Library Module
 * Manage books, issues, and returns
 */
import { 
  Library, Plus, Search, BookOpen, Users, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const LibraryModule = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Library className="w-7 h-7 text-amber-500" />
            Library Management
          </h2>
          <p className="text-slate-400">Manage books, issue/return, and catalog</p>
        </div>
        <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => toast.info('Add book')}>
          <Plus className="w-4 h-4 mr-2" /> Add Book
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Books", value: "0", icon: BookOpen, color: "bg-blue-500" },
          { label: "Issued", value: "0", icon: Users, color: "bg-green-500" },
          { label: "Overdue", value: "0", icon: Clock, color: "bg-red-500" },
          { label: "Available", value: "0", icon: Library, color: "bg-amber-500" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search books by title, author, or ISBN..." 
              className="pl-10 bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="py-12 text-center">
          <Library className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 mb-4">No books in the library catalog</p>
          <Button className="bg-amber-500" onClick={() => toast.info('Add book')}>
            <Plus className="w-4 h-4 mr-2" /> Add First Book
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
