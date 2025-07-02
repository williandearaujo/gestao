// src/App.tsx

import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { useState, useEffect } from "react";
import Dashboard from "@/pages/dashboard";
import Analysts from "@/pages/analysts";
import Clients from "@/pages/clients";
import Certifications from "@/pages/certifications";
import Tasks from "@/pages/tasks";
import CalendarPage from "@/pages/calendar";
import Visits from "@/pages/visits";
import NotFound from "@/pages/not-found";
import { SimpleLogin } from "@/simple-login";
import { useSession } from "@clerk/clerk-react";

function AuthenticatedApp() {
  const { isSignedIn, isLoaded } = useSession();
  const [userReady, setUserReady] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setUserReady(true);
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando sessão...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <SimpleLogin onLogin={() => {}} />;
  }

  if (!userReady) return null;

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/analysts" component={Analysts} />
      <Route path="/clients" component={Clients} />
      <Route path="/certifications" component={Certifications} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/calendar" component={CalendarPage} />
      <Route path="/visits" component={Visits} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ol-theme">
        <TooltipProvider>
          <Toaster />
          <AuthenticatedApp />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
