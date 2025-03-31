
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Resource } from "@/types";
import { Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ResourceForm: React.FC<{
  onSubmit: (data: Omit<Resource, "id">) => void;
  initialData?: Resource;
  buttonText: string;
}> = ({ onSubmit, initialData, buttonText }) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [link, setLink] = useState(initialData?.link || "");
  const [type, setType] = useState<Resource["type"]>(initialData?.type || "article");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      category,
      link,
      type,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Resource Type</Label>
          <Select
            value={type}
            onValueChange={(value) => setType(value as Resource["type"])}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="link">Resource Link</Label>
        <Input
          id="link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
        />
      </div>
      
      <Button type="submit">{buttonText}</Button>
    </form>
  );
};

const ResourcesManagement: React.FC = () => {
  const { resources, addResource, updateResource, deleteResource } = useApp();
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddResource = (data: Omit<Resource, "id">) => {
    addResource(data);
    setAddDialogOpen(false);
    toast({
      title: "Resource added",
      description: `"${data.title}" has been added to the resources.`,
    });
  };

  const handleUpdateResource = (data: Omit<Resource, "id">) => {
    if (selectedResource) {
      updateResource(selectedResource.id, data);
      setEditDialogOpen(false);
      toast({
        title: "Resource updated",
        description: `"${data.title}" has been updated.`,
      });
    }
  };

  const handleDeleteResource = (id: string, title: string) => {
    deleteResource(id);
    toast({
      title: "Resource removed",
      description: `"${title}" has been removed from the resources.`,
      variant: "destructive",
    });
  };

  // Group resources by category
  const resourcesByCategory = resources.reduce<Record<string, Resource[]>>(
    (acc, resource) => {
      if (!acc[resource.category]) {
        acc[resource.category] = [];
      }
      acc[resource.category].push(resource);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resources Management</h1>
          <p className="text-muted-foreground">
            Manage resources for users and counselors.
          </p>
        </div>
        
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Resource</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Resource</DialogTitle>
              <DialogDescription>
                Enter the details for the new resource.
              </DialogDescription>
            </DialogHeader>
            <ResourceForm
              onSubmit={handleAddResource}
              buttonText="Add Resource"
            />
          </DialogContent>
        </Dialog>
      </div>

      {Object.entries(resourcesByCategory).map(([category, categoryResources]) => (
        <div key={category} className="space-y-4">
          <h2 className="text-xl font-semibold">{category}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categoryResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onEdit={() => {
                  setSelectedResource(resource);
                  setEditDialogOpen(true);
                }}
                onDelete={() => handleDeleteResource(resource.id, resource.title)}
              />
            ))}
          </div>
        </div>
      ))}

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
            <DialogDescription>
              Update the resource information.
            </DialogDescription>
          </DialogHeader>
          {selectedResource && (
            <ResourceForm
              initialData={selectedResource}
              onSubmit={handleUpdateResource}
              buttonText="Update Resource"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ResourceCard: React.FC<{
  resource: Resource;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ resource, onEdit, onDelete }) => {
  const getTypeIcon = (type: Resource["type"]) => {
    switch (type) {
      case "article":
        return "📄";
      case "video":
        return "🎥";
      case "audio":
        return "🎧";
      case "pdf":
        return "📑";
      default:
        return "📝";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{resource.title}</CardTitle>
          <div className="text-lg">{getTypeIcon(resource.type)}</div>
        </div>
        <CardDescription className="capitalize">{resource.type}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {resource.description}
        </p>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
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
        </div>
        
        <Button variant="ghost" size="sm" asChild>
          <a href={resource.link} target="_blank" rel="noopener noreferrer">
            View
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResourcesManagement;
