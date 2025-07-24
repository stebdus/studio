"use client";

import { useState } from "react";
import type { Event, Todo, ActivityCategoryConfig } from "@/types";
import { addDays, startOfToday, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";
import CalendarView from "@/components/kiddie-plan/CalendarView";
import TodoList from "@/components/kiddie-plan/TodoList";
import { Users, Settings, School, PartyPopper, Dumbbell, Palette } from "lucide-react";
import SettingsDialog from "@/components/kiddie-plan/SettingsDialog";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";


const today = startOfToday();

const initialCategories: ActivityCategoryConfig[] = [
    { id: 'school', label: 'School', color: '#3b82f6', icon: School },
    { id: 'sport', label: 'Sport', color: '#22c55e', icon: Dumbbell },
    { id: 'party', label: 'Party', color: '#a855f7', icon: PartyPopper },
    { id: 'hobby', label: 'Hobby', color: '#f59e0b', icon: Palette },
];

const initialEvents: Event[] = [
  { 
    id: `evt_${Date.now()}_1`, 
    title: "Soccer Practice", 
    description: "Practice at the main field.", 
    date: today, 
    category: "sport", 
    child: "Alex", 
    color: initialCategories.find(c => c.id === 'sport')?.color || '#000000',
    todos: [
      { id: "t3", text: "Pack soccer bag for Saturday", completed: false },
    ]
  },
  { id: `evt_${Date.now()}_2`, title: "Piano Lesson", description: "With Mr. Smith.", date: addDays(today, 1), category: "hobby", child: "Ben", color: initialCategories.find(c => c.id === 'hobby')?.color || '#000000', todos: [] },
  { id: `evt_${Date.now()}_3`, title: "School Assembly", description: "All school assembly in the main hall.", date: addDays(today, 2), category: "school", child: "Alex", color: initialCategories.find(c => c.id === 'school')?.color || '#000000', todos: [] },
  { 
    id: `evt_${Date.now()}_4`, 
    title: "Leo's Birthday Party", 
    description: "At the park, bring a gift!", 
    date: addDays(today, 3), 
    category: "party", 
    child: "Ben", 
    color: initialCategories.find(c => c.id === 'party')?.color || '#000000',
    todos: [
      { id: "t1", text: "Buy birthday gift for Leo", completed: false },
    ]
  },
  { id: `evt_${Date.now()}_5`, title: "Soccer Game", description: "Away game against the Eagles.", date: addDays(today, 4), category: "sport", child: "Alex", color: initialCategories.find(c => c.id === 'sport')?.color || '#000000', todos: [] },
].map(e => ({...e, date: new Date(e.date)}));

const initialTodos: Todo[] = [
  { id: "t2", text: "Finish math homework", completed: true },
];

const parseStoredEvents = (events: Event[]): Event[] => {
  return events.map(e => ({...e, date: new Date(e.date)}));
}

export default function Home() {
  const [events, setEvents] = useLocalStorage<Event[]>("kiddieplan:events", initialEvents, parseStoredEvents);
  const [todos, setTodos] = useLocalStorage<Todo[]>("kiddieplan:todos", initialTodos);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showingAllWeekTodos, setShowingAllWeekTodos] = useState(false);
  const [children, setChildren] = useLocalStorage<string[]>("kiddieplan:children", ['Alex', 'Ben']);
  const [activityCategories, setActivityCategories] = useLocalStorage<ActivityCategoryConfig[]>("kiddieplan:categories", initialCategories, (cats) => {
    const iconMap: {[key: string]: React.ComponentType<{ className?: string }>} = {
      school: School,
      sport: Dumbbell,
      party: PartyPopper,
      hobby: Palette,
    };
    return cats.map(c => ({...c, icon: iconMap[c.id] || Palette}));
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
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
    if (selectedEvent && !showingAllWeekTodos) {
      const updatedEvent = {
        ...selectedEvent,
        todos: selectedEvent.todos.map(t => t.id === todo.id ? todo : t)
      };
      handleUpdateEvent(updatedEvent);
    } else {
      // It's either a general todo or a todo from an event while in "all week" view
      let wasInEvent = false;
      const updatedEvents = events.map(event => {
        if (event.todos.some(t => t.id === todo.id)) {
          wasInEvent = true;
          return { ...event, todos: event.todos.map(t => t.id === todo.id ? todo : t) };
        }
        return event;
      });

      if (wasInEvent) {
        setEvents(updatedEvents);
      } else {
        setTodos((prev) => prev.map(t => t.id === todo.id ? todo : t));
      }
    }
  };
  
  const handleAddTodo = (text: string) => {
    const newTodo: Todo = { id: `todo_${Date.now()}`, text, completed: false };
    if (selectedEvent && !showingAllWeekTodos) {
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
     if (selectedEvent && !showingAllWeekTodos) {
      const updatedEvent = {
        ...selectedEvent,
        todos: selectedEvent.todos.filter(t => t.id !== todoId)
      };
      handleUpdateEvent(updatedEvent);
    } else {
      // It's either a general todo or a todo from an event while in "all week" / general view
      let wasInEvent = false;
      const updatedEvents = events.map(event => {
         if (event.todos.some(t => t.id === todoId)) {
           wasInEvent = true;
           return { ...event, todos: event.todos.filter(t => t.id !== todoId) };
         }
         return event;
       });
 
       if (wasInEvent) {
         setEvents(updatedEvents);
       } else {
         setTodos((prev) => prev.filter((t) => t.id !== todoId));
       }
    }
  };

  const handleSelectEvent = (eventId: string | null) => {
    setShowingAllWeekTodos(false);
    if (eventId === null) {
      setSelectedEvent(null);
    } else {
      const event = events.find(e => e.id === eventId);
      setSelectedEvent(event || null);
    }
  };
  
  const handleShowAllWeekTodos = () => {
    setSelectedEvent(null);
    setShowingAllWeekTodos(true);
  }
  
  const getDisplayedTodos = () => {
    if (showingAllWeekTodos) {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEvents = events.filter(e => isWithinInterval(e.date, { start: weekStart, end: weekEnd }));
      const eventTodos = weekEvents.flatMap(e => e.todos);
      return [...todos, ...eventTodos];
    }
    return selectedEvent ? selectedEvent.todos : todos;
  }

  const handleSettingsSave = (settings: { children: string[], categories: ActivityCategoryConfig[] }) => {
    const oldChildren = [...children];
    setChildren(settings.children);
    setActivityCategories(settings.categories);

    // Update existing events with new category/child data
    setEvents(prevEvents => prevEvents.map(event => {
      const newCategory = settings.categories.find(c => c.id === event.category);
      const childIndex = oldChildren.indexOf(event.child);
      const newChild = settings.children[childIndex] || event.child;

      return {
        ...event,
        child: newChild,
        color: newCategory ? newCategory.color : event.color,
      };
    }));
  };

  const displayedTodos = getDisplayedTodos();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <header className="p-4 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold font-headline text-primary">KiddiePlan</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-semibold">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>{children.join(' & ')}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)} aria-label="Settings">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <CalendarView 
            events={events} 
            currentDate={currentDate}
            onSetCurrentDate={setCurrentDate}
            onUpdateEvent={handleUpdateEvent} 
            onDeleteEvent={handleDeleteEvent}
            onSelectEvent={handleSelectEvent}
            selectedEventId={selectedEvent?.id ?? null}
            children={children}
            activityCategories={activityCategories}
          />
        </div>
        <div className="lg:col-span-1">
          <TodoList 
            todos={displayedTodos}
            onUpdateTodo={handleUpdateTodo} 
            onDeleteTodo={handleDeleteTodo} 
            onAddTodo={handleAddTodo}
            selectedEvent={selectedEvent}
            onShowAllWeekTodos={handleShowAllWeekTodos}
            showingAllWeekTodos={showingAllWeekTodos}
          />
        </div>
      </main>
       <SettingsDialog
        isOpen={isSettingsOpen}
        setIsOpen={setIsSettingsOpen}
        currentChildren={children}
        currentCategories={activityCategories}
        onSave={handleSettingsSave}
      />
    </div>
  );
}
