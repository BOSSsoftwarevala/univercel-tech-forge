import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Layout, 
  Sparkles, 
  Globe, 
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Plus
} from "lucide-react";

interface ContentMarketingProps {
  activeView: string;
}

const ContentMarketing = ({ activeView }: ContentMarketingProps) => {
  const blogs = [
    { title: "10 Best CRM Practices for 2024", status: "published", views: 4560, date: "Jan 15, 2024" },
    { title: "How to Automate Your Sales Process", status: "published", views: 3210, date: "Jan 12, 2024" },
    { title: "Complete Guide to Lead Management", status: "draft", views: 0, date: "Jan 18, 2024" },
    { title: "Customer Success Strategies", status: "review", views: 0, date: "Jan 17, 2024" },
    { title: "AI in Modern CRM Systems", status: "scheduled", views: 0, date: "Jan 25, 2024" },
  ];

  const landingPages = [
    { name: "Product Launch 2024", url: "/lp/product-launch", conversions: 234, status: "active" },
    { name: "Free Trial Signup", url: "/lp/free-trial", conversions: 567, status: "active" },
    { name: "Enterprise Demo", url: "/lp/enterprise", conversions: 89, status: "active" },
    { name: "Black Friday Sale", url: "/lp/black-friday", conversions: 0, status: "draft" },
  ];

  const approvalQueue = [
    { title: "Blog: Email Marketing Tips", author: "John D.", submitted: "2 hours ago", type: "blog" },
    { title: "Landing Page: New Feature", author: "Sarah M.", submitted: "5 hours ago", type: "landing" },
    { title: "Social Post: Product Update", author: "Mike R.", submitted: "1 day ago", type: "social" },
  ];

  const renderBlogManager = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Blog Manager</h3>
        <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
          <Plus className="w-4 h-4 mr-1" />
          New Post
        </Button>
      </div>
      
      <div className="grid gap-4">
        {blogs.map((blog, idx) => (
          <Card key={idx} className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-teal-400" />
                  <div>
                    <h4 className="font-medium text-white">{blog.title}</h4>
                    <p className="text-xs text-slate-400">{blog.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {blog.views > 0 && (
                    <div className="flex items-center gap-1 text-slate-400">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">{blog.views.toLocaleString()}</span>
                    </div>
                  )}
                  <Badge className={`text-[10px] ${
                    blog.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' :
                    blog.status === 'draft' ? 'bg-slate-500/20 text-slate-400' :
                    blog.status === 'review' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {blog.status.toUpperCase()}
                  </Badge>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderLandingPages = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Landing Pages</h3>
        <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
          <Plus className="w-4 h-4 mr-1" />
          Create Page
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {landingPages.map((page, idx) => (
          <Card key={idx} className="bg-slate-800/50 border-slate-700/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <Layout className="w-4 h-4 text-teal-400" />
                  {page.name}
                </CardTitle>
                <Badge className={page.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}>
                  {page.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-slate-400 font-mono">{page.url}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Conversions</span>
                <span className="text-lg font-bold text-white">{page.conversions}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 h-7 text-xs border-slate-600">
                  Preview
                </Button>
                <Button size="sm" className="flex-1 h-7 text-xs bg-teal-600 hover:bg-teal-700">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAIContentGenerator = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">AI Content Generator</h3>
      
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            Generate Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Content Type</label>
            <div className="flex gap-2">
              {["Blog Post", "Landing Page", "Email", "Social Post", "Ad Copy"].map((type) => (
                <Button key={type} size="sm" variant="outline" className="border-slate-600 text-xs">
                  {type}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Topic / Keywords</label>
            <Input placeholder="Enter your topic or keywords..." className="bg-slate-900 border-slate-700" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Additional Instructions</label>
            <Textarea placeholder="Add any specific instructions..." className="bg-slate-900 border-slate-700 min-h-[100px]" />
          </div>
          
          <div className="flex gap-2">
            <Button className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Content
            </Button>
            <Button variant="outline" className="border-slate-600">
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLocalLanguageContent = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Local Language Content</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[
          { language: "Hindi", articles: 45, pending: 12 },
          { language: "Spanish", articles: 38, pending: 8 },
          { language: "German", articles: 32, pending: 5 },
          { language: "French", articles: 28, pending: 7 },
          { language: "Portuguese", articles: 22, pending: 4 },
          { language: "Arabic", articles: 18, pending: 6 },
        ].map((lang, idx) => (
          <Card key={idx} className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="w-8 h-8 text-teal-400" />
                <div>
                  <h4 className="font-medium text-white">{lang.language}</h4>
                  <p className="text-xs text-slate-400">{lang.articles} articles</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="text-slate-400">Pending Translation</span>
                <Badge className="bg-orange-500/20 text-orange-400">{lang.pending}</Badge>
              </div>
              <Button size="sm" variant="outline" className="w-full h-7 text-xs border-slate-600">
                Manage Content
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderContentApprovalQueue = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Content Approval Queue</h3>
      
      <div className="grid gap-4">
        {approvalQueue.map((item, idx) => (
          <Card key={idx} className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-orange-400" />
                  <div>
                    <h4 className="font-medium text-white">{item.title}</h4>
                    <p className="text-xs text-slate-400">By {item.author} • {item.submitted}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-500/20 text-blue-400 text-[10px]">
                    {item.type.toUpperCase()}
                  </Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="h-7 text-xs border-slate-600">
                      Preview
                    </Button>
                    <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs border-red-500/30 text-red-400">
                      <XCircle className="w-3 h-3 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  switch (activeView) {
    case "content-blog":
      return renderBlogManager();
    case "content-landing":
      return renderLandingPages();
    case "content-ai":
      return renderAIContentGenerator();
    case "content-local":
      return renderLocalLanguageContent();
    case "content-approval":
      return renderContentApprovalQueue();
    default:
      return renderBlogManager();
  }
};

export default ContentMarketing;
