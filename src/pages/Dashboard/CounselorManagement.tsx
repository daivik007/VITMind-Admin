
import React, { useState } from "react";
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
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Counselor } from "@/types";
import { Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CounselorForm: React.FC<{
  onSubmit: (data: Omit<Counselor, "id" | "chatCount">) => void;
  initialData?: Counselor;
  buttonText: string;
}> = ({ onSubmit, initialData, buttonText }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [specialty, setSpecialty] = useState(initialData?.specialty || "");
  const [bio, setBio] = useState(initialData?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(
    initialData?.avatarUrl || "https://randomuser.me/api/portraits/lego/1.jpg"
  );
  const [status, setStatus] = useState<"active" | "inactive">(
    initialData?.status || "active"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      specialty,
      bio,
      avatarUrl,
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="specialty">Specialty</Label>
          <Input
            id="specialty"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="avatar">Avatar URL</Label>
        <Input
          id="avatar"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          required
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="status"
          checked={status === "active"}
          onCheckedChange={(checked) =>
            setStatus(checked ? "active" : "inactive")
          }
        />
        <Label htmlFor="status">Active</Label>
      </div>
      
      <Button type="submit">{buttonText}</Button>
    </form>
  );
};

const CounselorManagement: React.FC = () => {
  const { counselors, addCounselor, updateCounselor, deleteCounselor } = useApp();
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddCounselor = (data: Omit<Counselor, "id" | "chatCount">) => {
    addCounselor(data);
    setAddDialogOpen(false);
    toast({
      title: "Counselor added",
      description: `${data.name} has been added to the system.`,
    });
  };

  const handleUpdateCounselor = (data: Omit<Counselor, "id" | "chatCount">) => {
    if (selectedCounselor) {
      updateCounselor(selectedCounselor.id, data);
      setEditDialogOpen(false);
      toast({
        title: "Counselor updated",
        description: `${data.name}'s information has been updated.`,
      });
    }
  };

  const handleDeleteCounselor = (id: string, name: string) => {
    deleteCounselor(id);
    toast({
      title: "Counselor removed",
      description: `${name} has been removed from the system.`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Counselor Management</h1>
          <p className="text-muted-foreground">
            Manage counselors and their chat histories.
          </p>
        </div>
        
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Counselor</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Counselor</DialogTitle>
              <DialogDescription>
                Enter the details for the new counselor.
              </DialogDescription>
            </DialogHeader>
            <CounselorForm
              onSubmit={handleAddCounselor}
              buttonText="Add Counselor"
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Counselors</TabsTrigger>
          <TabsTrigger value="inactive">Inactive Counselors</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {counselors
              .filter((c) => c.status === "active")
              .map((counselor) => (
                <CounselorCard
                  key={counselor.id}
                  counselor={counselor}
                  onEdit={() => {
                    setSelectedCounselor(counselor);
                    setEditDialogOpen(true);
                  }}
                  onDelete={() => handleDeleteCounselor(counselor.id, counselor.name)}
                />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="inactive" className="pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {counselors
              .filter((c) => c.status === "inactive")
              .map((counselor) => (
                <CounselorCard
                  key={counselor.id}
                  counselor={counselor}
                  onEdit={() => {
                    setSelectedCounselor(counselor);
                    setEditDialogOpen(true);
                  }}
                  onDelete={() => handleDeleteCounselor(counselor.id, counselor.name)}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Counselor</DialogTitle>
            <DialogDescription>
              Update the counselor's information.
            </DialogDescription>
          </DialogHeader>
          {selectedCounselor && (
            <CounselorForm
              initialData={selectedCounselor}
              onSubmit={handleUpdateCounselor}
              buttonText="Update Counselor"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const CounselorCard: React.FC<{
  counselor: Counselor;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ counselor, onEdit, onDelete }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={counselor.avatarUrl} alt={counselor.name} />
          <AvatarFallback>{counselor.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-lg">{counselor.name}</CardTitle>
          <CardDescription>{counselor.specialty}</CardDescription>
        </div>
        <div className="flex items-center space-x-1">
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              counselor.status === "active" ? "bg-green-500" : "bg-gray-400"
            }`}
          />
          <span className="text-xs font-medium capitalize">{counselor.status}</span>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">{counselor.bio}</p>
        <div className="mt-2 text-sm">
          <span className="font-medium">Chats:</span> {counselor.chatCount}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onEdit}>
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive"
          onClick={onDelete}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CounselorManagement;
