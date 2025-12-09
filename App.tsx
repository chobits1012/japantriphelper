
import React, { useState } from 'react';
import { Plus, Map, Calendar, ChevronRight, Copy } from 'lucide-react'; // Import Copy icon
import { WASHI_PATTERN } from './constants';
import { useTripManager } from './hooks/useTripManager';
import TripView from './components/TripView';
import TripSetup from './components/TripSetup';
import type { TripSeason } from './types';

const App: React.FC = () => {
  const { trips, createTrip, createTemplateTrip, deleteTrip, updateTripMeta } = useTripManager(); // Destructure createTemplateTrip
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [isSetupOpen, setIsSetupOpen] = useState(false);

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

  return (
    <div 
      className="min-h-screen w-full bg-paper font-sans text-ink relative overflow-y-auto"
      style={{ backgroundImage: `url("${WASHI_PATTERN}")` }}
    >
      <TripSetup isOpen={isSetupOpen} onClose={() => setIsSetupOpen(false)} onSetup={handleSetupTrip} />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Map className="text-japan-blue" size={32} />
          <h1 className="text-3xl font-serif font-bold text-ink">我的旅程</h1>
        </div>

        <div className="grid gap-4">
          {trips.map(trip => (
            <div 
              key={trip.id}
              onClick={() => setSelectedTripId(trip.id)}
              className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
            >
              <div className="flex h-32 md:h-40">
                <div className="w-1/3 md:w-1/4 relative overflow-hidden">
                   <img 
                     src={trip.coverImage} 
                     alt={trip.name} 
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                   />
                   <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="flex-1 p-5 flex flex-col justify-center">
                   <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{trip.season}</span>
                      <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{trip.days} Days</span>
                   </div>
                   <h2 className="text-2xl font-serif font-bold text-ink group-hover:text-japan-blue transition-colors mb-2">
                     {trip.name}
                   </h2>
                   <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={14} />
                      <span className="font-mono">{trip.startDate}</span>
                   </div>
                </div>
                <div className="pr-6 flex items-center justify-center text-gray-300 group-hover:text-japan-blue group-hover:translate-x-1 transition-all">
                   <ChevronRight size={24} />
                </div>
              </div>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <button 
                onClick={() => setIsSetupOpen(true)}
                className="flex items-center justify-center gap-2 py-6 border-2 border-dashed border-gray-300 rounded-2xl text-gray-400 font-bold hover:border-japan-blue hover:text-japan-blue hover:bg-white transition-all group"
            >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <Plus size={20} />
                </div>
                <span>建立新旅程</span>
            </button>

            <button 
                onClick={handleCreateTemplate}
                className="flex items-center justify-center gap-2 py-6 border-2 border-dashed border-gray-300 rounded-2xl text-gray-400 font-bold hover:border-japan-blue hover:text-japan-blue hover:bg-white transition-all group"
            >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <Copy size={18} />
                </div>
                <span>建立範本 (關西冬之旅)</span>
            </button>
          </div>
        </div>
        
        <div className="mt-12 text-center text-gray-400 text-xs font-mono">
           Travel Assistant v2.1
        </div>
      </div>
    </div>
  );
};

export default App;
