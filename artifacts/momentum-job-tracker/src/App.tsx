import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch } from 'wouter';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AppShell } from './components/AppShell';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import InsightsPage from './pages/InsightsPage';
import AlertsPage from './pages/AlertsPage';
import SettingsPage from './pages/SettingsPage';
import CareerIntelligencePage from './pages/CareerIntelligencePage';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function Router() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-[14px] font-medium text-muted-foreground">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Loading Momentum...
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }
  return (
    <ErrorBoundary>
      <AppShell>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/career-intelligence" component={CareerIntelligencePage} />
          <Route path="/search" component={SearchPage} />
          <Route path="/insights" component={InsightsPage} />
          <Route path="/alerts" component={AlertsPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route component={NotFound} />
        </Switch>
      </AppShell>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;