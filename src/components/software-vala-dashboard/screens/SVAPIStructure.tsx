import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, Users, Brain, MessageSquare, Presentation, 
  Smartphone, CreditCard, FileText, Code, Copy, Check,
  Lock, UserCog, Bot, Route, Zap
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description?: string;
}

interface APICategory {
  name: string;
  icon: React.ReactNode;
  endpoints: APIEndpoint[];
}

const apiCategories: APICategory[] = [
  {
    name: "Authentication",
    icon: <Lock className="h-4 w-4" />,
    endpoints: [
      { method: 'POST', path: '/auth/login', description: 'Email/password login' },
      { method: 'POST', path: '/auth/google', description: 'Google OAuth login' },
      { method: 'POST', path: '/auth/otp', description: 'OTP verification' },
      { method: 'POST', path: '/auth/refresh', description: 'Refresh access token' },
      { method: 'POST', path: '/auth/logout', description: 'End session' },
    ]
  },
  {
    name: "Users & Roles",
    icon: <UserCog className="h-4 w-4" />,
    endpoints: [
      { method: 'GET', path: '/users', description: 'List all users' },
      { method: 'POST', path: '/users', description: 'Create new user' },
      { method: 'PUT', path: '/users/{id}', description: 'Update user' },
      { method: 'GET', path: '/roles', description: 'List all roles' },
      { method: 'POST', path: '/roles', description: 'Create new role' },
      { method: 'GET', path: '/permissions', description: 'List permissions' },
      { method: 'POST', path: '/role-permissions', description: 'Assign permissions' },
    ]
  },
  {
    name: "AI Models",
    icon: <Brain className="h-4 w-4" />,
    endpoints: [
      { method: 'GET', path: '/ai/models', description: 'List all AI models' },
      { method: 'POST', path: '/ai/models', description: 'Register new model' },
      { method: 'PUT', path: '/ai/models/{id}', description: 'Update model config' },
      { method: 'POST', path: '/ai/models/{id}/enable', description: 'Enable model' },
      { method: 'POST', path: '/ai/models/{id}/disable', description: 'Disable model' },
      { method: 'GET', path: '/ai/models/{id}/usage', description: 'Get usage stats' },
      { method: 'GET', path: '/ai/models/{id}/health', description: 'Health check' },
    ]
  },
  {
    name: "Prompt Studio",
    icon: <Code className="h-4 w-4" />,
    endpoints: [
      { method: 'GET', path: '/ai/prompts', description: 'List all prompts' },
      { method: 'POST', path: '/ai/prompts', description: 'Create new prompt' },
      { method: 'PUT', path: '/ai/prompts/{id}', description: 'Update prompt' },
      { method: 'POST', path: '/ai/prompts/{id}/rollback', description: 'Rollback version' },
    ]
  },
  {
    name: "Routing & Fallback",
    icon: <Route className="h-4 w-4" />,
    endpoints: [
      { method: 'GET', path: '/ai/routing', description: 'List routing rules' },
      { method: 'POST', path: '/ai/routing', description: 'Create routing rule' },
      { method: 'PUT', path: '/ai/routing/{id}', description: 'Update routing rule' },
    ]
  },
  {
    name: "Support Chatbot",
    icon: <Bot className="h-4 w-4" />,
    endpoints: [
      { method: 'GET', path: '/bots', description: 'List all chatbots' },
      { method: 'POST', path: '/bots', description: 'Create new chatbot' },
      { method: 'PUT', path: '/bots/{id}', description: 'Update chatbot' },
      { method: 'GET', path: '/bots/{id}/conversations', description: 'Get conversations' },
      { method: 'POST', path: '/bots/{id}/messages', description: 'Send message' },
      { method: 'POST', path: '/bots/{id}/train', description: 'Train chatbot' },
    ]
  },
  {
    name: "Product Demo",
    icon: <Presentation className="h-4 w-4" />,
    endpoints: [
      { method: 'GET', path: '/demos', description: 'List all demos' },
      { method: 'POST', path: '/demos', description: 'Create new demo' },
      { method: 'PUT', path: '/demos/{id}', description: 'Update demo' },
      { method: 'POST', path: '/demos/{id}/schedule', description: 'Schedule demo' },
      { method: 'POST', path: '/demos/{id}/feedback', description: 'Submit feedback' },
    ]
  },
  {
    name: "Android Platform",
    icon: <Smartphone className="h-4 w-4" />,
    endpoints: [
      { method: 'GET', path: '/android/config', description: 'Get app config' },
      { method: 'GET', path: '/android/models', description: 'Get enabled models' },
      { method: 'POST', path: '/android/logs', description: 'Submit logs' },
      { method: 'POST', path: '/android/errors', description: 'Report errors' },
    ]
  },
  {
    name: "Usage & Billing",
    icon: <CreditCard className="h-4 w-4" />,
    endpoints: [
      { method: 'GET', path: '/usage/summary', description: 'Usage summary' },
      { method: 'GET', path: '/billing/cost', description: 'Cost breakdown' },
      { method: 'POST', path: '/billing/limit', description: 'Set spending limit' },
    ]
  },
  {
    name: "Logs & Audit",
    icon: <FileText className="h-4 w-4" />,
    endpoints: [
      { method: 'GET', path: '/logs', description: 'System logs' },
      { method: 'GET', path: '/audit', description: 'Audit trail' },
    ]
  },
];

const methodColors: Record<string, string> = {
  GET: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  POST: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  PUT: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
  PATCH: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const EndpointRow = ({ endpoint }: { endpoint: APIEndpoint }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(endpoint.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors group">
      <Badge variant="outline" className={`${methodColors[endpoint.method]} font-mono text-xs min-w-[50px] justify-center`}>
        {endpoint.method}
      </Badge>
      <code className="flex-1 font-mono text-sm text-foreground">{endpoint.path}</code>
      {endpoint.description && (
        <span className="text-xs text-muted-foreground hidden md:block">{endpoint.description}</span>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
      </Button>
    </div>
  );
};

const APICategory = ({ category }: { category: APICategory }) => {
  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          {category.icon}
          {category.name}
          <Badge variant="secondary" className="ml-auto text-xs">
            {category.endpoints.length} endpoints
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {category.endpoints.map((endpoint, index) => (
          <EndpointRow key={index} endpoint={endpoint} />
        ))}
      </CardContent>
    </Card>
  );
};

export const SVAPIStructure = () => {
  const totalEndpoints = apiCategories.reduce((acc, cat) => acc + cat.endpoints.length, 0);
  const methodCounts = apiCategories.reduce((acc, cat) => {
    cat.endpoints.forEach(ep => {
      acc[ep.method] = (acc[ep.method] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">API Structure</h1>
          <p className="text-muted-foreground text-sm">RESTful API endpoints for Software Vala Platform</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Base URL: <code className="ml-1">https://api.softwarevala.com/v1</code>
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{totalEndpoints}</div>
            <div className="text-xs text-muted-foreground">Total Endpoints</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">{methodCounts.GET || 0}</div>
            <div className="text-xs text-muted-foreground">GET</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{methodCounts.POST || 0}</div>
            <div className="text-xs text-muted-foreground">POST</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-400">{methodCounts.PUT || 0}</div>
            <div className="text-xs text-muted-foreground">PUT</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{methodCounts.DELETE || 0}</div>
            <div className="text-xs text-muted-foreground">DELETE</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{apiCategories.length}</div>
            <div className="text-xs text-muted-foreground">Categories</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all">All Endpoints</TabsTrigger>
          <TabsTrigger value="auth">Auth & Users</TabsTrigger>
          <TabsTrigger value="ai">AI & Prompts</TabsTrigger>
          <TabsTrigger value="apps">Apps & Bots</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <ScrollArea className="h-[calc(100vh-400px)]">
            <div className="grid gap-4">
              {apiCategories.map((category, index) => (
                <APICategory key={index} category={category} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="auth">
          <div className="grid gap-4">
            {apiCategories.filter(c => ['Authentication', 'Users & Roles'].includes(c.name)).map((category, index) => (
              <APICategory key={index} category={category} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai">
          <div className="grid gap-4">
            {apiCategories.filter(c => ['AI Models', 'Prompt Studio', 'Routing & Fallback'].includes(c.name)).map((category, index) => (
              <APICategory key={index} category={category} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="apps">
          <div className="grid gap-4">
            {apiCategories.filter(c => ['Support Chatbot', 'Product Demo', 'Android Platform'].includes(c.name)).map((category, index) => (
              <APICategory key={index} category={category} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="system">
          <div className="grid gap-4">
            {apiCategories.filter(c => ['Usage & Billing', 'Logs & Audit'].includes(c.name)).map((category, index) => (
              <APICategory key={index} category={category} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
