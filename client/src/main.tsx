import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { AuthProvider } from "react-oidc-context";

import ProtectedRoute from "@/components/protected-route";

// General pages
import AttendeeLandingPage from "./pages/attendee-landing-page.tsx";
import CallbackPage from "./pages/callback-page.tsx";
import DashboardPage from "./pages/dashboard-page.tsx";
import LoginPage from "./pages/login-page.tsx";
import PublishedEventsPage from "./pages/published-events-page.tsx";

// Administrator pages
import AdministrationDashboardPage from "./pages/administrator/administration-dashboard-page.tsx";
import AdministrationManageUsersPage from "./pages/administrator/administration-manage-users-page.tsx";
import AdministrationUserDetailsPage from "./pages/administrator/administration-user-details-page.tsx";

// Organizer pages
import OrganizerEventsListpage from "./pages/organizer/organizer-events-list-page.tsx";
import OrganizerManageEventPage from "./pages/organizer/organizer-manage-event-page.tsx";

// Attendee pages
import AttendeeTicketListPage from "./pages/attendee/attendee-tickets-list-page.tsx";
import AttendeeTicketDetailsPage from "./pages/attendee/attendee-ticket-details-page.tsx";
import AttendeePurchaseTicketPage from "./pages/attendee/attendee-purchase-ticket-page.tsx";

// Staff pages
import StaffValidateQrPage from "./pages/staff/staff-validate-qr-page.tsx";


import Layout from "@/components/layout";

import "./index.css";

const oidcConfig = {
  authority: import.meta.env.VITE_KEYCLOAK_URL,
  client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_KEYCLOAK_REDIRECT_URI,
  post_logout_redirect_uri: import.meta.env.VITE_KEYCLOAK_POST_LOGOUT_REDIRECT_URI,
};

export const router = createBrowserRouter([
  // ========================================
  // PUBLIC ROUTES - No authentication required
  // ========================================
  {
    path: "/",
    element: (
      <Layout>
        <AttendeeLandingPage />
      </Layout>
    ),
  },
  {
    path: "/login",
    element: (
      <Layout showNavBar={false}>
        <LoginPage />
      </Layout>
    ),
  },
  {
    path: "/callback",
    element: (
      <Layout showNavBar={false}>
        <CallbackPage />
      </Layout>
    ),
  },

  // ========================================
  // PROTECTED ROUTES - Require authentication + role checking
  // ========================================

  // Dashboard Hub - All authenticated users (auto-redirect by role)
  {
    path: "/dashboard",
    element: (
      <Layout>
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      </Layout>
    ),
  },

  // Administrator - Platform Management
  {
    path: "/dashboard/administration",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={['administrator']}>
          <AdministrationDashboardPage />
        </ProtectedRoute>
      </Layout>
    ),
  },

  {
    path: "/dashboard/administration/manage-users",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={['administrator']}>
          <AdministrationManageUsersPage />
        </ProtectedRoute>
      </Layout>
    ),
  },

  {
    path: "/dashboard/administration/manage-users/:attendeeId",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={['administrator']}>
          <AdministrationUserDetailsPage />
        </ProtectedRoute>
      </Layout>
    ),
  },


  // Organizer - Event Management
  {
    path: "/dashboard/events",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={['organizer']}>
          <OrganizerEventsListpage />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: "/dashboard/events/create",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={['organizer']}>
          <OrganizerManageEventPage />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: "/dashboard/events/update/:id",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={['organizer']}>
          <OrganizerManageEventPage />
        </ProtectedRoute>
      </Layout>
    ),
  },

  // Attendee - Ticket Management
  {
    path: "/dashboard/tickets",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={['attendee']}>
          <AttendeeTicketListPage />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: "/dashboard/tickets/:id",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={['attendee']}>
          <AttendeeTicketDetailsPage />
        </ProtectedRoute>
      </Layout>
    ),
  },

  {
    path: "/events/:eventId/purchase/:ticketTypeId",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={['attendee']}>
          <AttendeePurchaseTicketPage />
        </ProtectedRoute>
      </Layout>
    ),
  },

  // Staff Only Routes 
  {
    path: "/dashboard/validate-qr",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={['staff']}>
          <StaffValidateQrPage />
        </ProtectedRoute>
      </Layout>
    ),
  },

  // ========================================
  // SEMI-PUBLIC ROUTES - Optional authentication for enhanced features
  // ========================================

  // Event browsing - public but enhanced when logged in
  {
    path: "/events/:id",
    element: (
      <Layout>
        <ProtectedRoute requireAuth={false}>
          <PublishedEventsPage />
        </ProtectedRoute>
      </Layout>
    ),
  },

  
  // ========================================
  // CATCH-ALL ROUTE
  // ========================================
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider {...oidcConfig}>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
