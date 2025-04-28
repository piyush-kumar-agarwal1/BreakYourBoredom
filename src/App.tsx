import { Toaster } from "./components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { IndiaModeProvider } from "@/contexts/IndiaModeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import MoviesPage from "./pages/MoviesPage";
import AnimePage from "./pages/AnimePage";
import BooksPage from "./pages/BooksPage";
import SeriesPage from "./pages/SeriesPage";
import DetailPage from "./pages/DetailPage";
import SearchPage from "./pages/SearchPage";
import VibePickPage from "./pages/VibePickPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import WatchlistPage from "./pages/WatchlistPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <AuthProvider>
            <IndiaModeProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/movies" element={<MoviesPage />} />
                <Route path="/anime" element={<AnimePage />} />
                <Route path="/books" element={<BooksPage />} />
                <Route path="/series" element={<SeriesPage />} />
                <Route path="/vibe-pick" element={<VibePickPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/detail/:type/:id" element={<DetailPage />} />
                <Route path="/search" element={<SearchPage />} />
                {/* Protected Routes - require authentication */}
                <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
                <Route path="/watchlist" element={<ProtectedRoute element={<WatchlistPage />} />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <Sonner />
            </IndiaModeProvider>
          </AuthProvider>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
