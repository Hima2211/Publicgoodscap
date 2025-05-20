import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export function AdminHeader() {
  const { isAdmin, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleSignOut = () => {
    logout();
    setLocation("/admin/login");
  };

  return (
    <header className="border-b border-darkBorder bg-darkCard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          {isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-darkText hover:text-accent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
