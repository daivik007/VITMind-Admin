
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import EventTabs from './components/EventTabs';
import EventDialog from './components/EventDialog';
import { Event, EventType } from './components/EventForm';

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

      {/* Event Tabs for displaying events */}
      <EventTabs 
        events={events || []} 
        webinars={webinars} 
        therapySessions={therapySessions} 
        onEdit={openEditModal} 
        onDelete={handleDeleteEvent} 
      />

      {/* Add Event Dialog */}
      <EventDialog
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        title="Schedule New Event"
        description="Fill in the details below to create a new webinar or therapy session."
        event={newEvent}
        setEvent={setNewEvent}
        onCancel={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateEvent}
        submitButtonText="Create Event"
      />

      {/* Edit Event Dialog */}
      <EventDialog
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Edit Event"
        description="Update the details of this event."
        event={selectedEvent || {}}
        setEvent={setSelectedEvent}
        onCancel={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateEvent}
        submitButtonText="Save Changes"
      />
    </div>
  );
};

export default WebinarsManagement;
