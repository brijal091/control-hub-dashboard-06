
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Unauthorized: React.FC = () => {
  const { user } = useAuth();
  
  // Determine where to redirect the user based on their role
  const getRedirectPath = () => {
    if (!user) return '/login';
    
    switch (user.userRole) {
      case 'superadmin':
        return '/admin/organizations';
      case 'orgadmin':
        return '/admin/users';
      case 'user':
        return '/dashboard';
      default:
        return '/login';
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-destructive/10 p-3 rounded-full">
            <ShieldAlert className="h-12 w-12 text-destructive" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You don't have permission to access this page. Please contact your administrator if you think this is a mistake.
        </p>
        <Button asChild>
          <Link to={getRedirectPath()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
