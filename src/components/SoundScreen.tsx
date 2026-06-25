import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, AlertOctagon, HelpCircle, Activity } from 'lucide-react';

interface SoundScreenProps {
  onAddLog: (message: string, type: 'success' | 'warn' | 'info') => void;
}

export default function SoundScreen({ onAddLog }: SoundScreenProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundMode, setSoundMode] = useState<'whistle' | 'siren' | 'canine'>('whistle');
  const [volume, setVolume] = useState<number>(0.8);
  const [vibrateOn, setVibrateOn] = useState<boolean>(true);

  // Web Audio Context & nodes references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const currentOscillators = useRef<any[]>([]);
  const lfoNodeRef = useRef<OscillatorNode | null>(null);
  const vibrationInterval = useRef<any>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtxClass();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const startSound = () => {
    initAudio();
    const ctx = audioCtxRef.current!;
    
    // Stop any active node just in case
    stopSound();

    // Create Main gain node to control final output volume
    const mainGain = ctx.createGain();
    mainGain.gain.setValueAtTime(volume, ctx.currentTime);
    mainGain.connect(ctx.destination);
    gainNodeRef.current = mainGain;

    if (soundMode === 'whistle') {
      // 1. DÜDÜK (REF WHISTLE) - High-pitch dual frequencies + amplitude/vibrato modulation
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      
      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.5, ctx.currentTime);

      osc1.type = 'triangle';
      osc2.type = 'sine';

      // Precise sporty whistle frequencies
      osc1.frequency.setValueAtTime(1250, ctx.currentTime);
      osc2.frequency.setValueAtTime(1285, ctx.currentTime);

      // Low frequency oscillator (LFO) to create the fast 'trill' or 'warble' amplitude flutter (15Hz)
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      
      lfo.frequency.setValueAtTime(15, ctx.currentTime); // 15 Hz fluttering rate
      lfoGain.gain.setValueAtTime(0.4, ctx.currentTime); // depth of modulation
      
      // Connect nodes
      lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain); // modulates primary output amplitude

      osc1.connect(oscGain);
      osc2.connect(oscGain);
      oscGain.connect(mainGain);

      // Start all nodes
      lfo.start();
      osc1.start();
      osc2.start();

      currentOscillators.current = [osc1, osc2];
      lfoNodeRef.current = lfo;
      onAddLog('ACİL durum düdüğü başlatıldı.', 'success');

    } else if (soundMode === 'canine') {
      // 2. KÖPEK ULTRASONİK BEACON - 12kHz Tone (highly receptive to search dog hearing, barely audible to adults)
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(12000, ctx.currentTime); // 12,000 Hertz

      // Pulse the sound slightly to conserve attention
      const pulseLfo = ctx.createOscillator();
      const pulseGain = ctx.createGain();
      
      pulseLfo.type = 'sawtooth';
      pulseLfo.frequency.setValueAtTime(2, ctx.currentTime); // 2 pulses per second
      pulseGain.gain.setValueAtTime(0.3, ctx.currentTime);

      pulseLfo.connect(pulseGain);
      pulseGain.connect(mainGain.gain);

      osc.connect(mainGain);
      
      pulseLfo.start();
      osc.start();

      currentOscillators.current = [osc];
      lfoNodeRef.current = pulseLfo;
      onAddLog('Arama köpeği ultrasonik dalgası yayında.', 'warn');

    } else {
      // 3. AMBULANS / SİREN - Continuous sweeping frequencies (pitch sweeps back and forth)
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);

      // Sweep the oscillator frequency dynamically using a linear ramp in an interval
      const intervalId = setInterval(() => {
        if (!ctx) return;
        const now = ctx.currentTime;
        osc.frequency.cancelScheduledValues(now);
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.linearRampToValueAtTime(1300, now + 0.6);
        osc.frequency.linearRampToValueAtTime(500, now + 1.2);
      }, 1200);

      osc.connect(mainGain);
      osc.start();

      currentOscillators.current = [osc, { stop: () => clearInterval(intervalId) }];
      onAddLog('Acil ikaz sireni çalınıyor.', 'success');
    }

    setIsPlaying(true);

    // Vibration feedback trigger (100ms vibrate, 50ms pause, etc.)
    if (vibrateOn && navigator.vibrate) {
      navigator.vibrate([250, 100, 250, 100, 250]);
      vibrationInterval.current = setInterval(() => {
        if (navigator.vibrate) {
          navigator.vibrate([250, 100, 250, 100, 250]);
        }
      }, 1500);
    }
  };

  const stopSound = () => {
    if (currentOscillators.current.length > 0) {
      currentOscillators.current.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // If it was the interval cleanup function
          if (typeof osc.stop === 'function') osc.stop();
        }
      });
      currentOscillators.current = [];
    }

    if (lfoNodeRef.current) {
      try { lfoNodeRef.current.stop(); } catch (e) {}
      lfoNodeRef.current = null;
    }

    if (vibrationInterval.current) {
      clearInterval(vibrationInterval.current);
      vibrationInterval.current = null;
    }

    if (navigator.vibrate) {
      navigator.vibrate(0); // Cancel ongoing vibration
    }

    setIsPlaying(false);
  };

  useEffect(() => {
    // Dynamically adjust volume to live nodes on slider slide
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  // Clean up if component suddenly unmounts
  useEffect(() => {
    return () => {
      stopSound();
    };
  }, []);

  const handleToggleSound = () => {
    if (isPlaying) {
      stopSound();
      onAddLog('Ses yayını durduruldu.', 'info');
    } else {
      startSound();
    }
  };

  return (
    <div className="space-y-4">
      {/* Wave Visualizer block */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col items-center justify-center space-y-6 overflow-hidden min-h-[220px] relative">
        {/* Dynamic visual rings emanating on play */}
        {isPlaying ? (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-56 h-56 rounded-full bg-red-500/5 animate-pulse-ring absolute"></div>
            <div className="w-44 h-44 rounded-full bg-red-500/10 animate-pulse-ring absolute [animation-delay:0.5s]"></div>
            <div className="w-32 h-32 rounded-full bg-red-500/15 animate-pulse-ring absolute [animation-delay:1s]"></div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
            <div className="w-32 h-32 rounded-full border border-dashed border-slate-200"></div>
          </div>
        )}

        {/* Central active indicator logo */}
        <div 
          onClick={handleToggleSound}
          className={`cursor-pointer p-8 rounded-full transition-all duration-500 z-10 relative ${
            isPlaying 
              ? 'bg-red-650 hover:bg-red-700 text-white shadow-xl shadow-red-205 scale-105' 
              : 'bg-slate-50 hover:bg-slate-100 text-slate-400 border border-slate-150'
          }`}
        >
          {isPlaying ? (
            <Volume2 size={44} className="animate-bounce" />
          ) : (
            <VolumeX size={44} />
          )}
        </div>

        {/* Pulse waveform mock display using tiny CSS bars */}
        <div className="flex gap-1 items-center h-4 z-10">
          {[1,2,3,4,5,6,7,6,5,4,3,2,1].map((bar, idx) => (
            <div 
              key={idx} 
              className={`w-0.5 rounded-full transition-all duration-300 ${
                isPlaying 
                  ? 'bg-red-500' 
                  : 'bg-slate-200'
              }`}
              style={{ 
                height: isPlaying ? `${Math.floor(Math.random() * 16) + 3}px` : '4px',
                animationDelay: isPlaying ? `${idx * 0.05}s` : '0s'
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Main trigger controls */}
      <button
        onClick={handleToggleSound}
        className={`w-full py-4 rounded-xl text-xs font-black shadow-lg transition active:scale-95 border uppercase tracking-wider ${
          isPlaying
            ? 'bg-slate-900 border-slate-950 hover:bg-slate-950 text-white shadow-slate-105'
            : 'bg-red-600 border-red-700 hover:bg-red-750 text-white shadow-red-105'
        }`}
      >
        {isPlaying ? 'YAYINI DURDUR' : 'YAYINLAMAYA BAŞLAT'}
      </button>

      {/* Utility Preset selectors */}
      <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-xs space-y-3.5">
        <h4 className="font-extrabold text-[10px] text-slate-500 uppercase tracking-widest">Sinyal Türü Seçenekleri</h4>
        
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'whistle', label: 'Hakem Düdüğü', desc: 'Klasik yüksek tiz' },
            { id: 'canine', label: 'Eğitim Köpeği', desc: 'Ultrasonik 12kHz' },
            { id: 'siren', label: 'İkaz Sireni', desc: 'Mekanik ambulans' }
          ].map(mode => (
            <button
              key={mode.id}
              onClick={() => {
                const wasPlaying = isPlaying;
                stopSound();
                setSoundMode(mode.id as any);
                onAddLog(`Ton değiştirildi: ${mode.label}`, 'info');
                // Auto restart with new tone if it was playing already
                if (wasPlaying) {
                  setTimeout(() => {
                    setSoundMode((prev) => {
                      // Workaround to ensure correct config loaded
                      startSound();
                      return prev;
                    });
                  }, 100);
                }
              }}
              className={`p-3 rounded-xl border-2 transition text-left flex flex-col justify-between h-20 ${
                soundMode === mode.id
                  ? 'border-red-600 bg-red-50/20'
                  : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'
              }`}
            >
              <span className={`text-[11px] font-black leading-tight ${soundMode === mode.id ? 'text-red-700' : 'text-slate-800'}`}>
                {mode.label}
              </span>
              <span className="text-[9px] text-slate-400 font-medium leading-none">
                {mode.desc}
              </span>
            </button>
          ))}
        </div>

        {/* Volume slider control */}
        <div className="space-y-1.5 pt-1.5 border-t border-slate-100 flex items-center justify-between">
          <label className="text-[10px] font-bold text-slate-500 uppercase">SES ŞİDDETİ: %{Math.round(volume * 100)}</label>
          <input 
            type="range" 
            min="0.1" 
            max="1.0" 
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(+e.target.value)}
            className="w-1/2 accent-red-600 cursor-pointer"
          />
        </div>

        {/* Vibrate switch control */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
          <span className="text-[10px] uppercase text-slate-500">Cihaz Titreşim Desteği:</span>
          <button
            onClick={() => setVibrateOn(!vibrateOn)}
            className={`px-3 py-1 rounded-md text-[10px] font-black transition ${
              vibrateOn ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
            }`}
          >
            {vibrateOn ? 'AKTİF (250ms)' : 'KAPALI'}
          </button>
        </div>
      </div>

      {/* Safety info alert */}
      <div className="bg-red-50/30 p-3.5 rounded-2xl border border-red-100 flex gap-2 items-start text-[10px]">
        <AlertOctagon className="text-red-600 shrink-0" size={15} />
        <div>
          <p className="font-extrabold text-slate-900 uppercase">Hayati Kullanım Notu:</p>
          <p className="text-slate-600 leading-relaxed font-medium mt-0.5">
            Düdük uyarısı, arama-kurtarma çalışmaları durdurulup sessizlik istendiğinde ("Sesimi duyan var mı?" aşaması) konumunuzu tespit ettirmek amacıyla maksimum verimle kullanılmalıdır. Bataryanızı tasarruflu kullanın.
          </p>
        </div>
      </div>
    </div>
  );
}
