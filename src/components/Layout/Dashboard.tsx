
import React from "react";
import { useApp } from "@/contexts/AppContext";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarProvider 
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useNavigate, Outlet } from "react-router-dom";
import { Bell, Calendar, Home, MessageCircle, User, Users, BookOpen } from "lucide-react";

const Dashboard: React.FC = () => {
  const { logout, emergencyChats } = useApp();
  const navigate = useNavigate();
  
  const hasEmergencies = emergencyChats.length > 0;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="p-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-therapy-600">Therapy Dashboard</h1>
          </SidebarHeader>
          
          <SidebarContent className="px-4 py-2">
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => navigate("/dashboard")}
              >
                <Home className="mr-2 h-5 w-5" />
                Dashboard
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => navigate("/dashboard/users")}
              >
                <User className="mr-2 h-5 w-5" />
                Users
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => navigate("/dashboard/counselors")}
              >
                <Users className="mr-2 h-5 w-5" />
                Counselors
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => navigate("/dashboard/resources")}
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Resources
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => navigate("/dashboard/webinars")}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Webinars & Sessions
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start relative" 
                onClick={() => navigate("/dashboard/emergency")}
              >
                <Bell className="mr-2 h-5 w-5" />
                Emergency
                {hasEmergencies && (
                  <span className="absolute top-2 right-2 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => navigate("/chat")}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                AI Chatbot
              </Button>
            </div>
          </SidebarContent>
          
          <SidebarFooter className="p-4 border-t">
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={logout}
            >
              <User className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
