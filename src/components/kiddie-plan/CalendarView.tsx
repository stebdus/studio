
"use client";

import { useState, useEffect } from "react";
import { add, format, eachDayOfInterval, startOfWeek, endOfWeek, sub, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, PlusCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Event, ActivityCategoryConfig } from "@/types";
import EventCard from "./EventCard";
import { EventDialog } from "./EventDialog";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  events: Event[];
  currentDate: Date;
  onSetCurrentDate: (date: Date) => void;
  onUpdateEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
  onSelectEvent: (eventId: string | null) => void;
  selectedEventId: string | null;
  children: string[];
  activityCategories: ActivityCategoryConfig[];
}

export default function CalendarView({ events, currentDate, onSetCurrentDate, onUpdateEvent, onDeleteEvent, onSelectEvent, selectedEventId, children, activityCategories }: CalendarViewProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEventForDialog, setSelectedEventForDialog] = useState<Event | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setToday(new Date());
  }, []);

  const week = eachDayOfInterval({
    start: startOfWeek(currentDate, { weekStartsOn: 1 }),
    end: endOfWeek(currentDate, { weekStartsOn: 1 }),
  });

  const nextWeek = () => onSetCurrentDate(add(currentDate, { weeks: 1 }));
  const prevWeek = () => onSetCurrentDate(sub(currentDate, { weeks: 1 }));

  const handleAddEventClick = (date: Date) => {
    setSelectedEventForDialog(undefined);
    setSelectedDate(date);
    onSelectEvent(null);
    setIsDialogOpen(true);
  };
  
  const handleEventClick = (event: Event) => {
    if (selectedEventId === event.id) {
      onSelectEvent(null);
    } else {
      onSelectEvent(event.id);
    }
  };

  const handleEditEventClick = (event: Event) => {
    setSelectedEventForDialog(event);
    setSelectedDate(event.date);
    setIsDialogOpen(true);
  }

  const handleClearSelection = () => {
    onSelectEvent(null);
  }

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
           {selectedEventId && (
            <Button variant="ghost" size="sm" onClick={handleClearSelection} className="text-muted-foreground">
              <X className="mr-2 h-4 w-4" />
              Clear Selection
            </Button>
          )}
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
            <div 
              key={day.toString()} 
              className={cn("grid grid-rows-2 border-r relative group transition-colors", { "bg-muted/50": !selectedEventId && today && isSameDay(day, today) })}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                   onSelectEvent(null);
                }
              }}
            >
              {children.map((child, index) => (
                <div key={child} className={`p-2 h-48 overflow-y-auto ${index === 0 ? 'border-b' : ''}`}>
                  {index === 0 && <div className="absolute top-1 left-1 text-xs font-bold text-muted-foreground">{child}</div>}
                  {index === 1 && <div className="absolute top-1/2 left-1 text-xs font-bold text-muted-foreground">{child}</div>}
                  <div className="mt-4 space-y-1">
                    {events
                      .filter((e) => isSameDay(e.date, day) && e.child === child)
                      .sort((a,b) => a.date.getTime() - b.date.getTime())
                      .map((event) => (
                        <EventCard 
                          key={event.id} 
                          event={event}
                          activityCategories={activityCategories}
                          onClick={() => handleEventClick(event)}
                          onEditClick={() => handleEditEventClick(event)}
                          isSelected={selectedEventId === event.id}
                        />
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
        event={selectedEventForDialog}
        selectedDate={selectedDate}
        onUpdateEvent={onUpdateEvent}
        onDeleteEvent={onDeleteEvent}
        children={children}
        activityCategories={activityCategories}
      />
    </Card>
  );
}
