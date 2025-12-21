import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Badge } from "@/components/ui/badge";

const realtimeData = [
  { time: "00:00", seo: 12, chatbot: 18, devAssist: 8, ocr: 5, imageGen: 3 },
  { time: "02:00", seo: 8, chatbot: 12, devAssist: 5, ocr: 3, imageGen: 2 },
  { time: "04:00", seo: 5, chatbot: 8, devAssist: 3, ocr: 2, imageGen: 1 },
  { time: "06:00", seo: 15, chatbot: 22, devAssist: 10, ocr: 6, imageGen: 4 },
  { time: "08:00", seo: 35, chatbot: 45, devAssist: 25, ocr: 15, imageGen: 8 },
  { time: "10:00", seo: 52, chatbot: 65, devAssist: 38, ocr: 22, imageGen: 12 },
  { time: "12:00", seo: 48, chatbot: 58, devAssist: 32, ocr: 18, imageGen: 10 },
  { time: "14:00", seo: 55, chatbot: 72, devAssist: 42, ocr: 25, imageGen: 15 },
  { time: "16:00", seo: 62, chatbot: 78, devAssist: 45, ocr: 28, imageGen: 18 },
  { time: "18:00", seo: 45, chatbot: 55, devAssist: 30, ocr: 18, imageGen: 12 },
  { time: "20:00", seo: 32, chatbot: 42, devAssist: 22, ocr: 12, imageGen: 8 },
  { time: "22:00", seo: 22, chatbot: 28, devAssist: 15, ocr: 8, imageGen: 5 },
];

const modules = [
  { key: "seo", name: "SEO", color: "#3b82f6" },
  { key: "chatbot", name: "Chatbot", color: "#22c55e" },
  { key: "devAssist", name: "Dev Assist", color: "#a855f7" },
  { key: "ocr", name: "OCR", color: "#f59e0b" },
  { key: "imageGen", name: "Image Gen", color: "#ec4899" },
];

export const AIUsageChart = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Real-time AI Usage (Requests/Hour)</h3>
        <div className="flex items-center gap-2">
          {modules.map((module) => (
            <Badge 
              key={module.key} 
              variant="outline" 
              className="text-xs"
              style={{ borderColor: module.color, color: module.color }}
            >
              {module.name}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={realtimeData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <defs>
              {modules.map((module) => (
                <linearGradient key={module.key} id={`gradient-${module.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={module.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={module.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={10}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px"
              }}
            />
            {modules.map((module) => (
              <Area
                key={module.key}
                type="monotone"
                dataKey={module.key}
                stroke={module.color}
                fill={`url(#gradient-${module.key})`}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
