
import React, { useState, useEffect, useRef } from 'react';
import { X, Wallet, Calculator, CheckSquare, Plus, Trash2, RefreshCw, TrendingUp, Coins, Cloud, Download, Upload, Copy, Check, FileJson } from 'lucide-react';
import LZString from 'lz-string';
import type { ExpenseItem, ChecklistItem, TripSettings, ItineraryDay } from '../types';

interface TravelToolboxProps {
  isOpen: boolean;
  onClose: () => void;
  tripSettings: TripSettings;
  onUpdateTripSettings: (settings: TripSettings) => void;
  itineraryData: ItineraryDay[];
  onUpdateItinerary: (data: ItineraryDay[]) => void;
  expenses: ExpenseItem[];
  onUpdateExpenses: (items: ExpenseItem[]) => void;
  checklist: ChecklistItem[];
  onUpdateChecklist: (items: ChecklistItem[]) => void;
}

const DEFAULT_CHECKLIST = [
  "護照 (效期6個月以上)", "JR PASS 兌換券", "日幣現金", "信用卡 (海外回饋高)", 
  "SIM卡 / Roaming 開通", "行動電源", "充電線 / 轉接頭", "個人藥品", 
  "保暖衣物 / 發熱衣", "好走的鞋子", "Visit Japan Web 填寫"
];

const TravelToolbox: React.FC<TravelToolboxProps> = ({ 
  isOpen, onClose, 
  tripSettings, onUpdateTripSettings,
  itineraryData, onUpdateItinerary,
  expenses, onUpdateExpenses, 
  checklist, onUpdateChecklist 
}) => {
  const [activeTab, setActiveTab] = useState<'currency' | 'expense' | 'checklist' | 'backup'>('expense');
  
  // --- Currency State ---
  const [rate, setRate] = useState<number>(0.215);
  const [jpyInput, setJpyInput] = useState<string>('1000');
  const [twdInput, setTwdInput] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loadingRate, setLoadingRate] = useState(false);

  // --- Expense State ---
  const [newExpTitle, setNewExpTitle] = useState('');
  const [newExpAmount, setNewExpAmount] = useState('');
  const [newExpCat, setNewExpCat] = useState<ExpenseItem['category']>('food');

  // --- Backup State ---
  const [importCode, setImportCode] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Checklist if empty
  useEffect(() => {
    if (checklist.length === 0) {
      const initialList = DEFAULT_CHECKLIST.map(text => ({
        id: Math.random().toString(36).substr(2, 9),
        text,
        checked: false
      }));
      onUpdateChecklist(initialList);
    }
  }, []);

  // Fetch Exchange Rate
  useEffect(() => {
    if (isOpen && activeTab === 'currency') {
      fetchRate();
    }
  }, [isOpen, activeTab]);

  const fetchRate = async () => {
    setLoadingRate(true);
    try {
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/JPY');
      const data = await res.json();
      const currentRate = data.rates.TWD;
      setRate(currentRate);
      setLastUpdated(new Date().toLocaleTimeString());
      setTwdInput((parseFloat(jpyInput) * currentRate).toFixed(0));
    } catch (e) {
      console.error("Failed to fetch rate", e);
    } finally {
      setLoadingRate(false);
    }
  };

  const handleJpyChange = (val: string) => {
    setJpyInput(val);
    if (!isNaN(parseFloat(val))) {
      setTwdInput((parseFloat(val) * rate).toFixed(0));
    } else {
      setTwdInput('');
    }
  };

  const handleTwdChange = (val: string) => {
    setTwdInput(val);
    if (!isNaN(parseFloat(val))) {
      setJpyInput((parseFloat(val) / rate).toFixed(0));
    } else {
      setJpyInput('');
    }
  };

  // Expense Logic
  const handleAddExpense = () => {
    if (!newExpTitle || !newExpAmount) return;
    const newItem: ExpenseItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: newExpTitle,
      amountJPY: parseInt(newExpAmount),
      category: newExpCat,
      date: new Date().toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' })
    };
    onUpdateExpenses([newItem, ...expenses]);
    setNewExpTitle('');
    setNewExpAmount('');
  };

  const handleDeleteExpense = (id: string) => {
    onUpdateExpenses(expenses.filter(e => e.id !== id));
  };

  const handleClearExpenses = () => {
    if (window.confirm("確定要清空所有記帳紀錄嗎？此動作無法復原。")) {
      onUpdateExpenses([]);
    }
  };

  const totalJPY = expenses.reduce((sum, item) => sum + item.amountJPY, 0);

  // Checklist Logic
  const toggleCheck = (id: string) => {
    onUpdateChecklist(checklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleResetChecklist = () => {
    if (window.confirm("確定要重置檢查清單嗎？這將會恢復為預設項目並清除自訂項目。")) {
      const initialList = DEFAULT_CHECKLIST.map(text => ({
        id: Math.random().toString(36).substr(2, 9),
        text,
        checked: false
      }));
      onUpdateChecklist(initialList);
    }
  };

  // --- BACKUP & SHARE LOGIC ---

  const getExportData = () => {
    return {
      tripSettings,
      itineraryData,
      expenses,
      checklist,
      version: 1,
      timestamp: new Date().toISOString()
    };
  };

  // 1. Copy Compressed Code
  const handleCopyCode = () => {
    const data = getExportData();
    const jsonString = JSON.stringify(data);
    // Compress string to make it shorter for messaging apps
    const compressed = LZString.compressToEncodedURIComponent(jsonString);
    
    navigator.clipboard.writeText(compressed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 2. Download JSON File
  const handleDownloadFile = () => {
    const data = getExportData();
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tripSettings.name}_行程備份.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Common Import Processor
  const processImportData = (data: any) => {
     if (!data.itineraryData || !data.tripSettings) {
        throw new Error("無效的行程資料格式");
      }

      if (window.confirm(`⚠️ 確定要匯入行程「${data.tripSettings.name}」嗎？\n\n您目前手機上的所有資料將會被覆蓋！`)) {
        onUpdateTripSettings(data.tripSettings);
        onUpdateItinerary(data.itineraryData);
        if (data.expenses) onUpdateExpenses(data.expenses);
        if (data.checklist) onUpdateChecklist(data.checklist);
        
        alert("匯入成功！");
        setImportCode('');
        onClose();
      }
  };

  // 3. Import from Code (Auto-detect compressed or raw)
  const handleImportCode = () => {
    try {
      if (!importCode.trim()) return;
      
      let jsonString = importCode.trim();
      
      // Try to decompress if it doesn't look like JSON
      if (!jsonString.startsWith('{')) {
        const decompressed = LZString.decompressFromEncodedURIComponent(jsonString);
        if (decompressed) {
           jsonString = decompressed;
        }
      }

      const data = JSON.parse(jsonString);
      processImportData(data);
    } catch (e) {
      alert("匯入失敗：無效的代碼");
    }
  };

  // 4. Import from File
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const data = JSON.parse(result);
        processImportData(data);
      } catch (err) {
        alert("讀取檔案失敗：格式錯誤");
      }
      // Reset input value so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="bg-gray-900 p-4 flex items-center justify-between text-white">
          <h3 className="font-serif font-bold text-lg tracking-wide flex items-center gap-2">
            <Wallet size={20} className="text-yellow-400" />
            旅遊工具箱
          </h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('expense')}
            className={`flex-1 min-w-[80px] py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'expense' ? 'text-japan-blue border-b-2 border-japan-blue bg-blue-50/50' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <Coins size={16} /> <span className="hidden sm:inline">記帳</span>
          </button>
          <button 
            onClick={() => setActiveTab('currency')}
            className={`flex-1 min-w-[80px] py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'currency' ? 'text-japan-blue border-b-2 border-japan-blue bg-blue-50/50' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <RefreshCw size={16} /> <span className="hidden sm:inline">匯率</span>
          </button>
          <button 
            onClick={() => setActiveTab('checklist')}
            className={`flex-1 min-w-[80px] py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'checklist' ? 'text-japan-blue border-b-2 border-japan-blue bg-blue-50/50' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <CheckSquare size={16} /> <span className="hidden sm:inline">清單</span>
          </button>
          <button 
            onClick={() => setActiveTab('backup')}
            className={`flex-1 min-w-[80px] py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'backup' ? 'text-japan-blue border-b-2 border-japan-blue bg-blue-50/50' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <Cloud size={16} /> <span className="hidden sm:inline">備份</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto flex-1 bg-paper">
          
          {/* --- EXPENSE TAB --- */}
          {activeTab === 'expense' && (
            <div className="space-y-4">
              {/* Summary Card */}
              <div className="bg-gradient-to-br from-japan-blue to-indigo-700 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                   <p className="text-xs font-bold opacity-70 mb-1 uppercase tracking-wider">Total Spending</p>
                   <div className="flex items-baseline gap-2">
                     <span className="text-3xl font-bold font-mono">¥{totalJPY.toLocaleString()}</span>
                     <span className="text-sm opacity-80">≈ NT${(totalJPY * rate).toLocaleString()}</span>
                   </div>
                </div>
                <Coins className="absolute -right-4 -bottom-4 text-white/10 w-24 h-24 rotate-12" />
              </div>

              {/* Action Header */}
              <div className="flex justify-between items-center">
                 <span className="text-xs font-bold text-gray-400 uppercase">記帳明細</span>
                 {expenses.length > 0 && (
                   <button 
                     onClick={handleClearExpenses}
                     className="text-xs font-bold text-red-400 hover:text-red-500 flex items-center gap-1 bg-red-50 px-2 py-1 rounded-md"
                   >
                     <Trash2 size={12} /> 清空記帳
                   </button>
                 )}
              </div>

              {/* Add Expense */}
              <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex gap-2">
                 <div className="flex-1 space-y-2">
                    <input 
                      type="text" 
                      placeholder="項目 (如: 拉麵)" 
                      value={newExpTitle}
                      onChange={e => setNewExpTitle(e.target.value)}
                      className="w-full text-sm font-bold border-b border-gray-200 focus:border-japan-blue outline-none py-1"
                    />
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        placeholder="日幣金額" 
                        value={newExpAmount}
                        onChange={e => setNewExpAmount(e.target.value)}
                        className="w-24 text-sm font-mono border-b border-gray-200 focus:border-japan-blue outline-none py-1"
                      />
                      <select 
                        value={newExpCat} 
                        onChange={(e: any) => setNewExpCat(e.target.value)}
                        className="text-xs bg-gray-50 rounded border-none outline-none"
                      >
                        <option value="food">美食</option>
                        <option value="shopping">購物</option>
                        <option value="transport">交通</option>
                        <option value="hotel">住宿</option>
                        <option value="other">其他</option>
                      </select>
                    </div>
                 </div>
                 <button 
                   onClick={handleAddExpense}
                   className="bg-japan-blue text-white w-10 rounded-lg flex items-center justify-center hover:bg-japan-blue/90 shadow-sm"
                 >
                   <Plus size={20} />
                 </button>
              </div>

              {/* List */}
              <div className="space-y-2">
                {expenses.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">還沒有記帳紀錄</div>
                ) : (
                  expenses.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm animate-in slide-in-from-bottom-2">
                       <div className="flex items-center gap-3">
                          <div className={`
                             w-8 h-8 rounded-full flex items-center justify-center text-xs text-white font-bold
                             ${item.category === 'food' ? 'bg-orange-400' : 
                               item.category === 'shopping' ? 'bg-purple-400' : 
                               item.category === 'transport' ? 'bg-gray-400' : 'bg-blue-400'}
                          `}>
                            {item.category[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-ink text-sm">{item.title}</p>
                            <p className="text-[10px] text-gray-400">{item.date} • {item.category}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-japan-blue">¥{item.amountJPY.toLocaleString()}</span>
                          <button onClick={() => handleDeleteExpense(item.id)} className="text-gray-300 hover:text-red-400">
                            <Trash2 size={14} />
                          </button>
                       </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* --- CURRENCY TAB --- */}
          {activeTab === 'currency' && (
             <div className="space-y-6 pt-4">
                <div className="text-center">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Current Rate (JPY/TWD)</p>
                   <div className="flex items-center justify-center gap-2 text-japan-blue">
                      <TrendingUp size={20} />
                      <span className="text-4xl font-mono font-bold">{rate}</span>
                   </div>
                   <p className="text-[10px] text-gray-400 mt-2">
                     {loadingRate ? 'Updating...' : `Updated: ${lastUpdated}`}
                   </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl space-y-4 border border-gray-100">
                   {/* JPY Input */}
                   <div className="relative">
                      <label className="text-xs font-bold text-gray-400 absolute left-3 top-2">JPY 日幣</label>
                      <input 
                        type="number" 
                        value={jpyInput}
                        onChange={e => handleJpyChange(e.target.value)}
                        className="w-full bg-white p-3 pt-6 rounded-xl border border-gray-200 text-2xl font-mono font-bold text-ink focus:ring-2 focus:ring-japan-blue outline-none"
                      />
                   </div>

                   <div className="flex justify-center -my-2 relative z-10">
                      <div className="bg-white border border-gray-200 rounded-full p-1.5 shadow-sm text-gray-400">
                        <RefreshCw size={16} />
                      </div>
                   </div>

                   {/* TWD Input */}
                   <div className="relative">
                      <label className="text-xs font-bold text-gray-400 absolute left-3 top-2">TWD 台幣 (約)</label>
                      <input 
                        type="number" 
                        value={twdInput}
                        onChange={e => handleTwdChange(e.target.value)}
                        className="w-full bg-white p-3 pt-6 rounded-xl border border-gray-200 text-2xl font-mono font-bold text-ink focus:ring-2 focus:ring-japan-blue outline-none"
                      />
                   </div>
                </div>
             </div>
          )}

          {/* --- CHECKLIST TAB --- */}
          {activeTab === 'checklist' && (
             <div className="space-y-2">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-3">
                      <h4 className="font-bold text-ink">出發前檢查</h4>
                      <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                        {checklist.filter(i => i.checked).length} / {checklist.length}
                      </span>
                   </div>
                   <button 
                     onClick={handleResetChecklist}
                     className="text-xs font-bold text-japan-blue hover:text-blue-600 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md"
                   >
                     <RefreshCw size={12} /> 重置清單
                   </button>
                </div>

                {checklist.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => toggleCheck(item.id)}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                      ${item.checked ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200 hover:border-japan-blue/50'}
                    `}
                  >
                     <div className={`
                        w-5 h-5 rounded border flex items-center justify-center transition-colors
                        ${item.checked ? 'bg-japan-blue border-japan-blue text-white' : 'border-gray-300 bg-white'}
                     `}>
                        {item.checked && <CheckSquare size={14} />}
                     </div>
                     <span className={`text-sm font-medium ${item.checked ? 'text-gray-400 line-through' : 'text-ink'}`}>
                       {item.text}
                     </span>
                  </div>
                ))}
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                   <input 
                     type="text" 
                     placeholder="新增自訂項目..." 
                     className="flex-1 text-sm p-2 border border-gray-200 rounded-lg outline-none focus:border-japan-blue"
                     onKeyDown={(e) => {
                       if (e.key === 'Enter') {
                         const val = (e.target as HTMLInputElement).value;
                         if (val) {
                           onUpdateChecklist([...checklist, { id: Math.random().toString(), text: val, checked: false }]);
                           (e.target as HTMLInputElement).value = '';
                         }
                       }
                     }}
                   />
                </div>
             </div>
          )}

          {/* --- BACKUP TAB --- */}
          {activeTab === 'backup' && (
            <div className="space-y-6 pt-2">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-japan-blue">
                    <Cloud size={24} />
                 </div>
                 <h4 className="font-bold text-ink mb-1">備份與分享行程</h4>
                 <p className="text-xs text-gray-500 leading-relaxed px-4">
                   將您的行程轉成代碼，或下載成小包裹檔案 (.json) 傳給朋友。
                 </p>
              </div>

              {/* Export Section */}
              <div className="grid grid-cols-2 gap-3">
                 <button 
                   onClick={handleDownloadFile}
                   className="flex flex-col items-center justify-center p-4 bg-japan-blue text-white rounded-xl shadow-md hover:bg-japan-blue/90 transition-all gap-2"
                 >
                   <FileJson size={24} />
                   <div className="text-center">
                     <span className="block text-sm font-bold">下載檔案</span>
                     <span className="text-[10px] opacity-80">(推薦 LINE 分享)</span>
                   </div>
                 </button>
                 
                 <button 
                   onClick={handleCopyCode}
                   className={`
                     flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl transition-all gap-2
                     ${copied 
                       ? 'border-emerald-400 bg-emerald-50 text-emerald-600' 
                       : 'border-japan-blue/30 text-japan-blue hover:bg-blue-50'}
                   `}
                 >
                   {copied ? <Check size={24} /> : <Copy size={24} />}
                   <div className="text-center">
                     <span className="block text-sm font-bold">{copied ? '已複製！' : '複製代碼'}</span>
                     <span className="text-[10px] opacity-70">(文字訊息)</span>
                   </div>
                 </button>
              </div>

              <div className="relative flex items-center py-2">
                 <div className="flex-grow border-t border-gray-200"></div>
                 <span className="flex-shrink-0 mx-4 text-gray-300 text-xs font-bold">OR IMPORT</span>
                 <div className="flex-grow border-t border-gray-200"></div>
              </div>

              {/* Import Section */}
              <div className="space-y-3">
                 <input 
                   type="file" 
                   accept=".json" 
                   ref={fileInputRef} 
                   onChange={handleFileUpload} 
                   className="hidden" 
                 />
                 
                 <button 
                   onClick={triggerFileUpload}
                   className="w-full py-3 bg-white border border-gray-300 text-gray-600 rounded-xl font-bold hover:bg-gray-50 flex items-center justify-center gap-2"
                 >
                   <Upload size={16} /> 選擇檔案 (.json) 匯入
                 </button>

                 <div className="flex gap-2">
                    <input 
                      value={importCode}
                      onChange={(e) => setImportCode(e.target.value)}
                      placeholder="或貼上壓縮代碼..."
                      className="flex-1 p-3 text-xs font-mono border border-gray-200 rounded-xl outline-none focus:border-japan-blue"
                    />
                    <button 
                      onClick={handleImportCode}
                      disabled={!importCode}
                      className="px-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      讀取
                    </button>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelToolbox;
