import React, { useState, useEffect } from 'react';
import { Home, Cloud, Sun, CloudRain, Snowflake, BedDouble, Lightbulb, ChevronLeft, ChevronRight, ExternalLink, Pencil, Save, X, Plus, Trash2, Loader2, Train } from 'lucide-react';
import type { ItineraryDay, ItineraryEvent } from '../types';
import TimelineEvent from './TimelineEvent';
import { TRANSPORT_PASSES } from '../constants';

interface DetailPanelProps {
  day: ItineraryDay;
  allDays: ItineraryDay[]; // New: Pass all days for multi-day updates
  onUpdate: (updatedDay: ItineraryDay | ItineraryDay[]) => void;
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

// Convert WMO Weather Codes to Icons
const getLiveWeatherIcon = (code: number, size = 16) => {
  if (code === 0 || code === 1) return <Sun className="text-orange-500 animate-pulse" size={size} />; 
  if (code === 2 || code === 3) return <Cloud className="text-gray-400" size={size} />; 
  if (code >= 51 && code <= 67) return <CloudRain className="text-blue-500" size={size} />; 
  if (code >= 71 && code <= 77) return <Snowflake className="text-sky-400 animate-bounce" size={size} />; 
  if (code >= 80 && code <= 82) return <CloudRain className="text-blue-600" size={size} />; 
  if (code >= 85 && code <= 86) return <Snowflake className="text-sky-500" size={size} />; 
  return <Cloud className="text-gray-400" size={size} />;
};

const DetailPanel: React.FC<DetailPanelProps> = ({ day, allDays, onUpdate, onHome, onNext, onPrev, hasPrev, hasNext, className }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ItineraryDay>(day);
  
  // Transport Pass State
  const [selectedPass, setSelectedPass] = useState<string>('');
  const [passDuration, setPassDuration] = useState<number>(1);

  // Live Weather State
  const [liveWeather, setLiveWeather] = useState<{temp: number, code: number} | null>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loadingWeather, setLoadingWeather] = useState(false);

  // Reset edit data when day changes
  useEffect(() => {
    setEditData(day);
    setIsEditing(false);
    setSelectedPass(''); // Reset pass selection
    setPassDuration(1);
    setLiveWeather(null);
    setForecast([]);
    
    // Fetch Weather using Geocoding API + Forecast API
    const fetchWeather = async () => {
      if (!day.location) return;

      setLoadingWeather(true);
      try {
        // 1. Geocoding: Find Lat/Lon from Location Name
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(day.location)}&count=1&language=zh&format=json`);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
           console.warn("Location not found:", day.location);
           return;
        }

        const { latitude, longitude } = geoData.results[0];

        // 2. Forecast: Get Weather
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
        );
        const data = await weatherRes.json();
        
        if (data.current) {
          setLiveWeather({
            temp: data.current.temperature_2m,
            code: data.current.weather_code
          });
        }

        if (data.daily) {
          const dailyData = data.daily.time.map((time: string, index: number) => ({
            date: time.slice(5).replace('-', '/'),
            code: data.daily.weather_code[index],
            max: data.daily.temperature_2m_max[index],
            min: data.daily.temperature_2m_min[index],
          }));
          setForecast(dailyData);
        }

      } catch (e) {
        console.error("Weather fetch failed", e);
      } finally {
        setLoadingWeather(false);
      }
    };

    fetchWeather();
  }, [day]);

  const handleSave = () => {
    let updates: ItineraryDay[] = [];
    
    // 1. Prepare current day update
    const sortedEvents = [...editData.events].sort((a, b) => a.time.localeCompare(b.time));
    let currentDayUpdate = { ...editData, events: sortedEvents };

    // 2. Handle Pass Logic (Multi-day update)
    if (selectedPass && passDuration > 0) {
        const startIndex = allDays.findIndex(d => d.day === day.day);
        if (startIndex !== -1) {
            // Update current day
            currentDayUpdate.pass = true;
            currentDayUpdate.passName = selectedPass;
            updates.push(currentDayUpdate);

            // Update subsequent days
            for (let i = 1; i < passDuration; i++) {
                if (startIndex + i < allDays.length) {
                    const nextDay = allDays[startIndex + i];
                    updates.push({
                        ...nextDay,
                        pass: true,
                        passName: selectedPass
                    });
                }
            }
        }
    } else {
        // No pass update, just push current day
        updates.push(currentDayUpdate);
    }

    onUpdate(updates);
    setEditData(currentDayUpdate);
    setIsEditing(false);
    setSelectedPass('');
    setPassDuration(1);
  };

  const handleCancel = () => {
    setEditData(day);
    setIsEditing(false);
  };

  const handleEventChange = (index: number, field: keyof ItineraryEvent, value: any) => {
    const newEvents = [...editData.events];
    newEvents[index] = { ...newEvents[index], [field]: value };
    setEditData({ ...editData, events: newEvents });
  };

  const handleAddEvent = () => {
    const newEvent: ItineraryEvent = {
      time: "00:00",
      title: "新行程",
      desc: "行程描述",
      category: 'sightseeing'
    };
    setEditData({ ...editData, events: [...editData.events, newEvent] });
  };

  const handleRemoveEvent = (index: number) => {
    const newEvents = editData.events.filter((_, i) => i !== index);
    setEditData({ ...editData, events: newEvents });
  };

  const key = day.day;
  const weatherUrl = `https://www.google.com/search?q=${encodeURIComponent(day.location + " 天氣")}`;

  return (
    <div 
      key={key}
      className={`h-full w-full flex flex-col bg-white relative overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500 ${className || ''}`}
    >
      {/* Watermark (Only visible in View Mode) */}
      {!isEditing && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-25 grayscale-0 pointer-events-none z-0 transition-all duration-700 ease-in-out transform scale-105"
            style={{ backgroundImage: `url('${day.bg}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/85 to-white/70 pointer-events-none z-0" />
        </>
      )}

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto relative z-10 px-6 py-8 md:px-12 md:py-10 no-scrollbar pb-32">
        
        {/* Navigation Bar */}
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
                
                {/* Weather Display */}
                {day.temp && !isEditing && (
                   <div className="flex flex-col gap-2 mt-1">
                      {/* Live Weather Badge & Link */}
                      <a 
                        href={weatherUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-3 text-sm font-medium text-gray-500 cursor-pointer transition-transform active:scale-95 origin-left"
                        title="點擊查看詳細天氣"
                      >
                          {/* Historical Average */}
                          <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                             {getWeatherIcon(day.weatherIcon)}
                             <span>{day.temp}</span>
                          </div>

                          {/* Live Weather Badge */}
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-gray-200/60 text-ink group-hover:border-japan-blue/50 group-hover:text-japan-blue transition-colors">
                            {loadingWeather ? (
                              <Loader2 size={12} className="animate-spin text-japan-blue" />
                            ) : liveWeather ? (
                              <>
                                {getLiveWeatherIcon(liveWeather.code)}
                                <span className="text-xs font-bold font-mono">
                                  Live: {liveWeather.temp}°
                                </span>
                              </>
                            ) : (
                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                 <ExternalLink size={10} />
                                 <span>{day.location}</span>
                              </div>
                            )}
                          </div>
                      </a>

                      {/* 7-Day Forecast Scroll View */}
                      {forecast.length > 0 && (
                        <div className="w-full max-w-[200px] md:max-w-[300px] overflow-x-auto no-scrollbar flex items-center gap-2 pb-1 mask-linear-fade">
                           {forecast.map((f, i) => (
                             <div key={i} className="flex-shrink-0 flex flex-col items-center justify-center bg-white/40 p-1.5 rounded-lg border border-white/60 min-w-[50px]">
                                <span className="text-[10px] text-gray-500 font-mono">{f.date}</span>
                                <div className="my-1">{getLiveWeatherIcon(f.code, 14)}</div>
                                <span className="text-[10px] font-bold text-gray-600">{Math.round(f.max)}°</span>
                             </div>
                           ))}
                        </div>
                      )}
                   </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                   <button 
                    onClick={handleSave}
                    className="p-2 rounded-full bg-japan-blue text-white shadow-sm hover:bg-japan-blue/90"
                    title="儲存並排序"
                  >
                    <Save size={18} />
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                    title="取消"
                  >
                    <X size={18} />
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-japan-blue transition-colors"
                  title="編輯行程 (修改地點可更新天氣)"
                >
                  <Pencil size={18} />
                </button>
              )}
              
              <button 
                onClick={onHome}
                className="p-2 rounded-full hover:bg-gray-100 text-japan-blue transition-colors bg-white shadow-sm border border-gray-100"
                title="回到首頁"
              >
                <Home size={18} />
              </button>
            </div>
        </div>
          
        {/* EDIT MODE CONTENT */}
        {isEditing ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* --- TRANSPORT PASS SETTING --- */}
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl space-y-3">
               <div className="flex items-center gap-2 text-japan-red">
                  <Train size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider">交通周遊券設定 (批次套用)</span>
               </div>
               <div className="flex gap-2">
                  <select 
                    value={selectedPass}
                    onChange={(e) => setSelectedPass(e.target.value)}
                    className="flex-1 p-2 text-sm border border-red-200 rounded-lg bg-white focus:outline-none focus:border-japan-red"
                  >
                     <option value="">選擇票券 (若不選則不更新)</option>
                     {TRANSPORT_PASSES.map(pass => (
                       <option key={pass} value={pass}>{pass}</option>
                     ))}
                  </select>
                  <select
                    value={passDuration}
                    onChange={(e) => setPassDuration(parseInt(e.target.value))}
                    className="w-24 p-2 text-sm border border-red-200 rounded-lg bg-white focus:outline-none focus:border-japan-red"
                  >
                     {[1,2,3,4,5,7,10].map(d => (
                       <option key={d} value={d}>{d} 天</option>
                     ))}
                  </select>
               </div>
               <p className="text-[10px] text-gray-500">
                 * 選擇票券與天數後按下儲存，系統會自動將「今天」以及「後續天數」標記為使用該票券。
               </p>
            </div>

            {/* Header Edit */}
            <div className="space-y-4 border-b border-gray-100 pb-6">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-xs font-bold text-gray-400 uppercase">標題</label>
                   <input 
                      type="text" 
                      value={editData.title}
                      onChange={(e) => setEditData({...editData, title: e.target.value})}
                      className="w-full text-xl font-serif font-bold text-ink border-b-2 border-gray-200 focus:border-japan-blue outline-none py-1 bg-transparent"
                   />
                 </div>
                 <div>
                   <label className="text-xs font-bold text-gray-400 uppercase">地點 (影響天氣)</label>
                   <input 
                      type="text" 
                      value={editData.location}
                      onChange={(e) => setEditData({...editData, location: e.target.value})}
                      className="w-full text-lg font-bold text-japan-blue border-b-2 border-gray-200 focus:border-japan-blue outline-none py-1 bg-transparent"
                      placeholder="例如: 東京"
                   />
                 </div>
               </div>
               <div>
                 <label className="text-xs font-bold text-gray-400 uppercase">描述</label>
                 <textarea 
                    value={editData.desc}
                    onChange={(e) => setEditData({...editData, desc: e.target.value})}
                    className="w-full p-3 bg-gray-50 rounded-lg text-sm text-gray-700 outline-none focus:ring-2 focus:ring-japan-blue/20"
                    rows={2}
                 />
               </div>
            </div>

            {/* Events Edit */}
            <div className="space-y-4">
               <label className="text-xs font-bold text-gray-400 uppercase flex items-center justify-between">
                  行程列表
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 font-normal">* 儲存後將自動按時間排序</span>
                    <button onClick={handleAddEvent} className="text-japan-blue hover:underline flex items-center gap-1">
                      <Plus size={14} /> 新增
                    </button>
                  </div>
               </label>
               
               {editData.events.map((event, index) => (
                 <div key={index} className="flex gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 relative group">
                    <button 
                      onClick={() => handleRemoveEvent(index)}
                      className="absolute top-2 right-2 text-gray-300 hover:text-red-500 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                    
                    <div className="space-y-3 flex-1">
                       <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={event.time}
                            onChange={(e) => handleEventChange(index, 'time', e.target.value)}
                            className="w-20 p-2 text-sm font-bold border rounded"
                            placeholder="時間"
                          />
                          <select 
                             value={event.category || 'sightseeing'}
                             onChange={(e) => handleEventChange(index, 'category', e.target.value)}
                             className="p-2 text-sm border rounded bg-white"
                          >
                             <option value="sightseeing">景點</option>
                             <option value="food">美食</option>
                             <option value="shopping">購物</option>
                             <option value="transport">交通</option>
                             <option value="hotel">住宿</option>
                             <option value="flight">航班</option>
                             <option value="activity">體驗</option>
                          </select>
                       </div>
                       <input 
                          type="text" 
                          value={event.title}
                          onChange={(e) => handleEventChange(index, 'title', e.target.value)}
                          className="w-full p-2 font-bold border rounded"
                          placeholder="行程標題"
                       />
                       <textarea 
                          value={event.desc}
                          onChange={(e) => handleEventChange(index, 'desc', e.target.value)}
                          className="w-full p-2 text-sm border rounded h-20 resize-none"
                          placeholder="詳細內容"
                       />
                    </div>
                 </div>
               ))}
            </div>

            {/* Footer Edit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-indigo-400 uppercase">住宿資訊</label>
                  <input 
                     type="text"
                     value={editData.accommodation?.name || ''}
                     onChange={(e) => setEditData({...editData, accommodation: { ...editData.accommodation, name: e.target.value }})}
                     className="w-full p-2 border rounded text-sm"
                     placeholder="飯店名稱"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-bold text-amber-400 uppercase">小撇步</label>
                  <textarea 
                     value={editData.tips || ''}
                     onChange={(e) => setEditData({...editData, tips: e.target.value})}
                     className="w-full p-2 border rounded text-sm h-20 resize-none"
                     placeholder="旅遊小提醒"
                  />
               </div>
            </div>

          </div>
        ) : (
          /* VIEW MODE CONTENT */
          <>
            <div className="max-w-3xl mx-auto mb-10 border-b border-japan-blue/10 pb-6">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-ink mb-4 leading-tight">
                {day.title}
              </h2>
              <p className="text-base md:text-lg text-gray-700 font-medium leading-relaxed bg-white/40 p-3 rounded-lg backdrop-blur-sm border border-white/40">
                {day.desc}
              </p>
            </div>

            <div className="max-w-3xl mx-auto pl-2 md:pl-4 mb-12">
              <div className="relative border-l-[2px] border-japan-blue/10 pl-8 pb-4 space-y-2">
                {day.events.map((event, index) => (
                  <TimelineEvent key={index} event={event} />
                ))}
              </div>
            </div>

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
          </>
        )}
      </div>

      {/* Floating Navigation Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 pl-6 pr-[156px] md:px-6 py-4 z-20 flex justify-between items-center">
        <button 
          onClick={onPrev}
          disabled={!hasPrev || isEditing}
          className={`
            flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-all
            ${hasPrev && !isEditing
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
          disabled={!hasNext || isEditing}
          className={`
            flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-all
            ${hasNext && !isEditing
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