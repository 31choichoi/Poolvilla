import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Maximize2, Users, Square, Bed, Wind, ArrowLeft, Calendar, Clock, ArrowUp } from "lucide-react";

export interface RoomInfo {
  id: string;
  name: string;
  type: string;
  description: string;
  price: string;
  size: string;
  capacity: string;
  bedType: string;
  features: string[];
  images: string[];
}

export const ROOMS_DATA: RoomInfo[] = [
  {
    id: "101",
    name: "Room 101",
    type: "Private Pool Villa",
    description: "101호는 프라이빗한 개인 풀과 넓은 거실을 갖춘 전형적인 풀빌라 타입입니다. 초록빛 자연을 바라보며 온전한 휴식을 취할 수 있습니다.",
    price: "350,000 KRW ~",
    size: "약 35평",
    capacity: "기준 2인 / 최대 4인",
    bedType: "퀸 사이즈 베드 2개",
    features: ["개인 온수풀", "핀란드식 사우나", "독자 테라스", "넷플릭스", "캡슐 커피머신"],
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200"
    ]
  },
  {
    id: "102",
    name: "Room 102",
    type: "Private Pool Villa",
    description: "102호는 세련된 인테리어와 현대적인 감각이 돋보이는 공간입니다. 거실에서 바로 연결되는 풀장은 가족 단위 여행객에게 최고의 만족감을 선사합니다.",
    price: "350,000 KRW ~",
    size: "약 35평",
    capacity: "기준 2인 / 최대 4인",
    bedType: "퀸 사이즈 베드 2개",
    features: ["개인 온수풀", "야외 자쿠지", "바비큐 데크", "대형 스마트 TV", "고급 어메니티"],
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200"
    ]
  },
  {
    id: "201",
    name: "Room 201",
    type: "Sky View Suite",
    description: "201호는 탁 트인 하늘과 산세를 한눈에 담을 수 있는 뷰 맛집입니다. 높은 천고와 통창을 통해 쏟아지는 햇살이 공간을 포근하게 감싸줍니다.",
    price: "320,000 KRW ~",
    size: "약 30평",
    capacity: "기준 2인 / 최대 3인",
    bedType: "킹 사이즈 베드 1개",
    features: ["스카이뷰 테라스", "핀란드식 실내 사우나", "빔 프로젝터", "와인 셀러", "블루투스 스피커"],
    images: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1537726235470-8504e3bdb285?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1560185127-6a430545169a?auto=format&fit=crop&q=80&w=1200"
    ]
  },
  {
    id: "202",
    name: "Room 202",
    type: "Sky View Suite",
    description: "202호는 차분한 톤의 인테리어로 온전한 휴식에 집중할 수 있는 공간입니다. 저녁 무렵 테라스에서 감상하는 노을은 로이스 풀빌라에서만 느낄 수 있는 감동입니다.",
    price: "320,000 KRW ~",
    size: "약 30평",
    capacity: "기준 2인 / 최대 3인",
    bedType: "킹 사이즈 베드 1개",
    features: ["스카이뷰 테라스", "커스텀 욕조", "미니 서재", "스타일러", "네스프레소 머신"],
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1594331565545-31682859132d?auto=format&fit=crop&q=80&w=1200"
    ]
  },
  {
    id: "vip",
    name: "VIP Suite",
    type: "Ultimate Luxury",
    description: "로이스 풀빌라의 정수, VIP Suite입니다. 가장 높은 곳에서 펼쳐지는 파노라마 뷰와 최고급 자재로 마감된 인테리어는 당신의 머무름을 특별한 예술로 만들어 드립니다.",
    price: "550,000 KRW ~",
    size: "약 50평",
    capacity: "기준 2인 / 최대 6인",
    bedType: "킹 사이즈 베드 2개",
    features: ["대형 인피니티 풀", "럭셔리 드라이 사우나", "프라이빗 정원", "고급 리클라이너", "AI 스마트 스피커"],
    images: [
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1512918766775-d56aebb309f9?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&q=80&w=1200"
    ]
  }
];

interface RoomDetailProps {
  room: RoomInfo;
  onClose: () => void;
  onBook: () => void;
}

export default function RoomDetail({ room, onClose, onBook }: RoomDetailProps) {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setShowTopBtn(scrollContainerRef.current.scrollTop > 300);
    }
  };

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div 
      ref={scrollContainerRef}
      onScroll={handleScroll}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-white overflow-y-auto"
    >
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[160] px-6 py-8 flex justify-between items-center mix-blend-difference text-white">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] hover:opacity-50 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>CLOSE</span>
        </button>
        <button 
          onClick={onBook}
          className="text-xs font-bold tracking-[0.2em] border-b border-white pb-1 hover:opacity-50 transition-opacity"
        >
          BOOK NOW
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[90vh] overflow-hidden bg-gray-100 flex items-end">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={room.images[0]} 
          alt={room.name} 
          className="absolute inset-0 w-full h-full object-cover" 
          referrerPolicy="no-referrer" 
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative w-full max-w-7xl mx-auto px-6 py-20 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <span className="text-xs uppercase tracking-[0.5em] font-bold opacity-70 mb-4 block">{room.type}</span>
            <h1 className="text-6xl md:text-8xl font-light tracking-tighter uppercase mb-6">{room.name}</h1>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            {/* Left: Summary */}
            <div className="lg:col-span-8 space-y-20">
              <div className="space-y-8">
                <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-400">The Space</h3>
                <p className="text-2xl md:text-3xl font-light leading-snug text-gray-900 max-w-2xl">
                  {room.description}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 border-t border-gray-100 pt-16">
                {[
                  { label: "Size", value: room.size, icon: Square },
                  { label: "Capacity", value: room.capacity, icon: Users },
                  { label: "Beds", value: room.bedType, icon: Bed },
                  { label: "Check In", value: "15:00", icon: Clock },
                ].map((spec, i) => (
                  <div key={i} className="space-y-2">
                    <span className="text-[10px] uppercase font-bold text-gray-300 tracking-widest flex items-center gap-2">
                      <spec.icon className="w-3 h-3" /> {spec.label}
                    </span>
                    <p className="text-sm font-medium text-gray-900">{spec.value}</p>
                  </div>
                ))}
              </div>

              {/* Secondary Images - Balanced Pair */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden"
                >
                  <img src={room.images[1]} alt={room.name} className="w-full h-full object-cover" />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden md:mt-20"
                >
                  <img src={room.images[2]} alt={room.name} className="w-full h-full object-cover" />
                </motion.div>
              </div>

              {/* Features */}
              <div className="space-y-10 border-t border-gray-100 pt-20">
                <h4 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-400">Amenities & Features</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4">
                  {room.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                      <span className="text-sm text-gray-600 font-light">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Booking Sidebar */}
            <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-8">
              <div className="p-10 bg-gray-50 rounded-3xl space-y-8 text-center lg:text-left">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Pricing From</span>
                  <p className="text-4xl font-light text-gray-900">{room.price}</p>
                </div>
                <div className="space-y-6">
                  <button 
                    onClick={onBook}
                    className="w-full py-5 bg-gray-900 text-white text-[11px] font-bold tracking-[0.2em] uppercase rounded-xl hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-gray-200"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>예약 가능 여부 확인</span>
                  </button>
                  <p className="text-[11px] text-gray-400 font-light leading-relaxed text-center px-4">
                    * 시즌 및 요일에 따라 가격은 변동될 수 있으며, <br />실시간 예약 창에서 정확한 견적을 확인하실 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="p-10 border border-gray-100 rounded-3xl space-y-6">
                <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-900 border-b border-gray-100 pb-4">Essential Info</h5>
                <ul className="space-y-4 text-xs text-gray-400 font-light leading-relaxed">
                  <li className="flex justify-between"><span>Check-In</span> <span className="text-gray-900 font-medium">15:00</span></li>
                  <li className="flex justify-between"><span>Check-Out</span> <span className="text-gray-900 font-medium">11:00</span></li>
                  <li className="flex flex-col gap-2 pt-4">
                    <span className="uppercase text-[9px] font-bold tracking-widest">Notice</span>
                    <p className="pl-3 border-l border-gray-200">반려견 동반 시 사전 문의 부탁드립니다. 실내 정숙 및 금연 원칙을 준수해 주세요.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final Bottom Bar for mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 flex items-center justify-between z-[170]">
        <div>
          <span className="text-[9px] uppercase font-bold text-gray-400">{room.name}</span>
          <p className="text-sm font-bold text-gray-900">{room.price}</p>
        </div>
        <button 
          onClick={onBook}
          className="px-6 py-3 bg-gray-900 text-white text-[10px] font-bold tracking-widest uppercase rounded-lg"
        >
          RESERVE
        </button>
      </div>

      {/* Internal Scroll to Top for Detail View */}
      <AnimatePresence>
        {showTopBtn && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-20 md:bottom-8 right-8 z-[170] p-4 bg-white/80 backdrop-blur-md border border-gray-100 rounded-full shadow-2xl text-gray-900 transition-all hover:bg-gray-900 hover:text-white"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
