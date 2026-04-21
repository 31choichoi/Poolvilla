import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addDays, isBefore, startOfDay, differenceInDays, parseISO, isValid, isWithinInterval } from "date-fns";
import { ChevronLeft, ChevronRight, Clock, Users, Calendar as CalendarIcon, CheckCircle2, Moon, Home, User, Phone, MessageSquare, AlertCircle } from "lucide-react";
import { ROOMS_DATA } from "./RoomDetail.tsx";
import { createReservation, db } from "../lib/firebase";
import { collection, query, onSnapshot } from "firebase/firestore";

interface Reservation {
  id: string;
  name: string;
  room: string;
  date: string; // "yyyy-MM-dd ~ MM-dd (N박, HH:mm)"
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface ReservationPageProps {
  onBook: () => void;
}

const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
];

export default function ReservationPage({ onBook }: ReservationPageProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedNights, setSelectedNights] = useState(1);
  const [selectedRoomId, setSelectedRoomId] = useState(ROOMS_DATA[0].id);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestMessage, setGuestMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [isSuccess, setIsSuccess] = useState(false);
  const [allReservations, setAllReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const q = query(collection(db, "reservations"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const res = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Reservation[];
      setAllReservations(res);
    });
    return () => unsubscribe();
  }, []);

  const selectedRoom = ROOMS_DATA.find(r => r.id === selectedRoomId) || ROOMS_DATA[0];
  const checkOutDate = addDays(selectedDate, selectedNights);

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-8">
      <h3 className="text-xl font-light tracking-tight text-gray-900">
        {format(currentMonth, "MMMM yyyy")}
      </h3>
      <div className="flex gap-2">
        <button 
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <button 
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 mb-4">
        {days.map((day) => (
          <div key={day} className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const isDateOccupied = (day: Date, roomId: string) => {
    const room = ROOMS_DATA.find(r => r.id === roomId);
    if (!room) return false;

    return allReservations.some(res => {
      if (res.status === 'cancelled') return false;
      if (res.room !== room.name) return false;

      try {
        const startDateStr = res.date.split(' ~ ')[0];
        const startDate = parseISO(startDateStr);
        const nightsMatch = res.date.match(/\((\d+)박/);
        const nights = nightsMatch ? parseInt(nightsMatch[1]) : 1;
        
        if (!isValid(startDate)) return false;

        const endDate = addDays(startDate, nights - 1);
        return isWithinInterval(startOfDay(day), { 
          start: startOfDay(startDate), 
          end: startOfDay(endDate) 
        });
      } catch (e) {
        return false;
      }
    });
  };

  const isRangeOccupied = (start: Date, nights: number, roomId: string) => {
    for (let i = 0; i < nights; i++) {
      if (isDateOccupied(addDays(start, i), roomId)) return true;
    }
    return false;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, idx) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isPast = isBefore(day, startOfDay(new Date()));
          const isOccupied = isDateOccupied(day, selectedRoomId);
          
          return (
            <button
              key={idx}
              disabled={isPast || isOccupied}
              onClick={() => setSelectedDate(day)}
              className={`
                relative aspect-square flex items-center justify-center text-xs sm:text-sm rounded-lg transition-all
                ${!isCurrentMonth ? "text-gray-300" : isPast ? "text-gray-200 cursor-not-allowed" : isOccupied ? "text-red-200 cursor-not-allowed line-through" : "text-gray-700 hover:bg-gray-50"}
                ${isSelected ? "bg-gray-900 text-white hover:bg-gray-800 shadow-lg scale-105 z-10" : ""}
              `}
            >
              {format(day, "d")}
              {isOccupied && isCurrentMonth && (
                <span className="absolute bottom-1 text-[8px] font-bold text-red-400 uppercase tracking-tighter scale-75">Full</span>
              )}
              {isSelected && (
                <motion.div 
                  layoutId="activeDay"
                  className="absolute inset-0 border-2 border-gray-900 rounded-lg pointer-events-none"
                />
              )}
            </button>
          );
        })}
      </div>
    );
  };

  const handleReservation = async () => {
    if (!selectedTime || !guestName || !guestPhone) return;
    
    // Check for overlap one last time before submitting
    if (isRangeOccupied(selectedDate, selectedNights, selectedRoomId)) {
      alert("죄송합니다. 선택하신 기간에 이미 예약이 완료된 날짜가 포함되어 있습니다. 다른 날짜나 호실을 선택해 주세요.");
      return;
    }

    setStatus("loading");
    
    try {
      const reservationData = {
        name: guestName,
        phone: guestPhone,
        date: `${format(selectedDate, "yyyy-MM-dd")} ~ ${format(checkOutDate, "MM-dd")} (${selectedNights}박, ${selectedTime})`,
        room: selectedRoom.name,
        message: guestMessage
      };
      
      await createReservation(reservationData);
      setIsSuccess(true);
      setStatus("success");
    } catch (error) {
      console.error("Reservation failed:", error);
      setStatus("error");
      alert("예약 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <section id="reservation" className="py-32 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-xs uppercase tracking-[0.4em] text-gray-400 mb-4 block">Booking System</span>
          <h2 className="text-4xl font-light tracking-tight text-gray-900 mb-6 font-serif uppercase">RESERVATION</h2>
          <p className="text-sm text-gray-500 font-light tracking-widest max-w-lg mx-auto leading-relaxed">
            한눈에 확인하는 예약 현황. 원하는 날짜와 시간을 선택하여 <br /> 로이스 풀빌라에서의 완벽한 휴식을 시작하세요.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          <div className="flex flex-col lg:flex-row">
            {/* Left: Calendar */}
            <div className="flex-1 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-gray-100">
              <div className="max-w-md mx-auto">
                <div className="flex items-center gap-3 mb-10 text-gray-400">
                  <CalendarIcon className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Select Date</span>
                </div>
                {renderHeader()}
                {renderDays()}
                {renderCells()}

                {/* Night Selection */}
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-3 mb-6 text-gray-400">
                    <Moon className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Stay Duration</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setSelectedNights(n)}
                        className={`
                          flex-1 py-3 rounded-xl border text-sm font-medium transition-all
                          ${selectedNights === n 
                            ? "bg-gray-900 text-white border-gray-900 shadow-lg" 
                            : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"}
                        `}
                      >
                        {n}박
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl flex justify-between items-center">
                    <span className="text-[11px] text-gray-400 font-medium uppercase tracking-widest">Checkout</span>
                    <span className="text-sm text-gray-900 font-medium">
                      {format(checkOutDate, "yyyy. MM. dd")} ({format(checkOutDate, "EEE")})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Time Selection */}
            <div className="flex-1 p-8 lg:p-12 bg-gray-50/30">
              <div className="max-w-md mx-auto h-full flex flex-col">
                {/* Room Selection */}
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6 text-gray-400">
                    <Home className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Select Room</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ROOMS_DATA.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => setSelectedRoomId(room.id)}
                        className={`
                          p-4 rounded-xl border text-left transition-all
                          ${selectedRoomId === room.id 
                            ? "bg-gray-900 border-gray-900 text-white shadow-lg ring-2 ring-gray-900 ring-offset-2" 
                            : "bg-white border-gray-100 text-gray-600 hover:border-gray-300"}
                        `}
                      >
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">{room.type}</p>
                        <p className="text-sm font-bold uppercase tracking-widest">{room.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-10 text-gray-400">
                  <Clock className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Select Time</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
                  {TIME_SLOTS.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`
                        py-4 px-6 text-sm font-medium rounded-xl border transition-all
                        ${selectedTime === time 
                          ? "bg-gray-900 text-white border-gray-900 shadow-md ring-2 ring-gray-900 ring-offset-2" 
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50"}
                      `}
                    >
                      {time}
                    </button>
                  ))}
                </div>

                {/* Guest Information */}
                <div className="mt-12 space-y-6">
                  <div className="flex items-center gap-3 mb-2 text-gray-400">
                    <User className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Guest Information</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Name</label>
                      <input 
                        type="text" 
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="성함"
                        className="w-full px-4 py-4 bg-white border border-gray-100 rounded-xl focus:ring-2 ring-gray-900/10 transition-all outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Phone</label>
                      <input 
                        type="tel" 
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="010-0000-0000"
                        className="w-full px-4 py-4 bg-white border border-gray-100 rounded-xl focus:ring-2 ring-gray-900/10 transition-all outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Message (Optional)</label>
                    <textarea 
                      value={guestMessage}
                      onChange={(e) => setGuestMessage(e.target.value)}
                      placeholder="추가 요청 사항을 입력해 주세요."
                      rows={2}
                      className="w-full px-4 py-4 bg-white border border-gray-100 rounded-xl focus:ring-2 ring-gray-900/10 transition-all outline-none text-sm resize-none"
                    />
                  </div>
                </div>

                {/* Selected Summary & Action */}
                <div className="mt-auto pt-8 border-t border-gray-200">
                  {isRangeOccupied(selectedDate, selectedNights, selectedRoomId) && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-red-900 uppercase tracking-widest">Unavailable</p>
                        <p className="text-[11px] text-red-600 leading-relaxed font-medium">
                          선택하신 기간 중 이미 예약된 날짜가 포함되어 있습니다.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-8">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Selected Summary</p>
                      <p className="text-sm text-gray-900 font-bold uppercase tracking-widest mb-1">
                        {selectedRoom.name}
                      </p>
                      <p className="text-lg text-gray-900 font-light">
                        {format(selectedDate, "MMM d")} - {format(checkOutDate, "MMM d")} ({selectedNights}박)
                      </p>
                      <p className="text-sm text-gray-500 font-light">
                        {selectedTime ? `@ ${selectedTime}` : "시간 선택 전"}
                      </p>
                    </div>
                  </div>

                  <button
                    disabled={!selectedTime || !guestName || !guestPhone || status === "loading" || isRangeOccupied(selectedDate, selectedNights, selectedRoomId)}
                    onClick={handleReservation}
                    className={`
                      w-full py-5 rounded-2xl text-xs font-bold tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-3
                      ${selectedTime && guestName && guestPhone && !isRangeOccupied(selectedDate, selectedNights, selectedRoomId)
                        ? "bg-gray-900 text-white hover:bg-black shadow-xl" 
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"}
                    `}
                  >
                    {status === "loading" ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Confirm Reservation"
                    )}
                  </button>
                  
                  <p className="text-center text-[10px] text-gray-400 mt-6 tracking-widest uppercase">
                    * 예약 확정 후 개별 문자가 발송됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Overlay Animation */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-8"
            >
              <CheckCircle2 className="w-12 h-12" />
            </motion.div>
            <h3 className="text-3xl font-light text-gray-900 mb-4 tracking-tight">예약이 완료되었습니다</h3>
            <div className="space-y-2 text-gray-500 font-light max-w-sm mx-auto leading-relaxed mb-8">
              <p className="text-xl font-bold text-gray-900 uppercase tracking-widest mb-4">
                {selectedRoom.name}
              </p>
              <p className="text-gray-900 font-medium">
                {format(selectedDate, "yyyy년 M월 d일")} ~ {format(checkOutDate, "M월 d일")}
              </p>
              <p>총 {selectedNights}박 | 입실 시간: {selectedTime}</p>
              <p>선택하신 일정으로 예약 신청이 접수되었습니다.</p>
            </div>
            <button 
              onClick={() => {
                setIsSuccess(false);
                setSelectedTime(null);
                setGuestName("");
                setGuestPhone("");
                setGuestMessage("");
                setStatus("idle");
                onBook();
              }}
              className="px-10 py-4 bg-gray-900 text-white text-xs font-bold tracking-[0.3em] uppercase rounded-xl hover:bg-black transition-all"
            >
              홈으로 돌아가기
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
