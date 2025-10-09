import React, { lazy, useEffect, Suspense, startTransition } from 'react';
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
import AI from "./pages/AI";
import AuthCallback from "./pages/AuthCallback";
import AuthError from "./pages/AuthError";
import Dashboard from "./pages/Dashboard";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import Insurance from "./pages/Insurance";
import ScrollToTop from "./components/ScrollToTop";

import SecurityWrapper from "./components/SecurityWrapper";
import { ModalHost } from "./components/ActionWizard";
import AppLayout from "./components/layouts/AppLayout";

// MyFixco pages
import DashboardOverview from "./pages/MyFixco/DashboardOverview";
import PropertiesPage from "./pages/MyFixco/PropertiesPage";
import InvoicesPage from "./pages/MyFixco/InvoicesPage";
import HistoryPage from "./pages/MyFixco/HistoryPage";
import ActivityPage from "./pages/MyFixco/ActivityPage";
import RotRutPage from "./pages/MyFixco/RotRutPage";
import AccountSettings from "./pages/MyFixco/AccountSettings";
import StaffManagement from "./pages/MyFixco/StaffManagement";

// Admin pages
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminQuotes from "./pages/admin/AdminQuotes";
import AdminQuoteDetail from "./pages/admin/AdminQuoteDetail";
import AdminQuoteEdit from "./pages/admin/AdminQuoteEdit";
import AdminQuotesTrash from "./pages/admin/AdminQuotesTrash";
import AdminBookingsTrash from "./pages/admin/AdminBookingsTrash";
import AdminJobsTrash from "./pages/admin/AdminJobsTrash";
import QuoteWizard from "./pages/admin/QuoteWizard";
import AdminInvoices from "./pages/admin/AdminInvoices";
import AdminOngoingProjects from "./pages/admin/AdminOngoingProjects";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminBookingDetail from "./pages/admin/AdminBookingDetail";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDatabase from "./pages/admin/AdminDatabase";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminSecurity from "./pages/admin/AdminSecurity";
import AdminStaff from "./pages/admin/AdminStaff";
import JobPool from "./pages/worker/JobPool";
import MyJobs from "./pages/worker/MyJobs";
import JobDetail from "./pages/worker/JobDetail";
import WorkerDashboard from "./pages/worker/WorkerDashboard";
import WorkerTimesheet from "./pages/worker/WorkerTimesheet";
import WorkerSettings from "./pages/worker/WorkerSettings";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminJobRequests from "./pages/admin/AdminJobRequests";
import AdminTranslations from "./pages/admin/AdminTranslations";
import AdminServices from "./pages/admin/AdminServices";
import AdminLeads from "./pages/admin/AdminLeads";

// Lazy load components for better performance with Suspense fallbacks
const MyFixcoLayout = lazy(() => import('./components/MyFixcoLayout'));
const WorkerLayout = lazy(() => import('./components/worker/WorkerLayout'));
const SmartHome = lazy(() => import('./pages/SmartHome'));
const TestBooking = lazy(() => import('./pages/TestBooking'));
const BookingWizard = lazy(() => import('./pages/BookingWizard'));
const QuoteRequestWizard = lazy(() => import('./pages/QuoteRequestWizard'));
import { ErrorBoundary } from './components/ErrorBoundary';

// Suspense fallback component
const SuspenseFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  // Global event handling for wizard actions
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const wizardType = target.getAttribute('data-wizard');
      
      if (wizardType === 'booking') {
        event.preventDefault();
        window.open('/boka/standard', '_blank');
      } else if (wizardType === 'quote') {
        event.preventDefault();
        window.open('/offert/standard', '_blank');
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <SecurityWrapper>
          <TooltipProvider>
            <div className="min-h-screen bg-background font-inter">
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/auth/error" element={<AuthError />} />
                  <Route path="/dashboard" element={<Dashboard />} />

                  {/* MyFixco Layout with nested routes */}
                  <Route path="/mitt-fixco" element={
                    <Suspense fallback={<SuspenseFallback />}>
                      <MyFixcoLayout />
                    </Suspense>
                  }>
                    <Route index element={<DashboardOverview />} />
                    <Route path="properties" element={<PropertiesPage />} />
                    <Route path="invoices" element={<InvoicesPage />} />
                    <Route path="history" element={<HistoryPage />} />
                    <Route path="activity" element={<ActivityPage />} />
                    <Route path="rot-rut" element={<RotRutPage />} />
                    <Route path="settings" element={<AccountSettings />} />
                    <Route path="staff" element={<StaffManagement />} />
                  </Route>

                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="services" element={<AdminServices />} />
                    <Route path="quotes" element={<AdminQuotes />} />
                    <Route path="quotes/trash" element={<AdminQuotesTrash />} />
                    <Route path="quotes/:id" element={<AdminQuoteDetail />} />
                    <Route path="quotes/:id/edit" element={<AdminQuoteEdit />} />
                    <Route path="quotes/new" element={<QuoteWizard />} />
                    <Route path="invoices" element={<AdminInvoices />} />
                    <Route path="ongoing-projects" element={<AdminOngoingProjects />} />
                    <Route path="bookings" element={<AdminBookings />} />
                    <Route path="bookings/trash" element={<AdminBookingsTrash />} />
                    <Route path="bookings/:id" element={<AdminBookingDetail />} />
                    <Route path="customers" element={<AdminCustomers />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="database" element={<AdminDatabase />} />
                    <Route path="reports" element={<AdminReports />} />
                    <Route path="jobs" element={<AdminJobs />} />
                    <Route path="jobs/trash" element={<AdminJobsTrash />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="security" element={<AdminSecurity />} />
                    <Route path="staff" element={<AdminStaff />} />
                    <Route path="job-requests" element={<AdminJobRequests />} />
                    <Route path="jobs" element={<AdminJobs />} />
                    <Route path="analytics/detailed" element={<AdminReports />} />
                    <Route path="translations" element={<AdminTranslations />} />
                    <Route path="leads" element={<AdminLeads />} />
                  </Route>

                  {/* Worker Routes */}
                  <Route path="/worker" element={
                    <Suspense fallback={<SuspenseFallback />}>
                      <WorkerLayout />
                    </Suspense>
                  }>
                    <Route index element={<WorkerDashboard />} />
                    <Route path="pool" element={<JobPool />} />
                    <Route path="jobs" element={<MyJobs />} />
                    <Route path="jobs/:jobId" element={<JobDetail />} />
                    <Route path="timesheet" element={<WorkerTimesheet />} />
                    <Route path="settings" element={<WorkerSettings />} />
                  </Route>

                  {/* Booking and Quote Request Routes */}
                  <Route path="/boka/:slug" element={
                    <Suspense fallback={<SuspenseFallback />}>
                      <BookingWizard />
                    </Suspense>
                  } />
                  <Route path="/offert/:slug" element={
                    <Suspense fallback={<SuspenseFallback />}>
                      <QuoteRequestWizard />
                    </Suspense>
                  } />
                  <Route path="/test-booking" element={
                    <Suspense fallback={<SuspenseFallback />}>
                      <TestBooking />
                    </Suspense>
                  } />
                  
                  {/* Main Swedish Routes */}
                  <Route path="/" element={<AppLayout />}>
                    <Route index element={<Home />} />
                    <Route path="tjanster" element={<Services />} />
                    <Route path="tjanster/:slug" element={<ServiceDetail />} />
                    <Route path="kontakt" element={<Contact />} />
                    <Route path="faq" element={<FAQ />} />
                    <Route path="om-oss" element={<AboutUs />} />
                    <Route path="boka-hembesok" element={<BookVisit />} />
                    <Route path="rot-info" element={<ROTInfo />} />
                    <Route path="cookies" element={<Cookies />} />
                    <Route path="ansvar-forsakring" element={<Insurance />} />
                    <Route path="rot" element={<ROTInfo />} />
                    <Route path="rut" element={<RUT />} />
                    <Route path="referenser" element={<Referenser />} />
                    <Route path="ai" element={<AI />} />
                    <Route path="smart-hem" element={
                      <ErrorBoundary fallback={
                        <div className="min-h-screen flex items-center justify-center">
                          <div className="text-center">
                            <h2 className="text-2xl font-bold mb-4">Smart Home temporarily unavailable</h2>
                            <p className="text-muted-foreground">Please try again later</p>
                          </div>
                        </div>
                      }>
                        <Suspense fallback={<SuspenseFallback />}>
                          <SmartHome />
                        </Suspense>
                      </ErrorBoundary>
                    } />
                    <Route path="terms" element={<Terms />} />
                    <Route path="privacy" element={<Privacy />} />
                    <Route path="cookies" element={<Cookies />} />
                    <Route path="ansvar-forsakring" element={<Insurance />} />
                  </Route>
                  
                  <Route path="/en/*" element={<AppLayout />}>
                    <Route index element={<Home />} />
                    <Route path="services" element={<Services />} />
                    <Route path="services/:slug" element={<ServiceDetail />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="faq" element={<FAQ />} />
                    <Route path="about" element={<AboutUs />} />
                    <Route path="references" element={<Referenser />} />
                    <Route path="terms" element={<Terms />} />
                    <Route path="privacy" element={<Privacy />} />
                    <Route path="cookies" element={<Cookies />} />
                    <Route path="insurance" element={<Insurance />} />
                    <Route path="rot" element={<ROTInfo />} />
                    <Route path="rut" element={<RUT />} />
                    <Route path="book-visit" element={<BookVisit />} />
                    <Route path="ai" element={<AI />} />
                    <Route path="smart-home" element={
                      <ErrorBoundary fallback={
                        <div className="min-h-screen flex items-center justify-center">
                          <div className="text-center">
                            <h2 className="text-2xl font-bold mb-4">Smart Home temporarily unavailable</h2>
                            <p className="text-muted-foreground">Please try again later</p>
                          </div>
                        </div>
                      }>
                        <Suspense fallback={<SuspenseFallback />}>
                          <SmartHome />
                        </Suspense>
                      </ErrorBoundary>
                    } />
                  </Route>
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <ModalHost />
              </BrowserRouter>
            </div>
          </TooltipProvider>
        </SecurityWrapper>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;