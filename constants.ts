import { ItineraryDay } from './types';

export const WASHI_PATTERN = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d0d0d0' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`;

// Kyoto Winter Snow Scene
export const HERO_IMAGE = "https://images.unsplash.com/photo-1624253321171-1be53e12f5f4?q=80&w=2000";

export const ITINERARY_DATA: ItineraryDay[] = [
  {
      day: "Day 1", date: "01/23", weekday: "Fri",
      title: "抵達京都",
      desc: "桃園機場 ➔ 關西機場 ➔ 京都",
      pass: false,
      bg: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000",
      weatherIcon: 'cloudy',
      temp: "4°C / 9°C",
      tips: "出關時間約需 1-1.5 小時，記得先在機場兌換 JR Pass。",
      accommodation: { name: "Kyoto Sakura Terrace", checkIn: "22:00" },
      events: [
          { time: "15:40", title: "TPE 起飛 (D7378)", desc: "AirAsia X 桃園第一航廈", category: 'flight', mapQuery: "Taoyuan International Airport" },
          { time: "19:20", title: "抵達關西機場 (KIX)", desc: "入境、領取行李", category: 'flight', mapQuery: "Kansai International Airport" },
          { time: "20:30", title: "Haruka 特急列車", desc: "前往京都站 (約75分鐘)", transport: "Haruka", category: 'transport' },
          { time: "22:00", title: "Check-in", desc: "Kyoto Sakura Terrace", category: 'hotel', mapQuery: "Sakura Terrace Kyoto" }
      ]
  },
  {
      day: "Day 2", date: "01/24", weekday: "Sat",
      title: "京都散策",
      desc: "伏見稻荷、清水寺、市區漫遊",
      pass: false,
      bg: "https://images.unsplash.com/photo-1578469645742-46cae010e5d4?q=80&w=1000",
      weatherIcon: 'sunny',
      temp: "1°C / 7°C",
      tips: "伏見稻荷建議 9 點前抵達，避開大量遊客人潮。",
      accommodation: { name: "Kyoto Sakura Terrace" },
      events: [
          { time: "09:00", title: "伏見稻荷大社", desc: "早晨參拜，千本鳥居人潮較少", highlight: true, category: 'sightseeing', mapQuery: "Fushimi Inari Taisha" },
          { time: "12:00", title: "清水寺 & 二三年坂", desc: "經典京都風情散步", category: 'sightseeing', mapQuery: "Kiyomizu-dera" },
          { time: "18:00", title: "京都車站周邊", desc: "拉麵小路或 Porta 地下街晚餐", category: 'food', mapQuery: "Kyoto Station Ramen Koji" }
      ]
  },
  {
      day: "Day 3", date: "01/25", weekday: "Sun",
      title: "滋賀琵琶湖",
      desc: "海上鳥居、藤森照信建築",
      pass: true,
      bg: "https://images.unsplash.com/photo-1733237190111-a537f7a83d72?q=80&w=1000",
      weatherIcon: 'cloudy',
      temp: "0°C / 5°C",
      tips: "白鬚神社附近無人行道，拍照時請務必注意來車。",
      accommodation: { name: "Kyoto Sakura Terrace" },
      events: [
          { time: "09:00", title: "出發前往近江高島", desc: "JR 湖西線", transport: "JR Pass Day 1", category: 'transport' },
          { time: "10:00", title: "白鬚神社", desc: "必拍！琵琶湖中的海上鳥居", highlight: true, category: 'sightseeing', mapQuery: "Shirahige Shrine" },
          { time: "13:00", title: "前往近江八幡", desc: "轉乘電車與巴士", category: 'transport' },
          { time: "14:30", title: "La Collina 近江八幡", desc: "童話般的草屋根甜點園區，現烤年輪蛋糕", highlight: true, category: 'food', mapQuery: "La Collina Omihachiman" },
          { time: "18:00", title: "返回京都", desc: "晚餐後回飯店休息", category: 'transport' }
      ]
  },
  {
      day: "Day 4", date: "01/26", weekday: "Mon",
      title: "海之京都",
      desc: "神隱少女海上列車、伊根舟屋",
      pass: true,
      bg: "https://images.unsplash.com/photo-1554797584-073db172f3da?q=80&w=1000",
      weatherIcon: 'rain',
      temp: "2°C / 6°C",
      tips: "丹後鐵道班次較少，請務必準時抵達車站。",
      accommodation: { name: "伊根大平莊", checkIn: "15:00" },
      events: [
          { time: "08:30", title: "前往西舞鶴站", desc: "搭乘 JR 特急 Hashidate", transport: "JR Pass Day 2", category: 'transport' },
          { time: "10:30", title: "丹後鐵道觀光列車", desc: "行經「由良川橋樑」，體驗海上行駛的感覺", highlight: true, category: 'sightseeing', mapQuery: "Yura River Bridge" },
          { time: "11:40", title: "抵達天橋立站", desc: "轉乘巴士前往伊根", category: 'transport' },
          { time: "15:00", title: "Check-in: 伊根大平莊", desc: "入住舟屋，體驗臨海而居", category: 'hotel', mapQuery: "Ine Taiheiso" },
          { time: "18:00", title: "舟屋晚餐", desc: "享受在地海鮮料理 (需準時)", category: 'food' }
      ]
  },
  {
      day: "Day 5", date: "01/27", weekday: "Tue",
      title: "伊根 ➔ 城崎",
      desc: "天橋立絕景、城崎溫泉巡禮",
      pass: true,
      bg: "https://images.unsplash.com/photo-1669824244249-144f23da4504?q=80&w=1000",
      weatherIcon: 'snow',
      temp: "-1°C / 4°C",
      tips: "城崎溫泉適合穿浴衣散步，記得跟飯店拿七外湯 Pass。",
      accommodation: { name: "大西屋水翔苑", checkIn: "15:30" },
      events: [
          { time: "08:00", title: "伊根早餐", desc: "晨間伊根灣散步", category: 'food' },
          { time: "09:30", title: "返回天橋立", desc: "搭乘纜車前往 Viewland 看飛龍觀", category: 'sightseeing', mapQuery: "Amanohashidate Viewland" },
          { time: "13:40", title: "移動至城崎溫泉", desc: "Hashidate ➔ Konotori (豐岡轉車)", transport: "JR Pass Day 3", category: 'transport' },
          { time: "15:30", title: "Check-in: 大西屋水翔苑", desc: "換上浴衣", category: 'hotel', mapQuery: "Onishiya Suishoen" },
          { time: "16:30", title: "七外湯巡禮", desc: "持 Pass 免費泡湯，晚餐享用松葉蟹", highlight: true, category: 'activity', mapQuery: "Kinosaki Onsen" }
      ]
  },
  {
      day: "Day 6", date: "01/28", weekday: "Wed",
      title: "城崎 ➔ 岡山",
      desc: "長途移動、岡山之夜",
      pass: true,
      bg: "https://images.unsplash.com/photo-1616421051516-728b4c023d8c?q=80&w=1000",
      weatherIcon: 'sunny',
      temp: "3°C / 11°C",
      tips: "今日移動距離較長，建議在車上準備些零食。",
      accommodation: { name: "Livemax Okayama", checkIn: "18:00" },
      events: [
          { time: "10:00", title: "城崎晨間時光", desc: "最後採買溫泉街土產", category: 'shopping' },
          { time: "11:00", title: "前往岡山", desc: "特急 ➔ 姬路 ➔ 新幹線", transport: "JR Pass Day 4", category: 'transport' },
          { time: "14:00", title: "姬路城 (選配)", desc: "若有體力可中途下車參觀", category: 'sightseeing', mapQuery: "Himeji Castle" },
          { time: "18:00", title: "Check-in: Livemax Okayama", desc: "岡山站西口", category: 'hotel', mapQuery: "Hotel Livemax Okayama" },
          { time: "19:00", title: "Aeon Mall 岡山", desc: "站前超大購物中心晚餐", category: 'shopping', mapQuery: "Aeon Mall Okayama" }
      ]
  },
  {
      day: "Day 7", date: "01/29", weekday: "Thu",
      title: "岡山 ➔ 京都",
      desc: "倉敷美觀、返回京都基地",
      pass: true,
      bg: "https://images.unsplash.com/photo-1623940373033-68d712e09b30?q=80&w=1000",
      weatherIcon: 'sunny',
      temp: "4°C / 12°C",
      tips: "倉敷美觀地區有很多精緻的牛仔布製品店。",
      accommodation: { name: "Kyoto Sakura Terrace", checkIn: "16:00" },
      events: [
          { time: "09:00", title: "倉敷美觀地區", desc: "白壁土藏群漫步，江戶風情", category: 'sightseeing', mapQuery: "Kurashiki Bikan Historical Quarter" },
          { time: "14:00", title: "返回京都", desc: "搭乘新幹線 (Pass 最後一日)", transport: "JR Pass Day 5", category: 'transport' },
          { time: "16:00", title: "Check-in: Sakura Terrace", desc: "回到熟悉的京都飯店", category: 'hotel' }
      ]
  },
  {
      day: "Day 8", date: "01/30", weekday: "Fri",
      title: "京都療癒日",
      desc: "迷你豬咖啡、錦市場、祇園",
      pass: false,
      bg: "https://images.unsplash.com/photo-1528325888203-82d242621746?q=80&w=1000",
      weatherIcon: 'cloudy',
      temp: "3°C / 8°C",
      tips: "Mipig Cafe 務必提前預約，現場很難有位子。",
      accommodation: { name: "Kyoto Sakura Terrace" },
      events: [
          { time: "10:00", title: "錦市場", desc: "京都的廚房，吃點心", category: 'food', mapQuery: "Nishiki Market" },
          { time: "13:00", title: "Mipig Cafe", desc: "預約制：與迷你豬零距離互動", highlight: true, category: 'activity', mapQuery: "mipig cafe kyoto" },
          { time: "15:30", title: "祇園 / 花見小路", desc: "漫步傳統茶屋街", category: 'sightseeing', mapQuery: "Hanamikoji Street" },
          { time: "18:00", title: "鴨川散步", desc: "三條大橋夜景", category: 'sightseeing', mapQuery: "Sanjo Ohashi Bridge" }
      ]
  },
  {
      day: "Day 9", date: "01/31", weekday: "Sat",
      title: "嵐山漫遊",
      desc: "渡月橋、竹林、小火車",
      pass: false,
      bg: "https://images.unsplash.com/photo-1594901842323-288277203b57?q=80&w=1000",
      weatherIcon: 'cloudy',
      temp: "2°C / 7°C",
      tips: "嵐山週末人潮眾多，小火車建議先上網預約。",
      accommodation: { name: "Kyoto Sakura Terrace" },
      events: [
          { time: "09:00", title: "嵐山地區", desc: "渡月橋、竹林小徑", category: 'sightseeing', mapQuery: "Arashiyama Bamboo Grove" },
          { time: "13:00", title: "嵯峨野觀光小火車", desc: "保津川溪谷美景", category: 'activity', mapQuery: "Sagano Romantic Train" },
          { time: "16:00", title: "京都市區自由行", desc: "最後的古都時光", category: 'shopping' }
      ]
  },
  {
      day: "Day 10", date: "02/01", weekday: "Sun",
      title: "移動至大阪",
      desc: "心齋橋、道頓堀購物",
      pass: false,
      bg: "https://images.unsplash.com/photo-1590559899731-a363c7084602?q=80&w=1000",
      weatherIcon: 'sunny',
      temp: "5°C / 10°C",
      tips: "大阪飯店位於淀屋橋，交通便利，可善用御堂筋線。",
      accommodation: { name: "APA 淀屋橋", checkIn: "12:30" },
      events: [
          { time: "11:00", title: "前往大阪", desc: "搭乘京阪電車或 JR", category: 'transport' },
          { time: "12:30", title: "Check-in: APA 淀屋橋", desc: "寄放行李 (11號出口)", category: 'hotel', mapQuery: "APA Hotel Yodoyabashi" },
          { time: "14:00", title: "道頓堀 & 心齋橋", desc: "跑跑人看板，購物模式全開", category: 'shopping', mapQuery: "Dotonbori Glico Man Sign" },
          { time: "19:00", title: "飯店溫泉", desc: "享受 B1 天然溫泉大浴場", category: 'activity' }
      ]
  },
  {
      day: "Day 11", date: "02/02", weekday: "Mon",
      title: "大阪全日",
      desc: "大阪城、梅田夜景",
      pass: false,
      bg: "https://images.unsplash.com/photo-1596720563857-46549298246d?q=80&w=1000",
      weatherIcon: 'sunny',
      temp: "4°C / 11°C",
      tips: "梅田藍天大廈看夜景建議在日落前半小時抵達。",
      accommodation: { name: "APA 淀屋橋" },
      events: [
          { time: "10:00", title: "大阪城公園", desc: "天守閣巡禮", category: 'sightseeing', mapQuery: "Osaka Castle" },
          { time: "15:00", title: "梅田商圈", desc: "最後補貨 (藥妝、電器)", category: 'shopping', mapQuery: "Umeda Station" },
          { time: "18:00", title: "梅田藍天大廈", desc: "空中庭園觀賞夜景", highlight: true, category: 'sightseeing', mapQuery: "Umeda Sky Building" }
      ]
  },
  {
      day: "Day 12", date: "02/03", weekday: "Tue",
      title: "返台",
      desc: "最後時光、前往機場",
      pass: false,
      bg: "https://images.unsplash.com/photo-1536531317768-d0554460ce41?q=80&w=1000",
      weatherIcon: 'cloudy',
      temp: "6°C / 12°C",
      tips: "請務必在起飛前 2.5 小時抵達機場。",
      accommodation: { name: "Sweet Home" },
      events: [
          { time: "Morning", title: "中之島散步", desc: "悠閒早餐，整理行李", category: 'sightseeing', mapQuery: "Nakanoshima Park" },
          { time: "15:30", title: "前往關西機場", desc: "南海電鐵 Rapi:t 或 Haruka", transport: "Airport", category: 'transport' },
          { time: "20:45", title: "起飛 (D7379)", desc: "AirAsia X 返回台北", category: 'flight', mapQuery: "Kansai International Airport" },
          { time: "23:05", title: "抵達台北 (TPE)", desc: "桃園機場第一航廈，旅程圓滿結束", category: 'flight', mapQuery: "Taoyuan International Airport" }
      ]
  }
];