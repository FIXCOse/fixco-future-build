import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import AboutUs from "./pages/AboutUs";
import BookVisit from "./pages/BookVisit";
import ROTInfo from "./pages/ROTInfo";
import RUT from "./pages/RUT";
import Referenser from "./pages/Referenser";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import AuthError from "./pages/AuthError";
import Dashboard from "./pages/Dashboard";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import StickyCtaBar from "./components/StickyCtaBar";
import ScrollToTop from "./components/ScrollToTop";
import StickyCTA from "./components/StickyCTA";
import AIChat from "./components/AIChat";
import SecurityWrapper from "./components/SecurityWrapper";
import MyFixcoLayout from "./components/MyFixcoLayout";
import DashboardOverview from "./pages/MyFixco/DashboardOverview";
import PropertiesPage from "./pages/MyFixco/PropertiesPage";
import InvoicesPage from "./pages/MyFixco/InvoicesPage";
import RotRutPage from "./pages/MyFixco/RotRutPage";
import ActivityPage from "./pages/MyFixco/ActivityPage";
import HistoryPage from "./pages/MyFixco/HistoryPage";

const queryClient = new QueryClient();

const App = () => {
  console.log("App component is loading...");
  
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <SecurityWrapper>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/auth/error" element={<AuthError />} />
                
                {/* MyFixco Dashboard with nested routes */}
                <Route path="/mitt-fixco" element={<MyFixcoLayout />}>
                  <Route index element={<DashboardOverview />} />
                  <Route path="properties" element={<PropertiesPage />} />
                  <Route path="invoices" element={<InvoicesPage />} />
                  <Route path="rot-rut" element={<RotRutPage />} />
                  <Route path="activity" element={<ActivityPage />} />
                  <Route path="history" element={<HistoryPage />} />
                </Route>
                
                <Route path="/tjanster" element={<Services />} />
                <Route path="/tjanster/:slug" element={<ServiceDetail />} />
                <Route path="/kontakt" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/om-oss" element={<AboutUs />} />
                <Route path="/boka-hembesok" element={<BookVisit />} />
                <Route path="/rot-info" element={<ROTInfo />} />
                <Route path="/rut" element={<RUT />} />
                <Route path="/referenser" element={<Referenser />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <StickyCtaBar />
              <StickyCTA />
              <AIChat />
            </BrowserRouter>
          </TooltipProvider>
        </SecurityWrapper>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
