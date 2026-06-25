import { useState, useEffect } from 'react';
import { X, Search, Activity, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Earthquake } from '../types';

interface KandilliModalProps {
  onClose: () => void;
}

export default function KandilliModal({ onClose }: KandilliModalProps) {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [minMagnitude, setMinMagnitude] = useState<number>(0);

  // High-fidelity fallback list representing realistic live earthquakes in Turkey
  const generateMockEarthquakes = (): Earthquake[] => {
    const locations = [
      { name: 'Marmara Denizi (İstanbul Açıkları)', lat: 40.85, lng: 28.52 },
      { name: 'Ege Denizi (Muğla Açıkları)', lat: 36.72, lng: 27.81 },
      { name: 'Kahramanmaraş (Pazarcık)', lat: 37.38, lng: 37.24 },
      { name: 'İzmir (Seferihisar)', lat: 38.01, lng: 26.85 },
      { name: 'Hatay (Defne)', lat: 36.12, lng: 36.14 },
      { name: 'Bingöl (Karlıova)', lat: 39.31, lng: 41.02 },
      { name: 'Çanakkale (Ayvacık)', lat: 39.54, lng: 26.21 },
      { name: 'Van (Tuşba)', lat: 38.64, lng: 43.37 },
      { name: 'Düzce (Gölyaka)', lat: 40.81, lng: 30.98 },
      { name: 'Malatya (Yeşilyurt)', lat: 38.29, lng: 38.25 },
      { name: 'Muğla (Bodrum)', lat: 36.98, lng: 27.42 },
      { name: 'Adana (Saimbeyli)', lat: 37.98, lng: 36.08 },
    ];

    const list: Earthquake[] = [];
    const now = new Date();

    for (let i = 0; i < 20; i++) {
      const loc = locations[i % locations.length];
      const magnitude = +(3.0 + Math.random() * 2.8).toFixed(1);
      const depth = +(4.2 + Math.random() * 12.5).toFixed(1);
      
      const quakeTime = new Date(now.getTime() - i * (12 * 60 * 1000 + Math.random() * 50 * 60 * 1000));
      const hours = String(quakeTime.getHours()).padStart(2, '0');
      const minutes = String(quakeTime.getMinutes()).padStart(2, '0');
      const seconds = String(quakeTime.getSeconds()).padStart(2, '0');
      const timeStr = `${hours}:${minutes}:${seconds}`;
      const dateStr = quakeTime.toLocaleDateString('tr-TR');

      list.push({
        title: `${loc.name} Depremi`,
        date: dateStr,
        time: timeStr,
        depth,
        magnitude,
        location: loc.name,
        latitude: +(loc.lat + (Math.random() - 0.5) * 0.1).toFixed(4),
        longitude: +(loc.lng + (Math.random() - 0.5) * 0.1).toFixed(4)
      });
    }

    // Sort by chronological order (most recent first)
    return list;
  };

  const fetchLiveEarthquakes = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // Free public earthquake API with direct secure endpoints
      const res = await fetch('https://api.orhanaydogdu.com.tr/deprem/kandilli/live');
      if (!res.ok) throw new Error('Sunucu hatası veya geçici kesinti.');
      
      const json = await res.json();
      if (json.status && Array.isArray(json.result)) {
        const mapped: Earthquake[] = json.result.slice(0, 30).map((q: any) => ({
          title: q.title,
          date: q.date,
          time: q.lokasyon.includes('(') ? q.date.split(' ')[1] : q.time, // Fallback if format differs
          depth: q.depth || q.derinlik,
          magnitude: q.mag || q.mag,
          location: q.title,
          latitude: q.geojson?.coordinates?.[1] || q.lat || 0,
          longitude: q.geojson?.coordinates?.[0] || q.lng || 0
        }));
        
        // Sometimes time parsing is needed, we map carefully
        const finalized = mapped.map((item, idx) => {
          if (!item.time || item.time.length < 5) {
            const parts = json.result[idx].date ? json.result[idx].date.split(' ') : [];
            item.time = parts[1] || '00:00:00';
            item.date = parts[0] || item.date;
          }
          return item;
        });

        if (finalized.length > 0) {
          setEarthquakes(finalized);
          return;
        }
      }
      throw new Error('Geçersiz veri modeli.');
    } catch (err: any) {
      console.warn('CORS or Network problem reading Live Kandilli API. Loading smart fallbacks.', err);
      // Fallback is local high-fidelity generator
      setEarthquakes(generateMockEarthquakes());
      setErrorMsg('Gerçek zamanlı sunucu bağlantısı kurulamadı. Çevrimdışı/Simüle edilmiş Kandilli verileri yüklenmiştir.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveEarthquakes();
  }, []);

  const filteredEarthquakes = earthquakes.filter((eq) => {
    const matchesSearch = eq.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMag = eq.magnitude >= minMagnitude;
    return matchesSearch && matchesMag;
  });

  return (
    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex flex-col justify-end">
      <div 
        id="kandilli-modal-panel"
        className="bg-white rounded-t-3xl max-h-[90%] flex flex-col overflow-hidden shadow-2xl transition-all duration-300"
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-red-50 text-red-950 relative">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></div>
            <div>
              <h2 className="font-extrabold text-sm tracking-tight text-slate-950">KANDİLLİ SİSMİK VERİ</h2>
              <p className="text-[10px] text-slate-500 font-medium">T.C. Kandilli Rasathanesi Gözlem Evi Akışı</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button 
              onClick={fetchLiveEarthquakes}
              className="p-1.5 hover:bg-red-150 rounded-full transition text-slate-700"
              title="Yenile"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
            <button 
              id="close-kandilli-modal"
              onClick={onClose} 
              className="p-1.5 bg-white/70 hover:bg-white rounded-full transition shadow-sm text-slate-800"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 space-y-2.5">
          {/* Magnitudes filters */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Minimum Şiddet:</span>
            <div className="flex gap-1">
              {[0, 3.0, 4.0, 5.0].map((mag) => (
                <button
                  key={mag}
                  onClick={() => setMinMagnitude(mag)}
                  className={`px-3 py-1 rounded-full text-[10px] transition font-bold border ${
                    minMagnitude === mag
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {mag === 0 ? 'Tümü' : `${mag.toFixed(1)}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Şehir / Bölge ara... (Örn: İzmir)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-white rounded-lg border border-slate-200 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-red-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 text-xs hover:text-slate-600 font-bold"
              >
                Temizle
              </button>
            )}
          </div>
        </div>

        {/* Dynamic warning if offline/fallback loaded */}
        {errorMsg && (
          <div className="mx-4 mt-3 bg-amber-50 text-amber-800 text-[11px] p-2 rounded-lg border border-amber-200 flex gap-2 items-start font-medium">
            <AlertTriangle className="text-amber-500 shrink-0" size={14} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Earthquake List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <Activity className="text-red-500 animate-pulse" size={32} />
              <p className="text-xs text-slate-500 font-bold">Kandilli sistemi taranıyor...</p>
            </div>
          ) : filteredEarthquakes.length === 0 ? (
            <div className="text-center py-16">
              <ShieldCheck className="mx-auto text-slate-300 mb-2" size={24} />
              <p className="text-xs text-slate-500 font-bold">Aranan kriterlerde deprem bulunamadı.</p>
            </div>
          ) : (
            filteredEarthquakes.map((eq, idx) => {
              const isMajor = eq.magnitude >= 4.5;
              const isModerate = eq.magnitude >= 3.5 && eq.magnitude < 4.5;

              return (
                <div 
                  key={idx}
                  className={`p-3 rounded-xl border flex justify-between items-center transition ${
                    isMajor 
                      ? 'border-red-200 bg-red-50/50' 
                      : isModerate 
                        ? 'border-orange-100 bg-orange-50/30' 
                        : 'border-slate-100 bg-white'
                  }`}
                >
                  <div className="space-y-1 max-w-[78%]">
                    <h4 className="font-extrabold text-xs text-slate-950 truncate uppercase leading-tight">
                      {eq.location}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] text-slate-500 font-medium">
                      <span className="font-mono text-slate-700 font-semibold">{eq.date} {eq.time}</span>
                      <span>•</span>
                      <span>Derinlik: <strong className="font-mono text-slate-700">{eq.depth} km</strong></span>
                      <span>•</span>
                      <span className="text-slate-400 font-mono">📍 {eq.latitude}, {eq.longitude}</span>
                    </div>
                  </div>

                  {/* Rating indicator */}
                  <div className="text-right shrink-0">
                    <div 
                      className={`text-sm font-black px-2.5 py-1 rounded-lg border tracking-tighter ${
                        isMajor
                          ? 'bg-red-600 text-white border-red-700 shadow-xs'
                          : isModerate
                            ? 'bg-orange-500 text-white border-orange-600'
                            : 'bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      {eq.magnitude.toFixed(1)} Mw
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info banner */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 text-center font-medium">
          Dirençli toplum kuralları gereği, 4.0 ve üzeri sarsıntılarda panik yapmadan güvenli toplanma alanlarına hazırlanın.
        </div>
      </div>
    </div>
  );
}
