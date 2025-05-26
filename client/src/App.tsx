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

import { createConfig, WagmiProvider, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { walletConnect } from '@wagmi/connectors';
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

// Create wagmi config
const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    walletConnect({
      projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '37b5e2fccd46c838885f41186745251e',
      metadata: {
        name: 'YouBuidl',
        description: 'Public Goods Platform',
        url: window.location.origin,
        icons: ['https://youbuidl.vercel.app/logo.png']
      },
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

function App() {
  const { 
    fetchProjects, 
    setCategory, 
    setSearchQuery, 
    activeCategory 
  } = useProjectsStore();
  const [location] = useLocation();
  
  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const isAdminRoute = location.startsWith('/admin');
  
  return (
    <Router>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <TooltipProvider>
              <AuthProvider>
                <div className="flex flex-col min-h-screen bg-darkBg">
                  {/* Only show main header on non-admin routes */}
                  {!isAdminRoute && <Header onCategoryChange={setCategory} onSearchQuery={setSearchQuery} />}
                  <main className="flex-grow container mx-auto px-4 py-8 pb-20 md:pb-8">
                    <Switch>
                      <Route path="/" component={Home} />
                      <Route path="/projects/:id" component={ProjectDetails} />
                      <Route path="/submit" component={Submit} />
                      <Route path="/profile/:address?" component={Profile} />
                      <Route path="/names" component={Names} />
                      <Route path="/leaderboard" component={Leaderboard} />
                      <Route path="/learn" component={LearnDocs} />
                      <Route path="/admin/login" component={AdminLogin} />
                      <Route path="/admin" component={() => (
                        <ProtectedRoute>
                          <AdminDashboard />
                        </ProtectedRoute>
                      )} />
                      <Route component={NotFound} />
                    </Switch>
                  </main>
                  {/* Only show footer on non-admin routes */}
                  {!isAdminRoute && <Footer />}
                </div>
              </AuthProvider>
            </TooltipProvider>
            <Toaster />
          </ThemeProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </Router>
  );
}

export default App;
