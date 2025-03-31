
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Users, MessageCircle, Calendar, BookOpen, AlertTriangle, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";

const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  
  // Fetch dashboard stats
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      // Get counts from different tables
      const [
        { count: userCount, error: userError }, 
        { count: counselorCount, error: counselorError },
        { count: eventCount, error: eventError },
        { count: resourceCount, error: resourceError },
        { count: messageCount, error: messageError },
        { count: emergencyCount, error: emergencyError }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('counselors').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('resources').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }),
        supabase.from('chats').select('*', { count: 'exact', head: true }).eq('status', 'emergency'),
      ]);

      if (userError || counselorError || eventError || resourceError || messageError || emergencyError) {
        console.error('Error fetching stats:', { userError, counselorError, eventError, resourceError, messageError, emergencyError });
        throw new Error('Failed to fetch dashboard statistics');
      }

      return {
        userCount: userCount || 0,
        counselorCount: counselorCount || 0,
        eventCount: eventCount || 0,
        resourceCount: resourceCount || 0,
        messageCount: messageCount || 0,
        emergencyCount: emergencyCount || 0
      };
    }
  });

  // Fetch recent activity data
  const { data: recentActivity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ['recentActivity'],
    queryFn: async () => {
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select(`
          id,
          message_text,
          created_at,
          sender_type,
          chat_id,
          chats(student_id)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (messagesError) {
        console.error('Error fetching recent messages:', messagesError);
        throw new Error('Failed to fetch recent activity');
      }

      return messages || [];
    }
  });

  // Generate chart data from the stats
  const chartData = [
    { name: 'Users', count: stats?.userCount || 0 },
    { name: 'Counselors', count: stats?.counselorCount || 0 },
    { name: 'Webinars', count: stats?.eventCount || 0 },
    { name: 'Resources', count: stats?.resourceCount || 0 },
    { name: 'Messages', count: stats?.messageCount || 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate('/dashboard/emergency')} variant="destructive" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            {stats?.emergencyCount || 0} Emergency Cases
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoadingStats ? "Loading..." : stats?.userCount}</div>
                <p className="text-xs text-muted-foreground">Registered users in the platform</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" onClick={() => navigate('/dashboard/users')}>
                  <span>View all users</span>
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Counselors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoadingStats ? "Loading..." : stats?.counselorCount}</div>
                <p className="text-xs text-muted-foreground">Active counselors available</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" onClick={() => navigate('/dashboard')}>
                  <span>Manage counselors</span>
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoadingStats ? "Loading..." : stats?.messageCount}</div>
                <p className="text-xs text-muted-foreground">Total messages exchanged</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" onClick={() => navigate('/dashboard/emergency')}>
                  <span>View emergency chats</span>
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Webinars & Sessions</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoadingStats ? "Loading..." : stats?.eventCount}</div>
                <p className="text-xs text-muted-foreground">Scheduled events</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" onClick={() => navigate('/dashboard/webinars')}>
                  <span>Manage webinars</span>
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resources</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoadingStats ? "Loading..." : stats?.resourceCount}</div>
                <p className="text-xs text-muted-foreground">Available resources</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" onClick={() => navigate('/dashboard/resources')}>
                  <span>Manage resources</span>
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Emergency Cases</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoadingStats ? "Loading..." : stats?.emergencyCount}</div>
                <p className="text-xs text-muted-foreground">Active emergency conversations</p>
              </CardContent>
              <CardFooter>
                <Button variant="destructive" className="w-full" onClick={() => navigate('/dashboard/emergency')}>
                  <span>Handle emergencies</span>
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>The latest messages in the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingActivity ? (
                <p>Loading recent activity...</p>
              ) : (
                <div className="space-y-4">
                  {recentActivity?.map((message) => (
                    <div key={message.id} className="flex items-start gap-4 border-b pb-4 last:border-0">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{message.sender_type === 'user' ? 'User' : message.sender_type}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{message.message_text}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(message.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard/users')}>
                View All Activity
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Statistics</CardTitle>
              <CardDescription>Overview of key metrics</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer config={{ value: { theme: { light: "#4f46e5", dark: "#4f46e5" } } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="count" fill="#4f46e5" name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Custom tooltip component for the chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-md rounded">
        <p className="font-medium">{`${label}: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

export default DashboardHome;
