import React, { lazy, useEffect } from 'react';
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
import AIAssistant from "./pages/AIAssistant";
import StickyCtaBar from "./components/StickyCtaBar";
import ScrollToTop from "./components/ScrollToTop";
import StickyCTA from "./components/StickyCTA";
import AIChat from "./components/AIChat";
import SecurityWrapper from "./components/SecurityWrapper";
import { ModalHost } from "./components/ActionWizard";
import MyFixcoLayout from "./components/MyFixcoLayout";
import DashboardOverview from "./pages/MyFixco/DashboardOverview";
import PropertiesPage from "./pages/MyFixco/PropertiesPage";
import InvoicesPage from "./pages/MyFixco/InvoicesPage";
import RotRutPage from "./pages/MyFixco/RotRutPage";
import ActivityPage from "./pages/MyFixco/ActivityPage";
import HistoryPage from "./pages/MyFixco/HistoryPage";
import AccountSettings from "./pages/MyFixco/AccountSettings";
import StaffManagement from "./pages/MyFixco/StaffManagement";
import AdminRoute from "./components/AdminRoute";
import AdminLayoutNew from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import WorkerLayout from "./components/worker/WorkerLayout";
import WorkerDashboard from "./pages/worker/WorkerDashboard";
import JobPool from "./pages/worker/JobPool";
import MyJobs from "./pages/worker/MyJobs";
import JobDetail from "./pages/worker/JobDetail";
import WorkerTimesheet from "./pages/worker/WorkerTimesheet";
import WorkerSettings from "./pages/worker/WorkerSettings";
import QuoteWizard from "./pages/admin/QuoteWizard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDatabase from "./pages/admin/AdminDatabase";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminSecurity from "./pages/admin/AdminSecurity";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminInvoices from "./pages/admin/AdminInvoices";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminBookingDetail from "./pages/admin/AdminBookingDetail";
import AdminOngoingProjects from "./pages/admin/AdminOngoingProjects";
import BookingWizard from "./pages/BookingWizard";
import QuoteRequestWizard from "./pages/QuoteRequestWizard";
import AdminQuoteRequests from "./pages/admin/AdminQuoteRequests";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminQuotes from "./pages/admin/AdminQuotes";
import AdminQuoteDetail from "./pages/admin/AdminQuoteDetail";
import TestBooking from "./pages/TestBooking";
import { SmartHome } from "./pages/SmartHome";
import { Neighborhood } from "./pages/Neighborhood"; 
import { Leaderboard } from "./pages/Leaderboard";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminJobRequests from "./pages/admin/AdminJobRequests";

const queryClient = new QueryClient();

const App = () => {
  console.log("App component is loading...");
  
  // Global event delegation for wizard buttons as fallback
  useEffect(() => {
    const handleWizardClick = (e: any) => {
      const el = (e.target as HTMLElement).closest("[data-wizard]");
      if (!el) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      const mode = el.getAttribute("data-wizard") as "book" | "quote";
      const serviceId = el.getAttribute("data-service-id") || undefined;
      const serviceName = el.getAttribute("data-service-name") || undefined;
      
      console.log("[Event Delegation] Opening wizard via delegation:", { mode, serviceId, serviceName });
      
      // @ts-ignore
      if (window.__WIZ) {
        // @ts-ignore
        window.__WIZ.getState().open({ mode, serviceId, serviceName });
      }
    };
    
    document.addEventListener("click", handleWizardClick, true); // capture phase
    return () => document.removeEventListener("click", handleWizardClick, true);
  }, []);
  
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
                  
                  <Route path="/mitt-fixco" element={<MyFixcoLayout />}>
                    <Route index element={<DashboardOverview />} />
                    <Route path="properties" element={<PropertiesPage />} />
                    <Route path="invoices" element={<InvoicesPage />} />
                    <Route path="history" element={<HistoryPage />} />
                    <Route path="activity" element={<ActivityPage />} />
                    <Route path="rot-rut" element={<RotRutPage />} />
                    <Route path="settings" element={<AccountSettings />} />
                    <Route path="staff" element={<StaffManagement />} />
                  </Route>

                  {/* New Admin Routes */}
                  <Route path="/admin" element={<AdminRoute><AdminLayoutNew /></AdminRoute>}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="quotes" element={<AdminQuotes />} />
                    <Route path="quotes/:id" element={<AdminQuoteDetail />} />
                    <Route path="quote-requests" element={<AdminQuoteRequests />} />
                    <Route path="quotes/new" element={<QuoteWizard />} />
                    <Route path="invoices" element={<AdminInvoices />} />
                    <Route path="ongoing-projects" element={<AdminOngoingProjects />} />
                    <Route path="bookings" element={<AdminBookings />} />
                    <Route path="bookings/:id" element={<AdminBookingDetail />} />
                    <Route path="customers" element={<AdminCustomers />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="database" element={<AdminDatabase />} />
                    <Route path="reports" element={<AdminReports />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="security" element={<AdminSecurity />} />
                    <Route path="staff" element={<AdminStaff />} />
                    <Route path="job-requests" element={<AdminJobRequests />} />
                    <Route path="jobs" element={<AdminJobs />} />
                    <Route path="analytics/detailed" element={<AdminReports />} />
                  </Route>

                  {/* Worker Routes */}
                  <Route path="/worker" element={<WorkerLayout />}>
                    <Route index element={<WorkerDashboard />} />
                    <Route path="pool" element={<JobPool />} />
                    <Route path="jobs" element={<MyJobs />} />
                    <Route path="jobs/:jobId" element={<JobDetail />} />
                    <Route path="timesheet" element={<WorkerTimesheet />} />
                    <Route path="settings" element={<WorkerSettings />} />
                  </Route>

                  {/* Booking and Quote Request Routes */}
                  <Route path="/boka/:slug" element={<BookingWizard />} />
                  <Route path="/offert/:slug" element={<QuoteRequestWizard />} />
                  <Route path="/test-booking" element={<TestBooking />} />
                  
                  <Route path="/tjanster" element={<Services />} />
                  <Route path="/tjanster/:slug" element={<ServiceDetail />} />
                  <Route path="/ai-assistent" element={<AIAssistant />} />
                  <Route path="/kontakt" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/om-oss" element={<AboutUs />} />
                  <Route path="/boka-hembesok" element={<BookVisit />} />
                  <Route path="/rot-info" element={<ROTInfo />} />
                  <Route path="/rut" element={<RUT />} />
                  <Route path="/referenser" element={<Referenser />} />
                  <Route path="/smart-hem" element={<SmartHome />} />
                  <Route path="/naromrade" element={<Neighborhood />} />
                  <Route path="/topplista" element={<Leaderboard />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <StickyCtaBar />
                <StickyCTA />
                <AIChat />
      <ModalHost />
              </BrowserRouter>
            </TooltipProvider>
        </SecurityWrapper>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;