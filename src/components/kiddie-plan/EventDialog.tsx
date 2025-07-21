"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Event, Todo } from "@/types";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Plus, Trash2, X } from "lucide-react";
import { format } from "date-fns";
import { activityCategories } from "@/config/activities";
import { useToast } from "@/hooks/use-toast";

const todoSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "To-do text cannot be empty"),
  completed: z.boolean(),
});

const eventSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  date: z.date({ required_error: "A date for the event is required." }),
  child: z.enum(["Alex", "Ben"], { required_error: "Please select a child" }),
  category: z.enum(["school", "sport", "party", "hobby"], { required_error: "Please select a category" }),
  color: z.string(),
  todos: z.array(todoSchema),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  event?: Event;
  selectedDate?: Date;
  onUpdateEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
}

export function EventDialog({ isOpen, setIsOpen, event, selectedDate, onUpdateEvent, onDeleteEvent }: EventDialogProps) {
  const { toast } = useToast();
  const [newTodoText, setNewTodoText] = useState("");

  const defaultCategory = event?.category || "school";
  const defaultColor = event?.color || activityCategories[defaultCategory].color;

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: event 
      ? {...event}
      : {
          title: "",
          description: "",
          date: selectedDate || new Date(),
          child: "Alex",
          category: "school",
          color: activityCategories.school.color,
          todos: [],
        },
  });

  const watchedCategory = form.watch("category");

  React.useEffect(() => {
    form.setValue('color', activityCategories[watchedCategory].color);
  }, [watchedCategory, form]);
  
  React.useEffect(() => {
    if (isOpen) {
      const category = event?.category || "school";
      const color = event?.color || activityCategories[category].color;
      form.reset(event ? {...event} : {
        title: "",
        description: "",
        date: selectedDate || new Date(),
        child: "Alex",
        category: category,
        color: color,
        todos: [],
      });
      setNewTodoText("");
    }
  }, [isOpen, event, selectedDate, form]);
  
  const handleAddTodo = () => {
    if (newTodoText.trim() === "") return;
    const newTodo: Todo = {
      id: `todo_${Date.now()}`,
      text: newTodoText.trim(),
      completed: false
    };
    const currentTodos = form.getValues('todos');
    form.setValue('todos', [...currentTodos, newTodo]);
    setNewTodoText("");
  };

  const handleRemoveTodo = (todoId: string) => {
    const currentTodos = form.getValues('todos');
    form.setValue('todos', currentTodos.filter(t => t.id !== todoId));
  }

  const onSubmit = (data: EventFormValues) => {
    const newEvent: Event = {
      id: event?.id || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      ...data,
    };
    onUpdateEvent(newEvent);
    toast({
      title: event ? "Event Updated" : "Event Created",
      description: `"${data.title}" has been saved.`,
    });
    setIsOpen(false);
  };

  const handleDelete = () => {
    if (event) {
      onDeleteEvent(event.id);
      toast({
        title: "Event Deleted",
        description: `"${event.title}" has been removed.`,
        variant: "destructive"
      });
      setIsOpen(false);
    }
  };
  
  const todos = form.watch('todos');

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Add Event"}</DialogTitle>
          <DialogDescription>
            {event ? "Make changes to your event here." : "Add a new event to your calendar."} Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Soccer Practice" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add any details..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="child"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>For which child?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Alex" />
                        </FormControl>
                        <FormLabel className="font-normal">Alex</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Ben" />
                        </FormControl>
                        <FormLabel className="font-normal">Ben</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-4">
                <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                    <FormItem className="col-span-2">
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select an activity type" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {Object.entries(activityCategories).map(([key, { label }]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <div className="w-full h-10 rounded-md border border-input" style={{ backgroundColor: field.value }}></div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
            </div>

            <div className="space-y-2">
              <FormLabel>To-dos for this event</FormLabel>
              <div className="space-y-2 rounded-md border p-2">
                {todos.length > 0 ? (
                  todos.map((todo) => (
                    <div key={todo.id} className="flex items-center gap-2">
                      <span className="flex-1 text-sm">{todo.text}</span>
                       <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveTodo(todo.id)}>
                         <X className="h-4 w-4"/>
                       </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground p-2 text-center">No to-dos yet.</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                 <Input 
                   value={newTodoText}
                   onChange={(e) => setNewTodoText(e.target.value)}
                   placeholder="Add a to-do..."
                   onKeyDown={(e) => {
                     if (e.key === "Enter") {
                       e.preventDefault();
                       handleAddTodo();
                     }
                   }}
                 />
                 <Button type="button" size="icon" onClick={handleAddTodo}>
                   <Plus className="h-4 w-4" />
                 </Button>
              </div>
            </div>

            <DialogFooter className="pt-4 sticky bottom-0 bg-background py-4">
              {event && (
                 <Button type="button" variant="destructive" onClick={handleDelete} className="mr-auto">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
              )}
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
