"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Todo } from "@/types";
import TodoItem from "./TodoItem";
import { AnimatePresence } from "framer-motion";

interface TodoListProps {
  todos: Todo[];
  onUpdateTodo: (todo: Todo) => void;
  onDeleteTodo: (todoId: string) => void;
  onAddTodo: (text: string) => void;
}

export default function TodoList({ todos, onUpdateTodo, onDeleteTodo, onAddTodo }: TodoListProps) {
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
        <CardTitle className="font-headline text-2xl">To-Do List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <AnimatePresence>
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onUpdate={onUpdateTodo} onDelete={onDeleteTodo} />
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleAddTodo} className="flex w-full items-center space-x-2">
          <Input 
            value={newTodoText} 
            onChange={(e) => setNewTodoText(e.target.value)} 
            placeholder="Add a new to-do..."
          />
          <Button type="submit" size="icon" aria-label="Add to-do">
            <Plus className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
