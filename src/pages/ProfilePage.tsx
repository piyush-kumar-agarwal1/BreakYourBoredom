import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail } from 'lucide-react';

const ProfilePage = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return null; // Should be handled by ProtectedRoute
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-8 pb-16">
        <div className="container max-w-3xl">
          <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
          
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Account Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User size={18} className="text-muted-foreground" />
                      <span>{user.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={18} className="text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button variant="destructive" onClick={logout}>
                    Logout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;