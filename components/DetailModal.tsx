import React from 'react';
import { Home, Cloud, Sun, CloudRain, Snowflake, BedDouble, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';
import { ItineraryDay } from '../types';
import TimelineEvent from './TimelineEvent';

interface DetailPanelProps {
  day: ItineraryDay;
  onHome: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  className?: string;
}

const getWeatherIcon = (icon?: string) => {
  switch (icon) {
    case 'sunny': return <Sun className="text-orange-400" size={20} />;
    case 'rain': return <CloudRain className="text-blue-400" size={20} />;
    case 'snow': return <Snowflake className="text-sky-300" size={20} />;
    default: return <Cloud className="text-gray-400" size={20} />;
  }
};

const DetailPanel: React.FC<DetailPanelProps> = ({ day, onHome, onNext, onPrev, hasPrev, hasNext, className }) => {
  // Animation key
  const key = day.day;

  return (
    <div 
      key={key}
      className={`h-full w-full flex flex-col bg-white relative overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500 ${className || ''}`}
    >
      {/* Watermark */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-25 grayscale-0 pointer-events-none z-0 transition-all duration-700 ease-in-out transform scale-105"
        style={{ backgroundImage: `url('${day.bg}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/85 to-white/70 pointer-events-none z-0" />

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto relative z-10 px-6 py-8 md:px-12 md:py-10 no-scrollbar pb-32">
        
        {/* Navigation Bar - REMOVED STICKY */}
        <div className="flex items-center justify-between mb-8 pt-2">
             <div className="flex items-center gap-4">
               {/* Day Number */}
              <span className="text-4xl font-serif font-bold text-japan-blue/20 select-none">
                {day.day}
              </span>
              <div className="h-8 w-px bg-japan-blue/20"></div>
              {/* Date & Weather */}
              <div className="flex flex-col">
                <span className="text-xs font-bold tracking-widest text-japan-blue uppercase">
                  {day.date} • {day.weekday}
                </span>
                {day.temp && (
                   <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500 mt-0.5">
                      {getWeatherIcon(day.weatherIcon)}
                      <span>{day.temp}</span>
                   </div>
                )}
              </div>
            </div>

            <button 
              onClick={onHome}
              className="p-2 rounded-full hover:bg-gray-100 text-japan-blue transition-colors bg-white shadow-sm border border-gray-100"
              title="回到首頁"
            >
              <Home size={18} />
            </button>
        </div>
          
        {/* Title */}
        <div className="max-w-3xl mx-auto mb-10 border-b border-japan-blue/10 pb-6">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-ink mb-4 leading-tight">
            {day.title}
          </h2>
          <p className="text-base md:text-lg text-gray-700 font-medium leading-relaxed bg-white/40 p-3 rounded-lg backdrop-blur-sm border border-white/40">
            {day.desc}
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto pl-2 md:pl-4 mb-12">
          <div className="relative border-l-[2px] border-japan-blue/10 pl-8 pb-4 space-y-2">
            {day.events.map((event, index) => (
              <TimelineEvent key={index} event={event} />
            ))}
          </div>
        </div>

        {/* Footer Info: Hotel & Tips */}
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
           {day.accommodation && (
             <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-indigo-100 shadow-sm flex items-start gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-500 rounded-lg">
                   <BedDouble size={20} />
                </div>
                <div>
                   <h5 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Accommodation</h5>
                   <p className="font-bold text-ink text-sm">{day.accommodation.name}</p>
                   {day.accommodation.checkIn && <p className="text-xs text-gray-500 mt-1">Check-in after {day.accommodation.checkIn}</p>}
                </div>
             </div>
           )}

           {day.tips && (
             <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-amber-100 shadow-sm flex items-start gap-3">
                <div className="p-2 bg-amber-50 text-amber-500 rounded-lg">
                   <Lightbulb size={20} />
                </div>
                <div>
                   <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Travel Tip</h5>
                   <p className="text-sm text-gray-700 leading-relaxed">{day.tips}</p>
                </div>
             </div>
           )}
        </div>
      </div>

      {/* Floating Navigation Footer */}
      {/* Adjusted padding-right to pr-[156px] (unit 39) for precise tuning */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 pl-6 pr-[156px] md:px-6 py-4 z-20 flex justify-between items-center">
        <button 
          onClick={onPrev}
          disabled={!hasPrev}
          className={`
            flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-all
            ${hasPrev 
              ? 'text-japan-blue hover:bg-japan-blue/5' 
              : 'text-gray-300 cursor-not-allowed'}
          `}
        >
          <ChevronLeft size={16} />
          <span className="hidden md:inline">上一天</span>
        </button>

        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
           {day.day}
        </span>

        <button 
          onClick={onNext}
          disabled={!hasNext}
          className={`
            flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-all
            ${hasNext 
              ? 'text-japan-blue hover:bg-japan-blue/5' 
              : 'text-gray-300 cursor-not-allowed'}
          `}
        >
          <span className="hidden md:inline">下一天</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default DetailPanel;