
import React, { useState, useEffect, useRef } from 'react';
import { X, Wallet, CheckSquare, Plus, Trash2, RefreshCw, TrendingUp, Coins, Cloud, Download, Upload, Copy, Check, FileJson, ChevronDown, ChevronRight, FolderPlus, Pencil, Save } from 'lucide-react';
import LZString from 'lz-string';
import type { ExpenseItem, ChecklistCategory, ChecklistItem, TripSettings, ItineraryDay } from '../types';

interface TravelToolboxProps {
  isOpen: boolean;
  onClose: () => void;
  tripSettings: TripSettings;
  onUpdateTripSettings: (settings: TripSettings) => void;
  itineraryData: ItineraryDay[];
  onUpdateItinerary: (data: ItineraryDay[]) => void;
  expenses: ExpenseItem[];
  onUpdateExpenses: (items: ExpenseItem[]) => void;
  checklist: ChecklistCategory[];
  onUpdateChecklist: (categories: ChecklistCategory[]) => void;
}

const DEFAULT_CATEGORIES = [
  { title: "證件/錢財", items: ["護照 (效期6個月以上)", "JR PASS 兌換券", "日幣現金", "信用卡 (海外回饋高)"] },
  { title: "衣物/穿搭", items: ["換洗衣物", "好走的鞋子", "保暖衣物/發熱衣", "帽子/太陽眼鏡"] },
  { title: "電子產品", items: ["手機", "充電器", "行動電源", "網卡/eSIM/漫遊", "轉接頭 (日本雙孔)"] },
  { title: "盥洗/藥品", items: ["個人藥品", "牙刷牙膏", "保養品/化妝品"] },
  { title: "其他", items: ["雨傘", "筆", "Visit Japan Web 截圖"] }
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

  // --- Checklist State ---
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  
  // State for adding items per category: { [catId]: "item text" }
  const [newItemInputs, setNewItemInputs] = useState<Record<string, string>>({});
  
  // State for editing category title
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  // Initialize Checklist if empty
  useEffect(() => {
    if (checklist.length === 0) {
      handleResetChecklist(false); // Init without confirm
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

  // --- CHECKLIST LOGIC ---

  const handleResetChecklist = (confirm = true) => {
    if (!confirm || window.confirm("確定要重置檢查清單嗎？這將會恢復為預設項目並清除自訂項目。")) {
      const initialList: ChecklistCategory[] = DEFAULT_CATEGORIES.map(cat => ({
        id: Math.random().toString(36).substr(2, 9),
        title: cat.title,
        items: cat.items.map(text => ({
           id: Math.random().toString(36).substr(2, 9),
           text,
           checked: false
        })),
        isCollapsed: false
      }));
      onUpdateChecklist(initialList);
    }
  };

  const toggleCategoryCollapse = (catId: string) => {
    onUpdateChecklist(checklist.map(cat => 
      cat.id === catId ? { ...cat, isCollapsed: !cat.isCollapsed } : cat
    ));
  };

  const handleDeleteCategory = (catId: string) => {
    if (window.confirm("確定要刪除這個分類嗎？")) {
      onUpdateChecklist(checklist.filter(c => c.id !== catId));
    }
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCat: ChecklistCategory = {
      id: Math.random().toString(36).substr(2, 9),
      title: newCategoryName,
      items: [],
      isCollapsed: false
    };
    onUpdateChecklist([...checklist, newCat]);
    setNewCategoryName('');
    setShowNewCatInput(false);
  };

  const handleStartEditTitle = (cat: ChecklistCategory, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCatId(cat.id);
    setEditingTitle(cat.title);
  };

  const handleSaveTitle = (catId: string) => {
    if (editingTitle.trim()) {
      onUpdateChecklist(checklist.map(c => c.id === catId ? { ...c, title: editingTitle } : c));
    }
    setEditingCatId(null);
    setEditingTitle('');
  };

  const handleAddItemInput = (catId: string, val: string) => {
    setNewItemInputs(prev => ({ ...prev, [catId]: val }));
  };

  const handleAddItemSubmit = (catId: string) => {
    const text = newItemInputs[catId];
    if (!text || !text.trim()) return;

    onUpdateChecklist(checklist.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          items: [...cat.items, { id: Math.random().toString(36).substr(2, 9), text: text.trim(), checked: false }]
        };
      }
      return cat;
    }));

    // Clear input but keep focus logic is handled by React state update
    setNewItemInputs(prev => ({ ...prev, [catId]: '' }));
  };

  const handleToggleItem = (catId: string, itemId: string) => {
    onUpdateChecklist(checklist.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          items: cat.items.map(item => 
            item.id === itemId ? { ...item, checked: !item.checked } : item
          )
        };
      }
      return cat;
    }));
  };

  const handleDeleteItem = (catId: string, itemId: string) => {
    onUpdateChecklist(checklist.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          items: cat.items.filter(item => item.id !== itemId)
        };
      }
      return cat;
    }));
  };

  // --- BACKUP & SHARE LOGIC ---

  const getExportData = () => {
    return {
      tripSettings,
      itineraryData,
      expenses,
      checklist,
      version: 2, // Bumped version for categorized checklist
      timestamp: new Date().toISOString()
    };
  };

  const handleCopyCode = () => {
    const data = getExportData();
    const jsonString = JSON.stringify(data);
    const compressed = LZString.compressToEncodedURIComponent(jsonString);
    
    navigator.clipboard.writeText(compressed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  const processImportData = (data: any) => {
     if (!data.itineraryData || !data.tripSettings) {
        throw new Error("無效的行程資料格式");
      }

      if (window.confirm(`⚠️ 確定要匯入行程「${data.tripSettings.name}」嗎？\n\n您目前手機上的所有資料將會被覆蓋！`)) {
        onUpdateTripSettings(data.tripSettings);
        onUpdateItinerary(data.itineraryData);
        if (data.expenses) onUpdateExpenses(data.expenses);
        
        // Handle checklist migration during import if needed
        if (data.checklist) {
           const cl = data.checklist;
           if (Array.isArray(cl) && cl.length > 0 && 'text' in cl[0]) {
              // Old format import
              onUpdateChecklist([{
                 id: 'imported-legacy', title: '匯入的清單', items: cl, isCollapsed: false
              }]);
           } else {
              onUpdateChecklist(cl);
           }
        }
        
        alert("匯入成功！");
        setImportCode('');
        onClose();
      }
  };

  const handleImportCode = () => {
    try {
      if (!importCode.trim()) return;
      let jsonString = importCode.trim();
      if (!jsonString.startsWith('{')) {
        const decompressed = LZString.decompressFromEncodedURIComponent(jsonString);
        if (decompressed) jsonString = decompressed;
      }
      const data = JSON.parse(jsonString);
      processImportData(data);
    } catch (e) {
      alert("匯入失敗：無效的代碼");
    }
  };

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

          {/* --- CHECKLIST TAB (Categorized) --- */}
          {activeTab === 'checklist' && (
             <div className="space-y-4 pb-20">
                <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center gap-2">
                      <h4 className="font-bold text-ink">檢查清單</h4>
                      <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                        {checklist.reduce((acc, cat) => acc + cat.items.filter(i => i.checked).length, 0)} / {checklist.reduce((acc, cat) => acc + cat.items.length, 0)}
                      </span>
                   </div>
                   <button 
                     onClick={() => handleResetChecklist(true)}
                     className="text-xs font-bold text-gray-400 hover:text-japan-blue flex items-center gap-1"
                   >
                     <RefreshCw size={12} /> 重置
                   </button>
                </div>

                {/* Categories */}
                <div className="space-y-4">
                   {checklist.map(cat => {
                      const total = cat.items.length;
                      const checkedCount = cat.items.filter(i => i.checked).length;
                      const progress = total > 0 ? (checkedCount / total) * 100 : 0;
                      const isEditingTitle = editingCatId === cat.id;

                      return (
                        <div key={cat.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                           {/* Cat Header */}
                           <div 
                             onClick={() => toggleCategoryCollapse(cat.id)}
                             className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors select-none"
                           >
                              <div className="flex items-center gap-2 flex-1">
                                 {cat.isCollapsed ? <ChevronRight size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                                 
                                 {isEditingTitle ? (
                                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                       <input 
                                          type="text" 
                                          value={editingTitle}
                                          onChange={e => setEditingTitle(e.target.value)}
                                          onKeyDown={e => {
                                             if(e.key === 'Enter') handleSaveTitle(cat.id);
                                          }}
                                          className="text-sm font-bold p-1 border border-japan-blue rounded outline-none"
                                          autoFocus
                                       />
                                       <button onClick={() => handleSaveTitle(cat.id)} className="text-japan-blue"><Save size={16} /></button>
                                    </div>
                                 ) : (
                                    <div className="flex items-center gap-2 group">
                                       <span className="font-bold text-sm text-ink">{cat.title}</span>
                                       <button 
                                          onClick={(e) => handleStartEditTitle(cat, e)}
                                          className="text-gray-300 hover:text-japan-blue p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                       >
                                          <Pencil size={12} />
                                       </button>
                                       <span className="text-xs text-gray-400 font-mono">({checkedCount}/{total})</span>
                                    </div>
                                 )}
                              </div>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id); }}
                                className="text-gray-300 hover:text-red-400 p-1"
                              >
                                <Trash2 size={14} />
                              </button>
                           </div>
                           
                           {/* Progress Bar */}
                           <div className="h-1 bg-gray-100 w-full">
                              <div className="h-full bg-japan-blue transition-all duration-500" style={{ width: `${progress}%` }}></div>
                           </div>

                           {/* Cat Items */}
                           {!cat.isCollapsed && (
                             <div className="p-3 space-y-2">
                                {cat.items.map(item => (
                                  <div 
                                    key={item.id} 
                                    onClick={() => handleToggleItem(cat.id, item.id)}
                                    className="flex items-center justify-between group cursor-pointer"
                                  >
                                     <div className="flex items-center gap-3">
                                        <div className={`
                                           w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0
                                           ${item.checked ? 'bg-japan-blue border-japan-blue text-white' : 'border-gray-300 bg-white'}
                                        `}>
                                           {item.checked && <Check size={10} />}
                                        </div>
                                        <span className={`text-sm ${item.checked ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                          {item.text}
                                        </span>
                                     </div>
                                     <button 
                                       onClick={(e) => { e.stopPropagation(); handleDeleteItem(cat.id, item.id); }}
                                       className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-opacity"
                                     >
                                       <X size={14} />
                                     </button>
                                  </div>
                                ))}
                                
                                {/* Add Item Input */}
                                <div className="mt-2 pt-2 border-t border-gray-50 flex items-center gap-2">
                                   <Plus size={14} className="text-gray-300" />
                                   <input 
                                     type="text" 
                                     placeholder="新增項目..." 
                                     className="flex-1 text-xs bg-transparent outline-none py-1"
                                     value={newItemInputs[cat.id] || ''}
                                     onChange={(e) => handleAddItemInput(cat.id, e.target.value)}
                                     onKeyDown={(e) => {
                                       if (e.key === 'Enter') {
                                         handleAddItemSubmit(cat.id);
                                       }
                                     }}
                                   />
                                   <button 
                                     onClick={() => handleAddItemSubmit(cat.id)}
                                     className="p-1 rounded bg-blue-50 text-japan-blue hover:bg-japan-blue hover:text-white transition-colors"
                                   >
                                      <Plus size={14} />
                                   </button>
                                </div>
                             </div>
                           )}
                        </div>
                      );
                   })}
                </div>

                {/* Add Category Button */}
                {showNewCatInput ? (
                   <div className="flex gap-2 items-center bg-gray-50 p-3 rounded-xl border border-gray-200">
                      <input 
                        type="text" 
                        value={newCategoryName}
                        onChange={e => setNewCategoryName(e.target.value)}
                        placeholder="新分類名稱..."
                        className="flex-1 bg-white border border-gray-200 rounded px-2 py-1 text-sm outline-none focus:border-japan-blue"
                        autoFocus
                      />
                      <button onClick={handleAddCategory} className="text-japan-blue font-bold text-sm">新增</button>
                      <button onClick={() => setShowNewCatInput(false)} className="text-gray-400"><X size={16} /></button>
                   </div>
                ) : (
                   <button 
                     onClick={() => setShowNewCatInput(true)}
                     className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-japan-blue hover:text-japan-blue hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-bold text-sm"
                   >
                     <FolderPlus size={16} /> 新增分類
                   </button>
                )}
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
