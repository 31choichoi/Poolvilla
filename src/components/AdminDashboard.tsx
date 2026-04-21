import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, LogOut, CheckCircle, XCircle, Trash2, Calendar, 
  User, Phone, MessageSquare, Home as HomeIcon, LogIn,
  ShieldCheck
} from "lucide-react";
import { 
  auth, db, loginWithGoogle, logout 
} from "../lib/firebase";
import { 
  onAuthStateChanged, User as FirebaseUser 
} from "firebase/auth";
import { 
  collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, getDoc
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
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check if user is an admin in Firestore OR matches the predefined admin email
        const adminDoc = await getDoc(doc(db, "admins", currentUser.uid));
        const isHardcodedAdmin = currentUser.email === "31choichoi@gmail.com";
        setIsAdmin(adminDoc.exists() || isHardcodedAdmin);
        setLoading(false);
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && isAdmin) {
      const q = query(collection(db, "reservations"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Reservation[];
        setReservations(docs);
      });
      return () => unsubscribe();
    }
  }, [user, isAdmin]);

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
            {user && (
              <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm">
                <img src={user.photoURL || ""} alt="" className="w-6 h-6 rounded-full" />
                <span className="text-sm font-medium text-gray-700">{user.displayName}</span>
                <button onClick={logout} className="p-1 hover:text-red-500 transition-colors">
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
          ) : !user ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                <LogIn className="w-10 h-10 text-gray-300" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">관리자 로그인</h3>
                <p className="text-sm text-gray-500 font-light max-w-sm mx-auto">
                  관리자 계정으로 로그인하여 예약 내역을 확인해 주세요.
                </p>
              </div>
              <button 
                onClick={loginWithGoogle}
                className="flex items-center gap-3 px-8 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition-all"
              >
                Google 계정으로 로그인
              </button>
            </div>
          ) : !isAdmin ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <XCircle className="w-16 h-16 text-red-100" />
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">접근 권한 없음</h3>
                <p className="text-sm text-gray-500 font-light">
                  해당 계정({user.email})은 관리자 권한이 없습니다. <br />
                  관리자 등록을 위해 시스템 담당자에게 문의해 주세요.
                </p>
              </div>
              <button onClick={logout} className="text-sm font-medium text-gray-900 underline underline-offset-4">로그아웃</button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">Total Reservations: {reservations.length}</h3>
              </div>
              
              <div className="grid gap-4">
                {reservations.length === 0 ? (
                  <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                    <p className="text-gray-400 font-light italic">아직 접수된 예약 내역이 없습니다.</p>
                  </div>
                ) : reservations.map((res) => (
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
                        <span className="text-[10px] uppercase font-bold text-gray-300 tracking-widest flex items-center gap-1.5"><Calendar className="w-3 h-3"/> Stay Date</span>
                        <span className="text-sm font-bold text-gray-900">{res.date}</span>
                        <span className="text-[10px] text-gray-400 font-light">Requested at {res.createdAt?.toDate().toLocaleDateString()}</span>
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
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
