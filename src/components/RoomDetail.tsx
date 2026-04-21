import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Maximize2, Users, Square, Bed, Wind, ArrowLeft, Calendar } from "lucide-react";

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
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-white overflow-y-auto"
    >
      {/* Navigation Bar */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK</span>
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">{room.type}</span>
            <h2 className="text-xl font-light tracking-widest uppercase">{room.name}</h2>
          </div>
          <button 
            onClick={onBook}
            className="px-6 py-2 bg-gray-900 text-white text-xs font-bold tracking-widest uppercase rounded-full hover:bg-black transition-all"
          >
            RESERVE NOW
          </button>
        </div>
      </div>

      {/* Main Images */}
      <div className="space-y-4 p-4 md:p-6 lg:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="aspect-[4/3] rounded-2xl overflow-hidden shadow-sm"
          >
            <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </motion.div>
          <div className="grid grid-rows-2 gap-4 md:gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl overflow-hidden shadow-sm"
            >
              <img src={room.images[1]} alt={room.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl overflow-hidden shadow-sm"
            >
              <img src={room.images[2]} alt={room.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-6">
              <h3 className="text-3xl font-light tracking-tight text-gray-900">{room.name} Overview</h3>
              <p className="text-lg text-gray-500 font-light leading-relaxed">
                {room.description}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-gray-100">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-300 tracking-widest flex items-center gap-2"><Square className="w-3 h-3"/> Size</span>
                <p className="text-sm font-medium">{room.size}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-300 tracking-widest flex items-center gap-2"><Users className="w-3 h-3"/> Capacity</span>
                <p className="text-sm font-medium">{room.capacity}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-300 tracking-widest flex items-center gap-2"><Bed className="w-3 h-3"/> Beds</span>
                <p className="text-sm font-medium">{room.bedType}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-300 tracking-widest flex items-center gap-2"><Maximize2 className="w-3 h-3"/> Check-In/Out</span>
                <p className="text-sm font-medium">15:00 / 11:00</p>
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-xl font-light tracking-tight text-gray-900">Room Features</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6">
                {room.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Wind className="w-4 h-4 text-gray-300" />
                    <span className="text-sm text-gray-600 font-light">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="p-8 bg-gray-50 rounded-2xl space-y-6">
              <div className="space-y-1">
                <span className="text-xs text-gray-400 font-light">Starting from</span>
                <p className="text-3xl font-light text-gray-900">{room.price}</p>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="space-y-4">
                <p className="text-sm text-gray-500 font-light leading-relaxed">
                  * 시즌에 따라 가격이 변동될 수 있습니다. <br />
                  * 실시간 예약창에서 정확한 가격을 확인해 주세요.
                </p>
                <button 
                  onClick={onBook}
                  className="w-full py-4 bg-gray-900 text-white text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-black transition-all flex items-center justify-center gap-3"
                >
                  <Calendar className="w-4 h-4" />
                  <span>예약 가능 여부 확인</span>
                </button>
              </div>
            </div>
            
            <div className="p-8 border border-gray-100 rounded-2xl">
              <h5 className="text-sm font-bold uppercase tracking-widest border-b border-gray-100 pb-4 mb-4">Notification</h5>
              <ul className="space-y-3 text-xs text-gray-400 font-light leading-relaxed list-disc pl-4">
                <li>입실시간 15:00 / 퇴실시간 11:00</li>
                <li>반려견 동반 시 사전 문의 필수</li>
                <li>객실 내 육류/생선 조리 금지</li>
                <li>전 객실 금연 구역입니다.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
