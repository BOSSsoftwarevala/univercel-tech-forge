import { useLocation } from 'react-router-dom';
import FloatingAIChatbot from './FloatingAIChatbot';

const FloatingAIChatbotWrapper = () => {
  const location = useLocation();
  
  // Determine user role based on current route
  const getUserRoleFromRoute = (): string => {
    const path = location.pathname;
    
    if (path.includes('super-admin') || path.includes('admin') || path.includes('master')) return 'boss_owner';
    if (path.includes('franchise')) return 'franchise';
    if (path.includes('reseller')) return 'reseller';
    if (path.includes('developer')) return 'developer';
    if (path.includes('influencer')) return 'influencer';
    if (path.includes('support')) return 'support';
    if (path.includes('seo')) return 'seo';
    if (path.includes('marketing')) return 'marketing';
    if (path.includes('finance')) return 'finance';
    if (path.includes('hr')) return 'hr';
    if (path.includes('legal')) return 'legal';
    if (path.includes('demo')) return 'demo_manager';
    if (path.includes('client-success')) return 'client_success';
    if (path.includes('prime')) return 'prime_user';
    if (path.includes('sales')) return 'sales_support';
    
    return 'user';
  };

  const userRole = getUserRoleFromRoute();

  // Don't show on landing pages
  const hiddenPaths = ['/', '/auth', '/franchise-program', '/reseller-program', '/apply'];
  if (hiddenPaths.some(p => location.pathname === p || location.pathname.startsWith('/onboard'))) {
    return null;
  }

  return (
    <FloatingAIChatbot 
      userRole={userRole}
      userName={`${userRole.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} User`}
      userId="mock-user-id"
    />
  );
};

export default FloatingAIChatbotWrapper;