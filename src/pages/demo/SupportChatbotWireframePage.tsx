/**
 * Support Chatbot Wireframe Page
 */
import React from 'react';
import { SupportChatbotWireframe } from '@/components/support-chatbot-wireframe';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';

const SupportChatbotWireframePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <TooltipProvider>
      <SupportChatbotWireframe onBack={() => navigate(-1)} />
    </TooltipProvider>
  );
};

export default SupportChatbotWireframePage;
