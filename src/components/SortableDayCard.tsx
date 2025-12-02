
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronRight, GripVertical, Trash2 } from 'lucide-react';
import { ItineraryDay } from '../types';

interface SortableDayCardProps {
  day: ItineraryDay;
  index: number; // The actual day index (0, 1, 2...)
  isSelected: boolean;
  isHome: boolean;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
  getPassShortLabel: (passName?: string) => string;
}

export const SortableDayCard: React.FC<SortableDayCardProps> = ({
  day,
  isSelected,
  isHome,
  onClick,
  onDelete,
  getPassShortLabel,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: day.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative transition-all duration-300 group
        ${isHome 
            ? 'bg-white/85 backdrop-blur-sm hover:bg-white rounded-xl p-5 shadow-lg hover:shadow-2xl border border-white/20 mb-4' 
            : isSelected 
                ? 'bg-japan-blue text-white p-5 pl-6' 
                : 'hover:bg-gray-50 text-ink p-5 pl-6 border-b border-gray-100 last:border-0'
        }
        ${!isHome && 'h-[80px] flex justify-center items-center lg:block lg:h-auto'}
      `}
    >
      {/* Drag Handle & Delete Button Container */}
      <div className={`absolute ${isHome ? 'right-2 top-2' : 'right-1 top-1'} flex items-center gap-1 z-20`}>
         {/* Only show delete if there are multiple days to avoid empty itinerary */}
         <button 
            onClick={onDelete}
            className={`p-1.5 rounded-full transition-colors ${isHome ? 'text-gray-300 hover:text-red-500 hover:bg-red-50' : isSelected ? 'text-white/50 hover:text-white' : 'text-gray-300 hover:text-red-500'}`}
            title="刪除此日行程"
         >
            <Trash2 size={14} />
         </button>
         
         <div 
            {...attributes} 
            {...listeners}
            className={`cursor-grab active:cursor-grabbing p-1.5 rounded-md ${isHome ? 'text-gray-300 hover:text-gray-500 hover:bg-gray-100' : isSelected ? 'text-white/50 hover:text-white' : 'text-gray-300 hover:text-gray-500'}`}
         >
            <GripVertical size={16} />
         </div>
      </div>

      {/* Main Click Area */}
      <div onClick={onClick} className="cursor-pointer w-full h-full">
        {/* Home Mode Layout */}
        {isHome && (
          <div className="flex items-center gap-5">
            <div className="flex flex-col items-center justify-center min-w-[60px] border-r border-gray-300 pr-4">
              <span className="text-2xl font-serif font-bold text-japan-blue">{day.date.split('/')[1]}</span>
              <span className="text-xs text-gray-500 uppercase font-bold">{day.weekday}</span>
            </div>
            <div className="flex-1 pr-12"> {/* pr-12 to avoid overlap with action buttons */}
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-serif font-bold text-xl text-ink">{day.title}</h3>
                {day.pass && (
                  <span className="text-[10px] font-bold text-white bg-japan-red px-2 py-0.5 rounded-full whitespace-nowrap">
                    {getPassShortLabel(day.passName)}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 line-clamp-none">{day.desc}</p>
            </div>
            {/* Chevron is decorative, keep it subtle */}
            {/* <ChevronRight className="text-gray-300" /> */} 
          </div>
        )}

        {/* Sidebar Mode Layout */}
        {!isHome && (
          <div className={`flex items-center ${!isHome ? 'flex-col lg:flex-row' : 'flex-row'}`}>
            {isSelected && <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-1 bg-japan-red" />}
            
            <div className={`flex flex-col items-center justify-center transition-all ${!isHome ? 'lg:mr-4' : 'mr-5'} ${!isSelected && !isHome ? 'text-gray-400' : ''}`}>
              <span className={`font-serif font-bold leading-none ${isSelected ? 'text-lg lg:text-2xl' : 'text-2xl'}`}>
                {day.date.split('/')[1]}
              </span>
              <span className={`text-[10px] uppercase mt-1 ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                {day.weekday}
              </span>
            </div>

            <div className="hidden lg:block flex-1 min-w-0 pr-6">
              <div className="flex justify-between items-center mb-1">
                <h3 className={`font-bold text-lg font-serif truncate ${isSelected ? 'text-white' : 'text-ink'}`}>
                  {day.title}
                </h3>
                {day.pass && !isSelected && (
                  <span className="text-[10px] font-bold text-japan-red border border-japan-red/30 px-1.5 rounded bg-red-50 whitespace-nowrap">
                    {getPassShortLabel(day.passName)}
                  </span>
                )}
              </div>
              <p className={`text-sm truncate ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>
                {day.desc}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
