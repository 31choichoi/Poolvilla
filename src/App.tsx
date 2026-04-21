/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import AdminDashboard from "./components/AdminDashboard.tsx";
import ReservationPage from "./components/ReservationPage.tsx";
import RoomDetail, { ROOMS_DATA, RoomInfo } from "./components/RoomDetail.tsx";
import { 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X, 
  MapPin, 
  Phone, 
  Clock,
  Calendar,
  Dog,
  ChevronDown,
  ArrowUp
} from "lucide-react";

const NAV_ITEMS = ["PROLOGUE", "LOCATION", "SPECIAL", "ROOMS", "RESERVATION"];
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1920"
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'reservation'>('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomInfo | null>(null);
  const [isRoomMenuOpen, setIsRoomMenuOpen] = useState(false);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.1]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    const heroTimer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(heroTimer);
    };
  }, []);

  useEffect(() => {
    if (currentPage === 'home' && window.location.hash) {
      const id = window.location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [currentPage]);

  return (
    <div className="relative min-h-screen">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "bg-white/90 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-6"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a 
            href="#" 
            className="flex items-center gap-2 group cursor-pointer" 
            onClick={(e) => { 
              e.preventDefault(); 
              if (currentPage === 'reservation') setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' }); 
            }}
          >
            <div className={`p-1.5 border rounded-lg transition-colors duration-500 ${isScrolled ? "border-gray-900" : "border-white"}`}>
              <Dog className={`w-5 h-5 transition-colors duration-500 ${isScrolled ? "text-gray-900" : "text-white"}`} />
            </div>
            <div className="flex flex-col">
              <span className={`text-lg font-bold tracking-tight transition-all duration-500 group-hover:opacity-70 ${isScrolled ? "text-gray-900" : "text-white"}`}>
                Lois Poolvilla
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_ITEMS.map((item) => (
              <div 
                key={item} 
                className="relative group"
                onMouseEnter={() => item === "ROOMS" && setIsRoomMenuOpen(true)}
                onMouseLeave={() => item === "ROOMS" && setIsRoomMenuOpen(false)}
              >
                <a 
                  href={item === "ROOMS" ? "#rooms" : item === "RESERVATION" ? "#" : `#${item.toLowerCase()}`}
                  onClick={(e) => {
                    if (item === "RESERVATION") {
                      e.preventDefault();
                      setCurrentPage('reservation');
                      window.scrollTo({ top: 0 });
                    } else if (currentPage === 'reservation') {
                      setCurrentPage('home');
                    }
                  }}
                  className={`text-sm font-medium tracking-wide transition-colors duration-300 hover:opacity-70 flex items-center gap-1 ${isScrolled ? "text-gray-700" : "text-white/90"}`}
                >
                  {item}
                  {item === "ROOMS" && <ChevronDown className="w-3 h-3 opacity-50" />}
                </a>

                {item === "ROOMS" && (
                  <AnimatePresence>
                    {isRoomMenuOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
                      >
                        <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-3 w-48 overflow-hidden">
                          {ROOMS_DATA.map((room) => (
                            <button 
                              key={room.id}
                              onClick={() => {
                                if (currentPage === 'reservation') setCurrentPage('home');
                                setSelectedRoom(room);
                              }}
                              className="w-full text-left px-5 py-2.5 text-[11px] font-bold text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all uppercase tracking-widest"
                            >
                              {room.name}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
            <button 
              onClick={() => setIsAdminDashboardOpen(true)}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${isScrolled ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-white text-gray-900 hover:bg-white/90"}`}
            >
              Admin
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className={isScrolled ? "text-gray-900" : "text-white"} />
            ) : (
              <Menu className={isScrolled ? "text-gray-900" : "text-white"} />
            )}
          </button>
        </div>

        {/* Mobile Nav Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-6 md:hidden flex flex-col gap-2 shadow-xl overflow-y-auto max-h-[80vh]"
          >
            {NAV_ITEMS.map((item) => (
              <div key={item} className="flex flex-col">
                <a 
                  href={item === "RESERVATION" ? "#" : `#${item.toLowerCase()}`}
                  className="text-gray-900 text-lg font-medium py-3 border-b border-gray-50 flex justify-between items-center"
                  onClick={(e) => {
                    if (item === "RESERVATION") {
                      e.preventDefault();
                      setCurrentPage('reservation');
                      setIsMenuOpen(false);
                      window.scrollTo({ top: 0 });
                    } else {
                      if (currentPage === 'reservation') setCurrentPage('home');
                      if (item !== "ROOMS") setIsMenuOpen(false);
                    }
                  }}
                >
                  {item}
                  {item === "ROOMS" && (
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsRoomMenuOpen(!isRoomMenuOpen); }}>
                      <ChevronDown className={`w-5 h-5 transition-transform ${isRoomMenuOpen ? "rotate-180" : ""}`} />
                    </button>
                  )}
                </a>
                {item === "ROOMS" && isRoomMenuOpen && (
                  <div className="bg-gray-50 flex flex-col pl-4">
                    {ROOMS_DATA.map(room => (
                      <button 
                        key={room.id}
                        onClick={() => { 
                          if (currentPage === 'reservation') setCurrentPage('home');
                          setSelectedRoom(room); 
                          setIsMenuOpen(false); 
                        }}
                        className="text-left py-3 text-sm text-gray-500 font-medium border-b border-gray-100 last:border-0"
                      >
                        {room.name} - {room.type}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </nav>

      {/* Page Content */}
      {currentPage === 'home' ? (
        <>
          {/* Hero Section */}
          <section className="relative h-[95vh] overflow-hidden">
        <motion.div 
          style={{ scale: heroScale }}
          className="absolute inset-0"
        >
          {HERO_IMAGES.map((img, index) => (
            <motion.img 
              key={index}
              src={img} 
              alt={`Hero ${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: currentHeroIndex === index ? 1 : 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ))}
        </motion.div>

        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative h-full flex flex-col items-center justify-center text-center text-white px-6"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="text-2xl md:text-4xl font-light tracking-tighter mb-6 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] uppercase"
          >
            Lois Poolvilla
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-xs md:text-sm font-light tracking-widest opacity-90 drop-shadow-md"
          >
            "편안하고 아늑한 로이스풀빌라"에 오신 것을 환영합니다.
          </motion.p>
          
          <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden md:block">
            <button onClick={() => setCurrentHeroIndex(prev => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)} className="p-2 border border-white/30 rounded-full hover:bg-white/10 transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:block">
            <button onClick={() => setCurrentHeroIndex(prev => (prev + 1) % HERO_IMAGES.length)} className="p-2 border border-white/30 rounded-full hover:bg-white/10 transition-colors">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-12 flex gap-3">
            {HERO_IMAGES.map((_, index) => (
              <button 
                key={index}
                onClick={() => setCurrentHeroIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${currentHeroIndex === index ? "bg-white w-6" : "bg-white/40"}`}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Prologue Section Content */}
      <section id="prologue" className="bg-white">
        {/* Welcome Text Header */}
        <div className="py-20 text-center border-b border-gray-100 mb-12">
          <div className="w-12 h-px bg-gray-300 mx-auto mb-6" />
          <p className="text-sm font-light text-gray-500 tracking-widest uppercase">로이스풀빌라 프롤로그</p>
        </div>

        {/* Description Section */}
        <div className="max-w-4xl mx-auto px-6 text-center mb-32">
          <span className="text-gray-400 text-sm uppercase tracking-widest mb-4 block">2024년 신축 오픈</span>
          <h3 className="text-4xl font-light tracking-tight text-gray-900 mb-12">Lois Poolvilla</h3>
          
          <div className="space-y-6 text-gray-500 font-light leading-relaxed">
            <p>프라이빗한 공간에서 특별한 부대 시설을 한 번에 만끽할 수 있는 '로이스 풀빌라' 입니다.</p>
            <div className="space-y-2 py-4">
              <p><strong>숙소는 초록초록한 자연 속에</strong> 있고</p>
              <p><strong>핀란드식 사우나</strong>가 준비되어 있습니다.</p>
              <p><strong>사계절 이용할 수 있는 대형 온수풀</strong>이 있습니다.</p>
              <p><strong>야외 마당에서는 로맨틱한 불멍</strong>이 가능하며</p>
              <p><strong>호텔식 침구류를 사용</strong>하여 온전한 휴식을 취할 수 있습니다.</p>
            </div>
            <p className="pt-4">사랑하는 반려견과의 소중한 추억을 남길 수 있도록</p>
            <p>로이스 애견 풀빌라는 항상 여러분의 편안한 휴식에 최선을 다하겠습니다.</p>
          </div>
        </div>
      </section>

      {/* Featured Interior Showcase */}
      <section id="special" className="relative h-[100vh] flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-fixed bg-center bg-cover"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1920')",
            backgroundAttachment: "fixed" 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 w-full text-white">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="max-w-md space-y-6"
          >
            <span className="text-sm tracking-[0.3em] font-medium opacity-80">LoisPoolvilla</span>
            <h3 className="text-4xl font-light tracking-tight leading-tight">
              사랑하는 반려견과 함께하는 <br /> 잊지 못할 휴가
            </h3>
            <p className="text-sm font-light opacity-70 leading-relaxed">
              로이스 풀빌라는 독채로 구성되어 있어 <br />
              아늑한 쉼을 즐길 수 있습니다.
            </p>
            <button 
              onClick={() => { setCurrentPage('reservation'); window.scrollTo({ top: 0 }); }}
              className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded hover:bg-white hover:text-gray-900 transition-all duration-300"
            >
              <Clock className="w-4 h-4" />
              <span className="text-xs uppercase tracking-widest">실시간 예약하기</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Rooms Overview Section */}
      <section id="rooms" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-xs uppercase tracking-[0.4em] text-gray-400 mb-4 block">Our Spaces</span>
            <h2 className="text-4xl font-light tracking-tight text-gray-900 mb-6 font-serif uppercase">ROOMS</h2>
            <p className="text-sm text-gray-500 font-light tracking-widest">각기 다른 매력을 가진 로이스 풀빌라의 공간들을 소개합니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ROOMS_DATA.map((room) => (
              <motion.div 
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="group cursor-pointer"
                onClick={() => setSelectedRoom(room)}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 mb-6">
                  <img 
                    src={room.images[0]} 
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <span className="text-[10px] text-white font-bold tracking-[0.3em] uppercase opacity-80 mb-2 block">{room.type}</span>
                    <h4 className="text-2xl text-white font-light tracking-widest uppercase">{room.name}</h4>
                  </div>
                </div>
                <div className="flex justify-between items-end px-2">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400 font-light italic">{room.size} / {room.capacity}</p>
                    <p className="text-sm font-medium text-gray-900 tracking-tight">{room.price}</p>
                  </div>
                  <span className="text-[10px] font-bold text-gray-300 border-b border-gray-200 pb-1 group-hover:text-gray-900 group-hover:border-gray-900 transition-all uppercase tracking-widest">View Detail</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="location" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.4em] text-gray-400 mb-4 block">Where we are</span>
          <h2 className="text-3xl font-light tracking-tight text-gray-900">LOCATION</h2>
        </div>
        <div className="aspect-[21/9] bg-gray-100 rounded-xl overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-1000">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.8!2d126.5!3d37.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357b7f1e7d8c7b8d%3A0x7d8c7b8d7d8c7b8d!2z7J247LmcIOyYneynhOq1sCDsmIHtnaë©´IOyìŀ¬ë¦¬IDU0NS02!5e0!3m2!1sko!2skr!4v1713714263000!5m2!1sko!2skr"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
          ></iframe>
          <div className="absolute inset-y-0 left-12 flex items-center pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-lg shadow-2xl text-center max-w-sm pointer-events-auto">
              <MapPin className="w-8 h-8 text-gray-900 mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2 uppercase tracking-widest">Lois Poolvilla</h4>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                인천 옹진군 영흥면 선재리 545-6 <br />
                (545-6 Seonjae-ri, Yeongheung-myeon)
              </p>
              <a 
                href="https://map.naver.com/v5/search/인천%20옹진군%20영흥면%20선재리%20545-6" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-bold tracking-widest uppercase text-gray-900 border-b border-gray-900 pb-1"
              >
                Open in Naver Maps
              </a>
            </div>
          </div>
        </div>
      </section>
        </>
      ) : (
        <div className="pt-24 min-h-screen bg-white">
          <ReservationPage onBook={() => setCurrentPage('home')} />
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#6B5A43] text-white/90 py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <Dog className="w-6 h-6" />
              <span className="text-2xl font-bold tracking-tight">Lois Poolvilla</span>
            </div>
            <div className="space-y-2 text-[13px] font-light leading-relaxed opacity-80">
              <p>대표자 : 홍길동</p>
              <p>TEL : 010-0000-0000</p>
              <p>ADD : 인천 옹진군 영흥면 선재리 545-6</p>
              <p>사업자등록번호 : 000-00-00000</p>
              <p>계좌번호 : 00은행 000-00-000000 (예금주 : 홍길동)</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-16">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest">Navigation</h4>
              <ul className="space-y-3 text-[13px] font-light opacity-70">
                {NAV_ITEMS.map(item => (
                  <li key={item}>
                    <a 
                      href={item === "RESERVATION" ? "#" : `#${item.toLowerCase()}`} 
                      className="hover:text-white transition-colors text-left w-full"
                      onClick={(e) => {
                        if (item === "RESERVATION") {
                          e.preventDefault();
                          setCurrentPage('reservation');
                          window.scrollTo({ top: 0 });
                        } else if (currentPage === 'reservation') {
                          setCurrentPage('home');
                        }
                      }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest">Legal</h4>
              <ul className="space-y-3 text-[13px] font-light opacity-70">
                <li><a href="#" className="hover:text-white transition-colors">이용약관</a></li>
                <li><a href="#" className="hover:text-white transition-colors">개인정보처리방침</a></li>
                <li><button onClick={() => setIsAdminDashboardOpen(true)} className="hover:text-white transition-colors cursor-pointer">관리자 모드</button></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      <AdminDashboard 
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
      />

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {isScrolled && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 z-[100] p-4 bg-white/80 backdrop-blur-md border border-gray-100 rounded-full shadow-2xl text-gray-900 transition-all hover:bg-gray-900 hover:text-white"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedRoom && (
          <RoomDetail 
            room={selectedRoom} 
            onClose={() => setSelectedRoom(null)} 
            onBook={() => {
              setSelectedRoom(null);
              setCurrentPage('reservation');
              window.scrollTo({ top: 0 });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
