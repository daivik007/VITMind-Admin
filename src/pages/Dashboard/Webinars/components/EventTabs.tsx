
import React from 'react';
import { Calendar } from 'lucide-react';
import { Event } from './EventForm';
import EventCard from './EventCard';
import EventTable from './EventTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EventTabsProps {
  events: Event[];
  webinars: Event[];
  therapySessions: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

const EventTabs: React.FC<EventTabsProps> = ({ 
  events, 
  webinars, 
  therapySessions, 
  onEdit, 
  onDelete 
}) => {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all">All Events</TabsTrigger>
        <TabsTrigger value="webinars">Webinars</TabsTrigger>
        <TabsTrigger value="therapy">Therapy Sessions</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="space-y-4">
        <EventTable events={events} onEdit={onEdit} onDelete={onDelete} />
      </TabsContent>

      <TabsContent value="webinars" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {webinars.length > 0 ? (
            webinars.map((webinar) => (
              <EventCard 
                key={webinar.id} 
                event={webinar} 
                onEdit={onEdit} 
                onDelete={onDelete} 
              />
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
              <EventCard 
                key={session.id} 
                event={session} 
                onEdit={onEdit} 
                onDelete={onDelete} 
              />
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
  );
};

export default EventTabs;
