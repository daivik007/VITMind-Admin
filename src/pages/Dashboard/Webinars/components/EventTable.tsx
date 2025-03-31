
import React from 'react';
import { format } from 'date-fns';
import { Edit, Trash } from 'lucide-react';
import { Event } from './EventForm';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EventTableProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

const EventTable: React.FC<EventTableProps> = ({ events, onEdit, onDelete }) => {
  return (
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
                  <Button variant="outline" size="sm" onClick={() => onEdit(event)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDelete(event.id)}>
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
  );
};

export default EventTable;
