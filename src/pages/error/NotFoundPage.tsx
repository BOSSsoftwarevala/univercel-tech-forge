import { PageNotFoundUI } from "@/components/error/ErrorUI";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <PageNotFoundUI 
        customMessage="Redirecting you to the correct workspace..."
      />
    </div>
  );
};

export default NotFoundPage;
