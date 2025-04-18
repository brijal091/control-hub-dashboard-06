
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Layouts
import AdminLayout from "@/components/layouts/AdminLayout";
import DashboardLayout from "@/components/layouts/DashboardLayout";

// Pages
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import OrganizationsPage from "@/pages/admin/Organizations";
import UsersPage from "@/pages/admin/Users";
import SettingsPage from "@/pages/admin/Settings";
import Unauthorized from "@/pages/Unauthorized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Dashboard />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* User routes */}
            <Route path="/" element={
              <ProtectedRoute allowedRoles={['1', '2', '3']}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
            </Route>
            
            {/* Admin routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['1', '2']}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route path="organizations" element={
                <ProtectedRoute allowedRoles={['1']}>
                  <OrganizationsPage />
                </ProtectedRoute>
              } />
              <Route path="users" element={
                <ProtectedRoute allowedRoles={['1', '2']}>
                  <UsersPage />
                </ProtectedRoute>
              } />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            
            {/* Catch all not found route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
