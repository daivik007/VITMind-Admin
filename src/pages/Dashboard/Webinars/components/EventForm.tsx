
import React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// Define event types
export type EventType = 'webinar' | 'therapy';

// Define the event interface
export interface Event {
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

interface EventFormProps {
  event: Partial<Event>;
  setEvent: React.Dispatch<React.SetStateAction<any>>;
  onCancel: () => void;
  onSubmit: () => void;
  submitButtonText: string;
}

const EventForm: React.FC<EventFormProps> = ({ 
  event, 
  setEvent, 
  onCancel, 
  onSubmit, 
  submitButtonText 
}) => {
  const [date, setDate] = React.useState<Date | undefined>(
    event.date ? new Date(event.date) : new Date()
  );

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Title
        </Label>
        <Input
          id="title"
          value={event.title || ''}
          onChange={(e) => setEvent({...event, title: e.target.value})}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Description
        </Label>
        <Textarea
          id="description"
          value={event.description || ''}
          onChange={(e) => setEvent({...event, description: e.target.value})}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="event-type" className="text-right">
          Event Type
        </Label>
        <Select
          value={event.event_type || 'webinar'}
          onValueChange={(value) => setEvent({...event, event_type: value as EventType})}
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
          {event.event_type === 'webinar' ? 'Presenter' : 'Therapist'}
        </Label>
        <Input
          id="presenter"
          value={event.presenter || ''}
          onChange={(e) => setEvent({...event, presenter: e.target.value})}
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
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                  setDate(selectedDate);
                  if (selectedDate) {
                    setEvent({
                      ...event, 
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
          value={event.time || '12:00'}
          onChange={(e) => setEvent({...event, time: e.target.value})}
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
          value={event.duration || 60}
          onChange={(e) => setEvent({...event, duration: parseInt(e.target.value) || 60})}
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
          value={event.max_attendees || 50}
          onChange={(e) => setEvent({...event, max_attendees: parseInt(e.target.value) || 50})}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="platform" className="text-right">
          Platform
        </Label>
        <Select
          value={event.platform || 'zoom'}
          onValueChange={(value) => setEvent({...event, platform: value})}
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
          value={event.link || ''}
          onChange={(e) => setEvent({...event, link: e.target.value})}
          className="col-span-3"
        />
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>{submitButtonText}</Button>
      </div>
    </div>
  );
};

export default EventForm;
