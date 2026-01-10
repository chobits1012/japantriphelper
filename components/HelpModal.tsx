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
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px] animate-in fade-in duration-500">
            <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] border border-white/40 dark:border-white/10 ring-1 ring-white/20">

                {/* Header */}
                <div className="bg-japan-blue/80 dark:bg-sky-700/80 p-4 flex items-center justify-between text-white backdrop-blur-md shrink-0 border-b border-white/20 shadow-sm">
                    <div className="flex items-center gap-2">
                        <BookOpen size={20} className="text-yellow-300 drop-shadow-md" />
                        <h3 className="font-serif font-bold text-lg tracking-wide drop-shadow-md">使用說明書</h3>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/20 p-1.5 rounded-full transition-colors active:scale-95">
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/20 dark:border-white/5 bg-white/10 dark:bg-black/20 shrink-0 backdrop-blur-md">
                    <button
                        onClick={() => setActiveTab('intro')}
                        className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'intro' ? 'text-japan-blue bg-white/50 dark:bg-white/10 dark:text-sky-300 shadow-inner' : 'text-gray-600 hover:bg-white/20 dark:text-slate-400 dark:hover:bg-white/5'}`}
                    >
                        <Map size={16} /> <span className="hidden sm:inline">快速上手</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('features')}
                        className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'features' ? 'text-japan-blue bg-white/50 dark:bg-white/10 dark:text-sky-300 shadow-inner' : 'text-gray-600 hover:bg-white/20 dark:text-slate-400 dark:hover:bg-white/5'}`}
                    >
                        <Sparkles size={16} /> <span className="hidden sm:inline">功能介紹</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('tips')}
                        className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'tips' ? 'text-japan-blue bg-white/50 dark:bg-white/10 dark:text-sky-300 shadow-inner' : 'text-gray-600 hover:bg-white/20 dark:text-slate-400 dark:hover:bg-white/5'}`}
                    >
                        <Lightbulb size={16} /> <span className="hidden sm:inline">小撇步</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto font-sans text-ink dark:text-slate-100 space-y-6 bg-transparent">

                    {/* INTRO TAB */}
                    {activeTab === 'intro' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-serif font-bold text-japan-blue dark:text-sky-300 leading-tight drop-shadow-sm">
                                    歡迎使用<br /><span className="inline-block mt-1 whitespace-nowrap">Japan Trip Helper 🇯🇵</span>
                                </h2>
                                <p className="text-sm text-gray-800 dark:text-slate-300 mt-2 font-medium drop-shadow-sm">
                                    整合行程、天氣、記帳與清單<br />讓安排行程本身也成為一種享受
                                </p>
                            </div>

                            <div className="bg-white/50 dark:bg-black/20 p-5 rounded-xl border border-white/40 dark:border-white/10 shadow-lg backdrop-blur-md">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-japan-red dark:text-red-300 drop-shadow-sm">
                                    <CheckCircle2 size={18} /> 快速上手：建立旅程
                                </h3>
                                <ol className="list-decimal list-inside space-y-3 text-sm text-gray-900 dark:text-slate-200">
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

                            <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-slate-800/40 dark:to-slate-700/40 p-4 rounded-xl border border-white/40 dark:border-white/10 shadow-lg backdrop-blur-md">
                                <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-japan-blue dark:text-sky-300 drop-shadow-sm">
                                    <Sparkles size={18} /> 懶人救星：使用範本
                                </h3>
                                <p className="text-sm text-gray-900 dark:text-slate-200 leading-relaxed">
                                    不想從頭開始？試試首頁右下角的 <span className="font-bold bg-white/60 dark:bg-white/10 px-2 py-0.5 rounded text-xs border border-white/40 dark:border-white/10 shadow-sm backdrop-blur-sm">建立範本</span>。
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
                                <div className="flex items-center gap-2 mb-3 border-b border-white/30 dark:border-white/10 pb-2">
                                    <Map size={20} className="text-japan-blue dark:text-sky-400 text-shadow-sm" />
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-slate-100 drop-shadow-sm">旅程管理</h3>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-900 dark:text-slate-200">
                                    <li className="flex gap-2"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-japan-blue flex-shrink-0 shadow-sm" /> 點擊旅程卡片即可進入行程表。</li>
                                    <li className="flex gap-2"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-japan-blue flex-shrink-0 shadow-sm" /> 卡片左上角顯示季節標籤，背景會隨季節變換。</li>
                                </ul>
                            </section>

                            {/* Itinerary */}
                            <section>
                                <div className="flex items-center gap-2 mb-3 border-b border-white/30 dark:border-white/10 pb-2">
                                    <Calendar size={20} className="text-japan-blue dark:text-sky-400 drop-shadow-sm" />
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-slate-100 drop-shadow-sm">行程規劃 (當日詳情)</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900 dark:text-slate-100 mb-1 drop-shadow-sm">【編輯模式】點擊 ✏️ 按鈕</h4>
                                        <ul className="text-sm text-gray-800 dark:text-slate-300 space-y-1 list-disc list-inside ml-1">
                                            <li><span className="font-bold">修改標題/地點：</span>輸入正確城市 (如：Osaka) 可自動抓天氣。</li>
                                            <li><span className="font-bold">新增行程：</span>設定時間、類別 (景點/美食等)、關鍵字。</li>
                                            <li><span className="font-bold">地圖關鍵字：</span>輸入精確地點 (如：清水寺)，預覽時可開地圖。</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900 dark:text-slate-100 mb-1 drop-shadow-sm">【查看模式】</h4>
                                        <ul className="text-sm text-gray-800 dark:text-slate-300 space-y-1 list-disc list-inside ml-1">
                                            <li><span className="font-bold">天氣預報：</span>點擊天氣圖示查看未來一週預報。</li>
                                            <li><span className="font-bold">查看路線：</span>若當天有 2 個以上地圖關鍵字，會出現 <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-white/50 dark:bg-white/10 rounded text-xs border border-white/40 dark:border-white/10 backdrop-blur-sm"><Map size={10} /> 查看路線</span> 按鈕。</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* AI Planner */}
                            <section>
                                <div className="flex items-center gap-2 mb-3 border-b border-white/30 dark:border-white/10 pb-2">
                                    <Sparkles size={20} className="text-purple-600 dark:text-purple-400 drop-shadow-sm" />
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-slate-100 drop-shadow-sm">AI 旅遊規劃師</h3>
                                </div>
                                <div className="bg-purple-50/50 dark:bg-purple-900/10 p-4 rounded-lg text-sm text-gray-900 dark:text-slate-200 space-y-3 border border-purple-100/40 dark:border-white/5 backdrop-blur-md shadow-lg">
                                    <p>不知道行程怎麼排？讓 AI 來幫您！點擊下方的 <span className="font-bold text-purple-700 dark:text-purple-300">AI 排程</span> 按鈕。</p>
                                    <ol className="list-decimal list-inside space-y-2">
                                        <li><span className="font-bold">整趟旅程生成：</span>適合從零開始。告訴 AI 您想去的城市與喜好。</li>
                                        <li><span className="font-bold">單日行程修改：</span>針對某一天重新生成，可選擇存入方案 A/B/C。</li>
                                    </ol>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-xs text-purple-700 dark:text-purple-300 font-bold px-2 py-1 bg-white/60 dark:bg-white/10 rounded shadow-sm backdrop-blur-sm">💡 API Key 可儲存到瀏覽器</span>
                                        <span className="text-xs text-purple-700 dark:text-purple-300 font-bold px-2 py-1 bg-white/60 dark:bg-white/10 rounded shadow-sm backdrop-blur-sm">✨ 支援多方案比較</span>
                                    </div>
                                </div>
                            </section>

                            {/* Multi-Plan */}
                            <section>
                                <div className="flex items-center gap-2 mb-3 border-b border-white/30 dark:border-white/10 pb-2">
                                    <Calendar size={20} className="text-blue-500 drop-shadow-sm" />
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-slate-100 drop-shadow-sm">多方案規劃 (A/B/C)</h3>
                                </div>
                                <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-lg text-sm text-gray-900 dark:text-slate-200 space-y-2 border border-blue-100/40 dark:border-white/5 backdrop-blur-md shadow-lg">
                                    <p>規劃行程時常有多個選項？現在可以輕鬆比較！</p>
                                    <ul className="list-disc list-inside space-y-1 text-xs">
                                        <li>在每日詳情頁面，標題旁會看到 <span className="font-bold">A B C 方案</span> 按鈕</li>
                                        <li>點擊切換，每個方案的行程內容獨立儲存</li>
                                        <li>用 AI 生成備案時，可選擇存入 B 或 C 方案</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Pass Management */}
                            <section>
                                <div className="flex items-center gap-2 mb-3 border-b border-white/30 dark:border-white/10 pb-2">
                                    <Train size={20} className="text-red-500 drop-shadow-sm" />
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-slate-100 drop-shadow-sm">交通周遊券 (JR Pass)</h3>
                                </div>
                                <p className="text-sm text-gray-900 dark:text-slate-200 mb-2">
                                    在「當日詳情」的<span className="font-bold">編輯模式</span>中，使用上方的紅色區塊 <span className="font-bold text-red-500">交通周遊券批次管理</span>。
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs text-gray-700 dark:text-slate-300">
                                    <span className="bg-white/50 dark:bg-white/10 px-2 py-1 rounded shadow-sm border border-white/30 backdrop-blur-sm">1. 選擇票券 (如: Kansai Thru Pass)</span>
                                    <span className="bg-white/50 dark:bg-white/10 px-2 py-1 rounded shadow-sm border border-white/30 backdrop-blur-sm">2. 設定天數</span>
                                    <span className="bg-white/50 dark:bg-white/10 px-2 py-1 rounded shadow-sm border border-white/30 backdrop-blur-sm">3. 點擊套用</span>
                                </div>
                            </section>

                            {/* Toolbox */}
                            <section>
                                <div className="flex items-center gap-2 mb-3 border-b border-white/30 dark:border-white/10 pb-2">
                                    <Briefcase size={20} className="text-orange-500 drop-shadow-sm" />
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-slate-100 drop-shadow-sm">旅遊工具箱</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="bg-white/50 dark:bg-slate-800/30 p-3 rounded-lg flex items-start gap-3 border border-white/40 dark:border-white/10 shadow-lg backdrop-blur-md transition-all hover:bg-white/60">
                                        <DollarSign className="text-green-600 dark:text-green-400 shrink-0 drop-shadow-sm" size={20} />
                                        <div>
                                            <h4 className="font-bold text-sm mb-1 text-gray-900 dark:text-white">記帳 (Expense)</h4>
                                            <p className="text-xs text-gray-800 dark:text-slate-300">設定總預算、記錄每筆消費、自動統計餘額與類別圖表。</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/50 dark:bg-slate-800/30 p-3 rounded-lg flex items-start gap-3 border border-white/40 dark:border-white/10 shadow-lg backdrop-blur-md transition-all hover:bg-white/60">
                                        <ArrowRightLeft className="text-blue-500 shrink-0 drop-shadow-sm" size={20} />
                                        <div>
                                            <h4 className="font-bold text-sm mb-1 text-gray-900 dark:text-white">匯率 (Currency)</h4>
                                            <p className="text-xs text-gray-800 dark:text-slate-300">即時抓取最新匯率，支援日幣/台幣雙向快速換算。</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/50 dark:bg-slate-800/30 p-3 rounded-lg flex items-start gap-3 border border-white/40 dark:border-white/10 shadow-lg backdrop-blur-md transition-all hover:bg-white/60">
                                        <ClipboardList className="text-purple-500 shrink-0 drop-shadow-sm" size={20} />
                                        <div>
                                            <h4 className="font-bold text-sm mb-1 text-gray-900 dark:text-white">清單 (Checklist)</h4>
                                            <p className="text-xs text-gray-800 dark:text-slate-300">出國必備行李檢查表，支援自訂分類與進度條。</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/50 dark:bg-slate-800/30 p-3 rounded-lg flex items-start gap-3 border border-white/40 dark:border-white/10 shadow-lg backdrop-blur-md transition-all hover:bg-white/60">
                                        <Save className="text-gray-700 dark:text-gray-400 shrink-0 drop-shadow-sm" size={20} />
                                        <div>
                                            <h4 className="font-bold text-sm mb-1 text-gray-900 dark:text-white">備份 (Backup)</h4>
                                            <p className="text-xs text-gray-800 dark:text-slate-300">支援「複製代碼」或「下載檔案」將行程存檔，換手機也能輕鬆匯入。</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                        </div>
                    )}

                    {/* TIPS TAB */}
                    {activeTab === 'tips' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">

                            <div className="bg-gradient-to-br from-amber-50/60 to-orange-50/60 dark:from-yellow-900/20 dark:to-orange-900/20 p-5 rounded-xl border border-amber-200/50 dark:border-amber-700/30 backdrop-blur-md shadow-lg">
                                <h3 className="font-bold text-lg mb-2 text-amber-700 dark:text-amber-400 flex items-center gap-2 drop-shadow-sm">
                                    <Lightbulb size={20} /> 必學：加入主畫面 (PWA)
                                </h3>
                                <p className="text-sm text-gray-900 dark:text-slate-200 leading-relaxed">
                                    在 iPhone Safari 點擊下方「分享」按鈕，選擇 <strong>「加入主畫面」</strong>。<br />
                                    這樣做有兩大好處：
                                </p>
                                <ul className="list-disc list-inside text-sm text-gray-900 dark:text-slate-200 mt-2 space-y-1">
                                    <li>全螢幕體驗，像原生 App 一樣好用。</li>
                                    <li><strong>支援離線瀏覽</strong>：在飛機上或日本網路不穩時，依然能查看行程！</li>
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-lg border-b border-white/30 dark:border-white/10 pb-2 text-gray-900 dark:text-slate-100 drop-shadow-sm">使用情境舉例</h3>

                                <div className="bg-white/50 dark:bg-slate-800/30 p-4 rounded-xl border border-white/40 dark:border-white/10 backdrop-blur-md shadow-lg">
                                    <h4 className="font-bold text-base mb-2 text-japan-blue dark:text-sky-400 drop-shadow-sm">情境 A：規劃京都一日遊</h4>
                                    <ol className="text-sm text-gray-900 dark:text-slate-300 space-y-2 list-decimal list-inside">
                                        <li>編輯模式地點輸入「<span className="font-bold text-ink dark:text-white">京都</span>」(確認出現天氣圖示)。</li>
                                        <li>09:00 新增景點，關鍵字填「<span className="font-bold text-ink dark:text-white">清水寺</span>」。</li>
                                        <li>14:00 新增景點，關鍵字填「<span className="font-bold text-ink dark:text-white">伏見稻荷</span>」。</li>
                                        <li>儲存後，點擊 <span className="font-bold text-ink dark:text-white">查看路線</span>，直接看從清水寺移動到伏見稻荷的交通方式！</li>
                                    </ol>
                                </div>

                                <div className="bg-white/50 dark:bg-slate-800/30 p-4 rounded-xl border border-white/40 dark:border-white/10 backdrop-blur-md shadow-lg">
                                    <h4 className="font-bold text-base mb-2 text-green-600 dark:text-green-400 drop-shadow-sm">情境 B：旅行中記帳</h4>
                                    <ol className="text-sm text-gray-900 dark:text-slate-300 space-y-2 list-decimal list-inside">
                                        <li>剛買了 Suica 卡儲值 5000 日圓。</li>
                                        <li>打開工具箱 → 記帳。</li>
                                        <li>輸入「Suica 儲值」、金額「5000」、類別「交通」。</li>
                                        <li>立刻看到預算條減少，隨時掌握荷包狀況！</li>
                                    </ol>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-white/20 dark:bg-black/10 text-center text-xs text-gray-700 dark:text-gray-400 mt-8 backdrop-blur-sm border border-white/20">
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
