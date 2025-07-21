"use client";

import { useState } from "react";
import type { Event, Todo } from "@/types";
import { addDays, startOfToday } from "date-fns";
import CalendarView from "@/components/kiddie-plan/CalendarView";
import TodoList from "@/components/kiddie-plan/TodoList";
import { Calendar, Users } from "lucide-react";
import { activityCategories } from "@/config/activities";

const today = startOfToday();

const initialEvents: Event[] = [
  { 
    id: `evt_${Date.now()}_1`, 
    title: "Soccer Practice", 
    description: "Practice at the main field.", 
    date: today, 
    category: "sport", 
    child: "Alex", 
    color: activityCategories.sport.color,
    todos: [
      { id: "t3", text: "Pack soccer bag for Saturday", completed: false },
    ]
  },
  { id: `evt_${Date.now()}_2`, title: "Piano Lesson", description: "With Mr. Smith.", date: addDays(today, 1), category: "hobby", child: "Ben", color: activityCategories.hobby.color, todos: [] },
  { id: `evt_${Date.now()}_3`, title: "School Assembly", description: "All school assembly in the main hall.", date: addDays(today, 2), category: "school", child: "Alex", color: activityCategories.school.color, todos: [] },
  { 
    id: `evt_${Date.now()}_4`, 
    title: "Leo's Birthday Party", 
    description: "At the park, bring a gift!", 
    date: addDays(today, 3), 
    category: "party", 
    child: "Ben", 
    color: activityCategories.party.color,
    todos: [
      { id: "t1", text: "Buy birthday gift for Leo", completed: false },
    ]
  },
  { id: `evt_${Date.now()}_5`, title: "Soccer Game", description: "Away game against the Eagles.", date: addDays(today, 4), category: "sport", child: "Alex", color: activityCategories.sport.color, todos: [] },
];

const initialTodos: Todo[] = [
  { id: "t2", text: "Finish math homework", completed: true },
];

export default function Home() {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  const handleUpdateEvent = (event: Event) => {
    setEvents((prev) => {
      const index = prev.findIndex((e) => e.id === event.id);
      if (index > -1) {
        const newEvents = [...prev];
        newEvents[index] = event;
        return newEvents;
      }
      return [...prev, event];
    });
    // If we're updating the selected event, update it in state too
    if (selectedEvent && selectedEvent.id === event.id) {
      setSelectedEvent(event);
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent(null);
    }
  };

  const handleUpdateTodo = (todo: Todo) => {
    if (selectedEvent) {
      const updatedEvent = {
        ...selectedEvent,
        todos: selectedEvent.todos.map(t => t.id === todo.id ? todo : t)
      };
      handleUpdateEvent(updatedEvent);
    } else {
      setTodos((prev) => prev.map(t => t.id === todo.id ? todo : t));
    }
  };
  
  const handleAddTodo = (text: string) => {
    const newTodo: Todo = { id: `todo_${Date.now()}`, text, completed: false };
    if (selectedEvent) {
      const updatedEvent = {
        ...selectedEvent,
        todos: [newTodo, ...selectedEvent.todos]
      };
      handleUpdateEvent(updatedEvent);
    } else {
      setTodos((prev) => [newTodo, ...prev]);
    }
  };

  const handleDeleteTodo = (todoId: string) => {
    if (selectedEvent) {
      const updatedEvent = {
        ...selectedEvent,
        todos: selectedEvent.todos.filter(t => t.id !== todoId)
      };
      handleUpdateEvent(updatedEvent);
    } else {
      setTodos((prev) => prev.filter((t) => t.id !== todoId));
    }
  };

  const handleSelectEvent = (eventId: string | null) => {
    if (eventId === null) {
      setSelectedEvent(null);
    } else {
      const event = events.find(e => e.id === eventId);
      setSelectedEvent(event || null);
    }
  };

  const displayedTodos = selectedEvent ? selectedEvent.todos : todos;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <header className="p-4 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold font-headline text-primary">KiddiePlan</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-semibold">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>Alex & Ben</span>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <CalendarView 
            events={events} 
            onUpdateEvent={handleUpdateEvent} 
            onDeleteEvent={handleDeleteEvent}
            onSelectEvent={handleSelectEvent}
            selectedEventId={selectedEvent?.id ?? null}
          />
        </div>
        <div className="lg:col-span-1">
          <TodoList 
            todos={displayedTodos}
            onUpdateTodo={handleUpdateTodo} 
            onDeleteTodo={handleDeleteTodo} 
            onAddTodo={handleAddTodo}
            selectedEvent={selectedEvent}
          />
        </div>
      </main>
    </div>
  );
}
