
import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, UserPlus, Video } from 'lucide-react';
import { Event } from './EventForm';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription className="flex items-center">
          {event.event_type === 'webinar' ? (
            <>
              <Video className="h-4 w-4 mr-1" />
              {event.platform.charAt(0).toUpperCase() + event.platform.slice(1)} Webinar
            </>
          ) : (
            'Therapy Session'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-1" />
            {format(new Date(event.date), 'PPP')}
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-1" />
            {event.time} | {event.duration} minutes
          </div>
          <div className="flex items-center text-sm">
            <UserPlus className="h-4 w-4 mr-1" />
            {event.event_type === 'webinar' ? 'Max attendees: ' : 'Therapist: '}
            {event.event_type === 'webinar' ? event.max_attendees : event.presenter}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onEdit(event)}>Edit</Button>
        <Button variant="outline" size="sm" onClick={() => onDelete(event.id)}>Delete</Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
