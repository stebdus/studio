"use client";

import { motion } from "framer-motion";
import type { Todo } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
  onUpdate: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const handleToggle = () => {
    onUpdate({ ...todo, completed: !todo.completed });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors group"
    >
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={handleToggle}
        aria-label={todo.text}
      />
      <label
        htmlFor={`todo-${todo.id}`}
        className={cn(
          "flex-1 cursor-pointer transition-all",
          todo.completed ? "line-through text-muted-foreground" : ""
        )}
      >
        {todo.text}
      </label>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete "${todo.text}"`}
      >
        <X className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}
