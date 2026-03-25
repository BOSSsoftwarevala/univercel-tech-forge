/**
 * CHAT RULES
 * System rules and policies
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ShieldCheck, AlertTriangle, Lock } from 'lucide-react';

const rules = [
  {
    category: 'Communication',
    icon: BookOpen,
    items: [
      'NO chat delete',
      'NO chat edit',
      'NO copy / paste',
      'NO forward / share',
      'NO screenshot',
      'NO screen recording',
    ]
  },
  {
    category: 'Privacy',
    icon: Lock,
    items: [
      'NO email / mobile visible',
      'NO banking info allowed',
      'NO file download allowed',
      'Internal User ID ONLY',
      'Name masked',
      'Mobile masked',
      'Email masked',
    ]
  },
  {
    category: 'Security',
    icon: ShieldCheck,
    items: [
      'Auto blur sensitive text',
      'Block number patterns',
      'Block email patterns',
      'Block bank keywords',
      'Session auto timeout',
      'IP + Device binding',
    ]
  },
  {
    category: 'Restrictions',
    icon: AlertTriangle,
    items: [
      'Chat only after approval',
      'One inquiry = one chat',
      'No background chat',
      'No invisible access',
      'No video call',
      'No screen share',
      'No external links',
    ]
  },
];

export const ICBChatRules: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Chat Rules</h1>
        <p className="text-muted-foreground">System policies and restrictions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((rule) => (
          <Card key={rule.category}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <rule.icon className="h-5 w-5 text-primary" />
                {rule.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {rule.items.map((item, idx) => (
                  <li key={idx} className="text-sm flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ICBChatRules;
