import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import CoordinatorDashboardPage from "./pages/dashboard/CoordinatorDashboardPage";
import SakhiDashboardPage from "./pages/dashboard/SakhiDashboardPage";
import CustomerDashboardPage from "./pages/dashboard/CustomerDashboardPage";
import LabDashboardPage from "./pages/dashboard/LabDashboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="coordinator" element={<CoordinatorDashboardPage />} />
              <Route path="sakhi" element={<SakhiDashboardPage />} />
              <Route path="customer" element={<CustomerDashboardPage />} />
              <Route path="lab" element={<LabDashboardPage />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default AppRoutes; 