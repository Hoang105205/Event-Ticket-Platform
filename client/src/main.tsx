import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { AuthProvider } from "react-oidc-context";

import ProtectedRoute from "@/components/protected-route";

import AttendeeLandingPage from "./pages/attendee-landing-page.tsx";
import CallbackPage from "./pages/callback-page.tsx";
import DashboardListEventsPage from "./pages/dashboard-list-events-page.tsx";
import DashboardListTickets from "./pages/dashboard-list-tickets.tsx";
import DashboardManageEventPage from "./pages/dashboard-manage-event-page.tsx";
import DashboardPage from "./pages/dashboard-page.tsx";
import DashboardValidateQrPage from "./pages/dashboard-validate-qr-page.tsx";
import DashboardViewTicketPage from "./pages/dashboard-view-ticket-page.tsx";
import LoginPage from "./pages/login-page.tsx";
import PublishedEventsPage from "./pages/published-events-page.tsx";
import PurchaseTicketPage from "./pages/purchase-ticket-page.tsx";

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

  // Organizer - Event Management
  {
    path: "/dashboard/events",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={['organizer']}>
          <DashboardListEventsPage />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: "/dashboard/events/create",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={['organizer']}>
          <DashboardManageEventPage />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: "/dashboard/events/update/:id",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={['organizer']}>
          <DashboardManageEventPage />
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
          <DashboardListTickets />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: "/dashboard/tickets/:id",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={['attendee']}>
          <DashboardViewTicketPage />
        </ProtectedRoute>
      </Layout>
    ),
  },

  {
    path: "/events/:eventId/purchase/:ticketTypeId",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={['attendee']}>
          <PurchaseTicketPage />
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
          <DashboardValidateQrPage />
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
