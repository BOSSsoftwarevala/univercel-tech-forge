import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    document.title = "404 Page Not Found | Software Vala";
  }, [location.pathname]);

  return (
    <main className="min-h-screen bg-muted flex items-center justify-center">
      <section className="text-center max-w-md px-4">
        <h1 className="mb-3 text-4xl font-bold">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">Oops! Page not found</p>
        <Button asChild>
          <Link to="/">Return to Home</Link>
        </Button>
      </section>
    </main>
  );
};

export default NotFound;
