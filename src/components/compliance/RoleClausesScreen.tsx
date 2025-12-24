import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, CheckCircle, AlertTriangle, Lock } from 'lucide-react';
import { ROLE_CLAUSES, RoleClause } from '@/types/compliance';
import { AppRole, ROLE_CONFIG } from '@/types/roles';
import { motion } from 'framer-motion';

interface RoleClausesScreenProps {
  role: AppRole;
  onAccept?: (clauseId: string, version: string) => void;
  isReadOnly?: boolean;
  hasAccepted?: boolean;
}

export const RoleClausesScreen = ({ 
  role, 
  onAccept, 
  isReadOnly = false,
  hasAccepted = false 
}: RoleClausesScreenProps) => {
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const roleClause = ROLE_CLAUSES.find(c => c.roleId === role);
  const roleConfig = ROLE_CONFIG[role];

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 50;
      if (isAtBottom) {
        setHasScrolledToEnd(true);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  if (!roleClause) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-12 h-12 mx-auto text-destructive mb-4" />
          <p className="text-destructive font-medium">No clauses defined for this role</p>
        </CardContent>
      </Card>
    );
  }

  const handleAccept = () => {
    if (onAccept && hasScrolledToEnd && isAgreed) {
      onAccept(roleClause.id, roleClause.version);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${roleConfig?.color}20` }}
              >
                <FileText className="w-5 h-5" style={{ color: roleConfig?.color }} />
              </div>
              <div>
                <CardTitle className="text-xl">{roleClause.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Version {roleClause.version} • Effective: {roleClause.effectiveDate}
                </p>
              </div>
            </div>
            {hasAccepted ? (
              <Badge className="bg-green-500/10 text-green-500 border-green-500/30">
                <CheckCircle className="w-3 h-3 mr-1" />
                Accepted
              </Badge>
            ) : (
              <Badge variant="outline" className="border-yellow-500/50 text-yellow-500">
                <Lock className="w-3 h-3 mr-1" />
                Pending Agreement
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Clauses */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Role-Specific Obligations</CardTitle>
            <Badge variant="outline" className="text-xs">
              {roleClause.clauses.length} Clauses
            </Badge>
          </div>
          {!isReadOnly && !hasAccepted && (
            <p className="text-sm text-muted-foreground mt-2">
              <AlertTriangle className="w-4 h-4 inline mr-1 text-yellow-500" />
              You must scroll to the end and agree to all clauses before proceeding
            </p>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea 
            ref={scrollRef}
            className="h-[400px] p-6"
          >
            <div className="space-y-4">
              {roleClause.clauses.map((clause, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 p-4 rounded-lg bg-muted/30 border border-border/50"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed">{clause}</p>
                  </div>
                </motion.div>
              ))}

              {/* End marker */}
              <div className="pt-6 border-t border-border/50 text-center">
                <p className="text-xs text-muted-foreground">
                  — End of Clauses —
                </p>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Agreement Section */}
      {!isReadOnly && !hasAccepted && (
        <Card className={`border-2 transition-colors ${
          hasScrolledToEnd ? 'border-primary/50 bg-primary/5' : 'border-muted bg-muted/20'
        }`}>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox 
                  id="agree" 
                  checked={isAgreed}
                  disabled={!hasScrolledToEnd}
                  onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
                  className="mt-1"
                />
                <label 
                  htmlFor="agree" 
                  className={`text-sm leading-relaxed ${!hasScrolledToEnd ? 'text-muted-foreground' : ''}`}
                >
                  I have read, understood, and agree to comply with all the clauses listed above. 
                  I understand that violation of any clause may result in penalties including but not 
                  limited to warnings, restrictions, suspension, termination, or legal action.
                </label>
              </div>

              {!hasScrolledToEnd && (
                <p className="text-xs text-yellow-500 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Please scroll through all clauses to enable agreement
                </p>
              )}

              <div className="flex justify-end gap-3">
                <Button
                  onClick={handleAccept}
                  disabled={!hasScrolledToEnd || !isAgreed}
                  className="min-w-[200px]"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept & Continue
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Read-only notice */}
      {isReadOnly && (
        <Card className="bg-muted/20 border-muted">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground text-center">
              <Lock className="w-4 h-4 inline mr-1" />
              These clauses are read-only and cannot be modified
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default RoleClausesScreen;
