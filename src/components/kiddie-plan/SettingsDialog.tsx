"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import type { ActivityCategoryConfig } from "@/types";

interface SettingsDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currentChildren: string[];
  currentCategories: ActivityCategoryConfig[];
  onSave: (settings: { children: string[], categories: ActivityCategoryConfig[] }) => void;
}

export default function SettingsDialog({
  isOpen,
  setIsOpen,
  currentChildren,
  currentCategories,
  onSave,
}: SettingsDialogProps) {
  const [children, setChildren] = useState(currentChildren);
  const [categories, setCategories] = useState(currentCategories);

  useEffect(() => {
    if (isOpen) {
      setChildren(currentChildren);
      setCategories(currentCategories);
    }
  }, [isOpen, currentChildren, currentCategories]);

  const handleChildNameChange = (index: number, name: string) => {
    const newChildren = [...children];
    newChildren[index] = name;
    setChildren(newChildren);
  };

  const handleCategoryChange = (index: number, field: 'label' | 'color', value: string) => {
    const newCategories = [...categories];
    newCategories[index] = { ...newCategories[index], [field]: value };
    setCategories(newCategories);
  };
  
  const handleAddCategory = () => {
    setCategories([
        ...categories,
        {
            id: `cat_${Date.now()}`,
            label: "New Category",
            color: "#cccccc",
            // We can't assign a real icon component here, so we will handle it on the main page
            // A placeholder or null could be used.
            icon: () => null 
        }
    ]);
  };

  const handleRemoveCategory = (index: number) => {
    const newCategories = categories.filter((_, i) => i !== index);
    setCategories(newCategories);
  };

  const handleSave = () => {
    onSave({ children, categories });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your application settings here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
          <div className="grid gap-3">
            <Label className="font-semibold">Children's Names</Label>
            {children.map((child, index) => (
              <Input
                key={index}
                value={child}
                onChange={(e) => handleChildNameChange(index, e.target.value)}
                placeholder={`Child ${index + 1} Name`}
              />
            ))}
          </div>
          <div className="grid gap-3">
             <div className="flex items-center justify-between">
                <Label className="font-semibold">Activity Categories</Label>
                <Button variant="outline" size="sm" onClick={handleAddCategory}>
                    <Plus className="mr-2 h-4 w-4" /> Add
                </Button>
            </div>
            <div className="space-y-4">
                {categories.map((category, index) => (
                    <div key={category.id} className="flex items-center gap-2 p-2 border rounded-md">
                        <Input
                            type="color"
                            value={category.color}
                            onChange={(e) => handleCategoryChange(index, 'color', e.target.value)}
                            className="w-16 p-1 h-10"
                            aria-label="Category color"
                        />
                        <Input
                            value={category.label}
                            onChange={(e) => handleCategoryChange(index, 'label', e.target.value)}
                            placeholder="Category Name"
                            className="flex-1"
                        />
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveCategory(index)} aria-label="Remove category">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button type="button" onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
