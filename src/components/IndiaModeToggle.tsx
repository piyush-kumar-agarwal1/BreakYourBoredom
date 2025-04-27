
import React from 'react';
import { useIndiaMode } from '@/contexts/IndiaModeContext';
import { Switch } from '@/components/ui/switch';
import { Globe, Flag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const IndiaModeToggle = () => {
  const { indiaMode, toggleIndiaMode } = useIndiaMode();
  const { toast } = useToast();

  const handleToggle = () => {
    toggleIndiaMode();
    toast({
      title: indiaMode ? "Global Mode Activated" : "India Mode Activated",
      description: indiaMode 
        ? "Showing content from around the world" 
        : "Showing Indian movies, books, and shows",
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Globe size={18} className={!indiaMode ? "text-primary" : "text-muted-foreground"} />
      <Switch 
        checked={indiaMode} 
        onCheckedChange={handleToggle}
        aria-label="Toggle India Mode"
      />
      <Flag size={18} className={indiaMode ? "text-primary" : "text-muted-foreground"} />
      <span className="hidden md:inline text-sm">
        {indiaMode ? "India Mode" : "Global Mode"}
      </span>
    </div>
  );
};

export default IndiaModeToggle;
