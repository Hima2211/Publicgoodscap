import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ProjectDetails from "@/pages/project-details";
import Submit from "@/pages/submit";
import { ThemeProvider } from "next-themes";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useProjectsStore } from "@/store/projects-store";
import { useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/projects/:id" component={ProjectDetails} />
      <Route path="/submit" component={Submit} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { 
    fetchProjects, 
    setCategory, 
    setSearchQuery, 
    activeCategory 
  } = useProjectsStore();

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen bg-darkBg">
          <Header 
            onCategoryChange={setCategory} 
            onSearchQuery={setSearchQuery} 
          />
          <div className="flex-grow">
            <Router />
          </div>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
