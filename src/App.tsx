import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import AboutUs from "./pages/AboutUs";
import BookVisit from "./pages/BookVisit";
import ROTInfo from "./pages/ROTInfo";
import Referenser from "./pages/Referenser";
import NotFound from "./pages/NotFound";
import StickyCtaBar from "./components/StickyCtaBar";

const queryClient = new QueryClient();

const App = () => {
  console.log("App component is loading...");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tjanster" element={<Services />} />
            <Route path="/tjanster/:slug" element={<ServiceDetail />} />
            <Route path="/kontakt" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/om-oss" element={<AboutUs />} />
            <Route path="/boka-hembesok" element={<BookVisit />} />
            <Route path="/rot-info" element={<ROTInfo />} />
            <Route path="/referenser" element={<Referenser />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <StickyCtaBar />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
