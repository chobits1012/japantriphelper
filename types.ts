export type EventCategory = 'sightseeing' | 'food' | 'transport' | 'shopping' | 'activity' | 'flight' | 'hotel';

export interface ItineraryEvent {
  time: string;
  title: string;
  desc: string;
  transport?: string;
  highlight?: boolean;
  category?: EventCategory; // New: Auto-assign icon based on this
  mapQuery?: string; // New: For Google Maps link
}

export interface Accommodation {
  name: string;
  checkIn?: string;
}

export interface ItineraryDay {
  day: string; // e.g., "Day 1"
  date: string; // e.g., "01/23"
  weekday: string; // e.g., "Fri"
  title: string;
  desc: string;
  pass: boolean; // JR Pass active
  bg: string;
  
  // New Enhanced Fields
  weatherIcon?: 'sunny' | 'cloudy' | 'rain' | 'snow';
  temp?: string; // e.g., "2°C / 8°C"
  tips?: string; // e.g., "Suggest wearing comfortable shoes."
  accommodation?: Accommodation; // Where to stay tonight
  
  events: ItineraryEvent[];
}