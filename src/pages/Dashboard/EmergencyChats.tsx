
import React from "react";
import { useApp } from "@/contexts/AppContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Message } from "@/types";
import { formatDistanceToNow } from "date-fns";

const EmergencyChats: React.FC = () => {
  const { emergencyChats, counselors } = useApp();
  
  const getCounselorName = (counselorId: string | null) => {
    if (!counselorId) return "Unassigned";
    const counselor = counselors.find((c) => c.id === counselorId);
    return counselor ? counselor.name : "Unknown Counselor";
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Emergency Cases</h1>
        <p className="text-muted-foreground">
          Review chats flagged as potential emergencies that need immediate attention.
        </p>
      </div>

      {emergencyChats.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No emergency cases at the moment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {emergencyChats.map((chat) => (
            <Card key={chat.id} className="border-l-4 border-l-red-500">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Case #{chat.id.slice(0, 5)}
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(chat.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <CardDescription>
                  Assigned to: {getCounselorName(chat.counselorId)}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  {chat.messages
                    .filter((msg) => msg.isEmergency)
                    .map((message) => (
                      <EmergencyMessage key={message.id} message={message} />
                    ))}
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      View Full Chat
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                      <DialogTitle>Chat #{chat.id.slice(0, 5)}</DialogTitle>
                      <DialogDescription>
                        Complete conversation history
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto p-1">
                      {chat.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-3 rounded-lg ${
                            message.sender === "user"
                              ? "bg-muted ml-auto max-w-[80%]"
                              : "bg-primary text-primary-foreground mr-auto max-w-[80%]"
                          } ${message.isEmergency ? "ring-2 ring-red-500" : ""}`}
                        >
                          <div className="text-sm font-medium mb-1 capitalize">
                            {message.sender}
                          </div>
                          <p>{message.content}</p>
                          <div className="text-xs mt-1 opacity-70">
                            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const EmergencyMessage: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
      <p className="text-red-800 font-medium">{message.content}</p>
      <div className="text-xs text-red-600 mt-1">
        {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
      </div>
    </div>
  );
};

export default EmergencyChats;
