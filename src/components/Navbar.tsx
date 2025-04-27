import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, Search, Film, Tv, BookOpen, Sparkles, 
  LogOut, User, Heart, Settings, X, MonitorPlay, 
  ChevronDown, ArrowRight, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import IndiaModeToggle from '@/components/IndiaModeToggle';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Navbar = ({ initialSearchTerm = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  // Collapse search on route change
  useEffect(() => {
    setIsSearchExpanded(false);
  }, [location.pathname]);

  // Animation variants
  const navLinkVariants = {
    hover: {
      y: -2,
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  const searchVariants = {
    collapsed: { width: "44px", borderRadius: "50%" },
    expanded: { width: "300px", borderRadius: "9999px" }
  };

  const userMenu = user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button 
          className="flex items-center gap-2 bg-background/80 backdrop-blur p-1.5 pl-3 rounded-full border border-border/20 hover:shadow-md transition-shadow"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Avatar className="h-8 w-8 ring-2 ring-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium pr-1.5">{user.name.split(' ')[0]}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-1.5 backdrop-blur-lg bg-background/95">
        <div className="flex items-center px-2.5 py-2 mb-1 border-b">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>
        
        <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer p-2.5 hover:bg-primary/5">
          <Link to="/profile">
            <User size={16} className="text-primary" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer p-2.5 hover:bg-primary/5">
          <Link to="/watchlist">
            <Heart size={16} className="text-pink-500" />
            <span>Watchlist</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer p-2.5 hover:bg-primary/5">
          <Link to="/watched">
            <Star size={16} className="text-amber-500" />
            <span>Watched</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="flex items-center gap-2 cursor-pointer p-2.5 text-red-500 hover:bg-red-500/10 hover:text-red-600" 
          onClick={logout}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link to="/login">
        <Button variant="gradient" size="sm" className="flex items-center gap-2 px-4 font-medium shadow-sm">
          <User size={16} />
          <span>Login</span>
        </Button>
      </Link>
    </motion.div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link to="/" className="flex items-center gap-2">
            <AnimatePresence mode="wait" initial={false}>
              {isSearchExpanded ? (
                <motion.span 
                  key="short-logo"
                  className="text-xl font-bold heading-gradient"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  BYB
                </motion.span>
              ) : (
                <motion.span 
                  key="full-logo"
                  className="text-xl font-bold heading-gradient"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  Break Your Boredom
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-5">
          <motion.div 
            variants={navLinkVariants}
            whileHover="hover"
          >
            <Link to="/movies" className="flex items-center gap-1.5 text-foreground/80 hover:text-primary transition-colors px-2 py-1">
              <Film size={18} />
              <span>Movies</span>
            </Link>
          </motion.div>
          
          <motion.div 
            variants={navLinkVariants}
            whileHover="hover"
          >
            <Link to="/anime" className="flex items-center gap-1.5 text-foreground/80 hover:text-primary transition-colors px-2 py-1">
              <Tv size={18} />
              <span>Anime</span>
            </Link>
          </motion.div>
          
          <motion.div 
            variants={navLinkVariants}
            whileHover="hover"
          >
            <Link to="/books" className="flex items-center gap-1.5 text-foreground/80 hover:text-primary transition-colors px-2 py-1">
              <BookOpen size={18} />
              <span>Books</span>
            </Link>
          </motion.div>
          
          <motion.div 
            variants={navLinkVariants}
            whileHover="hover"
          >
            <Link to="/series" className="flex items-center gap-1.5 text-foreground/80 hover:text-primary transition-colors px-2 py-1">
              <MonitorPlay size={18} />
              <span>Web Series</span>
            </Link>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/vibe-pick" className="relative flex items-center gap-1.5 text-primary font-medium hover:text-primary transition-colors group px-3 py-1.5 rounded-md overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-primary/10 rounded-md -z-10"
                animate={{ 
                  boxShadow: ["0 0 0px rgba(124, 58, 237, 0.4)", "0 0 15px rgba(124, 58, 237, 0.4)", "0 0 0px rgba(124, 58, 237, 0.4)"]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2 
                }}
              />
              <Sparkles size={18} className="text-primary animate-pulse" />
              <span>Vibe Pick</span>
            </Link>
          </motion.div>
        </div>

        {/* Search, India Mode Toggle, and User Menu for desktop */}
        <div className="hidden md:flex items-center gap-4">
          {/* Enhanced Magic Search */}
          <motion.div
            className="relative"
            initial={false}
            animate={isSearchExpanded ? "expanded" : "collapsed"}
            variants={searchVariants}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <form
              className="flex items-center relative w-full"
              onSubmit={(e) => {
                e.preventDefault();
                if (searchTerm.trim()) {
                  navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
                  setIsSearchExpanded(false);
                }
              }}
            >
              {isSearchExpanded ? (
                <motion.div 
                  className="absolute inset-0 bg-black/5 dark:bg-white/5 rounded-full -z-10 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              ) : null}
              
              <motion.button
                type={isSearchExpanded ? "submit" : "button"}
                className={`${isSearchExpanded ? 'pl-4 pr-2' : 'w-10 h-10'} flex items-center justify-center rounded-full transition-all ${isSearchExpanded ? 'bg-transparent' : 'bg-primary/10 hover:bg-primary/20'} text-primary`}
                onClick={() => !isSearchExpanded && setIsSearchExpanded(true)}
                whileHover={{ scale: isSearchExpanded ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="h-[18px] w-[18px]" />
              </motion.button>
              
              {isSearchExpanded && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "240px", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <Input
                    type="text"
                    placeholder="Search movies, anime, books..."
                    className="border-none shadow-none bg-transparent pl-1 pr-8 py-2 h-10 focus-visible:ring-0"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                </motion.div>
              )}
              
              {isSearchExpanded && (
                <motion.button
                  type="button"
                  className="absolute right-3 h-5 w-5 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-full transition-colors"
                  onClick={() => {
                    setIsSearchExpanded(false);
                    setSearchTerm('');
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                >
                  <X className="h-3.5 w-3.5" />
                </motion.button>
              )}
            </form>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IndiaModeToggle />
          </motion.div>
          
          {userMenu}
        </div>
        
        {/* Mobile menu button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(true)}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        
        {/* Mobile menu - keeping your existing implementation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="fixed inset-0 z-[9999] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Semi-transparent overlay */}
              <motion.div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
                onClick={() => setIsMenuOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              
              {/* Sidebar */}
              <motion.div 
                className="fixed top-0 right-0 h-[100dvh] w-[80%] max-w-xs bg-background shadow-2xl flex flex-col overflow-hidden"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                {/* Your existing mobile menu code */}
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b">
                  <Link to="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                    <span className="text-lg font-bold heading-gradient">Break Your Boredom</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Your existing scrollable content */}
                <div className="flex-1 overflow-y-auto py-2">
                  {/* Search form */}
                  <div className="px-4 py-3 mb-2">
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (searchTerm.trim()) {
                          navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
                          setIsMenuOpen(false);
                        }
                      }}
                    >
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Search movies, anime, books..."
                          className="w-full pl-9 pr-4"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </form>
                  </div>
                  
                  {/* Region Settings */}
                  <div className="px-4 py-2 mb-3 border-b">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Region</span>
                      <IndiaModeToggle />
                    </div>
                  </div>
                  
                  {/* Main navigation */}
                  <div className="px-3 mb-4">
                    <div className="px-2 mb-2 text-sm font-semibold text-muted-foreground">Browse Content</div>
                    <nav className="flex flex-col gap-1">
                      <Link 
                        to="/movies" 
                        className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-muted" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Film className="h-5 w-5" />
                        <span>Movies</span>
                      </Link>
                      <Link 
                        to="/anime" 
                        className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-muted" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Tv className="h-5 w-5" />
                        <span>Anime</span>
                      </Link>
                      <Link 
                        to="/books" 
                        className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-muted" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <BookOpen className="h-5 w-5" />
                        <span>Books</span>
                      </Link>
                      <Link 
                        to="/series" 
                        className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-muted" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <MonitorPlay className="h-5 w-5" />
                        <span>Web Series</span>
                      </Link>
                      <Link 
                        to="/vibe-pick" 
                        className="flex items-center gap-3 px-3 py-3 rounded-md bg-primary/10 text-primary" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Sparkles className="h-5 w-5" />
                        <span className="font-medium">Vibe Pick</span>
                      </Link>
                    </nav>
                  </div>
                  
                  {/* User section */}
                  <div className="px-3 pt-2 border-t">
                    <div className="px-2 mb-2 text-sm font-semibold text-muted-foreground">Account</div>
                    {user ? (
                      <div className="flex flex-col gap-1">
                        <Link 
                          to="/profile" 
                          className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-muted" 
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <User className="h-5 w-5" />
                          <span>Profile</span>
                        </Link>
                        <Link 
                          to="/watchlist" 
                          className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-muted" 
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Heart className="h-5 w-5" />
                          <span>Watchlist</span>
                        </Link>
                        <Link 
                          to="/watched" 
                          className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-muted" 
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Star className="h-5 w-5" />
                          <span>Watched</span>
                        </Link>
                        <Link 
                          to="/settings" 
                          className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-muted" 
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Settings className="h-5 w-5" />
                          <span>Settings</span>
                        </Link>
                        <button 
                          className="flex items-center gap-3 px-3 py-3 mt-1 rounded-md text-red-500 hover:bg-red-500/10 text-left w-full" 
                          onClick={() => {
                            logout();
                            setIsMenuOpen(false);
                            navigate('/');
                          }}
                        >
                          <LogOut className="h-5 w-5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    ) : (
                      <Button 
                        variant="default" 
                        className="w-full mt-1" 
                        onClick={() => {
                          setIsMenuOpen(false);
                          navigate('/login');
                        }}
                      >
                        Sign In
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;