import type { ActivityCategory } from '@/types';
import { School, PartyPopper, Dumbbell, Palette } from 'lucide-react';

export const activityCategories: {
  [key in ActivityCategory]: {
    label: string;
    colorClasses: string;
    icon: React.ComponentType<{ className?: string }>;
  };
} = {
  school: { label: 'School', colorClasses: 'bg-blue-100 text-blue-800 border-blue-200', icon: School },
  sport: { label: 'Sport', colorClasses: 'bg-green-100 text-green-800 border-green-200', icon: Dumbbell },
  party: { label: 'Party', colorClasses: 'bg-purple-100 text-purple-800 border-purple-200', icon: PartyPopper },
  hobby: { label: 'Hobby', colorClasses: 'bg-amber-100 text-amber-800 border-amber-200', icon: Palette },
};
