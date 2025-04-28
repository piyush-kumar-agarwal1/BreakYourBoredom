import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if this is likely a direct page load/refresh
    const isDirectLoad = performance.navigation && 
                          performance.navigation.type === 1;
    
    if (isDirectLoad) {
      // Try to handle the current path
      const path = location.pathname;
      
      // Log for debugging
      console.log("Handling direct load/refresh for path:", path);
      
      // If it looks like a valid app route, navigate to it
      if (path.startsWith('/detail/') || 
          path.startsWith('/movies') || 
          path.startsWith('/series') || 
          path.startsWith('/books') || 
          path.startsWith('/anime') || 
          path.startsWith('/vibe-pick')) {
        navigate(path, { replace: true });
        return;
      }
    }
    
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Oops! Page not found</p>
        <a href="/" className="text-primary hover:text-primary/90 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;