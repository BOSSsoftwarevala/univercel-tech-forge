import { SessionExpiredUI } from "@/components/error/ErrorUI";

const SessionExpiredPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <SessionExpiredUI 
        customMessage="Your session needs a quick refresh to continue."
      />
    </div>
  );
};

export default SessionExpiredPage;
