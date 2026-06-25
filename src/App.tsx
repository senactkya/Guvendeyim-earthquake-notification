import { useState, useEffect } from 'react';
import { 
  MapPin, Phone, Backpack, Volume2, Users, Compass, 
  X, AlertCircle, CheckCircle, Activity, Info, BellRing, Sparkles
} from 'lucide-react';
import KandilliModal from './components/KandilliModal';
import LocationScreen from './components/LocationScreen';
import BagScreen from './components/BagScreen';
import SoundScreen from './components/SoundScreen';
import ContactsScreen from './components/ContactsScreen';
import FamilyPlanScreen from './components/FamilyPlanScreen';
import { Contact } from './types';

interface SystemLog {
  id: string;
  message: string;
  type: 'success' | 'warn' | 'info';
  timestamp: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'konum' | 'ses' | 'canta' | 'rehber' | 'plan'>('konum');
  const [showKandilli, setShowKandilli] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);

  // Function to push new visual feedback toasts/logs
  const addLog = (message: string, type: 'success' | 'warn' | 'info') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    const newLog: SystemLog = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: timeStr
    };
    
    // Maintain a rolling list of the most recent 3 notifications to avoid cluttering the screen
    setLogs(prev => [newLog, ...prev.slice(0, 2)]);
  };

  // Sync initial log
  useEffect(() => {
    addLog('GÜVENDEYİM Acil Asistanı başarıyla aktif hale getirildi.', 'info');
  }, []);

  const handleUpdateContacts = (updated: Contact[]) => {
    setContacts(updated);
  };

  const removeLog = (id: string) => {
    setLogs(prev => prev.filter(l => l.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center items-center text-slate-900 p-0 sm:p-4 select-none">
      
      {/* Immersive Mobile Device Frame Wrapper */}
      <div 
        id="app-device-frame"
        className="w-full max-w-md h-screen sm:h-[840px] bg-slate-50 relative flex flex-col overflow-hidden sm:rounded-[40px] sm:shadow-2xl sm:border-[8px] sm:border-slate-950"
      >
        {/* Phone Notch/Header Spacer on high-resolution displays */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-b-2xl z-50"></div>

        {/* Tactical Sticky Toast Notifications Banner list */}
        <div className="absolute top-[72px] inset-x-4 z-40 space-y-1.5 pointer-events-none">
          {logs.map((log, index) => {
            return (
              <div
                key={log.id}
                className={`p-3 rounded-xl border shadow-xl flex items-center justify-between text-[11px] font-semibold pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-300 ${
                  index > 0 ? 'scale-95 opacity-70 transition-all' : ''
                } ${
                  log.type === 'success'
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-250'
                    : log.type === 'warn'
                      ? 'bg-amber-50 text-amber-900 border-amber-250'
                      : 'bg-slate-900 text-white border-slate-950'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] opacity-60">[{log.timestamp}]</span>
                  <span>{log.message}</span>
                </div>
                <button 
                  onClick={() => removeLog(log.id)}
                  className="p-1 hover:bg-black/10 rounded-full text-slate-400 hover:text-slate-700 transition"
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Global Application Header */}
        <header className="sticky top-0 bg-white border-b border-slate-100 px-4 py-4.5 flex justify-between items-center z-30 shadow-xs shrink-0">
          <div className="flex items-center gap-2">
            <button 
              id="kandilli-trigger"
              onClick={() => {
                setShowKandilli(true);
                addLog('Kandilli Rasathanesi sismik akışı taranıyor...', 'info');
              }}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest animate-pulse transition shadow-sm"
            >
              <Activity size={12} /> KANDİLLİ
            </button>
          </div>

          <div className="text-center absolute left-1/2 -translate-x-1/2">
            <h1 className="text-sm font-black tracking-widest text-slate-900 uppercase">GÜVENDEYİM</h1>
            <p className="text-[8px] text-slate-400 font-extrabold tracking-widest">ACİL DURUM SİSTEMİ</p>
          </div>

          {/* Quick status bar */}
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
            <span className="text-[9px] text-emerald-700 font-black tracking-tight font-mono">ÇEVRİMİÇİ</span>
          </div>
        </header>

        {/* Main Interface Screen Container (Scrollable) */}
        <main className="flex-1 overflow-y-auto p-4 pb-24 bg-slate-50 relative">
          
          {/* Lazy Screen Switcher */}
          {activeTab === 'konum' && (
            <LocationScreen 
              onAddLog={addLog} 
              contactsToNotify={contacts} 
            />
          )}

          {activeTab === 'ses' && (
            <SoundScreen 
              onAddLog={addLog} 
            />
          )}

          {activeTab === 'canta' && (
            <BagScreen 
              onAddLog={addLog} 
            />
          )}

          {activeTab === 'rehber' && (
            <ContactsScreen 
              onAddLog={addLog} 
              onUpdateContacts={handleUpdateContacts} 
            />
          )}

          {activeTab === 'plan' && (
            <FamilyPlanScreen 
              onAddLog={addLog} 
            />
          )}

        </main>

        {/* Kandilli Live Feeds List Overlay View */}
        {showKandilli && (
          <KandilliModal onClose={() => setShowKandilli(false)} />
        )}

        {/* Tactile Lower Navigation Bar Menu */}
        <nav className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-100 flex justify-around p-2.5 z-30 shadow-lg select-none">
          
          <button 
            id="nav-tab-konum"
            onClick={() => {
              setActiveTab('konum');
              addLog('Konum ve eylem paneline geçildi.', 'info');
            }} 
            className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
              activeTab === 'konum' 
                ? 'text-red-600 bg-red-50/50 font-black' 
                : 'text-slate-400 hover:text-slate-650'
            }`}
          >
            <MapPin size={21} className={activeTab === 'konum' ? 'scale-110' : ''} />
            <span className="text-[9px] font-black mt-1 uppercase tracking-wider">Konum</span>
          </button>

          <button 
            id="nav-tab-ses"
            onClick={() => {
              setActiveTab('ses');
              addLog('Acil akustik düdük ekranı yüklendi.', 'info');
            }} 
            className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
              activeTab === 'ses' 
                ? 'text-red-600 bg-red-50/50 font-black' 
                : 'text-slate-400 hover:text-slate-650'
            }`}
          >
            <Volume2 size={21} className={activeTab === 'ses' ? 'scale-110' : ''} />
            <span className="text-[9px] font-black mt-1 uppercase tracking-wider">DÜDÜK</span>
          </button>

          <button 
            id="nav-tab-canta"
            onClick={() => {
              setActiveTab('canta');
              addLog('Afet çantası kontrol listesi açıldı.', 'info');
            }} 
            className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
              activeTab === 'canta' 
                ? 'text-red-600 bg-red-50/50 font-black' 
                : 'text-slate-400 hover:text-slate-650'
            }`}
          >
            <Backpack size={21} className={activeTab === 'canta' ? 'scale-110' : ''} />
            <span className="text-[9px] font-black mt-1 uppercase tracking-wider">Çanta</span>
          </button>

          <button 
            id="nav-tab-rehber"
            onClick={() => {
              setActiveTab('rehber');
              addLog('Acil durum rehber yöneticisi açıldı.', 'info');
            }} 
            className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
              activeTab === 'rehber' 
                ? 'text-red-600 bg-red-50/50 font-black' 
                : 'text-slate-400 hover:text-slate-650'
            }`}
          >
            <Users size={21} className={activeTab === 'rehber' ? 'scale-110' : ''} />
            <span className="text-[9px] font-black mt-1 uppercase tracking-wider">REHBER</span>
          </button>

          <button 
            id="nav-tab-plan"
            onClick={() => {
              setActiveTab('plan');
              addLog('Güvenli buluşma protokolleri yüklendi.', 'info');
            }} 
            className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
              activeTab === 'plan' 
                ? 'text-red-600 bg-red-50/50 font-black' 
                : 'text-slate-400 hover:text-slate-650'
            }`}
          >
            <Compass size={21} className={activeTab === 'plan' ? 'scale-110' : ''} />
            <span className="text-[9px] font-black mt-1 uppercase tracking-wider">Plan</span>
          </button>

        </nav>
      </div>
    </div>
  );
}
