import { useState, useEffect } from 'react';
import { 
  CheckCircle, ShieldAlert, Heart, Calendar, 
  HelpCircle, Archive, Flame, Award, HeartPulse, Sparkles
} from 'lucide-react';
import { BagItem } from '../types';

interface BagScreenProps {
  onAddLog: (message: string, type: 'success' | 'warn' | 'info') => void;
}

const DEFAULT_ITEMS: BagItem[] = [
  { id: 'su', name: 'Su', category: 'vital', iconName: 'Flame', checked: false, turkishLabel: 'Su (3 Litre)', description: 'Kişi başı en az günlük 1.5 litre asgari tüketim su.' },
  { id: 'horn', name: 'Düdük', category: 'tactical', iconName: 'Archive', checked: false, turkishLabel: 'Ses Düdüğü', description: 'Enkaz altında kaldığınızda yüksek frekansta hayat kurtaran ses kaynağı.' },
  { id: 'flashlight', name: 'Fener', category: 'tactical', iconName: 'Archive', checked: false, turkishLabel: 'El Feneri', description: 'Şarjı uzun giden, su sızdırmaz pilli aydınlatma kaynağı.' },
  { id: 'canned', name: 'Konserve', category: 'vital', iconName: 'Flame', checked: false, turkishLabel: 'Konserve Gıda', description: 'Yüksek kalorili ve aç-bitir ambalajlı bozulmayan konserve gıdalar.' },
  { id: 'first_aid', name: 'İlkyardım', category: 'medical', iconName: 'HeartPulse', checked: false, turkishLabel: 'İlkyardım Çantası', description: 'Steril gazlı bezler, tentürdiyot, bandaj ve sargı bezleri.' },
  { id: 'radio', name: 'Radyo', category: 'tactical', iconName: 'Archive', checked: false, turkishLabel: 'Pilli Radyo', description: 'GSM hatlarının çöktüğü durumlarda acil durum duyurularını dinlemek üzere.' },
  { id: 'id_docs', name: 'Evraklar', category: 'vital', iconName: 'Flame', checked: false, turkishLabel: 'Kimlik Kimyeti', description: 'Nüfus cüzdanı, tapu, sigorta poliçesi kopyaları ve nakit para.' },
  { id: 'meds', name: 'İlaçlar', category: 'medical', iconName: 'HeartPulse', checked: false, turkishLabel: 'Reçeteli İlaçlar', description: 'Kronik rahatsızlıklarınız olması durumunda yedek reçeteli ilaçlar.' },
  { id: 'blanket', name: 'Battaniye', category: 'vital', iconName: 'Flame', checked: false, turkishLabel: 'Termal Battaniye', description: 'Hipotermi ve soğuğa karşı vücut ısısını maksimum seviyede tutan örtü.' }
];

export default function BagScreen({ onAddLog }: BagScreenProps) {
  const [items, setItems] = useState<BagItem[]>([]);
  const [showCongrats, setShowCongrats] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'vital' | 'tactical' | 'medical'>('all');

  // Load items from local storage
  useEffect(() => {
    const saved = localStorage.getItem('guvendeyim_bags');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Sync with any updates in structure just in case
        const merged = DEFAULT_ITEMS.map(def => {
          const match = parsed.find((p: any) => p.id === def.id);
          return match ? { ...def, checked: match.checked } : def;
        });
        setItems(merged);
      } catch (e) {
        setItems(DEFAULT_ITEMS);
      }
    } else {
      setItems(DEFAULT_ITEMS);
    }
  }, []);

  const saveItems = (updated: BagItem[]) => {
    localStorage.setItem('guvendeyim_bags', JSON.stringify(updated));
    setItems(updated);
  };

  const handleToggle = (id: string) => {
    const next = items.map(item => {
      if (item.id === id) {
        const nextChecked = !item.checked;
        if (nextChecked) {
          setShowCongrats(true);
          onAddLog(`Çantaya eklendi: ${item.turkishLabel}`, 'success');
          setTimeout(() => setShowCongrats(false), 1500);
        } else {
          onAddLog(`Çantadan çıkarıldı: ${item.turkishLabel}`, 'info');
        }
        return { ...item, checked: nextChecked };
      }
      return item;
    });
    saveItems(next);
  };

  const resetBag = () => {
    if (window.confirm('Afet Çantası ilerlemenizi sıfırlamak istiyor musunuz?')) {
      const reset = items.map(i => ({ ...i, checked: false }));
      saveItems(reset);
      onAddLog('Afet Çantası sıfırlandı.', 'warn');
    }
  };

  const checkedCount = items.filter(i => i.checked).length;
  const totalCount = items.length;
  const percent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  const filteredItems = items.filter(i => selectedCategory === 'all' || i.category === selectedCategory);

  return (
    <div className="space-y-4">
      {/* Dynamic Celebration Toast banner */}
      {showCongrats && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-slate-900 border-2 border-green-500 text-white px-5 py-2.5 rounded-2xl font-black text-xs shadow-2xl z-50 animate-bounce flex items-center gap-1.5 uppercase tracking-widest">
          <Sparkles className="text-yellow-400 animate-spin" size={16} />
          TEBRİKLER! 🎉
        </div>
      )}

      {/* Progress card header */}
      <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-xs space-y-3.5">
        <div className="flex justify-between items-end">
          <div className="space-y-0.5">
            <h3 className="font-extrabold text-sm text-slate-950">Afet Çantası Hazırlığı</h3>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">HAYATİ DESTEK EKİPMANLARI</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-500 mr-1.5">{checkedCount}/{totalCount} Öğe</span>
            <span className={`text-xl font-black font-mono leading-none ${percent === 100 ? 'text-green-600' : 'text-red-650'}`}>
              {percent}%
            </span>
          </div>
        </div>

        {/* Progress bar container */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-700 ease-out ${
              percent === 100 
                ? 'bg-green-600' 
                : percent > 60 
                  ? 'bg-emerald-500' 
                  : percent > 30 
                    ? 'bg-orange-500' 
                    : 'bg-red-600'
            }`} 
            style={{ width: `${percent}%` }}
          ></div>
        </div>

        {percent === 100 ? (
          <div className="bg-green-50 text-green-800 p-2.5 rounded-xl border border-green-200 flex gap-2 items-center text-[10px] font-bold">
            <Award className="text-green-600 shrink-0" size={16} />
            <span>Harika! Deprem çantanız %100 hazır durumda. Güvenliğiniz için her mevsim güncel tutun.</span>
          </div>
        ) : (
          <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
            Deprem sonrası ilk 72 saat, dış yardım ulaşana kadar kendinize yetebilmeniz hayati önem taşır. Lütfen eksiklerinizi tamamlayın.
          </p>
        )}
      </div>

      {/* Control filter options */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none text-[10px] font-bold">
        <div className="flex gap-1.5 shrink-0">
          {[
            { id: 'all', label: 'Tümü' },
            { id: 'vital', label: 'Temel' },
            { id: 'tactical', label: 'Hayatta Kalma' },
            { id: 'medical', label: 'Medikal' }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setSelectedCategory(opt.id as any)}
              className={`px-3 py-1.5 rounded-lg border transition ${
                selectedCategory === opt.id
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {checkedCount > 0 && (
          <button 
            onClick={resetBag}
            className="text-[10px] text-slate-400 hover:text-red-650 font-bold tracking-tight whitespace-nowrap"
          >
            Sıfırla
          </button>
        )}
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-2 gap-3">
        {filteredItems.map((item) => {
          return (
            <button
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={`p-4 rounded-2xl border-2 flex flex-col items-start text-left gap-2.5 transition active:scale-95 ${
                item.checked
                  ? 'border-green-600 bg-green-50/50 text-green-950'
                  : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                {/* Category specific icons */}
                <div className={`p-1.5 rounded-lg ${item.checked ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                  {item.category === 'vital' && <Heart size={15} />}
                  {item.category === 'tactical' && <Flame size={15} />}
                  {item.category === 'medical' && <HeartPulse size={15} />}
                </div>

                {/* Checkbox state */}
                <CheckCircle 
                  size={18} 
                  className={`transition-colors ${
                    item.checked ? 'text-green-650 fill-green-100' : 'text-slate-200'
                  }`} 
                />
              </div>

              <div className="space-y-0.5">
                <span className="font-extrabold text-xs tracking-tight uppercase leading-tight">
                  {item.turkishLabel}
                </span>
                <p className={`text-[10px] leading-relaxed line-clamp-2 ${item.checked ? 'text-green-800' : 'text-slate-400'}`}>
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Expiry alerts & guidelines */}
      <div className="bg-slate-105 p-4 rounded-r-2xl border-l-[3px] border-amber-500 text-[10px] space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Calendar className="text-amber-500" size={14} />
          <span className="font-black text-slate-800 uppercase tracking-wider">Periyodik Kontrol Hatırlatıcısı</span>
        </div>
        <p className="text-slate-600 leading-relaxed font-semibold">
          Çantanızdaki gıdaları ve pilleri **6 ayda bir** kontrol edin. Su tarihlerini ve son kullanma tarihlerini düzenli yenileriyle güncelleyin.
        </p>
      </div>
    </div>
  );
}
