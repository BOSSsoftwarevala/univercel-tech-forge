import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const BLOCKED_ROUTES = [
  "/finance",
  "/wallet",
  "/pricing",
  "/admin",
  "/master",
  "/server",
  "/partner",
  "/super-admin",
];

export const useMarketingManagerGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Block unauthorized routes
    const isBlocked = BLOCKED_ROUTES.some(route => 
      location.pathname.toLowerCase().startsWith(route.toLowerCase())
    );

    if (isBlocked) {
      toast({
        title: "Access Denied",
        description: "Marketing Manager cannot access this area.",
        variant: "destructive",
      });
      navigate("/marketing-manager-secure", { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    // Disable clipboard operations
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      toast({
        title: "Action Blocked",
        description: "Clipboard operations are disabled for security.",
        variant: "destructive",
      });
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    // Block screenshot attempts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen" || 
          (e.metaKey && e.shiftKey && (e.key === "3" || e.key === "4" || e.key === "5")) ||
          (e.ctrlKey && e.key === "p")) {
        e.preventDefault();
        toast({
          title: "Action Blocked",
          description: "Screenshots are disabled for security.",
          variant: "destructive",
        });
      }
    };

    // Block right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("cut", handleCut);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return { isSecure: true };
};
