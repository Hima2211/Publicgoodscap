import { Switch, Route, Router, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ProjectDetails from "@/pages/project-details";
import Submit from "@/pages/submit";
import Profile from "@/pages/profile";
import Names from "@/pages/names";
import Leaderboard from "@/pages/leaderboard";
import LearnDocs from "@/pages/learn";
import { ThemeProvider } from "next-themes";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useProjectsStore } from "@/store/projects-store";
import { useEffect } from "react";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminLogin from "@/pages/admin/login";
import { AuthProvider } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/protected-route";

// Wagmi imports
import { createConfig, WagmiConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { walletConnect } from '@wagmi/connectors';

const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    walletConnect({
      projectId: '37b5e2fccd46c838885f41186745251e',
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

function App() {
  const { fetchProjects, setCategory, setSearchQuery, activeCategory } = useProjectsStore();
  const [location] = useLocation();
  
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const isAdminRoute = location.startsWith('/admin');
  
  return (
    <Router>
      <WagmiConfig config={config}>
        <AuthProvider>
          <ThemeProvider defaultTheme="dark">
            <TooltipProvider>
              <div className="flex min-h-screen flex-col">
                {/* Only show main header on non-admin routes */}
                {!isAdminRoute && <Header onCategoryChange={setCategory} onSearchQuery={setSearchQuery} />}
                <div className="flex-1">
                  <Switch>
                    <Route path="/" component={Home} />
                    <Route path="/project/:id" component={ProjectDetails} />
                    <Route path="/submit" component={Submit} />
                    <Route path="/profile" component={Profile} />
                    <Route path="/leaderboard" component={Leaderboard} />
                    <Route path="/names" component={Names} />
                    <Route path="/learn" component={LearnDocs} />
                    <Route path="/admin/login" component={AdminLogin} />
                    <Route path="/admin">
                      {() => (
                        <ProtectedRoute>
                          <AdminDashboard />
                        </ProtectedRoute>
                      )}
                    </Route>
                    <Route path="/admin/dashboard">
                      {() => (
                        <ProtectedRoute>
                          <AdminDashboard />
                        </ProtectedRoute>
                      )}
                    </Route>
                    <Route component={NotFound} />
                  </Switch>
                </div>
                {/* Only show footer on non-admin routes */}
                {!isAdminRoute && <Footer />}
              </div>
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </WagmiConfig>
    </Router>
  );
}

export default App;
