import React, { useState } from 'react';
import { X, BookOpen, Map, Calendar, Sparkles, Train, Briefcase, Lightbulb, ChevronRight, CheckCircle2, Cloud, DollarSign, ArrowRightLeft, ClipboardList, Save } from 'lucide-react';

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
                <div className="bg-japan-blue/90 dark:bg-sky-700/90 p-4 flex items-center justify-between text-white backdrop-blur-sm shrink-0">
                    <div className="flex items-center gap-2">
                        <BookOpen size={20} className="text-yellow-300" />
                        <h3 className="font-serif font-bold text-lg tracking-wide">使用說明書</h3>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 shrink-0">
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
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-serif font-bold text-japan-blue dark:text-sky-400 leading-tight">
                                    歡迎使用<br /><span className="inline-block mt-1 whitespace-nowrap">Japan Trip Helper 🇯🇵</span>
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
                                    整合行程、天氣、記帳與清單<br />讓安排行程本身也成為一種享受
                                </p>
                            </div>

                            <div className="bg-white/60 dark:bg-slate-800/60 p-5 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-japan-red dark:text-red-400">
                                    <CheckCircle2 size={18} /> 快速上手：建立旅程
                                </h3>
                                <ol className="list-decimal list-inside space-y-3 text-sm text-gray-700 dark:text-slate-300">
                                    <li>
                                        <span className="font-bold">建立新旅程：</span> 點擊首頁左下角的「+」按鈕。
                                    </li>
                                    <li>
                                        <span className="font-bold">設定基本資訊：</span> 輸入旅程名稱 (如：東京賞櫻)、出發日期與天數。
                                    </li>
                                    <li>
                                        <span className="font-bold">選擇季節主題：</span> 選擇春/夏/秋/冬，這會改變 App 的整體配色與背景。
                                    </li>
                                    <li>
                                        <span className="font-bold">完成！</span> 點擊確認後，您的旅程卡片就會出現在首頁。
                                    </li>
                                </ol>
                            </div>

                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-800 p-4 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm">
                                <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-japan-blue dark:text-sky-400">
                                    <Sparkles size={18} /> 懶人救星：使用範本
                                </h3>
                                <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                                    不想從頭開始？試試首頁右下角的 <span className="font-bold bg-white dark:bg-slate-700 px-2 py-0.5 rounded text-xs border border-gray-200 dark:border-slate-600">建立範本</span>。
                                    系統會自動複製一份完整的「關西冬之旅」行程 (包含景點、交通範例) 供您直接修改！
                                </p>
                            </div>
                        </div>
                    )}

                    {/* FEATURES TAB */}
                    {activeTab === 'features' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">

                            {/* Trip Management */}
                            <section>
                                <div className="flex items-center gap-2 mb-3 border-b border-gray-200 dark:border-slate-700 pb-2">
                                    <Map size={20} className="text-japan-blue dark:text-sky-400" />
                                    <h3 className="font-bold text-lg">旅程管理</h3>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-700 dark:text-slate-300">
                                    <li className="flex gap-2"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-japan-blue flex-shrink-0" /> 點擊旅程卡片即可進入行程表。</li>
                                    <li className="flex gap-2"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-japan-blue flex-shrink-0" /> 卡片左上角顯示季節標籤，背景會隨季節變換。</li>
                                </ul>
                            </section>

                            {/* Itinerary */}
                            <section>
                                <div className="flex items-center gap-2 mb-3 border-b border-gray-200 dark:border-slate-700 pb-2">
                                    <Calendar size={20} className="text-japan-blue dark:text-sky-400" />
                                    <h3 className="font-bold text-lg">行程規劃 (當日詳情)</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900 dark:text-slate-100 mb-1">【編輯模式】點擊 ✏️ 按鈕</h4>
                                        <ul className="text-sm text-gray-600 dark:text-slate-400 space-y-1 list-disc list-inside ml-1">
                                            <li><span className="font-bold">修改標題/地點：</span>輸入正確城市 (如：Osaka) 可自動抓天氣。</li>
                                            <li><span className="font-bold">新增行程：</span>設定時間、類別 (景點/美食等)、關鍵字。</li>
                                            <li><span className="font-bold">地圖關鍵字：</span>輸入精確地點 (如：清水寺)，預覽時可開地圖。</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900 dark:text-slate-100 mb-1">【查看模式】</h4>
                                        <ul className="text-sm text-gray-600 dark:text-slate-400 space-y-1 list-disc list-inside ml-1">
                                            <li><span className="font-bold">天氣預報：</span>點擊天氣圖示查看未來一週預報。</li>
                                            <li><span className="font-bold">查看路線：</span>若當天有 2 個以上地圖關鍵字，會出現 <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 dark:bg-slate-800 rounded text-xs border border-gray-200 dark:border-slate-600"><Map size={10} /> 查看路線</span> 按鈕，一鍵開啟 Google Maps 規劃交通。</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* AI Planner */}
                            <section>
                                <div className="flex items-center gap-2 mb-3 border-b border-gray-200 dark:border-slate-700 pb-2">
                                    <Sparkles size={20} className="text-purple-500" />
                                    <h3 className="font-bold text-lg">AI 旅遊規劃師</h3>
                                </div>
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-sm text-gray-700 dark:text-slate-300 space-y-3">
                                    <p>不知道行程怎麼排？讓 AI 來幫您！點擊下方的 <span className="font-bold text-purple-600 dark:text-purple-400">AI 排程</span> 按鈕。</p>
                                    <ol className="list-decimal list-inside space-y-2">
                                        <li><span className="font-bold">整趟旅程生成：</span>適合從零開始。告訴 AI 您想去的城市與喜好 (如：古蹟、動漫)。</li>
                                        <li><span className="font-bold">單日行程修改：</span>針對某一天重新生成。例如：「Day 3 下雨，請幫我改成室內購物行程」。</li>
                                    </ol>
                                    <p className="text-xs text-purple-500 mt-2 font-bold px-2 py-1 bg-white/50 dark:bg-black/20 rounded inline-block">💡 需自備 Google Gemini API Key</p>
                                </div>
                            </section>

                            {/* Pass Management */}
                            <section>
                                <div className="flex items-center gap-2 mb-3 border-b border-gray-200 dark:border-slate-700 pb-2">
                                    <Train size={20} className="text-red-500" />
                                    <h3 className="font-bold text-lg">交通周遊券 (JR Pass)</h3>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-slate-300 mb-2">
                                    在「當日詳情」的<span className="font-bold">編輯模式</span>中，使用上方的紅色區塊 <span className="font-bold text-red-500">交通周遊券批次管理</span>。
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                                    <span className="bg-gray-100 px-2 py-1 rounded">1. 選擇票券 (如: Kansai Thru Pass)</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded">2. 設定天數</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded">3. 點擊套用</span>
                                </div>
                            </section>

                            {/* Toolbox */}
                            <section>
                                <div className="flex items-center gap-2 mb-3 border-b border-gray-200 dark:border-slate-700 pb-2">
                                    <Briefcase size={20} className="text-orange-500" />
                                    <h3 className="font-bold text-lg">旅遊工具箱</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-lg flex items-start gap-3">
                                        <DollarSign className="text-green-500 shrink-0" size={20} />
                                        <div>
                                            <h4 className="font-bold text-sm mb-1">記帳 (Expense)</h4>
                                            <p className="text-xs text-gray-500 dark:text-slate-400">設定總預算、記錄每筆消費、自動統計餘額與類別圖表。</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-lg flex items-start gap-3">
                                        <ArrowRightLeft className="text-blue-500 shrink-0" size={20} />
                                        <div>
                                            <h4 className="font-bold text-sm mb-1">匯率 (Currency)</h4>
                                            <p className="text-xs text-gray-500 dark:text-slate-400">即時抓取最新匯率，支援日幣/台幣雙向快速換算。</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-lg flex items-start gap-3">
                                        <ClipboardList className="text-purple-500 shrink-0" size={20} />
                                        <div>
                                            <h4 className="font-bold text-sm mb-1">清單 (Checklist)</h4>
                                            <p className="text-xs text-gray-500 dark:text-slate-400">出國必備行李檢查表，支援自訂分類與進度條。</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-lg flex items-start gap-3">
                                        <Save className="text-gray-500 shrink-0" size={20} />
                                        <div>
                                            <h4 className="font-bold text-sm mb-1">備份 (Backup)</h4>
                                            <p className="text-xs text-gray-500 dark:text-slate-400">匯出/匯入行程代碼，方便備份或分享給旅伴。</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                        </div>
                    )}

                    {/* TIPS TAB */}
                    {activeTab === 'tips' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">

                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-5 rounded-xl border border-amber-200 dark:border-amber-700/30">
                                <h3 className="font-bold text-lg mb-2 text-amber-700 dark:text-amber-400 flex items-center gap-2">
                                    <Lightbulb size={20} /> 必學：加入主畫面 (PWA)
                                </h3>
                                <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                                    在 iPhone Safari 點擊下方「分享」按鈕，選擇 <strong>「加入主畫面」</strong>。<br />
                                    這樣做有兩大好處：
                                </p>
                                <ul className="list-disc list-inside text-sm text-gray-700 dark:text-slate-300 mt-2 space-y-1">
                                    <li>全螢幕體驗，像原生 App 一樣好用。</li>
                                    <li><strong>支援離線瀏覽</strong>：在飛機上或日本網路不穩時，依然能查看行程！</li>
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-lg border-b border-gray-100 dark:border-slate-800 pb-2">使用情境舉例</h3>

                                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
                                    <h4 className="font-bold text-base mb-2 text-japan-blue dark:text-sky-400">情境 A：規劃京都一日遊</h4>
                                    <ol className="text-sm text-gray-600 dark:text-slate-400 space-y-2 list-decimal list-inside">
                                        <li>編輯模式地點輸入「<span className="font-bold text-ink dark:text-white">京都</span>」(確認出現天氣圖示)。</li>
                                        <li>09:00 新增景點，關鍵字填「<span className="font-bold text-ink dark:text-white">清水寺</span>」。</li>
                                        <li>14:00 新增景點，關鍵字填「<span className="font-bold text-ink dark:text-white">伏見稻荷</span>」。</li>
                                        <li>儲存後，點擊 <span className="font-bold text-ink dark:text-white">查看路線</span>，直接看從清水寺移動到伏見稻荷的交通方式！</li>
                                    </ol>
                                </div>

                                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
                                    <h4 className="font-bold text-base mb-2 text-green-600 dark:text-green-400">情境 B：旅行中記帳</h4>
                                    <ol className="text-sm text-gray-600 dark:text-slate-400 space-y-2 list-decimal list-inside">
                                        <li>剛買了 Suica 卡儲值 5000 日圓。</li>
                                        <li>打開工具箱 → 記帳。</li>
                                        <li>輸入「Suica 儲值」、金額「5000」、類別「交通」。</li>
                                        <li>立刻看到預算條減少，隨時掌握荷包狀況！</li>
                                    </ol>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-center text-xs text-gray-400 mt-8">
                                <p className="mb-1">Designed with ❤️ for Japan Lovers</p>
                                <p>祝您旅途愉快！ Have a nice trip! ✈️</p>
                            </div>

                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default HelpModal;
