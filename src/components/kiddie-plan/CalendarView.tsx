"use client";

import { useState } from "react";
import { add, format, eachDayOfInterval, startOfWeek, endOfWeek, sub, isSameDay, getDay } from "date-fns";
import { ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Event } from "@/types";
import EventCard from "./EventCard";
import { EventDialog } from "./EventDialog";

interface CalendarViewProps {
  events: Event[];
  onUpdateEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
}

const children = ["Alex", "Ben"];

export default function CalendarView({ events, onUpdateEvent, onDeleteEvent }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const week = eachDayOfInterval({
    start: startOfWeek(currentDate, { weekStartsOn: 1 }),
    end: endOfWeek(currentDate, { weekStartsOn: 1 }),
  });

  const nextWeek = () => setCurrentDate(add(currentDate, { weeks: 1 }));
  const prevWeek = () => setCurrentDate(sub(currentDate, { weeks: 1 }));

  const handleAddEventClick = (date: Date) => {
    setSelectedEvent(undefined);
    setSelectedDate(date);
    setIsDialogOpen(true);
  };
  
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setSelectedDate(event.date);
    setIsDialogOpen(true);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <CardTitle className="font-headline text-2xl">
            {format(week[0], "MMMM yyyy")}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevWeek} aria-label="Previous week">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextWeek} aria-label="Next week">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button onClick={() => handleAddEventClick(new Date())}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Event
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 border-t border-l">
          {week.map((day) => (
            <div key={day.toString()} className="text-center font-bold p-2 border-r border-b text-sm">
              <div>{format(day, "eee")}</div>
              <div className="font-normal text-muted-foreground">{format(day, "d")}</div>
            </div>
          ))}
          {week.map((day) => (
            <div key={day.toString()} className="grid grid-rows-2 border-r relative group">
              {children.map((child, index) => (
                <div key={child} className={`p-2 h-48 overflow-y-auto ${index === 0 ? 'border-b' : ''}`}>
                  {index === 0 && <div className="absolute top-1 left-1 text-xs font-bold text-muted-foreground">{child}</div>}
                  {index === 1 && <div className="absolute top-1/2 left-1 text-xs font-bold text-muted-foreground">{child}</div>}
                  <div className="mt-4 space-y-1">
                    {events
                      .filter((e) => isSameDay(e.date, day) && e.child === child)
                      .sort((a,b) => a.date.getTime() - b.date.getTime())
                      .map((event) => (
                        <EventCard key={event.id} event={event} onClick={() => handleEventClick(event)} />
                      ))}
                  </div>
                </div>
              ))}
              <Button size="icon" variant="ghost" className="absolute top-1/2 right-1 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-8 w-8" onClick={() => handleAddEventClick(day)}>
                <PlusCircle className="w-5 h-5 text-muted-foreground"/>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      <EventDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        event={selectedEvent}
        selectedDate={selectedDate}
        onUpdateEvent={onUpdateEvent}
        onDeleteEvent={onDeleteEvent}
      />
    </Card>
  );
}
