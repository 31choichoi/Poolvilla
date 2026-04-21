import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addDays, isBefore, startOfDay, differenceInDays } from "date-fns";
import { ChevronLeft, ChevronRight, Clock, Users, Calendar as CalendarIcon, CheckCircle2, Moon, Home } from "lucide-react";
import { ROOMS_DATA } from "./RoomDetail.tsx";

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
  const [isSuccess, setIsSuccess] = useState(false);

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
          
          return (
            <button
              key={idx}
              disabled={isPast}
              onClick={() => setSelectedDate(day)}
              className={`
                relative aspect-square flex items-center justify-center text-sm rounded-lg transition-all
                ${!isCurrentMonth ? "text-gray-300" : isPast ? "text-gray-200 cursor-not-allowed" : "text-gray-700 hover:bg-gray-50"}
                ${isSelected ? "bg-gray-900 text-white hover:bg-gray-800 shadow-lg scale-105 z-10" : ""}
              `}
            >
              {format(day, "d")}
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

  const handleReservation = () => {
    if (!selectedTime) return;
    setIsSuccess(true);
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

                {/* Selected Summary & Action */}
                <div className="mt-auto pt-8 border-t border-gray-200">
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
                    disabled={!selectedTime || isSuccess}
                    onClick={handleReservation}
                    className={`
                      w-full py-5 rounded-2xl text-xs font-bold tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-3
                      ${selectedTime 
                        ? "bg-gray-900 text-white hover:bg-black shadow-xl" 
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"}
                    `}
                  >
                    {isSuccess ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Reserved Successfully</span>
                      </motion.div>
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
