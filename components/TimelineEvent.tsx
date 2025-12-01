import React from 'react';
import { Train, Plane, MapPin, Camera, Utensils, ShoppingBag, BedDouble, Ticket, ExternalLink } from 'lucide-react';
import { ItineraryEvent, EventCategory } from '../types';

interface TimelineEventProps {
  event: ItineraryEvent;
}

const getCategoryIcon = (category?: EventCategory) => {
  switch (category) {
    case 'food': return <Utensils size={14} className="text-orange-500" />;
    case 'sightseeing': return <Camera size={14} className="text-japan-blue" />;
    case 'shopping': return <ShoppingBag size={14} className="text-purple-500" />;
    case 'hotel': return <BedDouble size={14} className="text-indigo-500" />;
    case 'transport': return <Train size={14} className="text-gray-500" />;
    case 'flight': return <Plane size={14} className="text-blue-400" />;
    case 'activity': return <Ticket size={14} className="text-red-400" />;
    default: return <MapPin size={14} className="text-gray-400" />;
  }
};

const getCategoryLabel = (category?: EventCategory) => {
  switch (category) {
    case 'food': return '美食';
    case 'sightseeing': return '景點';
    case 'shopping': return '購物';
    case 'hotel': return '住宿';
    case 'transport': return '交通';
    case 'flight': return '航班';
    case 'activity': return '體驗';
    default: return null;
  }
};

const TimelineEvent: React.FC<TimelineEventProps> = ({ event }) => {
  const isTransport = event.category === 'transport' || event.category === 'flight';
  
  const handleMapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const query = event.mapQuery || event.title;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
  };

  return (
    <div className={`relative pl-8 mb-8 last:mb-0 group`}>
      {/* Time Dot */}
      <div 
        className={`absolute -left-[11px] top-1 w-[22px] h-[22px] rounded-full border-[3px] z-10 bg-white transition-all duration-300 flex items-center justify-center ${
          event.highlight 
            ? 'border-japan-red shadow-lg scale-110' 
            : 'border-japan-blue group-hover:border-japan-blue/70'
        }`} 
      >
        <div className={`w-2 h-2 rounded-full ${event.highlight ? 'bg-japan-red' : 'bg-transparent'}`} />
      </div>
      
      {/* Content */}
      <div className="flex flex-col items-start w-full">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-sm font-bold text-gray-400 font-sans tracking-wide">
            {event.time}
          </span>
          {event.category && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-[10px] font-bold text-gray-600 uppercase tracking-wider">
               {getCategoryIcon(event.category)}
               <span>{getCategoryLabel(event.category)}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-start w-full gap-4">
          <h4 className={`text-lg md:text-xl font-serif font-bold text-ink leading-tight ${event.highlight ? 'text-japan-blue underline decoration-japan-blue/20 decoration-2 underline-offset-4' : ''}`}>
            {event.title}
          </h4>
          
          {/* Map Button */}
          {(event.mapQuery || event.category === 'sightseeing' || event.category === 'food' || event.category === 'hotel') && (
            <button 
              onClick={handleMapClick}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-japan-blue"
              title="在 Google 地圖中查看"
            >
              <ExternalLink size={16} />
            </button>
          )}
        </div>

        <div className="mt-2 text-sm md:text-base text-gray-600 leading-relaxed bg-white/60 backdrop-blur-sm px-4 py-3 rounded-lg shadow-sm border border-white/50 w-full md:w-auto hover:bg-white/80 transition-colors">
          {event.desc}
        </div>
        
        {/* Special Transport Badge */}
        {event.transport && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-[#8c7b6c] text-white text-xs rounded-full shadow-sm">
            {event.category === 'flight' ? <Plane size={12} /> : <Train size={12} />}
            <span className="font-medium font-sans tracking-wide">{event.transport === 'Airport' ? 'Airport Transfer' : event.transport}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineEvent;