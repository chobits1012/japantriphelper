import { useState, useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import type { ItineraryDay, TripSettings } from '../types';
import useLocalStorage from './useLocalStorage';
import { ITINERARY_DATA } from '../constants';

const STORAGE_KEY = 'kansai-trip-2026-v4';

// Helper: Recalculate Dates based on start date and index
const recalculateDates = (days: ItineraryDay[], startDateStr: string): ItineraryDay[] => {
  return days.map((day, index) => {
    const dateObj = new Date(startDateStr);
    dateObj.setDate(dateObj.getDate() + index);
    
    const dateStr = `${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getDate().toString().padStart(2, '0')}`;
    const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

    return {
      ...day,
      day: `Day ${index + 1}`,
      date: dateStr,
      weekday: weekday,
    };
  });
};

export const useItinerary = (tripSettings: TripSettings) => {
  const [itineraryData, setItineraryData] = useLocalStorage<ItineraryDay[]>(STORAGE_KEY, () => {
    // Migration: Add ID if missing
    return ITINERARY_DATA.map((d: any) => ({ ...d, id: d.id || Math.random().toString(36).substr(2, 9) }));
  });

  const addDay = useCallback(() => {
    const newDay: ItineraryDay = {
      id: Math.random().toString(36).substr(2, 9),
      day: "", date: "", weekday: "", // Will be calculated
      title: "新的一天",
      desc: "自由安排行程",
      pass: false,
      bg: "https://images.unsplash.com/photo-1478860409698-8707f313ee8b?q=80&w=1000",
      location: "Japan",
      weatherIcon: tripSettings.season === 'winter' ? 'snow' : 'sunny',
      temp: "--°C",
      events: []
    };

    setItineraryData(prevData => recalculateDates([...prevData, newDay], tripSettings.startDate));
  }, [setItineraryData, tripSettings.season, tripSettings.startDate]);

  const deleteDay = useCallback((id: string) => {
    setItineraryData(prevData => {
      if (prevData.length <= 1) {
        alert("至少需要保留一天行程！");
        return prevData;
      }
      const newData = prevData.filter(d => d.id !== id);
      return recalculateDates(newData, tripSettings.startDate);
    });
  }, [setItineraryData, tripSettings.startDate]);

  const reorderDays = useCallback((activeId: string, overId: string) => {
    setItineraryData((items) => {
      const oldIndex = items.findIndex((item) => item.id === activeId);
      const newIndex = items.findIndex((item) => item.id === overId);
      const newOrder = arrayMove(items, oldIndex, newIndex);
      return recalculateDates(newOrder, tripSettings.startDate);
    });
  }, [setItineraryData, tripSettings.startDate]);

  const updateDay = useCallback((updatedDay: ItineraryDay | ItineraryDay[] | Partial<ItineraryDay>) => {
    setItineraryData(prevData => {
        const updates = Array.isArray(updatedDay) ? updatedDay : [updatedDay];
        // 使用永不改變的 `id` 作為 key，確保更新的準確性
        const updateMap = new Map<string, ItineraryDay>(
            updates.map((d): [string, ItineraryDay] => [d.id!, d as ItineraryDay])
        );
        // 使用 id 來比對並更新，避免因排序變動而出錯
        return prevData.map(day => ({ ...day, ...updateMap.get(day.id) }));
    });
  }, [setItineraryData]);

  return {
    itineraryData,
    setItineraryData, // Expose setter for complex cases like AI generation
    addDay,
    deleteDay,
    reorderDays,
    updateDay,
    recalculateDates, // Expose for use in other parts like TripSetup
  };
};