import React, { useState } from 'react';
import { X, BookOpen, Map, Calendar, Sparkles, Train, Briefcase, Lightbulb, ChevronRight, CheckCircle2 } from 'lucide-react';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<'intro' | 'features' | 'tips'>('intro');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] border border-white/20 dark:border-slate-700">

                {/* Header */}
                <div className="bg-japan-blue/90 dark:bg-sky-700/90 p-4 flex items-center justify-between text-white backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <BookOpen size={20} className="text-yellow-300" />
                        <h3 className="font-serif font-bold text-lg tracking-wide">使用說明書</h3>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
                    <button
                        onClick={() => setActiveTab('intro')}
                        className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'intro' ? 'text-japan-blue border-b-2 border-japan-blue bg-blue-50/50 dark:bg-slate-800 dark:text-sky-400 dark:border-sky-500' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                    >
                        <Map size={16} /> <span className="hidden sm:inline">快速上手</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('features')}
                        className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'features' ? 'text-japan-blue border-b-2 border-japan-blue bg-blue-50/50 dark:bg-slate-800 dark:text-sky-400 dark:border-sky-500' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                    >
                        <Sparkles size={16} /> <span className="hidden sm:inline">功能介紹</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('tips')}
                        className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'tips' ? 'text-japan-blue border-b-2 border-japan-blue bg-blue-50/50 dark:bg-slate-800 dark:text-sky-400 dark:border-sky-500' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                    >
                        <Lightbulb size={16} /> <span className="hidden sm:inline">小撇步</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto font-sans text-ink dark:text-slate-200 space-y-6 bg-paper dark:bg-slate-950/50">

                    {/* INTRO TAB */}
                    {activeTab === 'intro' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="text-center space-y-2 mb-6">
                                <h2 className="text-2xl font-serif font-bold text-japan-blue dark:text-sky-400">歡迎使用 Japan Trip Helper 🇯🇵</h2>
                                <p className="text-sm text-gray-500 dark:text-slate-400">專為日本旅遊設計的個人化行程管理助手</p>
                            </div>

                            <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                                <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-japan-red dark:text-red-400">
                                    <CheckCircle2 size={18} /> 第一步：建立旅程
                                </h3>
                                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-slate-300">
                                    <li>點擊首頁左下角的 <span className="font-bold bg-gray-100 dark:bg-slate-700 px-1 rounded">建立新旅程</span> 按鈕。</li>
                                    <li>輸入旅程名稱 (如：東京賞櫻)。</li>
                                    <li>選擇出發日期與天數。</li>
                                    <li>選擇喜歡的季節主題 (春/夏/秋/冬)。</li>
                                </ol>
                            </div>

                            <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                                <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-orange-500">
                                    <Sparkles size={18} /> 懶人救星：使用範本
                                </h3>
                                <p className="text-sm text-gray-700 dark:text-slate-300 mb-2">
                                    不想從頭開始？點擊首頁右下角的 <span className="font-bold bg-japan-blue text-white px-2 py-0.5 rounded text-xs">建立範本</span>，
                                    系統會自動複製一份完整的「關西冬之旅」行程供您參考修改！
                                </p>
                            </div>
                        </div>
                    )}

                    {/* FEATURES TAB */}
                    {activeTab === 'features' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">

                            <section>
                                <div className="flex items-center gap-2 mb-3 border-b border-gray-200 dark:border-slate-700 pb-2">
                                    <Calendar size={20} className="text-japan-blue dark:text-sky-400" />
                                    <h3 className="font-bold text-lg">行程規劃</h3>
                                </div>
                                <ul className="space-y-3 text-sm text-gray-700 dark:text-slate-300">
                                    <li className="flex gap-2">
                                        <ChevronRight size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-bold">每日詳情：</span> 點擊旅程卡片進入每日時間軸，再點擊任一天進入詳細編輯模式。
                                        </div>
                                    </li>
                                    <li className="flex gap-2">
                                        <ChevronRight size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-bold">天氣預報：</span> 輸入正確的城市名稱 (如：京都)，系統會自動抓取當日天氣。
                                        </div>
                                    </li>
                                    <li className="flex gap-2">
                                        <ChevronRight size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-bold">路線規劃：</span> 當天有兩個以上「地圖關鍵字」時，會出現 <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 dark:bg-slate-800 rounded text-xs border border-gray-200 dark:border-slate-600"><Map size={10} /> 查看路線</span> 按鈕，一鍵開啟 Google Maps。
                                        </div>
                                    </li>
                                </ul>
                            </section>

                            <section>
                                <div className="flex items-center gap-2 mb-3 border-b border-gray-200 dark:border-slate-700 pb-2">
                                    <Sparkles size={20} className="text-purple-500" />
                                    <h3 className="font-bold text-lg">AI 旅遊規劃師</h3>
                                </div>
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-sm text-gray-700 dark:text-slate-300 space-y-2">
                                    <p>在此頁面下方點擊 <span className="font-bold text-purple-600 dark:text-purple-400">AI 排程</span> 來啟用。</p>
                                    <ul className="list-disc list-inside space-y-1 ml-1 opacity-80">
                                        <li><span className="font-bold">整趟旅程：</span> 從零開始規劃，適合剛開始構思行程時。</li>
                                        <li><span className="font-bold">單日修改：</span> 針對某一天重新生成，例如「Day 3 改去環球影城」。</li>
                                    </ul>
                                    <p className="text-xs text-purple-400 mt-2">* 需自備 Google Gemini API Key</p>
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-2 mb-3 border-b border-gray-200 dark:border-slate-700 pb-2">
                                    <Train size={20} className="text-red-500" />
                                    <h3 className="font-bold text-lg">交通周遊券 (JR Pass)</h3>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-slate-300">
                                    在「當日詳情」的編輯模式中，使用上方的紅色區塊 <span className="font-bold text-red-500">交通周遊券批次管理</span>。
                                    選擇票券與天數後，點擊「套用」，系統會自動將票券標記在連續的行程中。
                                </p>
                            </section>

                            <section>
                                <div className="flex items-center gap-2 mb-3 border-b border-gray-200 dark:border-slate-700 pb-2">
                                    <Briefcase size={20} className="text-orange-500" />
                                    <h3 className="font-bold text-lg">旅遊工具箱</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-lg">
                                        <h4 className="font-bold text-sm mb-1">💰 記帳</h4>
                                        <p className="text-xs text-gray-500 dark:text-slate-400">設定預算、記錄消費、自動計算餘額與統計圖表。</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-lg">
                                        <h4 className="font-bold text-sm mb-1">💱 匯率</h4>
                                        <p className="text-xs text-gray-500 dark:text-slate-400">即時抓取匯率，日幣/台幣雙向快速換算。</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-lg">
                                        <h4 className="font-bold text-sm mb-1">✅ 清單</h4>
                                        <p className="text-xs text-gray-500 dark:text-slate-400">出國必備檢查表，可自訂分類與項目。</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-lg">
                                        <h4 className="font-bold text-sm mb-1">☁️ 備份</h4>
                                        <p className="text-xs text-gray-500 dark:text-slate-400">匯出/匯入行程資料 (JSON)，方便換手機或分享。</p>
                                    </div>
                                </div>
                            </section>

                        </div>
                    )}

                    {/* TIPS TAB */}
                    {activeTab === 'tips' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">

                            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-5 rounded-xl border border-yellow-200 dark:border-yellow-700/30">
                                <h3 className="font-bold text-lg mb-2 text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
                                    <Lightbulb size={20} /> 離線也能用 (PWA)
                                </h3>
                                <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                                    在 iPhone Safari 點擊下方「分享」按鈕，選擇 <strong>「加入主畫面」</strong>。
                                    這樣即使在飛機上或日本網路不穩時，也能隨時開啟 App 查看行程！
                                </p>
                            </div>

                            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
                                <h3 className="font-bold text-base mb-2 text-ink dark:text-white">情境舉例：規劃京都一日遊</h3>
                                <ul className="text-sm text-gray-600 dark:text-slate-400 space-y-2 list-decimal list-inside">
                                    <li>進入編輯模式，地點輸入「<span className="text-japan-blue font-bold">京都</span>」(自動抓天氣)。</li>
                                    <li>新增 09:00 行程，地圖關鍵字填「<span className="text-japan-blue font-bold">清水寺</span>」。</li>
                                    <li>新增 14:00 行程，地圖關鍵字填「<span className="text-japan-blue font-bold">伏見稻荷</span>」。</li>
                                    <li>儲存後，點擊 <span className="font-bold">查看路線</span>，直接看交通怎麼搭！</li>
                                </ul>
                            </div>

                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-center text-xs text-gray-400">
                                <p>Designed with ❤️ for Japan Lovers</p>
                                <p>如果有更多建議，歡迎聯繫開發者 James Wang</p>
                            </div>

                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default HelpModal;
