import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  PlusCircle, 
  Wand2, 
  Rocket,
  Package,
  Palette,
  Globe,
  MapPin,
  CheckCircle2,
  Loader2
} from "lucide-react";

const products = ["RetailMaster Pro", "FoodServe Plus", "HotelHub Enterprise", "StockFlow Advanced", "SalonPro Suite", "GymMaster Elite"];
const themes = ["Default Blue", "Dark Pro", "Light Clean", "Gradient Modern", "Classic Corporate"];
const languages = ["English", "Arabic", "French", "Portuguese", "Swahili", "Hindi"];
const regions = ["Nigeria", "Kenya", "South Africa", "UAE", "Saudi Arabia", "India", "Egypt", "Ghana"];

export const CreateDemo = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");

  const handleCreate = () => {
    setIsCreating(true);
    setProgress(0);
    
    const steps = [
      { step: "Cloning product...", progress: 20 },
      { step: "Binding demo domain...", progress: 40 },
      { step: "Applying license...", progress: 60 },
      { step: "Testing all buttons...", progress: 80 },
      { step: "Finalizing demo...", progress: 100 },
    ];

    steps.forEach((item, index) => {
      setTimeout(() => {
        setCurrentStep(item.step);
        setProgress(item.progress);
        if (index === steps.length - 1) {
          setTimeout(() => setIsCreating(false), 1000);
        }
      }, (index + 1) * 1500);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Demo</h1>
          <p className="text-muted-foreground">AI-assisted demo creation in seconds</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-blue-400" />
              Demo Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Package className="w-4 h-4 text-violet-400" />
                Select Product
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map(product => (
                    <SelectItem key={product} value={product.toLowerCase().replace(/\s/g, '-')}>
                      {product}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Palette className="w-4 h-4 text-pink-400" />
                Select Theme
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a theme" />
                </SelectTrigger>
                <SelectContent>
                  {themes.map(theme => (
                    <SelectItem key={theme} value={theme.toLowerCase().replace(/\s/g, '-')}>
                      {theme}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                Select Language
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang} value={lang.toLowerCase()}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                Select Region
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(region => (
                    <SelectItem key={region} value={region.toLowerCase()}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleCreate}
              disabled={isCreating}
              className="w-full gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 mt-4"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Create Demo (AI)
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* AI Process */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-amber-400" />
              AI Process
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              AI will automatically perform these steps:
            </div>
            
            {[
              { step: "Clone Product", desc: "Copy all product files" },
              { step: "Bind Demo Domain", desc: "Assign unique demo URL" },
              { step: "Apply License", desc: "Generate demo license key" },
              { step: "Test All Buttons", desc: "Verify functionality" },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCreating && progress >= (index + 1) * 20
                    ? "bg-emerald-500"
                    : "bg-muted"
                }`}>
                  {isCreating && progress >= (index + 1) * 20 ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                <div>
                  <div className="font-medium text-foreground">{item.step}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
              </motion.div>
            ))}

            {isCreating && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{currentStep}</span>
                  <span className="text-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {!isCreating && progress === 100 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-4 rounded-lg bg-emerald-500/20 border border-emerald-500/30"
              >
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <Rocket className="w-5 h-5" />
                  <span className="font-medium">Demo Created Successfully!</span>
                </div>
                <div className="text-sm text-foreground">
                  Live Demo URL: <span className="text-blue-400">demo-ng-retail.example.com</span>
                </div>
                <Button size="sm" className="mt-3 gap-2">
                  Open Demo
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Demos */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Recently Created Demos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "RetailMaster - Nigeria", url: "demo-ng.retail.com", status: "active" },
              { name: "FoodServe - Kenya", url: "demo-ke.food.com", status: "active" },
              { name: "HotelHub - UAE", url: "demo-ae.hotel.com", status: "active" },
            ].map((demo, index) => (
              <motion.div
                key={demo.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-background/50 border border-border/50"
              >
                <div className="font-medium text-foreground mb-1">{demo.name}</div>
                <div className="text-xs text-blue-400 mb-2">{demo.url}</div>
                <Badge variant="outline" className="text-emerald-400 border-emerald-400/30">
                  {demo.status}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
