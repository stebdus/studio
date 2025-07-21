export type ActivityCategory = "school" | "sport" | "party" | "hobby";

export type Child = "Alex" | "Ben";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  category: ActivityCategory;
  child: Child;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}
