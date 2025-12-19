import React, { lazy, useEffect, Suspense, startTransition } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
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
const QuoteHtmlPreview = lazy(() => import("./pages/admin/QuoteHtmlPreview"));
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
const LocalServicePage = lazy(() => import("./pages/LocalServicePage"));
const Careers = lazy(() => import("./pages/Careers"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));

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
import { NavbarPortal } from './components/NavbarPortal';
import { StickyPhoneButton } from './components/StickyPhoneButton';
import './components/Navbar2.css';

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

// URL decode guard - fixes incorrectly encoded URLs (e.g., %3F instead of ?)
const URLDecodeGuard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if pathname contains encoded query characters
    if (location.pathname.includes('%3F') || location.pathname.includes('%26')) {
      const decodedPath = decodeURIComponent(location.pathname);
      const questionMarkIndex = decodedPath.indexOf('?');
      
      if (questionMarkIndex !== -1) {
        const actualPath = decodedPath.substring(0, questionMarkIndex);
        const queryString = decodedPath.substring(questionMarkIndex);
        navigate(actualPath + queryString, { replace: true });
      }
    }
  }, [location.pathname, navigate]);
  
  return null;
};

const App = () => {
  // Load content globally ONCE instead of per-route
  useContentLoader();
  
  // Preload routes in background for instant page transitions
  usePreloadRoutes();
  
  // Initialize ScrollSmoother - optimized for performance
  useEffect(() => {
    // Disable on mobile/tablet for better performance
    const isMobile = window.innerWidth < 1024;
    
    const smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: isMobile ? 0 : 1, // Disabled on mobile, reduced on desktop
      effects: !isMobile, // No parallax effects on mobile
      smoothTouch: false, // Completely disable touch smoothing
      ignoreMobileResize: true,
    });

    // Import store dynamically to avoid top-level import issues
    import('@/stores/scrollSmootherStore').then(({ useScrollSmootherStore }) => {
      useScrollSmootherStore.getState().setSmoother(smoother);
    });

    return () => {
      if (smoother) smoother.kill();
      import('@/stores/scrollSmootherStore').then(({ useScrollSmootherStore }) => {
        useScrollSmootherStore.getState().setSmoother(null);
      });
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
                <div id="smooth-wrapper">
                  <div id="smooth-content" className="min-h-screen bg-background font-inter">
                    <Toaster />
                    <Sonner />
                    <ServiceRequestModal />
                    <BrowserRouter>
                      <FeatureFlagInitializer>
                        <URLDecodeGuard />
                        <PageViewTracker />
                        <ScrollToTop />
                        <Routes>
                          {/* Auth routes OUTSIDE MaintenanceGate so admins can login during maintenance */}
                          <Route path="/auth" element={lazyElement(Auth)} />
                          <Route path="/en/auth" element={lazyElement(Auth)} />
                          <Route path="/auth/callback" element={lazyElement(AuthCallback)} />
                          <Route path="/auth/error" element={lazyElement(AuthError)} />
                          
                          {/* Public routes that don't need MaintenanceGate wrapper */}
                          <Route path="/dashboard" element={<MaintenanceGate>{lazyElement(Dashboard)}</MaintenanceGate>} />
                          
                          {/* Public Quote View - Hybrid format & legacy support */}
                          <Route path="/q/:number/:token" element={<MaintenanceGate>{lazyElement(QuotePublic)}</MaintenanceGate>} />
                          <Route path="/q/:token" element={<MaintenanceGate>{lazyElement(QuotePublic)}</MaintenanceGate>} />
                          
                          {/* Public Invoice View */}
                          <Route path="/invoice/:token" element={<MaintenanceGate>{lazyElement(InvoicePublic)}</MaintenanceGate>} />

                          {/* City pages */}
                          <Route path="/omraden/uppsala" element={<MaintenanceGate>{lazyElement(LocationCityPage, { city: "Uppsala" })}</MaintenanceGate>} />
                          <Route path="/omraden/stockholm" element={<MaintenanceGate>{lazyElement(LocationCityPage, { city: "Stockholm" })}</MaintenanceGate>} />

                          {/* MyFixco Layout with nested routes */}
                          <Route path="/mitt-fixco" element={
                            <MaintenanceGate>
                              <Suspense fallback={<SuspenseFallback />}>
                                <MyFixcoLayout />
                              </Suspense>
                            </MaintenanceGate>
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
                          <Route path="/admin" element={
                            <MaintenanceGate>
                              <AdminRoute><AdminLayout /></AdminRoute>
                            </MaintenanceGate>
                          }>
                            <Route index element={lazyElement(DashboardOverview)} />
                            <Route path="services" element={lazyElement(AdminServices)} />
                            {/* Unified quotes page */}
                            <Route path="quotes" element={lazyElement(AdminQuotesUnified)} />
                            <Route path="quotes/trash" element={lazyElement(AdminQuotesTrash)} />
                            <Route path="quotes/html-preview" element={lazyElement(QuoteHtmlPreview)} />
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
                            <MaintenanceGate>
                              <Suspense fallback={<SuspenseFallback />}>
                                <WorkerLayout />
                              </Suspense>
                            </MaintenanceGate>
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
                            <MaintenanceGate>
                              <Suspense fallback={<SuspenseFallback />}>
                                <BookingWizard />
                              </Suspense>
                            </MaintenanceGate>
                          } />
                          
                          {/* Main Swedish Routes */}
                          <Route path="/" element={<MaintenanceGate><AppLayout /></MaintenanceGate>}>
                            <Route index element={lazyElement(Home)} />
                            <Route path="home-v2" element={lazyElement(HomeV2)} />
                            <Route path="tjanster" element={lazyElement(Services)} />
                            
                            {/* Redirects: målning/måleri → målare (SEO-konsolidering) */}
                            <Route path="tjanster/malning" element={<Navigate to="/tjanster/malare" replace />} />
                            <Route path="tjanster/maleri" element={<Navigate to="/tjanster/malare" replace />} />
                            
                            {/* Redirects: gamla lokala tjänst-sidor → nya format (client-side) */}
                            <Route path="tjanster/elmontor-uppsala" element={<Navigate to="/tjanster/elektriker/uppsala" replace />} />
                            <Route path="tjanster/elmontor-stockholm" element={<Navigate to="/tjanster/elektriker/stockholm" replace />} />
                            <Route path="tjanster/vvs-uppsala" element={<Navigate to="/tjanster/vvs/uppsala" replace />} />
                            <Route path="tjanster/vvs-stockholm" element={<Navigate to="/tjanster/vvs/stockholm" replace />} />
                            <Route path="tjanster/snickare-uppsala" element={<Navigate to="/tjanster/snickare/uppsala" replace />} />
                            <Route path="tjanster/snickare-stockholm" element={<Navigate to="/tjanster/snickare/stockholm" replace />} />
                            <Route path="tjanster/montering-uppsala" element={<Navigate to="/tjanster/montering/uppsala" replace />} />
                            <Route path="tjanster/montering-stockholm" element={<Navigate to="/tjanster/montering/stockholm" replace />} />
                            <Route path="tjanster/tradgard-uppsala" element={<Navigate to="/tjanster/tradgard/uppsala" replace />} />
                            <Route path="tjanster/tradgard-stockholm" element={<Navigate to="/tjanster/tradgard/stockholm" replace />} />
                            <Route path="tjanster/stad-uppsala" element={<Navigate to="/tjanster/stad/uppsala" replace />} />
                            <Route path="tjanster/stad-stockholm" element={<Navigate to="/tjanster/stad/stockholm" replace />} />
                            <Route path="tjanster/markarbeten-uppsala" element={<Navigate to="/tjanster/markarbeten/uppsala" replace />} />
                            <Route path="tjanster/markarbeten-stockholm" element={<Navigate to="/tjanster/markarbeten/stockholm" replace />} />
                            <Route path="tjanster/tekniska-installationer-uppsala" element={<Navigate to="/tjanster/tekniska-installationer/uppsala" replace />} />
                            <Route path="tjanster/tekniska-installationer-stockholm" element={<Navigate to="/tjanster/tekniska-installationer/stockholm" replace />} />
                            <Route path="tjanster/flytt-uppsala" element={<Navigate to="/tjanster/flytt/uppsala" replace />} />
                            <Route path="tjanster/flytt-stockholm" element={<Navigate to="/tjanster/flytt/stockholm" replace />} />
                            <Route path="tjanster/malare-uppsala" element={<Navigate to="/tjanster/malare/uppsala" replace />} />
                            <Route path="tjanster/malare-stockholm" element={<Navigate to="/tjanster/malare/stockholm" replace />} />
                            
                            {/* DYNAMISK LOKAL SEO ROUTE - 540+ sidor */}
                            <Route path="tjanster/:serviceSlug/:areaSlug" element={lazyElement(LocalServicePage)} />
                            
                            {/* Dynamisk route SIST - fångar alla andra tjänster */}
                            <Route path="tjanster/:slug" element={lazyElement(ServiceDetail)} />
                            
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
                            <Route path="blogg" element={lazyElement(Blog)} />
                            <Route path="blogg/:slug" element={lazyElement(BlogPost)} />
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
                          </Route>
                          
                          {/* English Routes */}
                          <Route path="/en" element={<MaintenanceGate><AppLayout /></MaintenanceGate>}>
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
                          
                          {/* Catch-all 404 route */}
                          <Route path="*" element={<MaintenanceGate>{lazyElement(NotFound)}</MaintenanceGate>} />
                        </Routes>
                  </FeatureFlagInitializer>
                  
                  {/* Navbar2 Portal - renders OUTSIDE smooth-content to avoid transform issues */}
                  <NavbarPortal />
                  
                  {/* Sticky Phone Button - renders OUTSIDE smooth-content for proper fixed positioning */}
                  <StickyPhoneButton />
                </BrowserRouter>
              </div>
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