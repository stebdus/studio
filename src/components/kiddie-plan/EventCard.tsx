"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import type { Event } from "@/types";
import { activityCategories } from "@/config/activities";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
  const categoryInfo = activityCategories[event.category];
  const Icon = categoryInfo.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onClick={onClick}
      className={cn(
        "p-2 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-all text-sm bg-card",
      )}
      style={{ borderLeftColor: event.color }}
    >
      <div className="flex items-start justify-between">
        <div className="font-bold">{event.title}</div>
        <Icon className="h-4 w-4" style={{ color: event.color }} />
      </div>
      <div className="text-xs text-muted-foreground">{format(event.date, "h:mm a")}</div>
    </motion.div>
  );
}
