import React, { useEffect, useMemo } from 'react';
import { Snowflake, Sparkles, RotateCcw, Briefcase, Map as MapIcon, Flower2, Sun, Leaf, Plus, Moon } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { ITINERARY_DATA, WASHI_PATTERN, HERO_IMAGE } from './constants';
import type { ItineraryDay, ExpenseItem, ChecklistCategory, TripSeason, TripSettings } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import { useItinerary } from './hooks/useItinerary';
import { useUIState } from './hooks/useUIState';
import DetailPanel from './components/DetailModal';
import AIGenerator from './components/AIGenerator';
import TravelToolbox from './components/TravelToolbox';
import TripSetup from './components/TripSetup';
import { SortableDayCard } from './components/SortableDayCard';
import { DayCard } from './components/DayCard';

const SETTINGS_KEY = 'kansai-trip-settings';
const EXPENSE_KEY = 'kansai-trip-expenses';
const CHECKLIST_KEY = 'kansai-trip-checklist';
const DARK_MODE_KEY = 'kansai-trip-dark-mode';

const App: React.FC = () => {
  // 1. Trip Settings
  const [tripSettings, setTripSettings] = useLocalStorage<TripSettings>(SETTINGS_KEY, { name: "關西冬之旅", startDate: "2026-01-23", season: 'winter' });
  
  // 2. Itinerary State (managed by a custom hook)
  const {
    itineraryData,
    setItineraryData,
    addDay,
    deleteDay,
    reorderDays,
    updateDay,
  } = useItinerary(tripSettings);
  
  // 3. UI State (managed by a custom hook)
  const {
    selectedDayIndex,
    setSelectedDayIndex,
    isAIModalOpen,
    setIsAIModalOpen,
    isToolboxOpen,
    setIsToolboxOpen,
    isSetupOpen,
    setIsSetupOpen,
    activeDragId,
    setActiveDragId,
    handleHome, handleDaySelect, handleNext, handlePrev, isHome
  } = useUIState(itineraryData.length);

  const [expenses, setExpenses] = useLocalStorage<ExpenseItem[]>(EXPENSE_KEY, []);

  // 4. Checklist State (Categorized + Auto Migration)
  const [checklist, setChecklist] = useLocalStorage<ChecklistCategory[]>(CHECKLIST_KEY, () => {
    const saved = localStorage.getItem(CHECKLIST_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0 && 'text' in parsed[0]) {
        return [{
          id: 'migrated-default',
          title: '未分類 (舊資料)',
          items: parsed,
          isCollapsed: false
        }];
    }
    if (Array.isArray(parsed) && (parsed.length === 0 || 'items' in parsed[0])) return parsed;
    return [];
  });

  // 5. Dark Mode State
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>(DARK_MODE_KEY, false);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Dark Mode Effect
    useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);


  // Drag Handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (over && active.id !== over.id) {
      reorderDays(active.id as string, over.id as string);
    }
  };

  const handleAddDay = () => {
    addDay();
    setTimeout(() => {
       const listContainer = document.querySelector('.no-scrollbar');
       if (listContainer) listContainer.scrollTop = listContainer.scrollHeight;
    }, 100);
  };

  const handleDeleteDay = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("確定要刪除這一整天的行程嗎？刪除後無法復原。")) deleteDay(id);
    if (selectedDayIndex !== null) setSelectedDayIndex(null);
  };

  const handleReset = () => {
    if (window.confirm('⚠️ 確定要恢復為預設的「關西冬之旅」嗎？\n\n目前的編輯與行程將會被覆蓋為預設值。\n(記帳與檢查清單不會被刪除)')) {
      const defaultWithIds = ITINERARY_DATA.map(d => ({ ...d, id: d.id || Math.random().toString(36).substr(2, 9) }));
      setItineraryData(defaultWithIds);
      setTripSettings({ name: "關西冬之旅", startDate: "2026-01-23", season: 'winter' });
      setSelectedDayIndex(null);
    }
  };

  const handleNewTrip = () => {
    setIsSetupOpen(true);
  };

  const handleSetupTrip = (name: string, startDate: string, days: number, season: TripSeason) => {
    setTripSettings({ name, startDate, season });
    
    const newItinerary: ItineraryDay[] = Array.from({ length: days }, (_, i) => {
      const dateObj = new Date(startDate);
      dateObj.setDate(dateObj.getDate() + i);
      const dateStr = `${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getDate().toString().padStart(2, '0')}`;
      const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

      return {
        id: Math.random().toString(36).substr(2, 9),
        day: `Day ${i + 1}`,
        date: dateStr,
        weekday: weekday,
        title: "自由活動",
        desc: "點擊編輯來規劃行程",
        pass: false,
        bg: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000",
        location: "Japan",
        weatherIcon: season === 'winter' ? 'snow' : season === 'summer' ? 'sunny' : 'cloudy',
        temp: "--°C",
        events: []
      };
    });

    setItineraryData(newItinerary);
    setSelectedDayIndex(null);
    setIsSetupOpen(false);
  };

  const handleAIGenerate = (newGeneratedDays: ItineraryDay[], isFullReplace: boolean) => {
    const daysWithIds = newGeneratedDays.map(d => ({ ...d, id: d.id || Math.random().toString(36).substr(2, 9) }));
    
    if (isFullReplace) {
      setItineraryData(daysWithIds);
      setSelectedDayIndex(null);
    } else {
      setItineraryData(prevData => {
        const newDaysMap = new Map(daysWithIds.map(d => [d.day, d]));
        return prevData.map(day => {
           const newData = newDaysMap.get(day.day);
           return newData ? { ...newData, id: day.id } : day;
        });
      });
      if (daysWithIds.length === 1) {
         const dayIndex = itineraryData.findIndex(d => d.day === daysWithIds[0].day);
         if (dayIndex !== -1) setSelectedDayIndex(dayIndex);
      }
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const selectedDay = selectedDayIndex !== null ? itineraryData[selectedDayIndex] : null;
  const activeDragItem = activeDragId ? itineraryData.find(d => d.id === activeDragId) : null;

  const getSeasonIcon = (season: TripSeason, size: number, className?: string) => {
    switch(season) {
      case 'spring': return <Flower2 size={size} className={`text-pink-400 ${className}`} />;
      case 'summer': return <Sun size={size} className={`text-orange-400 ${className}`} />;
      case 'autumn': return <Leaf size={size} className={`text-red-500 ${className}`} />;
      case 'winter': return <Snowflake size={size} className={`text-sky-400 ${className}`} />;
      default: return <Snowflake size={size} className={`text-sky-400 ${className}`} />;
    }
  };

  const passUsageMap = useMemo(() => {
    const usage = new Map<string, number>();
    itineraryData.forEach(day => {
      if (day.passName) {
        usage.set(day.passName, (usage.get(day.passName) || 0) + 1);
      }
    });
    return usage;
  }, [itineraryData]);

  return (
    <div className="relative h-screen w-screen overflow-hidden font-sans text-ink bg-paper dark:bg-slate-950 dark:text-slate-100 transition-colors duration-1000">
      
      <div 
        className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000 ${isDarkMode ? 'opacity-0' : 'opacity-100'}`}
        style={{ backgroundImage: `url("${WASHI_PATTERN}")` }}
      />

      <TripSetup isOpen={isSetupOpen} onClose={() => setIsSetupOpen(false)} onSetup={handleSetupTrip} />

      <AIGenerator 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
        onGenerate={handleAIGenerate}
        existingDays={itineraryData} 
        startDate={tripSettings.startDate} 
        tripName={tripSettings.name}       
      />

      <TravelToolbox 
        isOpen={isToolboxOpen}
        onClose={() => setIsToolboxOpen(false)}
        tripSettings={tripSettings}
        onUpdateTripSettings={setTripSettings}
        itineraryData={itineraryData}
        onUpdateItinerary={setItineraryData}
        expenses={expenses}
        onUpdateExpenses={setExpenses}
        checklist={checklist}
        onUpdateChecklist={setChecklist}
      />

      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear transform scale-105"
        style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
      />
      
      <div className={`absolute inset-0 bg-gradient-to-t from-japan-blue/90 via-black/40 to-black/30 transition-opacity duration-1000 ${isHome && !isDarkMode ? 'opacity-100' : 'opacity-0'}`} />
      <div className={`absolute inset-0 bg-gradient-to-t from-slate-950/90 via-black/60 to-black/40 transition-opacity duration-1000 ${isHome && isDarkMode ? 'opacity-100' : 'opacity-0'}`} />

      <div className="absolute inset-0 flex flex-row overflow-hidden">
        
        <div 
           className={`relative z-10 flex flex-col transition-all duration-1000 ease-[cubic-bezier(0.25,0.8,0.25,1)] flex-shrink-0 pt-[env(safe-area-inset-top)] ${isHome ? 'w-full bg-transparent' : 'w-[80px] lg:w-[380px] bg-white/90 backdrop-blur-md border-r border-gray-200/60 dark:bg-slate-900/90 dark:border-slate-700/60'}`}
        >
          
          <div className={`transition-all duration-1000 flex-shrink-0 relative ${isHome ? 'h-[25vh] flex flex-col justify-end items-center pb-8 text-white text-shadow-lg' : 'h-0 overflow-hidden opacity-0'}`}>
             <div className="flex items-center gap-2 mb-3">
                {getSeasonIcon(tripSettings.season, 24, "animate-pulse")}
                <span className="text-sm font-bold tracking-[0.4em] uppercase">{tripSettings.startDate.split('-')[0]} Trip</span>
             </div>
             <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-widest leading-tight text-center drop-shadow-md">
               {tripSettings.name}
             </h1>
             <div className="mt-4 w-16 h-1 bg-japan-red shadow-lg rounded-full"></div>
          </div>

          <div onClick={handleHome} className={`cursor-pointer p-6 text-center transition-all duration-1000 hover:bg-gray-50 dark:hover:bg-slate-800 ${!isHome ? 'hidden lg:block opacity-100' : 'hidden opacity-0'}`}>
            <div className="flex items-center justify-center gap-2 mb-1 text-japan-blue/80 dark:text-sky-400">
              {getSeasonIcon(tripSettings.season, 16)}
              <span className="text-xs font-bold tracking-[0.2em] uppercase">{tripSettings.startDate.split('-')[0]}</span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-japan-blue dark:text-sky-400 tracking-widest line-clamp-1">
              {tripSettings.name}
            </h1>
          </div>

          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className={`flex-1 overflow-y-auto overflow-x-hidden no-scrollbar ${isHome ? 'pb-28 px-4 pt-4' : 'pb-60 lg:pb-28'}`}>
              <div className={`${isHome ? 'max-w-2xl mx-auto' : ''}`}>
                <SortableContext items={itineraryData.map(d => d.id)} strategy={verticalListSortingStrategy}>
                  {itineraryData.map((item, index) => (
                    <SortableDayCard
                      key={item.id}
                      day={item}
                      index={index}
                      isSelected={selectedDayIndex === index}
                      isHome={isHome}
                      onClick={() => handleDaySelect(index)}
                      onDelete={(e) => handleDeleteDay(e, item.id)}
                      passUsageMap={passUsageMap}
                    />
                  ))}
                </SortableContext>
                
                <button 
                  onClick={handleAddDay}
                  className={`
                    w-full mt-4 py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-japan-blue hover:text-japan-blue hover:bg-white/50 transition-all flex items-center justify-center gap-2 font-bold mb-8 dark:border-slate-600 dark:text-slate-500 dark:hover:border-sky-400 dark:hover:text-sky-400 dark:hover:bg-slate-800
                    ${!isHome ? 'hidden lg:flex' : ''}
                  `}
                >
                  <Plus size={20} />
                  新增行程日
                </button>
                {!isHome && (
                   <button 
                    onClick={handleAddDay}
                    className="lg:hidden mx-auto mt-4 w-10 h-10 rounded-full border-2 border-dashed border-gray-300 text-gray-400 hover:border-japan-blue hover:text-japan-blue flex items-center justify-center dark:border-slate-600 dark:text-slate-500 dark:hover:border-sky-400 dark:hover:text-sky-400"
                   >
                     <Plus size={20} />
                   </button>
                )}

                {isHome && <div className="h-20" />}
              </div>
            </div>

            <DragOverlay>
              {activeDragItem ? (
                <DayCard
                  day={activeDragItem}
                  isSelected={false}
                  isHome={isHome}
                  passUsageMap={passUsageMap}
                  isOverlay
                />
              ) : null}
            </DragOverlay>
          </DndContext>
          
          <div className={`absolute z-30 flex items-center gap-3 transition-all duration-500 ${isHome ? 'bottom-8 left-6 flex-row' : 'bottom-8 left-1/2 transform -translate-x-1/2 flex-col-reverse lg:flex-row lg:bottom-6'}`}>
            <button onClick={toggleDarkMode} title={isDarkMode ? "切換亮色模式" : "切換深色模式"} className={`p-2 rounded-full shadow-lg transition-all duration-500 ${isHome ? 'bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white/70 hover:text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-500 hover:text-gray-700 dark:bg-slate-800 dark:text-yellow-400 dark:hover:bg-slate-700'}`}>
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button onClick={handleReset} title="恢復為預設行程" className={`p-2 rounded-full shadow-lg transition-all duration-500 ${isHome ? 'bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white/70 hover:text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-500 hover:text-gray-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'}`}>
               <RotateCcw size={16} />
            </button>

            <button onClick={handleNewTrip} title="建立新旅程" className={`p-2 rounded-full shadow-lg transition-all duration-500 text-white ${isHome ? 'bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30' : 'bg-emerald-500 hover:bg-emerald-600'}`}>
               <MapIcon size={18} />
            </button>

            <button onClick={() => setIsToolboxOpen(true)} title="旅遊工具箱" className={`p-2 rounded-full shadow-lg transition-all duration-500 text-white ${isHome ? 'bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30' : 'bg-orange-500 hover:bg-orange-600'}`}>
               <Briefcase size={18} />
            </button>

             <button onClick={() => setIsAIModalOpen(true)} className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all duration-500 font-bold group ${isHome ? 'bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white' : 'bg-japan-blue hover:bg-japan-blue/90 text-white dark:bg-sky-600 dark:hover:bg-sky-500'}`}>
               <Sparkles size={16} className={isHome ? "group-hover:text-yellow-300 transition-colors" : ""} />
               <span className={`${!isHome ? 'hidden lg:inline' : ''}`}>AI 排程</span>
            </button>
          </div>
        </div>

        {selectedDay && selectedDayIndex !== null && (
          <div className="flex-1 relative overflow-hidden bg-paper shadow-2xl z-20">
            <DetailPanel 
              day={selectedDay} 
              allDays={itineraryData}
              onUpdate={updateDay} 
              onHome={handleHome}
              onNext={handleNext}
              onPrev={handlePrev}
              hasNext={selectedDayIndex < itineraryData.length - 1}
              hasPrev={selectedDayIndex > 0}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
