import React from 'react';
import { Eye, EyeOff, Copy, Phone, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MaskedInfoTagProps {
  type: 'phone' | 'email' | 'name' | 'id';
  maskedValue: string;
  canReveal?: boolean;
  onReveal?: () => void;
  isDark?: boolean;
}

export function MaskedInfoTag({
  type,
  maskedValue,
  canReveal = false,
  onReveal,
  isDark = true
}: MaskedInfoTagProps) {
  const icons = {
    phone: Phone,
    email: Mail,
    name: User,
    id: User
  };

  const Icon = icons[type];

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
      isDark ? 'bg-slate-800 border border-slate-700' : 'bg-gray-100 border border-gray-200'
    }`}>
      <Icon className="h-3 w-3 text-muted-foreground" />
      <span className="font-mono">{maskedValue}</span>
      {canReveal && (
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onReveal}>
          <EyeOff className="h-3 w-3" />
        </Button>
      )}
      <Button variant="ghost" size="icon" className="h-5 w-5">
        <Copy className="h-3 w-3" />
      </Button>
    </div>
  );
}
