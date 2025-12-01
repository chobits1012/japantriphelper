import React, { useState, useEffect } from 'react';
import { X, Wallet, Calculator, CheckSquare, Plus, Trash2, RefreshCw, TrendingUp, Coins } from 'lucide-react';
import type { ExpenseItem, ChecklistItem } from '../types';

interface TravelToolboxProps {
  isOpen: boolean;
  onClose: () => void;
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

const TravelToolbox: React.FC<TravelToolboxProps> = ({ isOpen, onClose, expenses, onUpdateExpenses, checklist, onUpdateChecklist }) => {
  const [activeTab, setActiveTab] = useState<'currency' | 'expense' | 'checklist'>('expense');
  
  // --- Currency State ---
  const [rate, setRate] = useState<number>(0.215); // Default fallback
  const [jpyInput, setJpyInput] = useState<string>('1000');
  const [twdInput, setTwdInput] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loadingRate, setLoadingRate] = useState(false);

  // --- Expense State ---
  const [newExpTitle, setNewExpTitle] = useState('');
  const [newExpAmount, setNewExpAmount] = useState('');
  const [newExpCat, setNewExpCat] = useState<ExpenseItem['category']>('food');

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
      // Using a free API (ExchangeRate-API)
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/JPY');
      const data = await res.json();
      const currentRate = data.rates.TWD;
      setRate(currentRate);
      setLastUpdated(new Date().toLocaleTimeString());
      // Recalculate TWD based on current JPY input
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

  const totalJPY = expenses.reduce((sum, item) => sum + item.amountJPY, 0);

  // Checklist Logic
  const toggleCheck = (id: string) => {
    onUpdateChecklist(checklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
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
        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('expense')}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'expense' ? 'text-japan-blue border-b-2 border-japan-blue bg-blue-50/50' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <Coins size={16} /> 記帳
          </button>
          <button 
            onClick={() => setActiveTab('currency')}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'currency' ? 'text-japan-blue border-b-2 border-japan-blue bg-blue-50/50' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <RefreshCw size={16} /> 匯率
          </button>
          <button 
            onClick={() => setActiveTab('checklist')}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'checklist' ? 'text-japan-blue border-b-2 border-japan-blue bg-blue-50/50' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <CheckSquare size={16} /> 清單
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
                
                <p className="text-xs text-center text-gray-400 px-4">
                   * 匯率僅供參考，實際請依銀行或換匯店為準。
                </p>
             </div>
          )}

          {/* --- CHECKLIST TAB --- */}
          {activeTab === 'checklist' && (
             <div className="space-y-2">
                <div className="flex items-center justify-between mb-4">
                   <h4 className="font-bold text-ink">出發前檢查</h4>
                   <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                     {checklist.filter(i => i.checked).length} / {checklist.length}
                   </span>
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
        </div>
      </div>
    </div>
  );
};

export default TravelToolbox;