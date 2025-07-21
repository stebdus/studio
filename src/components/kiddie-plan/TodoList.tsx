"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Plus } from "lucide-react";
import type { Event, Todo } from "@/types";
import TodoItem from "./TodoItem";
import { AnimatePresence } from "framer-motion";

interface TodoListProps {
  todos: Todo[];
  onUpdateTodo: (todo: Todo) => void;
  onDeleteTodo: (todoId: string) => void;
  onAddTodo: (text: string) => void;
  selectedEvent: Event | null;
  onShowAllWeekTodos: () => void;
  showingAllWeekTodos: boolean;
}

export default function TodoList({ todos, onUpdateTodo, onDeleteTodo, onAddTodo, selectedEvent, onShowAllWeekTodos, showingAllWeekTodos }: TodoListProps) {
  const [newTodoText, setNewTodoText] = useState("");

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      onAddTodo(newTodoText.trim());
      setNewTodoText("");
    }
  };
  
  const getTitle = () => {
    if (showingAllWeekTodos) return "This Week's To-Dos";
    if (selectedEvent) return "Event To-Dos";
    return "General To-Dos";
  }

  const getDescription = () => {
    if (showingAllWeekTodos) return "All tasks for the current week.";
    if (selectedEvent) return `Tasks for "${selectedEvent.title}"`;
    return "Your general tasks and reminders.";
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline text-2xl">{getTitle()}</CardTitle>
                <CardDescription>{getDescription()}</CardDescription>
            </div>
            {!selectedEvent && !showingAllWeekTodos && (
                <Button variant="outline" size="sm" onClick={onShowAllWeekTodos}>
                    <CalendarCheck className="mr-2 h-4 w-4"/>
                    Week's To-Dos
                </Button>
            )}
        </div>
      </CardHeader>
      <CardContent className="min-h-[200px]">
        <form onSubmit={handleAddTodo} className="flex w-full items-center space-x-2 mb-4">
          <Input 
            value={newTodoText} 
            onChange={(e) => setNewTodoText(e.target.value)} 
            placeholder="Add a new to-do..."
            disabled={showingAllWeekTodos}
          />
          <Button type="submit" size="icon" aria-label="Add to-do" disabled={showingAllWeekTodos}>
            <Plus className="h-4 w-4" />
          </Button>
        </form>
        <div className="space-y-2">
          <AnimatePresence>
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onUpdate={onUpdateTodo} onDelete={onDeleteTodo} />
            ))}
          </AnimatePresence>
           {todos.length === 0 && (
            <p className="text-sm text-muted-foreground text-center pt-8">
              {showingAllWeekTodos ? "No to-dos for this week." : "No to-dos here."}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
