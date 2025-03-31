
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./components/Layout/Dashboard";
import CounselorManagement from "./pages/Dashboard/CounselorManagement";
import ResourcesManagement from "./pages/Dashboard/ResourcesManagement";
import EmergencyChats from "./pages/Dashboard/EmergencyChats";
import WebinarsManagement from "./pages/Dashboard/Webinars/WebinarsManagement";
import UserManagement from "./pages/Dashboard/UserManagement";
import DashboardHome from "./pages/Dashboard/DashboardHome";
import Chat from "./pages/Chat";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected route component
const PrivateRoute = ({ element }: { element: React.ReactNode }) => {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { isAuthenticated } = useApp();
  
  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/chat" element={<Chat />} />
      
      <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />}>
        <Route index element={<DashboardHome />} />
        <Route path="counselors" element={<CounselorManagement />} />
        <Route path="resources" element={<ResourcesManagement />} />
        <Route path="webinars" element={<WebinarsManagement />} />
        <Route path="emergency" element={<EmergencyChats />} />
        <Route path="users" element={<UserManagement />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
