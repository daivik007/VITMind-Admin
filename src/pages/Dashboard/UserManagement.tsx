
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, MessageCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface UserActivity {
  id: string;
  message_text: string;
  created_at: string;
  sender_type: string;
  chat_id: string;
}

const UserManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Fetch all users
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
      }

      return data as UserProfile[];
    }
  });

  // Fetch user activity when a user is selected
  const { data: userActivity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ['userActivity', selectedUser?.id],
    queryFn: async () => {
      if (!selectedUser?.id) return [];

      const { data: chats, error: chatsError } = await supabase
        .from('chats')
        .select('id')
        .eq('student_id', selectedUser.id);

      if (chatsError) {
        console.error('Error fetching user chats:', chatsError);
        throw new Error('Failed to fetch user activity');
      }

      if (!chats?.length) return [];

      const chatIds = chats.map(chat => chat.id);
      
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .in('chat_id', chatIds)
        .order('created_at', { ascending: false });

      if (messagesError) {
        console.error('Error fetching user messages:', messagesError);
        throw new Error('Failed to fetch user activity');
      }

      return messages as UserActivity[];
    },
    enabled: !!selectedUser?.id
  });

  // Filter users based on search query
  const filteredUsers = users?.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (user.full_name && user.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // View user profile and activity
  const viewUserProfile = (user: UserProfile) => {
    setSelectedUser(user);
    setIsProfileOpen(true);
  };

  // Get initials for avatar fallback
  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Manage and view user profiles and activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-4">Loading users...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                        </Avatar>
                        <span>{user.full_name || "Anonymous User"}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell>{formatDate(user.updated_at)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => viewUserProfile(user)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* User Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-4 py-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedUser.avatar_url || undefined} />
                    <AvatarFallback className="text-lg">{getInitials(selectedUser.full_name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedUser.full_name || "Anonymous User"}</h3>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">User ID</h4>
                    <p className="text-sm">{selectedUser.id}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Joined</h4>
                    <p className="text-sm">{formatDate(selectedUser.created_at)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Last Active</h4>
                    <p className="text-sm">{formatDate(selectedUser.updated_at)}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="activity" className="space-y-4 py-4">
                <h3 className="text-xl font-semibold">Recent Messages</h3>
                
                {isLoadingActivity ? (
                  <p>Loading activity...</p>
                ) : userActivity && userActivity.length > 0 ? (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {userActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-2 border-b pb-4">
                        <div className="mt-0.5">
                          <MessageCircle className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant={activity.sender_type === 'user' ? 'default' : 'outline'}>
                                {activity.sender_type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(activity.created_at).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <p className="mt-1 text-sm">{activity.message_text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No activity found for this user.</p>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
