import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, LogOut, CheckCircle, XCircle, Trash2, Calendar, 
  User, Phone, MessageSquare, Home as HomeIcon, LogIn,
  ShieldCheck, LayoutGrid, CalendarDays, Moon, ChevronLeft, ChevronRight
} from "lucide-react";
import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval,
  parseISO, isValid, addDays, startOfDay
} from "date-fns";
import { 
  db
} from "../lib/firebase";
import { 
  collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc
} from "firebase/firestore";

interface Reservation {
  id: string;
  name: string;
  phone: string;
  date: string;
  room: string;
  message: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: any;
}

export default function AdminDashboard({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [loginError, setLoginError] = useState("");
  
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginId === "asdf" && loginPw === "7777") {
      setIsAdmin(true);
      setLoginError("");
    } else {
      setLoginError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setLoginId("");
    setLoginPw("");
  };

  const ROOM_COLORS: Record<string, string> = {
    "Room 101": "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100",
    "Room 102": "bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100",
    "Room 201": "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100",
    "Room 202": "bg-teal-50 text-teal-700 border-teal-100 hover:bg-teal-100",
    "VIP Suite": "bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100",
  };

  useEffect(() => {
    if (isAdmin) {
      setLoading(true);
      const q = query(collection(db, "reservations"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Reservation[];
        setReservations(docs);
        setLoading(false);
      }, (error) => {
        console.error("Firestore access error:", error);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [isAdmin]);

  const handleStatusUpdate = async (id: string, status: 'confirmed' | 'cancelled') => {
    try {
      await updateDoc(doc(db, "reservations", id), { status });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("이 예약을 정말 삭제하시겠습니까?")) {
      try {
        await deleteDoc(doc(db, "reservations", id));
      } catch (error) {
        console.error("Error deleting reservation:", error);
      }
    }
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">{format(currentMonth, "MMMM yyyy")}</h3>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentMonth(prev => startOfMonth(new Date(prev.getFullYear(), prev.getMonth() - 1)))}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setCurrentMonth(new Date())}
              className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900"
            >
              Today
            </button>
            <button 
              onClick={() => setCurrentMonth(prev => startOfMonth(new Date(prev.getFullYear(), prev.getMonth() + 1)))}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="grid grid-cols-7 border-b border-gray-100">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="py-4 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {calendarDays.map((day, idx) => {
              const dayReservations = reservations.filter(res => {
                try {
                  const startDateStr = res.date.split(' ~ ')[0];
                  const startDate = parseISO(startDateStr);
                  
                  const nightsMatch = res.date.match(/\((\d+)박/);
                  const nights = nightsMatch ? parseInt(nightsMatch[1]) : 1;
                  
                  if (!isValid(startDate)) return false;
                  
                  // Show the reservation on the calendar for the number of nights
                  const displayEndDate = addDays(startDate, nights - 1);
                  
                  return isWithinInterval(startOfDay(day), { 
                    start: startOfDay(startDate), 
                    end: startOfDay(displayEndDate) 
                  });
                } catch (e) {
                  return false;
                }
              }).sort((a, b) => {
                const roomOrder = ["Room 101", "Room 102", "Room 201", "Room 202", "VIP Suite"];
                return roomOrder.indexOf(a.room) - roomOrder.indexOf(b.room);
              });

              return (
                <div 
                  key={idx} 
                  className={`min-h-[120px] p-2 border-r border-b border-gray-50 flex flex-col gap-1 transition-colors
                    ${!isSameMonth(day, monthStart) ? "bg-gray-50/30 text-gray-300" : "text-gray-700"}
                  `}
                >
                  <span className="text-[11px] font-medium ml-1 mb-1">{format(day, "d")}</span>
                  <div className="flex flex-col gap-1">
                    {dayReservations.map(res => {
                      const roomColorClass = ROOM_COLORS[res.room] || "bg-gray-100 text-gray-700 border-gray-200";
                      const isCancelled = res.status === 'cancelled';

                      return (
                        <div 
                          key={res.id} 
                          className={`px-2 py-1.5 rounded-lg text-[10px] font-bold truncate tracking-tight shadow-sm border transition-all
                            ${isCancelled ? 'bg-gray-100 text-gray-400 border-gray-200 line-through opacity-60' : roomColorClass}
                          `}
                          title={`${res.room} - ${res.name} (${res.status})`}
                        >
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1 h-1 rounded-full ${
                              res.status === 'confirmed' ? 'bg-green-500' : 
                              res.status === 'cancelled' ? 'bg-red-500' : 'bg-amber-500'
                            }`} />
                            <span className="truncate">{res.room.split(' ').pop()} - {res.name}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-6xl h-full max-h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-900 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-gray-900">관리자 대시보드</h2>
              <p className="text-xs text-gray-500 font-light uppercase tracking-wider">Lois Poolvilla Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm">
                <span className="text-sm font-medium text-gray-700">관리자님</span>
                <button onClick={handleLogout} className="p-1 hover:text-red-500 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
            </div>
          ) : !isAdmin ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-sm mx-auto">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                <LogIn className="w-10 h-10 text-gray-300" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">관리자 로그인</h3>
                <p className="text-sm text-gray-500 font-light">
                  관리자 전용 아이디와 비밀번호를 입력해 주세요.
                </p>
              </div>
              
              <form onSubmit={handleLogin} className="w-full space-y-3">
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">ID</label>
                  <input 
                    type="text" 
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 ring-gray-900/10 focus:bg-white transition-all outline-none text-sm"
                    placeholder="asdf"
                    required
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Password</label>
                  <input 
                    type="password" 
                    value={loginPw}
                    onChange={(e) => setLoginPw(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 ring-gray-900/10 focus:bg-white transition-all outline-none text-sm"
                    placeholder="****"
                    required
                  />
                </div>
                {loginError && <p className="text-xs text-red-500 font-medium">{loginError}</p>}
                <button 
                  type="submit"
                  className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-xs tracking-[0.3em] uppercase hover:bg-black transition-all shadow-lg shadow-gray-200"
                >
                  Login Admin
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">Total Reservations: {reservations.length}</h3>
                
                <div className="flex bg-white rounded-xl p-1 border border-gray-100 shadow-sm">
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all
                      ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-900'}
                    `}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    LIST
                  </button>
                  <button 
                    onClick={() => setViewMode('calendar')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all
                      ${viewMode === 'calendar' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-900'}
                    `}
                  >
                    <CalendarDays className="w-3.5 h-3.5" />
                    CALENDAR
                  </button>
                </div>
              </div>

              {viewMode === 'calendar' ? renderCalendar() : (
                <div className="grid gap-4">
                  {reservations.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                      <p className="text-gray-400 font-light italic">아직 접수된 예약 내역이 없습니다.</p>
                    </div>
                  ) : reservations.map((res) => {
                    // Extract stay duration if present (e.g., "(1박, 15:00)")
                    const nightsMatch = res.date.match(/\((\d+)박/);
                    const nights = nightsMatch ? nightsMatch[1] : null;

                    return (
                      <motion.div 
                        key={res.id}
                        layoutId={res.id}
                        className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
                      >
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-bold text-gray-300 tracking-widest flex items-center gap-1.5"><User className="w-3 h-3"/> Guest</span>
                            <span className="text-sm font-bold text-gray-900">{res.name}</span>
                            <span className="text-xs text-gray-500 font-mono">{res.phone}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-bold text-gray-300 tracking-widest flex items-center gap-1.5"><Calendar className="w-3 h-3"/> Stay Info</span>
                            <span className="text-sm font-bold text-gray-900">{res.date}</span>
                            <div className="flex items-center gap-2">
                              {nights && (
                                <span className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 text-[9px] font-bold text-gray-500 rounded uppercase tracking-wider">
                                  <Moon className="w-2.5 h-2.5" /> {nights}박
                                </span>
                              )}
                              <span className="text-[10px] text-gray-400 font-light">Requested {res.createdAt?.toDate().toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-bold text-gray-300 tracking-widest flex items-center gap-1.5"><HomeIcon className="w-3 h-3"/> Room</span>
                            <span className="text-sm font-bold text-gray-900">{res.room}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-bold text-gray-300 tracking-widest flex items-center gap-1.5 flex items-center gap-1.5"><MessageSquare className="w-3 h-3"/> Message</span>
                            <p className="text-xs text-gray-600 line-clamp-2 font-light">{res.message || "N/A"}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
                          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            res.status === 'confirmed' ? 'bg-green-50 text-green-600' : 
                            res.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {res.status}
                          </div>
                          <div className="h-8 w-px bg-gray-100 hidden md:block mx-2" />
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => handleStatusUpdate(res.id, 'confirmed')}
                              disabled={res.status === 'confirmed'}
                              className="p-2 hover:bg-green-50 text-gray-400 hover:text-green-500 transition-colors disabled:opacity-20"
                              title="승인"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(res.id, 'cancelled')}
                              disabled={res.status === 'cancelled'}
                              className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-20"
                              title="취소"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleDelete(res.id)}
                              className="p-2 hover:bg-gray-100 text-gray-300 hover:text-gray-900 transition-colors"
                              title="삭제"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
