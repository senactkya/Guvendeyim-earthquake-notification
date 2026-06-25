import { useState, useEffect } from 'react';
import { SafeMeetingPoint } from '../types';
import { Navigation, Edit, Save, MapPin, Compass, AlertCircle, ShieldCheck } from 'lucide-react';

interface FamilyPlanScreenProps {
  onAddLog: (message: string, type: 'success' | 'warn' | 'info') => void;
}

const DEFAULT_POINT: SafeMeetingPoint = {
  name: 'Atatürk Parkı Toplanma Alanı',
  address: 'Atatürk Caddesi, No: 42, Geniş Güvenli Yeşil Alan',
  coordinates: { lat: 38.4237, lng: 27.1428 },
  image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=400'
};

export default function FamilyPlanScreen({ onAddLog }: FamilyPlanScreenProps) {
  const [point, setPoint] = useState<SafeMeetingPoint>(DEFAULT_POINT);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAddress, setEditAddress] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('guvendeyim_meeting_point');
    if (saved) {
      try {
        setPoint(JSON.parse(saved));
      } catch (e) {
        setPoint(DEFAULT_POINT);
      }
    }
  }, []);

  const handleStartEdit = () => {
    setEditName(point.name);
    setEditAddress(point.address);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editName.trim()) {
      onAddLog('Toplanma alanı ismi boş olamaz.', 'warn');
      return;
    }

    const updated: SafeMeetingPoint = {
      ...point,
      name: editName.trim(),
      address: editAddress.trim() || 'Açık adres belirtilmedi.'
    };

    localStorage.setItem('guvendeyim_meeting_point', JSON.stringify(updated));
    setPoint(updated);
    setIsEditing(false);
    onAddLog('Aile afet buluşma noktası güncellendi.', 'success');
  };

  const handleGetDirections = () => {
    const query = encodeURIComponent(`${point.name} ${point.address}`);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${query}`, '_blank');
    onAddLog(`Buluşma noktası yol tarifi başlatıldı: ${point.name}`, 'info');
  };

  return (
    <div className="space-y-4">
      {/* Introduction */}
      <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-xs space-y-1.5 animate-fade-in">
        <h3 className="font-extrabold text-sm text-slate-950 flex items-center gap-2">
          <Compass className="text-red-650" size={18} />
          Aile Afet Toplanma Noktası
        </h3>
        <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
          Deprem anında şebeke kesintilerinde aile bireylerinizin karmaşa yaşamadan sığınacağı, binanızdan uzak, fiziki yıkılma riski olmayan geniş açık alanı planlayın.
        </p>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-slate-400/20 shadow-xs overflow-hidden">
        <div className="relative h-44 bg-slate-100">
          <img 
            src={point.image}
            className="w-full h-full object-cover brightness-95"
            alt={point.name}
          />
          <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold text-slate-200 border border-slate-800">
            GÜVENLİ BÖLGE
          </div>
        </div>

        <div className="p-4 space-y-4">
          {isEditing ? (
            <div className="space-y-2.5">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Alan Adı:</label>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder="Örn: Atatürk Parkı Geniş Güvenli Alan"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-red-500 text-xs font-semibold"
              />

              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Adres / Yol Tarifi Notu:</label>
              <textarea
                value={editAddress}
                onChange={e => setEditAddress(e.target.value)}
                placeholder="Örn: Barbaros Bulvarı yanı geniş açık çimenlik bölge"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-red-500 text-xs font-semibold h-16 resize-none"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-[11px] font-bold"
                >
                  Vazgeç
                </button>
                <button
                  onClick={handleSave}
                  className="w-2/3 bg-slate-900 hover:bg-slate-950 text-white py-2.5 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 uppercase"
                >
                  <Save size={13} /> Değişikliği Kaydet
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-slate-400">
                    <MapPin className="text-red-650" size={14} />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Planlanmış Koordinat</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-950">{point.name}</h4>
                  <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">{point.address}</p>
                </div>

                <button
                  onClick={handleStartEdit}
                  className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition text-slate-500"
                  title="PlanıDüzenle"
                >
                  <Edit size={14} />
                </button>
              </div>

              <button
                onClick={handleGetDirections}
                className="w-full flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-950 text-white py-3 rounded-xl font-black text-xs uppercase transition active:scale-95 border border-slate-850"
              >
                <Navigation size={14} /> HARİTADA GÖR & YOL TARİFİ
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Safety checklists */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-800 uppercase tracking-widest">
          <AlertCircle size={15} className="text-red-600" />
          <span>AFET BULUŞMA PROTOKOLÜ</span>
        </div>
        
        <div className="space-y-2 text-[10px] text-slate-600 font-semibold leading-relaxed">
          <div className="flex gap-2 items-start">
            <ShieldCheck className="text-green-600 shrink-0 mt-0.5" size={14} />
            <span>Sarsıntı anında evi terk etmeden önce varsa gaz vanası ve ana sigortaları hızlıca kapatın.</span>
          </div>
          <div className="flex gap-2 items-start">
            <ShieldCheck className="text-green-600 shrink-0 mt-0.5" size={14} />
            <span>Binadan tahliye olurken kesinlikle asansör kullanmayın. Çantanızı alıp merdivenlerden temkinli inin.</span>
          </div>
          <div className="flex gap-2 items-start">
            <ShieldCheck className="text-green-600 shrink-0 mt-0.5" size={14} />
            <span>Hücresel şebekeleri meşgul etmemek için internet tabanlı mesajlaşma ağlarını veya kısa SMS'leri tercih edin.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
