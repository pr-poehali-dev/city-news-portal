import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useEffect } from "react";
import { clearCacheIfNeeded } from "@/utils/cache-manager";

import Index from "./pages/Index";
import Admin from "./pages/Admin";
import NewsPage from "./pages/NewsPage";
import MemoryPage from "./pages/MemoryPage";
import AllMemories from "./pages/AllMemories";
import Places from "./pages/Places";
import PlacesMap from "./pages/PlacesMap";
import About from "./pages/About";
import Contacts from "./pages/Contacts";
import YouthNotes from "./pages/YouthNotes";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App = () => {
  useTheme();
  
  useEffect(() => {
    clearCacheIfNeeded();
  }, []);
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/news/:id" element={<NewsPage />} />
              <Route path="/memory/:id" element={<MemoryPage />} />
              <Route path="/memory" element={<AllMemories />} />
              <Route path="/places" element={<Places />} />
              <Route path="/places/map" element={<PlacesMap />} />
              <Route path="/about" element={<About />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/youth-notes" element={<YouthNotes />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;