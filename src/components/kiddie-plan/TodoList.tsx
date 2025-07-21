"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Event, Todo } from "@/types";
import TodoItem from "./TodoItem";
import { AnimatePresence } from "framer-motion";

interface TodoListProps {
  todos: Todo[];
  onUpdateTodo: (todo: Todo) => void;
  onDeleteTodo: (todoId: string) => void;
  onAddTodo: (text: string) => void;
  selectedEvent: Event | null;
}

export default function TodoList({ todos, onUpdateTodo, onDeleteTodo, onAddTodo, selectedEvent }: TodoListProps) {
  const [newTodoText, setNewTodoText] = useState("");

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      onAddTodo(newTodoText.trim());
      setNewTodoText("");
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
            {selectedEvent ? "Event To-Dos" : "General To-Dos"}
        </CardTitle>
        <CardDescription>
            {selectedEvent ? `Tasks for "${selectedEvent.title}"` : "Your general tasks and reminders."}
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[200px]">
        <form onSubmit={handleAddTodo} className="flex w-full items-center space-x-2 mb-4">
          <Input 
            value={newTodoText} 
            onChange={(e) => setNewTodoText(e.target.value)} 
            placeholder="Add a new to-do..."
          />
          <Button type="submit" size="icon" aria-label="Add to-do">
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
              No to-dos here.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
