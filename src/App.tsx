
import React, { useState, useEffect } from 'react';
import { ChevronRight, Snowflake, Sparkles, RotateCcw, Briefcase, Map as MapIcon, Flower2, Sun, Leaf } from 'lucide-react';
import { ITINERARY_DATA, WASHI_PATTERN, HERO_IMAGE } from './constants';
import type { ItineraryDay, ExpenseItem, ChecklistItem, TripSeason } from './types';
import DetailPanel from './components/DetailModal';
import AIGenerator from './components/AIGenerator';
import TravelToolbox from './components/TravelToolbox';
import TripSetup from './components/TripSetup';

const STORAGE_KEY = 'kansai-trip-2026-v2';
const SETTINGS_KEY = 'kansai-trip-settings';
const EXPENSE_KEY = 'kansai-trip-expenses';
const CHECKLIST_KEY = 'kansai-trip-checklist';

interface TripSettings {
  name: string;
  startDate: string;
  season: TripSeason;
}

const App: React.FC = () => {
  // 1. Trip Settings (Name, Start Date, Season)
  const [tripSettings, setTripSettings] = useState<TripSettings>(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? JSON.parse(saved) : { name: "關西冬之旅", startDate: "2026-01-23", season: 'winter' };
  });

  // 2. Itinerary State
  const [itineraryData, setItineraryData] = useState<ItineraryDay[]>(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : ITINERARY_DATA;
  });

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem(EXPENSE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem(CHECKLIST_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isToolboxOpen, setIsToolboxOpen] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  // Persistence Effects
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(itineraryData)); }, [itineraryData]);
  useEffect(() => { localStorage.setItem(SETTINGS_KEY, JSON.stringify(tripSettings)); }, [tripSettings]);
  useEffect(() => { localStorage.setItem(EXPENSE_KEY, JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checklist)); }, [checklist]);

  const handleHome = () => setSelectedDayIndex(null);
  const handleDaySelect = (index: number) => setSelectedDayIndex(index);
  const handleNext = () => selectedDayIndex !== null && selectedDayIndex < itineraryData.length - 1 && setSelectedDayIndex(selectedDayIndex + 1);
  const handlePrev = () => selectedDayIndex !== null && selectedDayIndex > 0 && setSelectedDayIndex(selectedDayIndex - 1);

  // Restore Default Itinerary
  const handleReset = () => {
    if (window.confirm('⚠️ 確定要恢復為預設的「關西冬之旅」嗎？\n\n目前的編輯與行程將會被覆蓋為預設值。')) {
      setItineraryData(ITINERARY_DATA);
      setTripSettings({ name: "關西冬之旅", startDate: "2026-01-23", season: 'winter' });
      setSelectedDayIndex(null);
    }
  };

  // Open New Trip Wizard
  const handleNewTrip = () => {
    setIsSetupOpen(true);
  };

  const handleSetupTrip = (name: string, startDate: string, days: number, season: TripSeason) => {
    setTripSettings({ name, startDate, season });
    
    // Generate Empty Itinerary
    const newItinerary: ItineraryDay[] = Array.from({ length: days }, (_, i) => {
      const dateObj = new Date(startDate);
      dateObj.setDate(dateObj.getDate() + i);
      const dateStr = `${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getDate().toString().padStart(2, '0')}`;
      const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

      return {
        day: `Day ${i + 1}`,
        date: dateStr,
        weekday: weekday,
        title: "自由活動",
        desc: "點擊編輯來規劃行程",
        pass: false,
        bg: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000", // Generic Travel Img
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
    if (isFullReplace) {
      setItineraryData(newGeneratedDays);
      setSelectedDayIndex(null);
    } else {
      setItineraryData(prevData => {
        const newDaysMap = new Map(newGeneratedDays.map(d => [d.day, d]));
        return prevData.map(day => newDaysMap.get(day.day) || day);
      });
      if (newGeneratedDays.length === 1) {
         const dayIndex = itineraryData.findIndex(d => d.day === newGeneratedDays[0].day);
         if (dayIndex !== -1) setSelectedDayIndex(dayIndex);
      }
    }
  };

  const handleDayUpdate = (updatedDay: ItineraryDay | ItineraryDay[]) => {
    setItineraryData(prevData => {
        const updates = Array.isArray(updatedDay) ? updatedDay : [updatedDay];
        
        // Explicitly type the map entry to [string, ItineraryDay] to satisfy Map constructor
        const updateMap = new Map<string, ItineraryDay>(
            updates.map((d): [string, ItineraryDay] => [d.day, d])
        );
        
        return prevData.map(day => updateMap.get(day.day) || day);
    });
  };

  const isHome = selectedDayIndex === null;
  const selectedDay = selectedDayIndex !== null ? itineraryData[selectedDayIndex] : null;

  // Dynamic Season Icon
  const getSeasonIcon = (season: TripSeason, size: number, className?: string) => {
    switch(season) {
      case 'spring': return <Flower2 size={size} className={`text-pink-400 ${className}`} />;
      case 'summer': return <Sun size={size} className={`text-orange-400 ${className}`} />;
      case 'autumn': return <Leaf size={size} className={`text-red-500 ${className}`} />;
      case 'winter': return <Snowflake size={size} className={`text-sky-400 ${className}`} />;
      default: return <Snowflake size={size} className={`text-sky-400 ${className}`} />;
    }
  };

  return (
    <div 
      className="relative h-screen w-screen overflow-hidden font-sans text-ink bg-paper"
      style={{ backgroundImage: `url("${WASHI_PATTERN}")` }}
    >
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
        expenses={expenses}
        onUpdateExpenses={setExpenses}
        checklist={checklist}
        onUpdateChecklist={setChecklist}
      />

      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear transform scale-105"
        style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
      />
      <div className={`absolute inset-0 bg-gradient-to-t from-japan-blue/90 via-black/40 to-black/30 transition-opacity duration-500 ${isHome ? 'opacity-100' : 'opacity-0'}`} />

      {/* Main Container */}
      <div className="absolute inset-0 flex flex-row overflow-hidden">
        
        {/* Sidebar */}
        <div className={`relative z-10 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] flex-shrink-0 ${isHome ? 'w-full bg-transparent' : 'w-[80px] md:w-[380px] bg-white/90 backdrop-blur-md border-r border-gray-200/60'}`}>
          
          {/* Sidebar Header */}
          <div className={`transition-all duration-500 flex-shrink-0 relative ${isHome ? 'h-[25vh] flex flex-col justify-end items-center pb-8 text-white text-shadow-lg' : 'h-0 overflow-hidden opacity-0'}`}>
             <div className="flex items-center gap-2 mb-3">
                {getSeasonIcon(tripSettings.season, 24, "animate-pulse")}
                <span className="text-sm font-bold tracking-[0.4em] uppercase">{tripSettings.startDate.split('-')[0]} Trip</span>
             </div>
             <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-widest leading-tight text-center drop-shadow-md">
               {tripSettings.name}
             </h1>
             <div className="mt-4 w-16 h-1 bg-japan-red shadow-lg rounded-full"></div>
          </div>

          <div onClick={handleHome} className={`cursor-pointer p-6 text-center transition-all duration-300 hover:bg-gray-50 ${!isHome ? 'hidden md:block opacity-100' : 'hidden opacity-0'}`}>
            <div className="flex items-center justify-center gap-2 mb-1 text-japan-blue/80">
              {getSeasonIcon(tripSettings.season, 16)}
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase">{tripSettings.startDate.split('-')[0]}</span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-japan-blue tracking-widest line-clamp-1">
              {tripSettings.name}
            </h1>
          </div>

          {/* List */}
          <div className={`flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-28 ${isHome ? 'px-4 pt-4' : ''}`}>
            <div className={`${isHome ? 'max-w-2xl mx-auto space-y-4' : ''}`}>
              {itineraryData.map((item, index) => {
                const isSelected = selectedDayIndex === index;
                return (
                  <div
                    key={index}
                    onClick={() => handleDaySelect(index)}
                    className={`relative cursor-pointer transition-all duration-300 group ${isHome ? 'bg-white/85 backdrop-blur-sm hover:bg-white rounded-xl p-5 shadow-lg hover:shadow-2xl hover:scale-[1.02] border border-white/20' : isSelected ? 'bg-japan-blue text-white p-5 pl-6' : 'hover:bg-gray-50 text-ink p-5 pl-6 border-b border-gray-100 last:border-0'} ${!isHome && 'h-[80px] flex justify-center items-center md:block md:h-auto'}`}
                  >
                     {/* Home Mode Layout */}
                     {isHome && (
                       <div className="flex items-center gap-5">
                          <div className="flex flex-col items-center justify-center min-w-[60px] border-r border-gray-300 pr-4">
                             <span className="text-2xl font-serif font-bold text-japan-blue">{item.date.split('/')[1]}</span>
                             <span className="text-xs text-gray-500 uppercase font-bold">{item.weekday}</span>
                          </div>
                          <div className="flex-1">
                             <div className="flex items-center justify-between mb-1">
                                <h3 className="font-serif font-bold text-xl text-ink">{item.title}</h3>
                                {item.pass && <span className="text-[10px] font-bold text-white bg-japan-red px-2 py-0.5 rounded-full">{item.passName || 'JR PASS'}</span>}
                             </div>
                             <p className="text-sm text-gray-600 line-clamp-none">{item.desc}</p>
                          </div>
                          <ChevronRight className="text-gray-300" />
                       </div>
                     )}

                    {/* Sidebar Mode Layout */}
                    {!isHome && (
                      <div className={`flex items-center ${!isHome ? 'flex-col md:flex-row' : 'flex-row'}`}>
                        {isSelected && <div className="hidden md:block absolute left-0 top-0 bottom-0 w-1 bg-japan-red" />}
                        <div className={`flex flex-col items-center justify-center transition-all ${!isHome ? 'md:mr-4' : 'mr-5'} ${!isSelected && !isHome ? 'text-gray-400' : ''}`}>
                          <span className={`font-serif font-bold leading-none ${isSelected ? 'text-lg md:text-2xl' : 'text-2xl'}`}>
                            {item.date.split('/')[1]}
                          </span>
                          <span className={`text-[10px] uppercase mt-1 ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                            {item.weekday}
                          </span>
                        </div>
                        <div className="hidden md:block flex-1 min-w-0">
                           <div className="flex justify-between items-center mb-1">
                            <h3 className={`font-bold text-lg font-serif truncate ${isSelected ? 'text-white' : 'text-ink'}`}>
                              {item.title}
                            </h3>
                            {item.pass && !isSelected && <span className="text-[10px] font-bold text-japan-red border border-japan-red/30 px-1.5 rounded bg-red-50">JR</span>}
                          </div>
                          <p className={`text-sm truncate ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {isHome && <div className="h-20" />}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className={`absolute z-30 flex items-center gap-3 transition-all ${isHome ? 'bottom-8 left-6' : 'bottom-6 left-1/2 transform -translate-x-1/2'}`}>
            {/* AI Button */}
             <button onClick={() => setIsAIModalOpen(true)} className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all font-bold group ${isHome ? 'bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white' : 'bg-japan-blue hover:bg-japan-blue/90 text-white'}`}>
               <Sparkles size={16} className={isHome ? "group-hover:text-yellow-300 transition-colors" : ""} />
               <span className={`${!isHome ? 'hidden md:inline' : ''}`}>AI 排程</span>
            </button>
            
            {/* Toolbox Button */}
            <button onClick={() => setIsToolboxOpen(true)} title="旅遊工具箱" className={`p-2 rounded-full shadow-lg transition-all text-white ${isHome ? 'bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30' : 'bg-orange-500 hover:bg-orange-600'}`}>
               <Briefcase size={18} />
            </button>

            {/* New Trip Button */}
            <button onClick={handleNewTrip} title="建立新旅程" className={`p-2 rounded-full shadow-lg transition-all text-white ${isHome ? 'bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30' : 'bg-emerald-500 hover:bg-emerald-600'}`}>
               <MapIcon size={18} />
            </button>

            {/* Reset Button */}
            <button onClick={handleReset} title="恢復為預設行程" className={`p-2 rounded-full shadow-lg transition-all ${isHome ? 'bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white/70 hover:text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-500 hover:text-gray-700'}`}>
               <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Detail Panel */}
        {selectedDay && selectedDayIndex !== null && (
          <div className="flex-1 relative overflow-hidden bg-paper shadow-2xl z-20">
            <DetailPanel 
              day={selectedDay} 
              allDays={itineraryData}
              onUpdate={handleDayUpdate as any} 
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
