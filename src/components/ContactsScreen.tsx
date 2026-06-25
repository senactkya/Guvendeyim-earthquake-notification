import { useState, useEffect, FormEvent } from 'react';
import { Users, Trash2, Plus, PhoneCall, Heart, MessageSquare, ShieldAlert } from 'lucide-react';
import { Contact } from '../types';

interface ContactsScreenProps {
  onAddLog: (message: string, type: 'success' | 'warn' | 'info') => void;
  onUpdateContacts: (contacts: Contact[]) => void;
}

export default function ContactsScreen({ onAddLog, onUpdateContacts }: ContactsScreenProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('Aile');

  // Load and sync contacts to local storage and parent state.
  useEffect(() => {
    const saved = localStorage.getItem('guvendeyim_contacts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setContacts(parsed);
        onUpdateContacts(parsed);
      } catch (e) {
        setContacts([]);
      }
    } else {
      // Default initial contacts
      const initial: Contact[] = [
        { id: '1', name: 'Zeynep Yılmaz', phone: '05551112233', relation: 'Anne' },
        { id: '2', name: 'Ahmet Yılmaz', phone: '05554445566', relation: 'Baba' }
      ];
      setContacts(initial);
      onUpdateContacts(initial);
      localStorage.setItem('guvendeyim_contacts', JSON.stringify(initial));
    }
  }, []);

  const saveContacts = (updated: Contact[]) => {
    localStorage.setItem('guvendeyim_contacts', JSON.stringify(updated));
    setContacts(updated);
    onUpdateContacts(updated);
  };

  const handleCreateContact = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      onAddLog('İsim alanı boş bırakılamaz.', 'warn');
      return;
    }
    // Simple Turkish phone format validate or general number check
    const cleanedPhone = phone.replace(/\s+/g, '');
    if (!cleanedPhone || cleanedPhone.length < 10) {
      onAddLog('Lütfen geçerli bir telefon numarası girin (En az 10 haneli).', 'warn');
      return;
    }

    const n: Contact = {
      id: Date.now().toString(),
      name: name.trim(),
      phone: cleanedPhone,
      relation
    };

    const nextList = [...contacts, n];
    saveContacts(nextList);
    onAddLog(`Kişi başarıyla eklendi: ${n.name}`, 'success');
    
    // Clear forms
    setName('');
    setPhone('');
    setRelation('Aile');
  };

  const handleDelete = (id: string, contactName: string) => {
    const nextList = contacts.filter(c => c.id !== id);
    saveContacts(nextList);
    onAddLog(`${contactName} acil durum listesinden çıkarıldı.`, 'warn');
  };

  return (
    <div className="space-y-4">
      {/* Informative info block */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-1.5">
        <h3 className="font-extrabold text-sm text-slate-950 flex items-center gap-2">
          <Users size={18} className="text-red-650" />
          Acil Durum İletişim Rehberi
        </h3>
        <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
          Deprem ve benzeri afet anlarında tek tuşla ulaşabileceğiniz, durum raporu göndermek istediğiniz en fazla 10 yakınınızı listenize kaydedin.
        </p>
      </div>

      {/* Addition Form */}
      <form onSubmit={handleCreateContact} className="bg-white p-4 rounded-2xl border border-slate-400/20 shadow-xs space-y-3">
        <h4 className="font-extrabold text-[10px] text-slate-500 uppercase tracking-widest">Yeni Kişi Tanımlama</h4>
        
        <div className="grid grid-cols-2 gap-2.5">
          <input 
            type="text" 
            placeholder="İsim Soyisim" 
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-red-500 text-xs font-semibold"
          />

          <input 
            type="tel" 
            placeholder="05XX XXX XX XX" 
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-red-500 text-xs font-semibold"
          />
        </div>

        <div className="flex gap-2 items-center">
          <label className="text-[10px] font-bold text-slate-500 uppercase shrink-0">YAKINLIK DERECESİ:</label>
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
            {['Anne', 'Baba', 'Kardeş', 'Eş', 'Dost', 'Komşu'].map(rel => (
              <button
                key={rel}
                type="button"
                onClick={() => setRelation(rel)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition shrink-0 border ${
                  relation === rel
                    ? 'bg-slate-900 border-slate-950 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {rel}
              </button>
            ))}
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl font-black text-xs transition uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5"
        >
          <Plus size={14} /> ACİL YAKINI OLARAK EKLE
        </button>
      </form>

      {/* Saved contacts list */}
      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <h4 className="font-extrabold text-[10px] text-slate-500 uppercase tracking-widest">Acilde Aranacaklar ({contacts.length})</h4>
          {contacts.length === 0 && (
            <span className="text-[10px] text-amber-600 font-bold">Lütfen bir kişi tanımlayın!</span>
          )}
        </div>

        {contacts.map(c => (
          <div 
            key={c.id} 
            className="bg-white p-4 rounded-2xl flex justify-between items-center border border-slate-100 shadow-xs hover:border-slate-200 transition"
          >
            <div className="space-y-1 max-w-[65%]">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs text-slate-950">{c.name}</span>
                <span className="bg-red-50 text-red-700 font-black text-[9px] px-1.5 py-0.5 rounded-md uppercase">
                  {c.relation}
                </span>
              </div>
              <p className="text-slate-400 font-mono text-xs leading-none">{c.phone}</p>
            </div>

            {/* Calling trigger buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <a 
                href={`tel:${c.phone}`}
                onClick={() => onAddLog(`${c.name} aranıyor...`, 'info')}
                className="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl transition shadow-xs flex items-center justify-center"
                title={`${c.name} Ara`}
              >
                <PhoneCall size={16} />
              </a>
              <button 
                onClick={() => handleDelete(c.id, c.name)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                title="Sıl"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {contacts.length > 5 && (
        <div className="bg-amber-50 text-amber-900 p-2.5 rounded-xl text-[9px] font-semibold flex items-start gap-1.5">
          <ShieldAlert size={14} className="text-amber-500 shrink-0" />
          <span>Yoğunluk sebebiyle şebekede gecikmeler yaşanabilir, ses araması yerine öncelikli olarak SMS / veri tabanlı şablonları tercih edin.</span>
        </div>
      )}
    </div>
  );
}
