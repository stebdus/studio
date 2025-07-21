"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import type { Event, ActivityCategoryConfig } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Pencil, FileQuestion } from "lucide-react";

interface EventCardProps {
  event: Event;
  activityCategories: ActivityCategoryConfig[];
  onClick: () => void;
  onEditClick: () => void;
  isSelected: boolean;
}

export default function EventCard({ event, activityCategories, onClick, onEditClick, isSelected }: EventCardProps) {
  const categoryInfo = activityCategories.find(c => c.id === event.category);
  const Icon = categoryInfo ? categoryInfo.icon : FileQuestion;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditClick();
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onClick={onClick}
      className={cn(
        "p-2 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-all text-sm bg-card relative group",
        isSelected && "ring-2 ring-primary shadow-lg"
      )}
      style={{ borderLeftColor: event.color }}
    >
      <div className="flex items-start justify-between">
        <div className="font-bold pr-6">{event.title}</div>
        <Icon className="h-4 w-4 flex-shrink-0" style={{ color: event.color }} />
      </div>
      <div className="text-xs text-muted-foreground">{format(event.date, "h:mm a")}</div>
      {event.todos.length > 0 && (
         <div className="text-xs text-muted-foreground mt-1">{event.todos.length} to-do(s)</div>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleEditClick}
      >
        <Pencil className="h-3 w-3" />
      </Button>
    </motion.div>
  );
}
