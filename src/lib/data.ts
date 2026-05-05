export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  tags: string[];
  rating: number;
  reviews: number;
  badge?: string;
  colors?: string[];
}

export const categories = [
  { id: "all", name: "全部" },
  { id: "phone", name: "手机" },
  { id: "audio", name: "音频" },
  { id: "wearable", name: "穿戴" },
  { id: "computer", name: "电脑" },
  { id: "smart-home", name: "智能家居" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "XM Pro Max",
    description: "旗舰级智能手机，搭载最新处理器，超清影像系统",
    price: 6999,
    originalPrice: 7999,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop",
    category: "phone",
    tags: ["旗舰", "5G", "拍照"],
    rating: 4.9,
    reviews: 2341,
    badge: "热销",
    colors: ["#1a1a1a", "#f5f5f5", "#3b82f6"],
  },
  {
    id: "2",
    name: "XM Buds Pro",
    description: "主动降噪真无线耳机，Hi-Res音质认证",
    price: 1299,
    originalPrice: 1599,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop",
    category: "audio",
    tags: ["降噪", "无线", "Hi-Res"],
    rating: 4.8,
    reviews: 1856,
    badge: "新品",
    colors: ["#1a1a1a", "#f5f5f5"],
  },
  {
    id: "3",
    name: "XM Watch Ultra",
    description: "专业运动智能手表，钛合金表身，100米防水",
    price: 3999,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
    category: "wearable",
    tags: ["运动", "健康", "防水"],
    rating: 4.7,
    reviews: 982,
    colors: ["#1a1a1a", "#f5f5f5", "#f97316"],
  },
  {
    id: "4",
    name: "XM Book Air",
    description: "轻薄笔记本电脑，14小时续航，2.8K OLED屏",
    price: 8999,
    originalPrice: 9999,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop",
    category: "computer",
    tags: ["轻薄", "OLED", "办公"],
    rating: 4.8,
    reviews: 1567,
    badge: "推荐",
    colors: ["#1a1a1a", "#f5f5f5"],
  },
  {
    id: "5",
    name: "XM Speaker Home",
    description: "智能音箱，360度环绕音效，语音助手",
    price: 799,
    originalPrice: 999,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop",
    category: "smart-home",
    tags: ["智能", "音箱", "语音"],
    rating: 4.6,
    reviews: 723,
    colors: ["#1a1a1a", "#f5f5f5"],
  },
  {
    id: "6",
    name: "XM Pad Pro",
    description: "专业平板电脑，M2芯片，支持手写笔",
    price: 4999,
    originalPrice: 5499,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop",
    category: "computer",
    tags: ["平板", "创作", "M2"],
    rating: 4.7,
    reviews: 1123,
    colors: ["#1a1a1a", "#f5f5f5", "#a855f7"],
  },
  {
    id: "7",
    name: "XM Camera 360",
    description: "全景智能摄像头，4K画质，AI人形检测",
    price: 599,
    image: "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=600&h=600&fit=crop",
    category: "smart-home",
    tags: ["安防", "4K", "AI"],
    rating: 4.5,
    reviews: 456,
    colors: ["#1a1a1a", "#f5f5f5"],
  },
  {
    id: "8",
    name: "XM Neckband Sport",
    description: "运动颈挂式耳机，IPX7防水，12小时续航",
    price: 399,
    originalPrice: 499,
    image: "https://images.unsplash.com/photo-1572569028738-411a197b83cd?w=600&h=600&fit=crop",
    category: "audio",
    tags: ["运动", "防水", "长续航"],
    rating: 4.4,
    reviews: 678,
    badge: "特价",
    colors: ["#1a1a1a", "#3b82f6", "#22c55e"],
  },
];

export const heroSlides = [
  {
    id: 1,
    title: "XM Pro Max",
    subtitle: "超越想象的旗舰体验",
    description: "全新影像系统，捕捉每个精彩瞬间",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=600&fit=crop",
    color: "from-violet-600 to-indigo-600",
  },
  {
    id: 2,
    title: "XM Buds Pro",
    subtitle: "静享纯粹音质",
    description: "智能主动降噪，沉浸式听觉体验",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1200&h=600&fit=crop",
    color: "from-emerald-600 to-teal-600",
  },
  {
    id: 3,
    title: "XM Watch Ultra",
    subtitle: "探索无限可能",
    description: "专业运动监测，钛合金坚固表身",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=600&fit=crop",
    color: "from-orange-600 to-red-600",
  },
];

export const features = [
  {
    icon: "Truck",
    title: "极速配送",
    description: "全国包邮，次日送达",
  },
  {
    icon: "Shield",
    title: "品质保障",
    description: "官方正品，假一赔十",
  },
  {
    icon: "RotateCcw",
    title: "无忧退换",
    description: "7天无理由退换货",
  },
  {
    icon: "Headphones",
    title: "专属客服",
    description: "24小时在线支持",
  },
];
