import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Map, Calendar, ChevronRight, Copy, Plane, Sparkles, BookOpen, Camera, X } from 'lucide-react';
import { WASHI_PATTERN, HERO_IMAGE } from './constants';
import { useTripManager } from './hooks/useTripManager';
import TripView from './components/TripView';
import TripSetup from './components/TripSetup';
import HelpModal from './components/HelpModal';
import ImagePicker from './components/ImagePicker';
import { saveImage, getImageUrl } from './services/imageStore';
import type { TripSeason } from './types';

const App: React.FC = () => {
  const { trips, createTrip, createTemplateTrip, deleteTrip, updateTripMeta } = useTripManager();
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // 一次性更新提示
  const UPDATE_KEY = 'update-seen-v2.2';
  const [showUpdateToast, setShowUpdateToast] = useState(() => {
    return !localStorage.getItem(UPDATE_KEY);
  });

  const dismissToast = () => {
    setShowUpdateToast(false);
    localStorage.setItem(UPDATE_KEY, 'true');
  };

  // 自訂封面圖片快取：tripId -> Object URL
  const [customCovers, setCustomCovers] = useState<Record<string, string>>({});
  const customCoversRef = useRef(customCovers);
  customCoversRef.current = customCovers;

  // 防止換封面操作時觸發卡片導航
  const isPickingImage = useRef(false);

  // 頁面載入時從 IndexedDB 讀取所有旅程的自訂封面
  useEffect(() => {
    if (selectedTripId) return; // 在旅程內頁時不載入
    let cancelled = false;

    const loadCovers = async () => {
      const covers: Record<string, string> = {};
      for (const trip of trips) {
        const url = await getImageUrl(trip.id);
        if (url && !cancelled) {
          covers[trip.id] = url;
        }
      }
      if (!cancelled) {
        setCustomCovers(covers);
      }
    };

    loadCovers();

    return () => {
      cancelled = true;
      // 釋放 Object URL 避免記憶體洩漏
      const urls = customCoversRef.current;
      Object.values(urls).forEach((url: string) => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [trips, selectedTripId]);

  // 處理使用者更換封面
  const handleCoverChange = useCallback(async (tripId: string, blob: Blob) => {
    try {
      await saveImage(tripId, blob);
      // 釋放舊的 Object URL
      const oldUrl = customCoversRef.current[tripId];
      if (oldUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(oldUrl);
      }
      const newUrl = URL.createObjectURL(blob);
      setCustomCovers(prev => ({ ...prev, [tripId]: newUrl }));
    } catch (err) {
      console.error('封面儲存失敗:', err);
      alert('封面儲存失敗，請再試一次');
    } finally {
      isPickingImage.current = false;
    }
  }, []);

  // 卡片點擊處理 — 換封面時不導航
  const handleTripClick = useCallback((tripId: string) => {
    if (isPickingImage.current) return;
    setSelectedTripId(tripId);
  }, []);

  // If a trip is selected, show the TripView
  if (selectedTripId) {
    return (
      <TripView
        tripId={selectedTripId}
        onBack={() => setSelectedTripId(null)}
        onDeleteTrip={() => {
          deleteTrip(selectedTripId);
          setSelectedTripId(null);
        }}
        updateTripMeta={updateTripMeta}
      />
    );
  }

  // Otherwise, show the Trip List (Manager)
  const handleSetupTrip = (name: string, startDate: string, days: number, season: TripSeason) => {
    const newId = createTrip(name, startDate, days, season);
    setIsSetupOpen(false);
    setSelectedTripId(newId);
  };

  const handleCreateTemplate = () => {
    const newId = createTemplateTrip();
    setSelectedTripId(newId);
  };

  const getSeasonColor = (season: TripSeason) => {
    switch (season) {
      case 'spring': return 'bg-pink-500';
      case 'summer': return 'bg-orange-500';
      case 'autumn': return 'bg-red-600';
      case 'winter': return 'bg-sky-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="relative min-h-screen w-full font-sans text-ink overflow-x-hidden">

      <TripSetup isOpen={isSetupOpen} onClose={() => setIsSetupOpen(false)} onSetup={handleSetupTrip} />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* --- Background Layers --- */}
      {/* 1. Base Image */}
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
      />

      {/* 2. Gradient Overlay (Darkens image for text readability) */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60 z-0 backdrop-blur-[2px]" />

      {/* 3. Washi Texture Overlay */}
      <div
        className="fixed inset-0 z-0 opacity-30 pointer-events-none"
        style={{ backgroundImage: `url("${WASHI_PATTERN}")` }}
      />

      {/* ✨ 一次性更新提示 Toast */}
      {showUpdateToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-500">
          <div
            onClick={dismissToast}
            className="flex items-center gap-3 px-5 py-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 dark:border-white/10 cursor-pointer hover:scale-[1.02] transition-transform group max-w-sm"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Camera size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                新功能上線 🎉
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-tight">
                現在可以更換旅程封面圖片囉！將滑鼠移到卡片圖片即可更換。
              </p>
            </div>
            <X size={16} className="text-gray-300 group-hover:text-gray-500 flex-shrink-0 transition-colors" />
          </div>
        </div>
      )}

      {/* --- Main Content --- */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-20 flex flex-col min-h-screen">

        {/* Header Section */}
        <div className="mb-12 text-center md:text-left animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
          <div className="flex justify-between items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold tracking-widest uppercase mb-4 shadow-lg">
                <Plane size={14} className="animate-pulse" />
                Travel Planner
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-white drop-shadow-lg tracking-wide mb-2">
                我的旅程
              </h1>
              <p className="text-white/80 text-lg md:text-xl font-light tracking-wider drop-shadow-md">
                下一站，想去哪裡？
              </p>
            </div>

            {/* Help Trigger */}
            <button
              onClick={() => setIsHelpOpen(true)}
              className="bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md border border-white/20 text-white transition-all hover:scale-105 shadow-lg group"
              title="使用說明"
            >
              <BookOpen size={24} className="group-hover:text-yellow-300 transition-colors" />
            </button>
          </div>
        </div>

        {/* Trip List Grid */}
        <div className="grid gap-6 flex-1 content-start">
          {trips.map((trip, index) => (
            <div
              key={trip.id}
              onClick={() => handleTripClick(trip.id)}
              className="group relative bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 animate-in slide-in-from-bottom-4 border border-white/40"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col md:flex-row h-auto md:h-48">
                {/* Image Section */}
                <div className="w-full md:w-1/3 h-40 md:h-full relative overflow-hidden">
                  <div className={`absolute top-3 left-3 z-10 ${getSeasonColor(trip.season)} text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md uppercase tracking-wider`}>
                    {trip.season}
                  </div>
                  <img
                    src={customCovers[trip.id] || trip.coverImage}
                    alt={trip.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  {/* 更換封面按鈕 — hover 時出現，手機上不攔截觸碰 */}
                  <div className="absolute bottom-3 right-3 z-10 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
                    <ImagePicker
                      onImageSelected={(blob) => handleCoverChange(trip.id, blob)}
                      onPickStart={() => { isPickingImage.current = true; }}
                    />
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 flex flex-col justify-center relative">
                  {/* Decorative Washi BG for content */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url("${WASHI_PATTERN}")` }} />

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-2xl md:text-3xl font-serif font-bold text-ink group-hover:text-japan-blue transition-colors line-clamp-1">
                        {trip.name}
                      </h2>
                      <ChevronRight size={24} className="text-gray-300 group-hover:text-japan-blue group-hover:translate-x-1 transition-transform" />
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 font-medium mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={16} className="text-japan-blue/70" />
                        <span className="font-mono pt-0.5">{trip.startDate}</span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-gray-300" />
                      <span>{trip.days} Days</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="bg-gray-100 px-2 py-1 rounded text-gray-500 font-bold">
                        {trip.days > 5 ? 'Long Trip' : 'Short Trip'}
                      </span>
                      {trip.name.includes('關西') && <span className="bg-blue-50 text-blue-500 px-2 py-1 rounded font-bold">Kansai</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Action Buttons (or Bottom Area) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <button
            onClick={() => setIsSetupOpen(true)}
            className="flex items-center justify-center gap-3 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-md border-2 border-white/30 border-dashed rounded-2xl text-white font-bold transition-all group hover:border-white/60 hover:shadow-lg"
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-japan-blue transition-colors">
              <Plus size={24} />
            </div>
            <span className="text-lg tracking-wide">建立新旅程</span>
          </button>

          <button
            onClick={handleCreateTemplate}
            className="flex items-center justify-center gap-3 py-5 bg-japan-blue/80 hover:bg-japan-blue/90 backdrop-blur-md rounded-2xl text-white font-bold transition-all group shadow-lg hover:shadow-japan-blue/50 hover:-translate-y-1"
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-japan-blue transition-colors">
              <Sparkles size={20} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-lg tracking-wide leading-none">建立範本</span>
              <span className="text-xs opacity-70 font-normal mt-1">複製「關西冬之旅」</span>
            </div>
          </button>
        </div>

        <div className="mt-16 text-center text-white/40 text-xs font-mono tracking-widest space-y-2 pb-8">
          <p>TRAVEL ASSISTANT v2.1</p>
          <div className="flex flex-col items-center gap-1">
            <p className="text-white/60 font-bold">James Wang</p>
            <a
              href="https://www.threads.net/@jameswangwangwang"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors border-b border-transparent hover:border-white/40"
            >
              threads: jameswangwangwang
            </a>
          </div>

          {/* PWA Tip */}
          <div className="mt-6 p-3 bg-white/10 rounded-lg backdrop-blur-sm inline-block max-w-xs mx-auto border border-white/10">
            <p className="text-white/90 font-sans font-bold mb-1 text-xs">防丟失小撇步 💡</p>
            <p className="text-white/60 leading-tight text-[10px]">
              在 Safari 點擊「分享」<br />
              選擇「加入主畫面」<br />
              可讓資料保存更長久！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;