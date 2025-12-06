export type EventCategory = 'sightseeing' | 'food' | 'transport' | 'shopping' | 'activity' | 'flight' | 'hotel';
export type TripSeason = 'spring' | 'summer' | 'autumn' | 'winter';

export interface TripSettings {
  name: string;
  startDate: string;
  season: TripSeason;
  budgetJPY?: number; // New: Total budget in Yen
}

export interface ItineraryEvent {
  time: string;
  title: string;
  desc: string;
  transport?: string;
  highlight?: boolean;
  category?: EventCategory;
  mapQuery?: string;
}

export interface Accommodation {
  name: string;
  checkIn?: string;
}

export interface ItineraryDay {
  id: string; // Unique ID for drag-and-drop
  day: string;
  date: string;
  weekday: string;
  title: string;
  desc: string;
  pass: boolean;
  bg: string;
  
  // Weather & Location Info
  weatherIcon?: 'sunny' | 'cloudy' | 'rain' | 'snow';
  temp?: string;
  location: string;
  
  tips?: string;
  accommodation?: Accommodation;
  events: ItineraryEvent[];

  // Transport pass info
  passName?: string;
  passColor?: string;         // Hex color code for the pass badge
  passDurationDays?: number;  // 幾日券，例如 1,2,3,5...
}

// New Types for Travel Toolbox
export interface ExpenseItem {
  id: string;
  title: string;
  amountJPY: number;
  category: 'food' | 'shopping' | 'transport' | 'hotel' | 'other';
  date: string; // MM/DD
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface ChecklistCategory {
  id: string;
  title: string;
  items: ChecklistItem[];
  isCollapsed?: boolean;
}
