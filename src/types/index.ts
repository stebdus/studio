export type ActivityCategory = string; // "school" | "sport" | "party" | "hobby";

export type Child = string; // "Alex" | "Ben";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  category: ActivityCategory;
  child: Child;
  color: string;
  todos: Todo[];
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export interface ActivityCategoryConfig {
    id: string;
    label: string;
    color: string;
    icon: React.ComponentType<{ className?: string }>;
}
