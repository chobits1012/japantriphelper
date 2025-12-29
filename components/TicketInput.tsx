import React, { useState } from 'react';
import { Ticket, Link as LinkIcon, X } from 'lucide-react';
// import { ItineraryEvent } from '../types'; // 請依據您的專案路徑調整

interface TicketInputProps {
    url?: string;
    onUpdate: (updates: { ticketUrl: string }) => void;
}

const TicketInput: React.FC<TicketInputProps> = ({ url, onUpdate }) => {
    const [showInput, setShowInput] = useState(false);

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ ticketUrl: e.target.value });
    };

    // 如果沒有 URL 且輸入框未顯示，顯示 "新增票券連結" 按鈕
    if (!showInput && !url) {
        return (
            <button
                onClick={() => setShowInput(true)}
                className="text-xs font-bold text-gray-400 hover:text-blue-500 flex items-center gap-1 p-1 hover:bg-gray-50 rounded transition-colors"
            >
                <Ticket size={14} /> 新增票券連結
            </button>
        );
    }

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-blue-500 uppercase flex items-center gap-1">
                    <Ticket size={14} /> 電子票券連結
                </label>
                {!url && (
                    <button onClick={() => setShowInput(false)} className="text-gray-400 hover:text-red-500">
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* URL Input */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-2 py-1.5 focus-within:border-blue-500 transition-colors">
                <LinkIcon size={14} className="text-gray-400 flex-shrink-0" />
                <input
                    type="url"
                    value={url || ''}
                    onChange={handleUrlChange}
                    placeholder="貼上票券或是訂位網址..."
                    className="flex-1 text-xs bg-transparent outline-none placeholder-gray-400"
                />
            </div>
        </div>
    );
};

export default TicketInput;
