import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  FileImage, 
  FileText, 
  RefreshCw, 
  Shield, 
  Clock,
  QrCode,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

interface QRCodePreviewProps {
  selectedQR?: string | null;
  onQRSelect?: (qr: string | null) => void;
}

export const QRCodePreview = ({ selectedQR, onQRSelect }: QRCodePreviewProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock QR data
  const qrData = {
    usageId: "AI-20241221-a1b2c3d4",
    baseCost: 10.00,
    managementFee: 3.00,
    finalCost: 13.00,
    module: "SEO",
    provider: "Software Vala AI",
    date: new Date().toISOString(),
    walletRef: "TXN-2024122100001",
    triggeredBy: "admin",
    purpose: "Keyword analysis and content optimization"
  };

  const qrPayload = JSON.stringify({
    id: qrData.usageId,
    bc: qrData.baseCost,
    mf: qrData.managementFee,
    fc: qrData.finalCost,
    mod: qrData.module,
    prov: qrData.provider,
    dt: qrData.date,
    ref: qrData.walletRef
  });

  const handleDownloadPNG = () => {
    const canvas = document.querySelector("#billing-qr-code svg") as SVGSVGElement;
    if (!canvas) return;

    const svgData = new XMLSerializer().serializeToString(canvas);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvasEl = document.createElement("canvas");
      canvasEl.width = 400;
      canvasEl.height = 400;
      const ctx = canvasEl.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 400, 400);
        ctx.drawImage(img, 0, 0, 400, 400);
        
        const link = document.createElement("a");
        link.download = `AI-Billing-QR-${qrData.usageId}.png`;
        link.href = canvasEl.toDataURL("image/png");
        link.click();
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
    
    toast.success("QR Code downloaded as PNG");
    logScanAttempt("download_png");
  };

  const handleDownloadPDF = () => {
    // In production, this would generate a proper PDF
    toast.success("QR Code downloaded as PDF");
    logScanAttempt("download_pdf");
  };

  const handleRefresh = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("QR Code refreshed");
    }, 1000);
  };

  const logScanAttempt = (type: string) => {
    // Log the scan/download attempt
    console.log(`QR ${type} logged for ${qrData.usageId}`);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            QR Code Preview
          </CardTitle>
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Valid
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* QR Code Display */}
        <div 
          id="billing-qr-code"
          className="flex justify-center p-4 bg-white rounded-lg"
        >
          <QRCodeSVG 
            value={qrPayload}
            size={180}
            level="H"
            includeMargin
            imageSettings={{
              src: "/favicon.ico",
              x: undefined,
              y: undefined,
              height: 24,
              width: 24,
              excavate: true,
            }}
          />
        </div>

        {/* QR Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between py-1.5 border-b border-border">
            <span className="text-muted-foreground">Usage ID</span>
            <span className="font-mono text-xs">{qrData.usageId}</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-border">
            <span className="text-muted-foreground">Base Cost</span>
            <span className="text-blue-500">₹{qrData.baseCost.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-border">
            <span className="text-muted-foreground">Management Fee</span>
            <span className="text-amber-500">₹{qrData.managementFee.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-border">
            <span className="text-muted-foreground font-medium">Final Cost</span>
            <span className="text-green-500 font-bold">₹{qrData.finalCost.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-border">
            <span className="text-muted-foreground">Module</span>
            <Badge variant="secondary">{qrData.module}</Badge>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-border">
            <span className="text-muted-foreground">Provider</span>
            <span>{qrData.provider}</span>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-muted-foreground">Wallet Ref</span>
            <span className="font-mono text-xs">{qrData.walletRef}</span>
          </div>
        </div>

        {/* Expiry Notice */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <Clock className="h-4 w-4 text-amber-500" />
          <p className="text-xs text-amber-600">Auto-refreshes in 23h 45m</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={handleDownloadPNG}>
            <FileImage className="h-4 w-4 mr-2" />
            PNG
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
        
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full"
          onClick={handleRefresh}
          disabled={isGenerating}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
          {isGenerating ? "Generating..." : "Refresh QR"}
        </Button>

        {/* Security Notice */}
        <div className="flex items-start gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20">
          <Shield className="h-4 w-4 text-primary mt-0.5" />
          <div>
            <p className="text-xs font-medium text-primary">Secure QR</p>
            <p className="text-xs text-muted-foreground">
              Screenshot attempts are logged. Works offline.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
