import type { ActivityCategory } from '@/types';
import { School, PartyPopper, Dumbbell, Palette } from 'lucide-react';

export const activityCategories: {
  [key in ActivityCategory]: {
    label: string;
    color: string;
    colorClasses: string;
    icon: React.ComponentType<{ className?: string }>;
  };
} = {
  school: { label: 'School', color: '#3b82f6', colorClasses: 'bg-blue-100 text-blue-800 border-blue-200', icon: School },
  sport: { label: 'Sport', color: '#22c55e', colorClasses: 'bg-green-100 text-green-800 border-green-200', icon: Dumbbell },
  party: { label: 'Party', color: '#a855f7', colorClasses: 'bg-purple-100 text-purple-800 border-purple-200', icon: PartyPopper },
  hobby: { label: 'Hobby', color: '#f59e0b', colorClasses: 'bg-amber-100 text-amber-800 border-amber-200', icon: Palette },
};
