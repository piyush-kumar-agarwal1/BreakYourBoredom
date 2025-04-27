import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Film, Tv, BookOpen, MonitorPlay, Github, Twitter, 
  Mail, User, Sparkles, ChevronRight, Heart, 
  Star, Settings, LogOut, Info, FileText, 
  MessageSquare, HelpCircle
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from '@/contexts/AuthContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { user } = useAuth(); // Access the authentication context
  
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-border/30">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background to-background/80 pointer-events-none" />
      
      {/* Top curved border decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-primary/5 to-transparent" />
      
      <div className="container relative z-10 py-12">
        {/* Main footer content - 4 columns layout */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="space-y-6">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 transition-transform hover:scale-105"
            >
              <div className="rounded-lg bg-primary/10 p-2">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold heading-gradient tracking-tight">
                Break Your Boredom
              </span>
            </Link>
            
            <p className="text-sm text-muted-foreground max-w-xs">
              Discover your next favorite entertainment across movies, series, 
              anime, and books with personalized recommendations.
            </p>
            
            <div className="flex gap-4">
              <a 
                href="#" 
                className="rounded-full bg-primary/10 p-2 hover:bg-primary/20 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5 text-primary" />
              </a>
              <a 
                href="#" 
                className="rounded-full bg-primary/10 p-2 hover:bg-primary/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 text-primary" />
              </a>
              <a 
                href="#" 
                className="rounded-full bg-primary/10 p-2 hover:bg-primary/20 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5 text-primary" />
              </a>
            </div>
          </div>
          
          {/* Explore links column */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Explore</h3>
            <ul className="grid grid-cols-1 gap-2">
              <FooterLink to="/movies" icon={<Film className="h-4 w-4" />}>Movies</FooterLink>
              <FooterLink to="/series" icon={<MonitorPlay className="h-4 w-4" />}>Web Series</FooterLink>
              <FooterLink to="/anime" icon={<Tv className="h-4 w-4" />}>Anime</FooterLink>
              <FooterLink to="/books" icon={<BookOpen className="h-4 w-4" />}>Books</FooterLink>
              <FooterLink to="/vibe-pick" icon={<Sparkles className="h-4 w-4" />}>Vibe Pick</FooterLink>
            </ul>
          </div>
          
          {/* Information section - now in its own column */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Information</h3>
            <ul className="grid grid-cols-1 gap-2">
              <FooterLink to="/about" icon={<Info className="h-4 w-4" />}>About Us</FooterLink>
              <FooterLink to="/privacy" icon={<FileText className="h-4 w-4" />}>Privacy Policy</FooterLink>
              <FooterLink to="/terms" icon={<FileText className="h-4 w-4" />}>Terms of Service</FooterLink>
              <FooterLink to="/contact" icon={<MessageSquare className="h-4 w-4" />}>Contact</FooterLink>
            </ul>
          </div>
          
          {/* Account/links column */}
          <div className="space-y-6">
            {user ? (
              // Logged in state - show profile links instead of sign in
              <div>
                <h3 className="text-lg font-semibold">Your Account</h3>
                <ul className="mt-4 space-y-2">
                  <FooterLink to="/profile" icon={<User className="h-4 w-4" />}>Profile</FooterLink>
                  <FooterLink to="/watchlist" icon={<Star className="h-4 w-4" />}>Watchlist</FooterLink>
                  <FooterLink to="/watched" icon={<ChevronRight className="h-4 w-4" />}>Watched</FooterLink>
                  <FooterLink to="/settings" icon={<Settings className="h-4 w-4" />}>Settings</FooterLink>
                </ul>
              </div>
            ) : (
              // Logged out state - show sign in CTA
              <div>
                <h3 className="text-lg font-semibold">Your Account</h3>
                <div className="mt-4 rounded-xl border border-border/50 bg-card p-4 shadow-lg">
                  <p className="mb-4 text-sm">
                    Create an account to save your favorites and get personalized recommendations.
                  </p>
                  <Link 
                    to="/login"
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "w-full justify-between group"
                    )}
                  >
                    <span>Sign In</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Copyright bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/30 pt-6 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Break Your Boredom. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-destructive fill-destructive animate-pulse" />
            <span>for entertainment enthusiasts</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Helper components for consistent styling
const FooterLink = ({ to, children, icon }) => (
  <li>
    <Link 
      to={to} 
      className="group flex w-fit items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
    >
      <span className="text-primary/70 transition-colors group-hover:text-primary">
        {icon}
      </span>
      <span>{children}</span>
    </Link>
  </li>
);

export default Footer;