/**
 * API & SDK SCREEN
 * API keys, code examples, rate limits
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Key,
  Copy,
  RefreshCw,
  Eye,
  EyeOff,
  Code2,
  Gauge,
  CheckCircle2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const codeExamples = {
  python: `import softwarevala

client = softwarevala.Client(api_key="sk_live_...")

# Make an AI request
response = client.chat.completions.create(
    model="gpt-5",
    messages=[
        {"role": "user", "content": "Hello!"}
    ]
)

print(response.choices[0].message.content)`,
  
  javascript: `import SoftwareVala from 'softwarevala';

const client = new SoftwareVala({
  apiKey: 'sk_live_...'
});

// Make an AI request
const response = await client.chat.completions.create({
  model: 'gpt-5',
  messages: [
    { role: 'user', content: 'Hello!' }
  ]
});

console.log(response.choices[0].message.content);`,

  java: `import com.softwarevala.SoftwareValaClient;
import com.softwarevala.models.ChatRequest;

public class Example {
    public static void main(String[] args) {
        SoftwareValaClient client = new SoftwareValaClient("sk_live_...");
        
        ChatRequest request = ChatRequest.builder()
            .model("gpt-5")
            .addMessage("user", "Hello!")
            .build();
            
        ChatResponse response = client.chat().create(request);
        System.out.println(response.getContent());
    }
}`
};

export const SVApiSdk: React.FC = () => {
  const [showKey, setShowKey] = useState(false);
  const apiKey = 'sk_live_aBcDeFgHiJkLmNoPqRsTuVwXyZ123456';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard' });
  };

  const handleGenerateKey = () => {
    toast({ title: 'New API key generated', description: 'Your old key has been revoked' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">API & SDK</h1>
        <p className="text-slate-500 text-sm mt-1">Integrate Software Vala AI into your applications</p>
      </div>

      {/* API Key Section */}
      <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-600" />
              API Key
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleGenerateKey}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                readOnly
                className="pr-20 font-mono text-sm bg-slate-50"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleCopy(apiKey)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Keep your API key secure. Do not share it publicly or commit it to version control.
          </p>
        </CardContent>
      </Card>

      {/* Code Examples */}
      <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-blue-600" />
            SDK Examples
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="python" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="java">Java</TabsTrigger>
            </TabsList>
            {Object.entries(codeExamples).map(([lang, code]) => (
              <TabsContent key={lang} value={lang}>
                <div className="relative">
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto text-sm font-mono">
                    <code>{code}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 bg-slate-800 hover:bg-slate-700 text-slate-300"
                    onClick={() => handleCopy(code)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Rate Limits & Quotas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-blue-600" />
              Rate Limits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'Requests per minute', current: 850, limit: 1000 },
              { name: 'Tokens per minute', current: 45000, limit: 60000 },
              { name: 'Concurrent requests', current: 8, limit: 10 },
            ].map((limit, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">{limit.name}</span>
                  <span className="text-sm font-medium text-slate-800">
                    {limit.current.toLocaleString()} / {limit.limit.toLocaleString()}
                  </span>
                </div>
                <Progress value={(limit.current / limit.limit) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-800">Usage Quota</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="text-sm text-slate-600">Monthly API Calls</p>
                <p className="text-2xl font-bold text-slate-800">2.4M / 5M</p>
              </div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                48% used
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="text-sm text-slate-600">Tokens Used</p>
                <p className="text-2xl font-bold text-slate-800">180M / 500M</p>
              </div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                36% used
              </Badge>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Upgrade Quota
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
