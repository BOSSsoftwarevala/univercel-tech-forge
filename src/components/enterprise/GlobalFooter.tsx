import { Shield, Lock, FileCheck } from "lucide-react";
import { Link } from "react-router-dom";

export function GlobalFooter() {
  return (
    <footer className="bg-[hsl(var(--sv-navy-deep))] border-t border-[hsl(var(--sv-navy-light))] py-4 px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left - Contact */}
        <div className="text-sm text-[hsl(var(--sv-gray))]">
          <span>Support: </span>
          <a href="mailto:support@softwarevala.com" className="text-[hsl(var(--sv-blue-bright))] hover:underline">
            su****@softwarevala.com
          </a>
        </div>

        {/* Center - Links */}
        <div className="flex items-center gap-6 text-sm">
          <Link to="/terms" className="text-[hsl(var(--sv-gray))] hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link to="/privacy" className="text-[hsl(var(--sv-gray))] hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link to="/compliance" className="text-[hsl(var(--sv-gray))] hover:text-white transition-colors">
            Compliance
          </Link>
        </div>

        {/* Right - Compliance Badges */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-[hsl(var(--sv-navy))] border border-[hsl(var(--sv-navy-light))]">
            <Shield className="w-3 h-3 text-[hsl(var(--sv-success))]" />
            <span className="text-xs text-[hsl(var(--sv-gray))]">ISO 27001</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-[hsl(var(--sv-navy))] border border-[hsl(var(--sv-navy-light))]">
            <Lock className="w-3 h-3 text-[hsl(var(--sv-success))]" />
            <span className="text-xs text-[hsl(var(--sv-gray))]">GDPR</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-[hsl(var(--sv-navy))] border border-[hsl(var(--sv-navy-light))]">
            <FileCheck className="w-3 h-3 text-[hsl(var(--sv-success))]" />
            <span className="text-xs text-[hsl(var(--sv-gray))]">SOC 2</span>
          </div>
        </div>
      </div>
      
      <div className="mt-3 text-center text-xs text-[hsl(var(--sv-gray))]">
        © {new Date().getFullYear()} Software Vala. All rights reserved.
      </div>
    </footer>
  );
}
