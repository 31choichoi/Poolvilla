import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, User, Phone, Home, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { createReservation } from "../lib/firebase";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROOM_OPTIONS = ["101호", "102호", "201호", "202호", "VIP Suite"];

export default function ReservationModal({ isOpen, onClose }: ReservationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    room: "101호",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      await createReservation(formData);
      setStatus("success");
      setTimeout(() => {
        onClose();
        setStatus("idle");
        setFormData({ name: "", phone: "", date: "", room: "101호", message: "" });
      }, 3000);
    } catch (error) {
      console.error("Reservation error:", error);
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl z-[101] overflow-hidden"
          >
            <div className="relative p-8 md:p-12">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-light tracking-tight text-gray-900 mb-2 uppercase">RESERVATION</h2>
                <p className="text-sm text-gray-500 font-light">
                  로이스 풀빌라 예약을 위한 정보를 입력해 주세요.
                </p>
              </div>

              {status === "success" ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-12 flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">예약 요청 완료</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    예약 요청이 정상적으로 접수되었습니다.<br />
                    관리자가 확인 후 빠르게 연락드리겠습니다.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] uppercase tracking-widest text-gray-400 flex items-center gap-2">
                        <User className="w-3 h-3" /> Name
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="성함"
                        className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:ring-1 focus:ring-gray-200 border rounded-xl text-sm transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] uppercase tracking-widest text-gray-400 flex items-center gap-2">
                        <Phone className="w-3 h-3" /> Phone
                      </label>
                      <input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="연락처 (010-0000-0000)"
                        className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:ring-1 focus:ring-gray-200 border rounded-xl text-sm transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] uppercase tracking-widest text-gray-400 flex items-center gap-2">
                        <Calendar className="w-3 h-3" /> Date
                      </label>
                      <input
                        required
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:ring-1 focus:ring-gray-200 border rounded-xl text-sm transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] uppercase tracking-widest text-gray-400 flex items-center gap-2">
                        <Home className="w-3 h-3" /> Room
                      </label>
                      <select
                        required
                        value={formData.room}
                        onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:ring-1 focus:ring-gray-200 border rounded-xl text-sm transition-all outline-none appearance-none"
                      >
                        {ROOM_OPTIONS.map(room => (
                          <option key={room} value={room}>{room}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] uppercase tracking-widest text-gray-400 flex items-center gap-2">
                      <MessageSquare className="w-3 h-3" /> Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="추가 요청 사항을 입력해 주세요."
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:ring-1 focus:ring-gray-200 border rounded-xl text-sm transition-all outline-none resize-none"
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-xs text-red-500 text-center">
                      예약 처리 중 오류가 발생했습니다. 다시 시도해 주세요.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-gray-900 text-white rounded-xl py-4 font-medium tracking-widest uppercase hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {status === "loading" ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>예약 신청하기</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
