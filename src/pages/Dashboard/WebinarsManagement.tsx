
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Calendar, 
  Calendar as CalendarIcon, 
  Clock, 
  Edit, 
  Trash, 
  UserPlus, 
  Video 
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

// Define event types
type EventType = 'webinar' | 'therapy';

// Define the event interface
interface Event {
  id: string;
  title: string;
  description: string;
  event_type: EventType;
  presenter: string;
  date: string;
  time: string;
  duration: number;
  max_attendees: number;
  platform: string;
  link: string | null;
  created_at: string;
}

// Default/empty event
const emptyEvent: Omit<Event, 'id' | 'created_at'> = {
  title: '',
  description: '',
  event_type: 'webinar',
  presenter: '',
  date: format(new Date(), 'yyyy-MM-dd'),
  time: '12:00',
  duration: 60,
  max_attendees: 50,
  platform: 'zoom',
  link: '',
};

const WebinarsManagement: React.FC = () => {
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id' | 'created_at'>>(emptyEvent);
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Query to fetch all events
  const { data: events, isLoading, isError, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data as Event[];
    }
  });

  // Function to handle creating a new event
  const handleCreateEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([newEvent])
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Event Created",
        description: `${newEvent.title} has been scheduled successfully.`,
      });
      
      setIsAddModalOpen(false);
      setNewEvent(emptyEvent);
      refetch();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to handle updating an event
  const handleUpdateEvent = async () => {
    if (!selectedEvent) return;
    
    try {
      const { data, error } = await supabase
        .from('events')
        .update({
          title: selectedEvent.title,
          description: selectedEvent.description,
          event_type: selectedEvent.event_type,
          presenter: selectedEvent.presenter,
          date: selectedEvent.date,
          time: selectedEvent.time,
          duration: selectedEvent.duration,
          max_attendees: selectedEvent.max_attendees,
          platform: selectedEvent.platform,
          link: selectedEvent.link,
        })
        .eq('id', selectedEvent.id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Event Updated",
        description: `${selectedEvent.title} has been updated successfully.`,
      });
      
      setIsEditModalOpen(false);
      setSelectedEvent(null);
      refetch();
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to handle deleting an event
  const handleDeleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Event Deleted",
        description: "The event has been removed from the schedule.",
      });
      
      refetch();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to open edit modal with selected event
  const openEditModal = (event: Event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading events...</div>;
  }

  if (isError) {
    return <div className="flex justify-center items-center h-full">Error loading events.</div>;
  }

  // Filter for webinars and therapy sessions
  const webinars = events?.filter(event => event.event_type === 'webinar') || [];
  const therapySessions = events?.filter(event => event.event_type === 'therapy') || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Webinars & Therapy Sessions</h2>
          <p className="text-muted-foreground">
            Manage all upcoming webinars and therapy sessions.
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Calendar className="mr-2 h-4 w-4" />
          Schedule New Event
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="webinars">Webinars</TabsTrigger>
          <TabsTrigger value="therapy">Therapy Sessions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Presenter</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events && events.length > 0 ? (
                events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        event.event_type === 'webinar' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {event.event_type === 'webinar' ? 'Webinar' : 'Therapy Session'}
                      </span>
                    </TableCell>
                    <TableCell>{event.presenter}</TableCell>
                    <TableCell>{format(new Date(event.date), 'PPP')} at {event.time}</TableCell>
                    <TableCell>{event.duration} minutes</TableCell>
                    <TableCell className="capitalize">{event.platform}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openEditModal(event)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteEvent(event.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">No events scheduled</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="webinars" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {webinars.length > 0 ? (
              webinars.map((webinar) => (
                <Card key={webinar.id}>
                  <CardHeader>
                    <CardTitle>{webinar.title}</CardTitle>
                    <CardDescription className="flex items-center">
                      <Video className="h-4 w-4 mr-1" />
                      {webinar.platform.charAt(0).toUpperCase() + webinar.platform.slice(1)} Webinar
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">{webinar.description}</p>
                      <div className="flex items-center text-sm">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {format(new Date(webinar.date), 'PPP')}
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        {webinar.time} | {webinar.duration} minutes
                      </div>
                      <div className="flex items-center text-sm">
                        <UserPlus className="h-4 w-4 mr-1" />
                        Max attendees: {webinar.max_attendees}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => openEditModal(webinar)}>Edit</Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteEvent(webinar.id)}>Delete</Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <Calendar className="mx-auto h-10 w-10 text-muted-foreground" />
                <h3 className="mt-2 text-lg font-medium">No webinars scheduled</h3>
                <p className="text-sm text-muted-foreground">Get started by creating a new webinar.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="therapy" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {therapySessions.length > 0 ? (
              therapySessions.map((session) => (
                <Card key={session.id}>
                  <CardHeader>
                    <CardTitle>{session.title}</CardTitle>
                    <CardDescription>Therapy Session</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">{session.description}</p>
                      <div className="flex items-center text-sm">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {format(new Date(session.date), 'PPP')}
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        {session.time} | {session.duration} minutes
                      </div>
                      <div className="flex items-center text-sm">
                        <UserPlus className="h-4 w-4 mr-1" />
                        Therapist: {session.presenter}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => openEditModal(session)}>Edit</Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteEvent(session.id)}>Delete</Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <Calendar className="mx-auto h-10 w-10 text-muted-foreground" />
                <h3 className="mt-2 text-lg font-medium">No therapy sessions scheduled</h3>
                <p className="text-sm text-muted-foreground">Get started by creating a new therapy session.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Event Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Schedule New Event</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new webinar or therapy session.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-type" className="text-right">
                Event Type
              </Label>
              <Select
                value={newEvent.event_type}
                onValueChange={(value) => setNewEvent({...newEvent, event_type: value as EventType})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="webinar">Webinar</SelectItem>
                  <SelectItem value="therapy">Therapy Session</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="presenter" className="text-right">
                {newEvent.event_type === 'webinar' ? 'Presenter' : 'Therapist'}
              </Label>
              <Input
                id="presenter"
                value={newEvent.presenter}
                onChange={(e) => setNewEvent({...newEvent, presenter: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={(selectedDate) => {
                        setDate(selectedDate);
                        if (selectedDate) {
                          setNewEvent({
                            ...newEvent, 
                            date: format(selectedDate, 'yyyy-MM-dd')
                          });
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration (mins)
              </Label>
              <Input
                id="duration"
                type="number"
                value={newEvent.duration}
                onChange={(e) => setNewEvent({...newEvent, duration: parseInt(e.target.value) || 60})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="max-attendees" className="text-right">
                Max Attendees
              </Label>
              <Input
                id="max-attendees"
                type="number"
                value={newEvent.max_attendees}
                onChange={(e) => setNewEvent({...newEvent, max_attendees: parseInt(e.target.value) || 50})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="platform" className="text-right">
                Platform
              </Label>
              <Select
                value={newEvent.platform}
                onValueChange={(value) => setNewEvent({...newEvent, platform: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zoom">Zoom</SelectItem>
                  <SelectItem value="teams">Microsoft Teams</SelectItem>
                  <SelectItem value="meet">Google Meet</SelectItem>
                  <SelectItem value="inperson">In Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link" className="text-right">
                Meeting Link
              </Label>
              <Input
                id="link"
                value={newEvent.link || ''}
                onChange={(e) => setNewEvent({...newEvent, link: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateEvent}>Create Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update the details of this event.
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="edit-title"
                  value={selectedEvent.title}
                  onChange={(e) => setSelectedEvent({...selectedEvent, title: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={selectedEvent.description}
                  onChange={(e) => setSelectedEvent({...selectedEvent, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-event-type" className="text-right">
                  Event Type
                </Label>
                <Select
                  value={selectedEvent.event_type}
                  onValueChange={(value) => setSelectedEvent({...selectedEvent, event_type: value as EventType})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="webinar">Webinar</SelectItem>
                    <SelectItem value="therapy">Therapy Session</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-presenter" className="text-right">
                  {selectedEvent.event_type === 'webinar' ? 'Presenter' : 'Therapist'}
                </Label>
                <Input
                  id="edit-presenter"
                  value={selectedEvent.presenter}
                  onChange={(e) => setSelectedEvent({...selectedEvent, presenter: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-date" className="text-right">
                  Date
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedEvent.date ? format(new Date(selectedEvent.date), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={selectedEvent.date ? new Date(selectedEvent.date) : undefined}
                        onSelect={(selectedDate) => {
                          if (selectedDate) {
                            setSelectedEvent({
                              ...selectedEvent, 
                              date: format(selectedDate, 'yyyy-MM-dd')
                            });
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-time" className="text-right">
                  Time
                </Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={selectedEvent.time}
                  onChange={(e) => setSelectedEvent({...selectedEvent, time: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-duration" className="text-right">
                  Duration (mins)
                </Label>
                <Input
                  id="edit-duration"
                  type="number"
                  value={selectedEvent.duration}
                  onChange={(e) => setSelectedEvent({...selectedEvent, duration: parseInt(e.target.value) || 60})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-max-attendees" className="text-right">
                  Max Attendees
                </Label>
                <Input
                  id="edit-max-attendees"
                  type="number"
                  value={selectedEvent.max_attendees}
                  onChange={(e) => setSelectedEvent({...selectedEvent, max_attendees: parseInt(e.target.value) || 50})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-platform" className="text-right">
                  Platform
                </Label>
                <Select
                  value={selectedEvent.platform}
                  onValueChange={(value) => setSelectedEvent({...selectedEvent, platform: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zoom">Zoom</SelectItem>
                    <SelectItem value="teams">Microsoft Teams</SelectItem>
                    <SelectItem value="meet">Google Meet</SelectItem>
                    <SelectItem value="inperson">In Person</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-link" className="text-right">
                  Meeting Link
                </Label>
                <Input
                  id="edit-link"
                  value={selectedEvent.link || ''}
                  onChange={(e) => setSelectedEvent({...selectedEvent, link: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateEvent}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WebinarsManagement;
