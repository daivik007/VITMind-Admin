
import React from 'react';
import { Event } from './EventForm';
import EventForm from './EventForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  event: Partial<Event>;
  setEvent: React.Dispatch<React.SetStateAction<any>>;
  onCancel: () => void;
  onSubmit: () => void;
  submitButtonText: string;
}

const EventDialog: React.FC<EventDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  event,
  setEvent,
  onCancel,
  onSubmit,
  submitButtonText
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <EventForm
          event={event}
          setEvent={setEvent}
          onCancel={onCancel}
          onSubmit={onSubmit}
          submitButtonText={submitButtonText}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
