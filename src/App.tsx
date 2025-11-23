import React, { lazy, useEffect, Suspense, startTransition } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';

// Lazy load ALL pages for optimal performance
const Home = lazy(() => import("./pages/Home"));
const HomeV2 = lazy(() => import("./pages/HomeV2"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const BookVisit = lazy(() => import("./pages/BookVisit"));
const ROTInfo = lazy(() => import("./pages/ROTInfo"));
const RUT = lazy(() => import("./pages/RUT"));
const Referenser = lazy(() => import("./pages/Referenser"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AI = lazy(() => import("./pages/AI"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

// Auth components
const Auth = lazy(() => import("./pages/Auth"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const AuthError = lazy(() => import("./pages/AuthError"));

// Legal pages
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Cookies = lazy(() => import("./pages/Cookies"));
const Insurance = lazy(() => import("./pages/Insurance"));

import ScrollToTop from "./components/ScrollToTop";

import SecurityWrapper from "./components/SecurityWrapper";
import AppLayout from "./components/layouts/AppLayout";

// MyFixco pages
const DashboardOverview = lazy(() => import("./pages/MyFixco/DashboardOverview"));
const CustomerDashboard = lazy(() => import("./pages/MyFixco/CustomerDashboard"));
const PropertiesPage = lazy(() => import("./pages/MyFixco/PropertiesPage"));
const InvoicesPage = lazy(() => import("./pages/MyFixco/InvoicesPage"));
const HistoryPage = lazy(() => import("./pages/MyFixco/HistoryPage"));
const ActivityPage = lazy(() => import("./pages/MyFixco/ActivityPage"));
const RotRutPage = lazy(() => import("./pages/MyFixco/RotRutPage"));
const AccountSettings = lazy(() => import("./pages/MyFixco/AccountSettings"));
const StaffManagement = lazy(() => import("./pages/MyFixco/StaffManagement"));

// Admin pages
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
const AdminQuotesUnified = lazy(() => import("./pages/admin/AdminQuotesUnified"));
const AdminQuotesTrash = lazy(() => import("./pages/admin/AdminQuotesTrash"));
const AdminBookingsTrash = lazy(() => import("./pages/admin/AdminBookingsTrash"));
const AdminJobsTrash = lazy(() => import("./pages/admin/AdminJobsTrash"));
const AdminProjectsTrash = lazy(() => import("./pages/admin/AdminProjectsTrash"));
const AdminJobRequestsTrash = lazy(() => import("./pages/admin/AdminJobRequestsTrash"));
const AdminInvoices = lazy(() => import("./pages/admin/AdminInvoices"));
const AdminOngoingProjects = lazy(() => import("./pages/admin/AdminOngoingProjects"));
const AdminBookings = lazy(() => import("./pages/admin/AdminBookings"));
const AdminBookingDetail = lazy(() => import("./pages/admin/AdminBookingDetail"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminDatabase = lazy(() => import("./pages/admin/AdminDatabase"));
const AdminReports = lazy(() => import("./pages/admin/AdminReports"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminSecurity = lazy(() => import("./pages/admin/AdminSecurity"));
const AdminStaff = lazy(() => import("./pages/admin/AdminStaff"));
const AdminPayroll = lazy(() => import("./pages/admin/AdminPayroll"));
const AdminJobsUnified = lazy(() => import("./pages/admin/AdminJobsUnified"));
const AdminTranslations = lazy(() => import("./pages/admin/AdminTranslations"));
const AdminServices = lazy(() => import("./pages/admin/AdminServices"));
const AdminLeads = lazy(() => import("./pages/admin/AdminLeads"));
const AdminQuoteQuestions = lazy(() => import("./pages/admin/AdminQuoteQuestions"));
const AdminSchedule = lazy(() => import("./pages/admin/AdminSchedule"));
const AdminWorkerAnalytics = lazy(() => import("./pages/admin/AdminWorkerAnalytics"));
const AdminJobDetail = lazy(() => import("./pages/admin/AdminJobDetail"));
const AdminApplications = lazy(() => import("./pages/admin/AdminApplications"));
const AdminFeatureFlags = lazy(() => import("./pages/admin/AdminFeatureFlags"));

// Worker pages
const JobPool = lazy(() => import("./pages/worker/JobPool"));
const MyJobs = lazy(() => import("./pages/worker/MyJobs"));
const JobDetail = lazy(() => import("./pages/worker/JobDetail"));
const WorkerDashboard = lazy(() => import("./pages/worker/WorkerDashboard"));
const WorkerTimesheet = lazy(() => import("./pages/worker/WorkerTimesheet"));
const WorkerSettings = lazy(() => import("./pages/worker/WorkerSettings"));
const WorkerSchedule = lazy(() => import("./pages/worker/WorkerSchedule"));

// Public pages
const QuotePublic = lazy(() => import("./pages/QuotePublic"));
const InvoicePublic = lazy(() => import("./pages/InvoicePublic"));
const LocationCityPage = lazy(() => import("./pages/locations/LocationCityPage"));
const ServiceCityPage = lazy(() => import("./pages/locations/ServiceCityPage"));
const ServiceCityDetail = lazy(() => import("./pages/locations/ServiceCityDetail"));
const Careers = lazy(() => import("./pages/Careers"));

// Lazy load components for better performance with Suspense fallbacks
const MyFixcoLayout = lazy(() => import('./components/MyFixcoLayout'));
const WorkerLayout = lazy(() => import('./components/worker/WorkerLayout'));
const SmartHome = lazy(() => import('./pages/SmartHome'));
const BookingWizard = lazy(() => import('./pages/BookingWizard'));
import { ErrorBoundary } from './components/ErrorBoundary';
import { CopyProvider } from '@/copy/CopyProvider';
import { useEventTracking } from '@/hooks/useEventTracking';
import { useLocation } from 'react-router-dom';
import { MaintenanceGate } from './components/MaintenanceGate';
import { FeatureFlagInitializer } from './components/FeatureFlagInitializer';
import ServiceRequestModal from '@/features/requests/ServiceRequestModal';
import { AuthProfileProvider } from './contexts/AuthProfileProvider';
import { useContentLoader } from '@/hooks/useContentLoader';
import { usePreloadRoutes } from '@/hooks/usePreloadRoutes';
import { lazyElement } from './components/LazyRoute';
import { ScrollSmoother } from '@/lib/gsap';

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
      staleTime: 1000 * 60 * 5, // 5 minutes - queries stay fresh longer
      gcTime: 1000 * 60 * 30, // 30 minutes - keep in cache longer
    },
  },
});

// Track page views component
const PageViewTracker = () => {
  const location = useLocation();
  const { trackPageView } = useEventTracking();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname, trackPageView]);

  return null;
};

const App = () => {
  // Load content globally ONCE instead of per-route
  useContentLoader();
  
  // Preload routes in background for instant page transitions
  usePreloadRoutes();
  
  // Initialize ScrollSmoother for ultra-smooth scrolling
  useEffect(() => {
    const smoother = ScrollSmoother.create({
      smooth: 1.5,           // Smoothness level (1-2 recommended)
      effects: true,         // Enable data-speed and data-lag attributes
      smoothTouch: 0.1,      // Smooth scrolling on mobile
      normalizeScroll: true  // Normalize scroll between different devices
    });

    return () => {
      if (smoother) smoother.kill();
    };
  }, []);
  
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
        <AuthProfileProvider>
          <CopyProvider locale="sv">
            <SecurityWrapper>
              <TooltipProvider>
                <div className="min-h-screen bg-background font-inter">
                  <Toaster />
                  <Sonner />
                  <ServiceRequestModal />
                  <BrowserRouter>
                    <FeatureFlagInitializer>
                      <PageViewTracker />
                      <ScrollToTop />
                      <Routes>
                      {/* Auth routes OUTSIDE MaintenanceGate so admins can login during maintenance */}
                      <Route path="/auth" element={lazyElement(Auth)} />
                      <Route path="/en/auth" element={lazyElement(Auth)} />
                      <Route path="/auth/callback" element={lazyElement(AuthCallback)} />
                      <Route path="/auth/error" element={lazyElement(AuthError)} />
                      
                      {/* All other routes INSIDE MaintenanceGate */}
                      <Route path="*" element={
                        <MaintenanceGate>
                          <Routes>
                  <Route path="/dashboard" element={lazyElement(Dashboard)} />
                  
                  {/* Public Quote View */}
                  <Route path="/q/:token" element={lazyElement(QuotePublic)} />
                  
                  {/* Public Invoice View */}
                  <Route path="/invoice/:token" element={lazyElement(InvoicePublic)} />

                  {/* City pages */}
                  <Route path="/omraden/uppsala" element={lazyElement(LocationCityPage, { city: "Uppsala" })} />
                  <Route path="/omraden/stockholm" element={lazyElement(LocationCityPage, { city: "Stockholm" })} />

                  {/* MyFixco Layout with nested routes */}
                  <Route path="/mitt-fixco" element={
                    <Suspense fallback={<SuspenseFallback />}>
                      <MyFixcoLayout />
                    </Suspense>
                  }>
                    <Route index element={lazyElement(CustomerDashboard)} />
                    <Route path="properties" element={lazyElement(PropertiesPage)} />
                    <Route path="invoices" element={lazyElement(InvoicesPage)} />
                    <Route path="history" element={lazyElement(HistoryPage)} />
                    <Route path="activity" element={lazyElement(ActivityPage)} />
                    <Route path="rot-rut" element={lazyElement(RotRutPage)} />
                    <Route path="settings" element={lazyElement(AccountSettings)} />
                    <Route path="staff" element={lazyElement(StaffManagement)} />
                  </Route>

                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                    <Route index element={lazyElement(DashboardOverview)} />
                    <Route path="services" element={lazyElement(AdminServices)} />
                    {/* Unified quotes page */}
                    <Route path="quotes" element={lazyElement(AdminQuotesUnified)} />
                    <Route path="quotes/trash" element={lazyElement(AdminQuotesTrash)} />
                    {/* Redirects for old routes */}
                    <Route path="requests-quotes" element={<Navigate to="/admin/quotes?tab=requests" replace />} />
                    <Route path="bookings" element={<Navigate to="/admin/quotes?tab=requests" replace />} />
                    <Route path="bookings/:id" element={<Navigate to="/admin/quotes?tab=requests" replace />} />
                    <Route path="bookings/trash" element={lazyElement(AdminBookingsTrash)} />
                    <Route path="ongoing-projects" element={<Navigate to="/admin/jobs" replace />} />
                    <Route path="quote-questions" element={lazyElement(AdminQuoteQuestions)} />
                    <Route path="invoices" element={lazyElement(AdminInvoices)} />
                    <Route path="projects/trash" element={lazyElement(AdminProjectsTrash)} />
                    <Route path="customers" element={lazyElement(AdminCustomers)} />
                    <Route path="users" element={lazyElement(AdminUsers)} />
                    <Route path="database" element={lazyElement(AdminDatabase)} />
                    <Route path="reports" element={lazyElement(AdminReports)} />
                    <Route path="jobs" element={lazyElement(AdminJobsUnified)} />
                    <Route path="jobs/:jobId" element={lazyElement(AdminJobDetail)} />
                    <Route path="jobs/trash" element={lazyElement(AdminJobsTrash)} />
                    <Route path="schedule" element={lazyElement(AdminSchedule)} />
                    <Route path="settings" element={lazyElement(AdminSettings)} />
                    <Route path="feature-flags" element={lazyElement(AdminFeatureFlags)} />
                    <Route path="security" element={lazyElement(AdminSecurity)} />
                    <Route path="staff" element={lazyElement(AdminStaff)} />
                    <Route path="payroll" element={lazyElement(AdminPayroll)} />
                    <Route path="job-requests-trash" element={lazyElement(AdminJobRequestsTrash)} />
                    <Route path="analytics/detailed" element={lazyElement(AdminReports)} />
                    <Route path="translations" element={lazyElement(AdminTranslations)} />
                    <Route path="leads" element={lazyElement(AdminLeads)} />
                    <Route path="worker-analytics" element={lazyElement(AdminWorkerAnalytics)} />
                    <Route path="applications" element={lazyElement(AdminApplications)} />
                  </Route>

                  {/* Worker Routes */}
                  <Route path="/worker" element={
                    <Suspense fallback={<SuspenseFallback />}>
                      <WorkerLayout />
                    </Suspense>
                  }>
                  <Route index element={lazyElement(WorkerDashboard)} />
                    <Route path="pool" element={lazyElement(JobPool)} />
                    <Route path="jobs" element={lazyElement(MyJobs)} />
                    <Route path="jobs/:jobId" element={lazyElement(JobDetail)} />
                    <Route path="schedule" element={lazyElement(WorkerSchedule)} />
                    <Route path="timesheet" element={lazyElement(WorkerTimesheet)} />
                    <Route path="settings" element={lazyElement(WorkerSettings)} />
                  </Route>

                  {/* Booking Route */}
                  <Route path="/boka/:slug" element={
                    <Suspense fallback={<SuspenseFallback />}>
                      <BookingWizard />
                    </Suspense>
                  } />
                  
                  {/* Main Swedish Routes */}
                  <Route path="/" element={<AppLayout />}>
                    <Route index element={lazyElement(Home)} />
                    <Route path="home-v2" element={lazyElement(HomeV2)} />
                    <Route path="tjanster" element={lazyElement(Services)} />
                    <Route path="tjanster/:slug" element={lazyElement(ServiceDetail)} />
                    
                    {/* Service+City pages - Full detail pages like main service pages */}
                    <Route path="tjanster/elmontor-uppsala" element={lazyElement(ServiceCityDetail, { service: "el", city: "Uppsala" })} />
                    <Route path="tjanster/vvs-uppsala" element={lazyElement(ServiceCityDetail, { service: "vvs", city: "Uppsala" })} />
                    <Route path="tjanster/snickare-uppsala" element={lazyElement(ServiceCityDetail, { service: "snickeri", city: "Uppsala" })} />
                    <Route path="tjanster/montering-uppsala" element={lazyElement(ServiceCityDetail, { service: "montering", city: "Uppsala" })} />
                    <Route path="tjanster/tradgard-uppsala" element={lazyElement(ServiceCityDetail, { service: "tradgard", city: "Uppsala" })} />
                    <Route path="tjanster/stad-uppsala" element={lazyElement(ServiceCityDetail, { service: "stadning", city: "Uppsala" })} />
                    <Route path="tjanster/markarbeten-uppsala" element={lazyElement(ServiceCityDetail, { service: "markarbeten", city: "Uppsala" })} />
                    <Route path="tjanster/tekniska-installationer-uppsala" element={lazyElement(ServiceCityDetail, { service: "tekniska-installationer", city: "Uppsala" })} />
                    <Route path="tjanster/flytt-uppsala" element={lazyElement(ServiceCityDetail, { service: "flytt", city: "Uppsala" })} />
                    <Route path="tjanster/malning-uppsala" element={lazyElement(ServiceCityDetail, { service: "malning", city: "Uppsala" })} />
                    
                    <Route path="tjanster/elmontor-stockholm" element={lazyElement(ServiceCityDetail, { service: "el", city: "Stockholm" })} />
                    <Route path="tjanster/vvs-stockholm" element={lazyElement(ServiceCityDetail, { service: "vvs", city: "Stockholm" })} />
                    <Route path="tjanster/snickare-stockholm" element={lazyElement(ServiceCityDetail, { service: "snickeri", city: "Stockholm" })} />
                    <Route path="tjanster/montering-stockholm" element={lazyElement(ServiceCityDetail, { service: "montering", city: "Stockholm" })} />
                    <Route path="tjanster/tradgard-stockholm" element={lazyElement(ServiceCityDetail, { service: "tradgard", city: "Stockholm" })} />
                    <Route path="tjanster/stad-stockholm" element={lazyElement(ServiceCityDetail, { service: "stadning", city: "Stockholm" })} />
                    <Route path="tjanster/markarbeten-stockholm" element={lazyElement(ServiceCityDetail, { service: "markarbeten", city: "Stockholm" })} />
                    <Route path="tjanster/tekniska-installationer-stockholm" element={lazyElement(ServiceCityDetail, { service: "tekniska-installationer", city: "Stockholm" })} />
                    <Route path="tjanster/flytt-stockholm" element={lazyElement(ServiceCityDetail, { service: "flytt", city: "Stockholm" })} />
                    <Route path="tjanster/malning-stockholm" element={lazyElement(ServiceCityDetail, { service: "malning", city: "Stockholm" })} />
                    
                    <Route path="kontakt" element={lazyElement(Contact)} />
                    <Route path="faq" element={lazyElement(FAQ)} />
                    <Route path="om-oss" element={lazyElement(AboutUs)} />
                    <Route path="boka-hembesok" element={lazyElement(BookVisit)} />
                    <Route path="rot-info" element={lazyElement(ROTInfo)} />
                    <Route path="cookies" element={lazyElement(Cookies)} />
                    <Route path="ansvar-forsakring" element={lazyElement(Insurance)} />
                    <Route path="rot" element={lazyElement(ROTInfo)} />
                    <Route path="rut" element={lazyElement(RUT)} />
                    <Route path="referenser" element={lazyElement(Referenser)} />
                    <Route path="ai" element={lazyElement(AI)} />
                    <Route path="karriar" element={lazyElement(Careers)} />
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
                    <Route path="terms" element={lazyElement(Terms)} />
                    <Route path="privacy" element={lazyElement(Privacy)} />
                    <Route path="cookies" element={lazyElement(Cookies)} />
                    <Route path="ansvar-forsakring" element={lazyElement(Insurance)} />
                  </Route>
                  
                  <Route path="/en/*" element={<AppLayout />}>
                    <Route index element={lazyElement(Home)} />
                    <Route path="home-v2" element={lazyElement(HomeV2)} />
                    <Route path="services" element={lazyElement(Services)} />
                    <Route path="services/:slug" element={lazyElement(ServiceDetail)} />
                    <Route path="contact" element={lazyElement(Contact)} />
                    <Route path="faq" element={lazyElement(FAQ)} />
                    <Route path="about" element={lazyElement(AboutUs)} />
                    <Route path="references" element={lazyElement(Referenser)} />
                    <Route path="terms" element={lazyElement(Terms)} />
                    <Route path="privacy" element={lazyElement(Privacy)} />
                    <Route path="cookies" element={lazyElement(Cookies)} />
                    <Route path="insurance" element={lazyElement(Insurance)} />
                    <Route path="rot" element={lazyElement(ROTInfo)} />
                    <Route path="rut" element={lazyElement(RUT)} />
                    <Route path="book-visit" element={lazyElement(BookVisit)} />
                    <Route path="ai" element={lazyElement(AI)} />
                    <Route path="careers" element={lazyElement(Careers)} />
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
                            <Route path="*" element={lazyElement(NotFound)} />
                          </Routes>
                        </MaintenanceGate>
                      } />
                    </Routes>
                  </FeatureFlagInitializer>
                    </BrowserRouter>
                  </div>
                </TooltipProvider>
              </SecurityWrapper>
            </CopyProvider>
          </AuthProfileProvider>
        </QueryClientProvider>
      </HelmetProvider>
    );
  };
  
  export default App;