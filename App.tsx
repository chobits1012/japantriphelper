import React, { useState } from 'react';
import { ChevronRight, Snowflake } from 'lucide-react';
import { ITINERARY_DATA, WASHI_PATTERN, HERO_IMAGE } from './constants';
import { ItineraryDay } from './types';
import DetailPanel from './components/DetailModal';

const App: React.FC = () => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

  const handleHome = () => {
    setSelectedDayIndex(null);
  };

  const handleDaySelect = (index: number) => {
    setSelectedDayIndex(index);
  }

  const handleNext = () => {
    if (selectedDayIndex !== null && selectedDayIndex < ITINERARY_DATA.length - 1) {
      setSelectedDayIndex(selectedDayIndex + 1);
    }
  }

  const handlePrev = () => {
    if (selectedDayIndex !== null && selectedDayIndex > 0) {
      setSelectedDayIndex(selectedDayIndex - 1);
    }
  }

  const isHome = selectedDayIndex === null;
  const selectedDay = selectedDayIndex !== null ? ITINERARY_DATA[selectedDayIndex] : null;

  return (
    <div 
      className="relative h-screen w-screen overflow-hidden font-sans text-ink bg-paper"
      style={{ backgroundImage: `url("${WASHI_PATTERN}")` }}
    >
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear transform scale-105"
        style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
      />
      
      {/* Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-japan-blue/90 via-black/40 to-black/30 transition-opacity duration-500 ${isHome ? 'opacity-100' : 'opacity-0'}`} />

      {/* Main Container */}
      <div className="absolute inset-0 flex flex-row overflow-hidden">
        
        {/* Sidebar */}
        <div 
          className={`
            relative z-10 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] flex-shrink-0
            ${isHome ? 'w-full bg-transparent' : 'w-[80px] md:w-[380px] bg-white/90 backdrop-blur-md border-r border-gray-200/60'}
          `}
        >
          {/* Sidebar Header */}
          <div 
            className={`
              transition-all duration-500 flex-shrink-0
              ${isHome ? 'h-[25vh] flex flex-col justify-end items-center pb-8 text-white text-shadow-lg' : 'h-0 overflow-hidden opacity-0'}
            `}
          >
             <div className="flex items-center gap-2 mb-3">
                <Snowflake className="animate-pulse" size={24} />
                <span className="text-sm font-bold tracking-[0.4em] uppercase">2026 Winter</span>
             </div>
             <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-widest leading-tight text-center drop-shadow-md">
               關西冬之旅
             </h1>
             <div className="mt-4 w-16 h-1 bg-japan-red shadow-lg rounded-full"></div>
          </div>

          <div 
            onClick={handleHome}
            className={`
              cursor-pointer p-6 text-center transition-all duration-300 hover:bg-gray-50
              ${!isHome ? 'hidden md:block opacity-100' : 'hidden opacity-0'}
            `}
          >
            <div className="flex items-center justify-center gap-2 mb-1 text-japan-blue/80">
              <Snowflake size={16} />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase">2026</span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-japan-blue tracking-widest">
              關西冬之旅
            </h1>
          </div>

          {/* List */}
          <div className={`flex-1 overflow-y-auto overflow-x-hidden no-scrollbar ${isHome ? 'px-4 pb-20 pt-4' : ''}`}>
            <div className={`${isHome ? 'max-w-2xl mx-auto space-y-4' : ''}`}>
              {ITINERARY_DATA.map((item, index) => {
                const isSelected = selectedDayIndex === index;
                
                return (
                  <div
                    key={index}
                    onClick={() => handleDaySelect(index)}
                    className={`
                      relative cursor-pointer transition-all duration-300 group
                      ${isHome 
                          ? 'bg-white/85 backdrop-blur-sm hover:bg-white rounded-xl p-5 shadow-lg hover:shadow-2xl hover:scale-[1.02] border border-white/20' 
                          : isSelected 
                              ? 'bg-japan-blue text-white p-5 pl-6' 
                              : 'hover:bg-gray-50 text-ink p-5 pl-6 border-b border-gray-100 last:border-0'
                      }
                      ${!isHome && 'h-[80px] flex justify-center items-center md:block md:h-auto'}
                    `}
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
                                {item.pass && <span className="text-[10px] font-bold text-white bg-japan-red px-2 py-0.5 rounded-full">JR PASS</span>}
                             </div>
                             <p className="text-sm text-gray-600 line-clamp-1">{item.desc}</p>
                          </div>
                          <ChevronRight className="text-gray-300" />
                       </div>
                     )}

                    {/* Sidebar Mode Layout */}
                    {!isHome && (
                      <div className={`flex items-center ${!isHome ? 'flex-col md:flex-row' : 'flex-row'}`}>
                        {isSelected && <div className="hidden md:block absolute left-0 top-0 bottom-0 w-1 bg-japan-red" />}

                        <div className={`
                          flex flex-col items-center justify-center transition-all
                          ${!isHome ? 'md:mr-4' : 'mr-5'}
                          ${!isSelected && !isHome ? 'text-gray-400' : ''}
                        `}>
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
                            {item.pass && !isSelected && (
                              <span className="text-[10px] font-bold text-japan-red border border-japan-red/30 px-1.5 rounded bg-red-50">JR</span>
                            )}
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
        </div>

        {/* Detail Panel */}
        {selectedDay && selectedDayIndex !== null && (
          <div className="flex-1 relative overflow-hidden bg-paper shadow-2xl z-20">
            <DetailPanel 
              day={selectedDay} 
              onHome={handleHome}
              onNext={handleNext}
              onPrev={handlePrev}
              hasNext={selectedDayIndex < ITINERARY_DATA.length - 1}
              hasPrev={selectedDayIndex > 0}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;