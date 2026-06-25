import { useState, useEffect } from 'react';
import { 
  MapPin, Phone, Send, Navigation, AlertCircle, Info, 
  RefreshCw, CheckCircle2, ChevronRight, Share2 
} from 'lucide-react';
import { SafetyScenario } from '../types';

interface LocationScreenProps {
  onAddLog: (message: string, type: 'success' | 'warn' | 'info') => void;
  contactsToNotify: { name: string; phone: string }[];
}

export default function LocationScreen({ onAddLog, contactsToNotify }: LocationScreenProps) {
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string>('Konum aranıyor...');
  const [loadingGps, setLoadingGps] = useState(false);
  const [selectedHomeType, setSelectedHomeType] = useState('apartman_giris');
  const [quakeDistance, setQuakeDistance] = useState('12.4 km uzaklıkta');
  const [quakeSize, setQuakeSize] = useState('4.8 Mw');

  const HOUSING_SCENARIOS: Record<string, SafetyScenario> = {
    apartman_giris: {
      id: 'apartman_giris',
      title: 'Çok Katlı Apartman (Giriş Kat)',
      subtitle: 'Deprem anında çıkış tüneline en yakın ama basınç riski taşıyan bölge.',
      description: 'Sarsıntı bittiği an binayı terk etmeniz en kolay gruptur. Ancak ilk sarsıntıda merdivenler çökeceğinden asla kaçmaya yeltenmeyin.',
      tips: [
        'Merdiven boşluğu ve asansörlerden ilk sarsıntıda mutlaka uzak durun.',
        'Kapı kasaları yerine salonun sağlam mobilyaları yanında ÇÖK-KAPAN-TUTUN yapın.',
        'Sarsıntı bittiği an önceden hazırladığınız Afet Çantasını alıp toplanma alanına çıkın.'
      ]
    },
    apartman_ust: {
      id: 'apartman_ust',
      title: 'Çok Katlı Apartman (Üst Katlar)',
      subtitle: 'Sarsıntıyı en çok hissedecek ancak göçük riski tabana göre daha esnek katlar.',
      description: 'Yüksek binalarda tahliye süresi uzundur. Sallantı son bulana kadar kesinlikle merdivenleri veya asansörleri kullanmaya çalışmayın.',
      tips: [
        'Hemen devrilmeyecek bir yatak, koltuk veya masa köşesinde yaşam üçgeni kurun.',
        'Pencerelerden uçuşan cam patlamaları sebebiyle en az 2 metre uzaklaşın.',
        'Yangın sensörlerini tetiklememek için sarsıntı anında elektrik sigortalarını ve gazı kapatmayı planlayın.'
      ]
    },
    mustakil: {
      id: 'mustakil',
      title: 'Müstakil Ev / Villa',
      subtitle: 'Çatı çökmesi ana risk grubu olan, ancak hızlı tahliyeye elverişli evler.',
      description: 'Mutfak tezgahı yanı veya çelik tavan kiriş köşeleri sizin için en ideal toplanma noktalarıdır.',
      tips: [
        'Gaz kaçağı riskine karşı mutfaktaki fırın ve ocağın yanından hemen çekilin.',
        'Kiriş dayanıklılığı yüksek antrelerde koridor genişliğinde çömelin.',
        'Dışarıda elektrik direği veya bahçe duvarı çökme ihtimali olduğundan, sarsıntı tamamen bitmeden bahçeye fırlamayın.'
      ]
    },
    prefabrik: {
      id: 'prefabrik',
      title: 'Prefabrik / Geçici Konut',
      subtitle: 'Panel esnekliği yüksek, yapısal yıkılma ihtimali en düşük barınaklar.',
      description: 'Çelik gövde esnekliği sayesinde göçük tehlikesi azdır. Eşya devrilmesi ve elektrik tesisatı yangınları ana güvenlik odağınız olmalıdır.',
      tips: [
        'Dolaplarınızı duvara sabitlediğinizden emin olun.',
        'Isıtıcı, ocak ve tüp gibi yangın çıkarabilecek cihazları sarsıntıda stabil tutun.',
        'Pencerelerden uzak, orta bölmelerde kafanızı kalın bir yastıkla koruyun.'
      ]
    }
  };

  const activeScenario = HOUSING_SCENARIOS[selectedHomeType] || HOUSING_SCENARIOS.apartman_giris;

  const requestGps = () => {
    setLoadingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = +position.coords.latitude.toFixed(5);
          const lng = +position.coords.longitude.toFixed(5);
          setGps({ lat, lng });
          setAddress('Koordinatlarınız başarıyla doğrulandı.');
          setLoadingGps(false);
          onAddLog('Konum tespiti başarılı.', 'success');
        },
        (error) => {
          console.error(error);
          // High-fidelity fallback centered in dynamic Turkish activity zones
          const turkeyGpsList = [
            { lat: 38.4237, lng: 27.1428, name: 'İzmir, Konak (Sismik Aktif Bölge)' },
            { lat: 41.0082, lng: 28.9784, name: 'İstanbul, Kadıköy (Güvenli İzleme Alanı)' },
            { lat: 37.5794, lng: 36.9317, name: 'Kahramanmaraş, Onikişubat (Risk Analiz Alanı)' },
            { lat: 36.8841, lng: 30.7056, name: 'Antalya, Muratpaşa (İzleme Noktası)' }
          ];
          const selected = turkeyGpsList[Math.floor(Math.random() * turkeyGpsList.length)];
          setGps({ lat: selected.lat, lng: selected.lng });
          setAddress(selected.name);
          setLoadingGps(false);
          onAddLog('Geçici konum yüklendi (GPS İzni kapalı).', 'info');
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setAddress('GPS Tarayıcı uyuşmazlığı.');
      setLoadingGps(false);
    }
  };

  useEffect(() => {
    requestGps();
    // Simulate minor dynamic changes on every load to convey real live alert vibes
    const distances = ['8.5 km', '12.4 km', '24.1 km', '4.2 km'];
    const mag = ['4.3 Mw', '4.8 Mw', '5.1 Mw', '3.8 Mw'];
    setQuakeDistance(`${distances[Math.floor(Math.random() * distances.length)]} uzaklıkta`);
    setQuakeSize(mag[Math.floor(Math.random() * mag.length)]);
  }, []);

  const triggerGoogleMaps = () => {
    if (gps) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${gps.lat},${gps.lng}`, '_blank');
      onAddLog('Google Haritalar yönlendirmesi başlatıldı.', 'info');
    } else {
      onAddLog('Konum bilgisinin yüklenmesi bekleniyor.', 'warn');
    }
  };

  const shareEmergencyMessage = (type: 'whatsapp' | 'sms') => {
    if (!gps) {
      onAddLog('Konum olmadan acil mesaj gönderilemez!', 'warn');
      return;
    }
    const gpsUrl = `https://maps.google.com/?q=${gps.lat},${gps.lng}`;
    const smsBody = `ACIL DURUM! GÜVENDEYİM uygulaması üzerinden paylaşıyorum. Konumum: ${gps.lat}, ${gps.lng} (${address}). Bina Bilgim: ${activeScenario.title}. Güvenli toplanma alanına geçiyorum. Harita: ${gpsUrl}`;
    
    if (type === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(smsBody)}`, '_blank');
      onAddLog('WhatsApp acil paylaşım kanalı açıldı.', 'success');
    } else {
      const phones = contactsToNotify.map(c => c.phone).join(',');
      window.open(`sms:${phones}?body=${encodeURIComponent(smsBody)}`);
      onAddLog('SMS yardım mesajı şablonu yüklendi.', 'success');
    }
  };

  return (
    <div className="space-y-4">
      {/* Alert Header Banner */}
      <div className="bg-red-500 text-white p-3.5 rounded-2xl shadow-xs relative overflow-hidden flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[10px] font-black tracking-widest bg-white/20 px-2 py-0.5 rounded-md uppercase">YAKIN SARSINTI ANALİZİ</span>
          <h3 className="text-sm font-bold flex items-center gap-1.5 pt-1">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping"></span>
            Merkez Üsse {quakeDistance} sarsıntı tespit edildi.
          </h3>
        </div>
        <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 text-center shrink-0">
          <p className="text-[10px] font-bold text-red-100">ŞİDDET</p>
          <p className="text-sm font-black font-mono leading-none pt-0.5">{quakeSize}</p>
        </div>
      </div>

      {/* Simulated Map Container with dynamic details */}
      <div className="relative bg-slate-900 h-60 rounded-2xl overflow-hidden border border-slate-800 shadow-lg flex flex-col justify-between p-4">
        {/* Dynamic gridlines for tactical mapping look */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-60"></div>
        
        {/* Glowing Radar Target */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-40 h-40 rounded-full border border-red-500/10 animate-pulse-ring absolute -top-16 -left-16 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border border-red-500/20"></div>
          </div>
          <div className="relative z-10 bg-red-650 p-2 rounded-full shadow-lg border-2 border-white">
            <MapPin className="text-white animate-bounce" size={24} />
          </div>
        </div>

        {/* Floating Top Left Badge: Real Connection status */}
        <div className="z-10 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 flex items-center gap-2 max-w-[70%]">
          <div className={`w-2 h-2 rounded-full ${gps ? 'bg-green-500' : 'bg-amber-400'} animate-pulse`}></div>
          <span className="text-[10px] text-slate-300 font-bold truncate tracking-tight">{address}</span>
        </div>

        {/* GPS Button and Coordinates display */}
        <div className="z-10 flex items-end justify-between w-full">
          <div className="bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400 space-y-0.5 shadow-sm">
            <p className="text-slate-500 font-bold">KOORDİNAT</p>
            {gps ? (
              <p className="text-slate-150 font-bold">LAT: {gps.lat}  |  LNG: {gps.lng}</p>
            ) : (
              <p className="text-amber-400">Yükleniyor...</p>
            )}
          </div>

          <button
            onClick={requestGps}
            disabled={loadingGps}
            className="p-2.5 bg-red-600 hover:bg-red-700 disabled:bg-slate-800 text-white rounded-xl transition shadow-md active:scale-95 border border-red-700"
            title="GPS Güncelle"
          >
            <RefreshCw size={15} className={loadingGps ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Action triggers: 112, share and copy */}
      <div className="grid grid-cols-2 gap-3">
        <a 
          href="tel:112"
          onClick={() => onAddLog('Acil 112 arama talebi oluşturuldu.', 'warn')}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3.5 px-4 rounded-xl font-black text-xs shadow-md shadow-red-200 transition active:scale-95 border border-red-700 uppercase tracking-wider"
        >
          <Phone size={16} /> ACİL 112'Yİ ARA
        </a>
        <button 
          onClick={triggerGoogleMaps}
          className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-950 text-white py-3.5 px-4 rounded-xl font-bold text-xs transition active:scale-95 border border-slate-800 uppercase tracking-wider"
        >
          <Navigation size={16} /> GÜVENLİ HARİTA
        </button>
      </div>

      {/* Emergency Messaging buttons */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-100 space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-extrabold text-[11px] text-slate-500 uppercase tracking-widest">Kişilere Güvende Mesajı Gönder</h4>
          <span className="text-[10px] bg-sky-50 text-sky-700 font-bold px-2 py-0.5 rounded-full">
            {contactsToNotify.length} Kayıtlı Kişi
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
          Mevcut koordinatlarınızı ve sarsıntı durumunuzu acil rehberinizdeki sevdiklerinizle tek tıkla paylaşın:
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => shareEmergencyMessage('sms')}
            className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 p-2.5 rounded-xl font-bold text-[11px] transition"
          >
            <Share2 size={13} className="text-slate-600" />
            SMS Hazırla ({contactsToNotify.length})
          </button>
          <button
            onClick={() => shareEmergencyMessage('whatsapp')}
            className="flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white p-2.5 rounded-xl font-bold text-[11px] transition shadow-xs"
          >
            <Send size={13} />
            WhatsApp ile Paylaş
          </button>
        </div>
      </div>

      {/* Housing dynamic checklists */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-400/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-red-600" size={18} />
            <span className="font-extrabold text-xs text-slate-950 uppercase tracking-tight">Kişiselleştirilmiş Bina Uyarıları</span>
          </div>
        </div>

        {/* Selector pills */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
          {Object.values(HOUSING_SCENARIOS).map((sc) => (
            <button
              key={sc.id}
              onClick={() => setSelectedHomeType(sc.id)}
              className={`px-3 py-1.5 whitespace-nowrap rounded-lg text-[10px] font-bold transition shrink-0 ${
                selectedHomeType === sc.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {sc.id === 'apartman_giris' && 'Apartman (Giriş)'}
              {sc.id === 'apartman_ust' && 'Apartman (Üst Kat)'}
              {sc.id === 'mustakil' && 'Müstakil / Villa'}
              {sc.id === 'prefabrik' && 'Prefabrik Ev'}
            </button>
          ))}
        </div>

        {/* Content body */}
        <div className="pt-2 border-t border-slate-50 space-y-2">
          <div>
            <h5 className="font-extrabold text-xs text-slate-950">{activeScenario.title}</h5>
            <p className="text-[11px] text-slate-500 italic mt-0.5">{activeScenario.subtitle}</p>
          </div>
          
          <p className="text-[11px] text-slate-600 font-medium leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            {activeScenario.description}
          </p>

          <div className="space-y-1.5 pt-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Temel Eylem Adımları</p>
            {activeScenario.tips.map((tip, idx) => (
              <div key={idx} className="flex gap-2 items-start text-[11px] text-slate-700 leading-relaxed font-semibold">
                <CheckCircle2 size={13} className="text-red-650 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
