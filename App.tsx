import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { 
  ShieldCheck, Loader2, Globe, Trophy, Key, Fingerprint, ShieldAlert, 
  FileSearch, Radio, ChevronRight, MessageSquare, CheckCircle2, XCircle, Info, Send, VideoOff, Type, GraduationCap, Shield
} from 'lucide-react';
import { pipeline } from '@xenova/transformers';

// --- COMPOSANTS DE STYLE ---
const Card = ({ children, className = "" }) => (
  <div className={`bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 rounded-[2.5rem] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] ${className}`}>
    {children}
  </div>
);

// --- 1. PAGE D'ACCUEIL (GATEWAY) ---
const Gateway = ({ onChoose }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#F0F0F0] p-4 animate-in fade-in duration-700">
    <div className="bg-black p-4 rounded-3xl mb-8 text-yellow-400 shadow-2xl animate-bounce">
      <ShieldCheck size={64} />
    </div>
    <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-center mb-12 leading-none">
      MON BOUCLIER<br/><span className="text-yellow-500">NUMÉRIQUE</span>
    </h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
      <button 
        onClick={() => onChoose('shield')} 
        className="group bg-black text-white p-10 rounded-[3rem] border-4 border-black shadow-[15px_15px_0px_0px_#ffde59] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex flex-col items-center text-center gap-4"
      >
        <Shield size={48} className="group-hover:scale-110 transition-transform text-yellow-400" />
        <div>
          <h2 className="text-3xl font-black uppercase">Le Bouclier</h2>
          <p className="text-xs font-bold opacity-70 mt-2">OUTILS DE PROTECTION IA & SÉCURITÉ</p>
        </div>
      </button>
      
      <button 
        onClick={() => onChoose('academy')} 
        className="group bg-white text-black p-10 rounded-[3rem] border-4 border-black shadow-[15px_15px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex flex-col items-center text-center gap-4"
      >
        <GraduationCap size={48} className="group-hover:scale-110 transition-transform text-blue-600" />
        <div>
          <h2 className="text-3xl font-black uppercase">L'Académie</h2>
          <p className="text-xs font-bold opacity-70 mt-2">APPRENDRE LE HACKING ÉTHIQUE</p>
        </div>
      </button>
    </div>
    <p className="mt-12 font-black uppercase text-[10px] tracking-widest opacity-30 italic">v6.0 - Automatisé par Cyber Assistant</p>
  </div>
);

// --- 2. BANNIERE ALERTE URGENTE ---
const UrgentAlert = () => (
  <a 
    href="https://www.cybermalveillance.gouv.fr/tous-nos-contenus/actualites/alertecyber-faille-securite-critique-adobe-acrobat-acrobat-reader" 
    target="_blank" rel="noopener noreferrer"
    className="block bg-red-600 text-white py-3 px-4 text-center font-black uppercase text-[10px] tracking-widest animate-pulse hover:bg-red-700"
  >
    🚨 Alerte Critique : Faille Adobe Acrobat & Linux Root. Cliquez pour vous protéger !
  </a>
);

// --- 3. MODULES DU BOUCLIER ---
const ShieldSection = ({ onBack }) => {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyzeReal = async () => {
    if (!text.trim() || text.length < 10) return;
    setLoading(true);
    try {
      const classifier = await pipeline('text-classification', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
      const result = await classifier(text);
      const score = Math.round(result[0].score * 100);
      const isSuspect = result[0].label === 'NEGATIVE' || /(banque|ameli|urgent|impots|virement|lot|gagné)/i.test(text);
      setAnalysis({ score: isSuspect ? score : 100-score, level: isSuspect ? "CRITIQUE" : "FAIBLE", color: isSuspect ? "text-red-600" : "text-green-600", advice: isSuspect ? "🚨 DANGER : Arnaque probable !" : "✅ SAIN : Pas de menace détectée." });
    } catch (e) { setAnalysis({ level: "ERREUR", color: "text-gray-500", advice: "IA indisponible." }); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] animate-in slide-in-from-right duration-500">
      <UrgentAlert />
      <div className="p-4 md:p-10 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <button onClick={onBack} className="font-black uppercase text-xs flex items-center gap-2 hover:underline"><ChevronRight size={14} className="rotate-180"/> Retour</button>
          <div className="flex items-center gap-3">
             <div className="bg-black p-2 rounded-xl text-yellow-400"><ShieldCheck size={24} /></div>
             <h1 className="text-2xl font-black uppercase italic">Le Bouclier</h1>
          </div>
          <a href="/Bouclier%20Cyber%20.apk" download className="bg-[#ffde59] px-6 py-3 rounded-2xl font-black uppercase border-4 border-black shadow-lg text-xs">📥 App Android</a>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <Card className="lg:col-span-2">
              <div className="aspect-video rounded-3xl overflow-hidden border-4 border-black mb-6">
                <iframe width="100%" height="100%" src="https://www.youtube.com/embed/LVYqk4O4wBw" frameBorder="0" allowFullScreen></iframe>
              </div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Hygiène Numérique</h2>
              <p className="font-bold text-gray-600">Testez vos messages et protégez vos identités en un clic.</p>
           </Card>

           <Card className="flex flex-col">
              <h2 className="text-xl font-black uppercase mb-4 flex items-center gap-2"><ShieldAlert className="text-yellow-500"/> Scanner IA</h2>
              <textarea className="w-full h-32 p-4 bg-gray-50 border-2 border-black rounded-2xl font-bold text-sm outline-none mb-4" placeholder="Collez ici..." value={text} onChange={(e) => setText(e.target.value)} />
              <button onClick={analyzeReal} disabled={loading} className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase text-xs hover:bg-yellow-400 hover:text-black transition-all">
                {loading ? <Loader2 className="animate-spin mx-auto" /> : "Analyser"}
              </button>
              {analysis && <div className="mt-4 p-4 bg-gray-100 rounded-xl border-2 border-black font-black uppercase italic text-xs ${analysis.color}">{analysis.level}: {analysis.advice}</div>}
           </Card>

           <IdentityPhantom />
           <VeraModule />
           <NewsFeed />
           <PasswordTool />
           <CyberQuiz />
           <SecurityChecklist />
           
           <Card className="lg:col-span-3 bg-red-600 text-white border-red-900 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-left">
                <h2 className="text-3xl font-black uppercase italic">Fuites de données ?</h2>
                <p className="font-bold opacity-80">Vérifiez si vos comptes sont compromis.</p>
              </div>
              <a href="https://haveibeenpwned.com/" target="_blank" rel="noopener noreferrer" className="bg-white text-red-600 px-10 py-4 rounded-2xl font-black uppercase shadow-xl">Scanner</a>
           </Card>
        </main>
      </div>
    </div>
  );
};

// --- 4. SECTION ACADEMIE (NOUVEAU) ---
const AcademySection = ({ onBack }) => (
  <div className="min-h-screen bg-black text-white p-10 flex flex-col items-center animate-in slide-in-from-left duration-500">
    <header className="w-full max-w-4xl flex justify-between items-center mb-20">
      <button onClick={onBack} className="text-yellow-400 font-black uppercase text-xs hover:underline flex items-center gap-2"><ChevronRight size={14} className="rotate-180"/> Accueil</button>
      <h1 className="text-3xl font-black uppercase italic tracking-tighter">Cyber <span className="text-blue-500">Academy</span></h1>
      <div className="w-20"></div>
    </header>
    <div className="max-w-2xl text-center">
      <GraduationCap size={80} className="text-blue-500 mx-auto mb-8 animate-pulse" />
      <h2 className="text-5xl font-black uppercase mb-6 italic">En construction...</h2>
      <p className="text-xl font-bold text-zinc-500 mb-12">Bientôt, tes cours de hacking éthique, tes diaporamas VERA et tes défis OSINT seront centralisés ici.</p>
      <div className="p-8 border-4 border-blue-500 rounded-[3rem] bg-zinc-900">
        <p className="font-mono text-blue-400 text-sm">$> loading_expertise_modules... 40%</p>
        <div className="w-full h-2 bg-zinc-800 rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-blue-500 w-[40%]" />
        </div>
      </div>
    </div>
  </div>
);

// --- MODULES EXISTANTS (Optimisés) ---
const IdentityPhantom = () => {
  const [pseudo, setPseudo] = useState("");
  const gen = () => {
    const p = ["Neon", "Cyber", "Void", "Astro"];
    const c = ["Wolf", "Spectre", "Kernel", "Phantom"];
    setPseudo(`${p[Math.floor(Math.random()*p.length)]}_${c[Math.floor(Math.random()*c.length)]}_${Math.floor(Math.random()*99)}`);
  };
  return (
    <Card className="bg-yellow-400 text-black">
      <h2 className="text-xl font-black uppercase mb-2">Identité Fantôme</h2>
      <p className="text-[10px] font-bold mb-4 opacity-70 uppercase">Pseudo anonyme pour vos comptes</p>
      <button onClick={gen} className="w-full bg-black text-white py-3 rounded-xl font-black uppercase text-xs mb-4">Générer</button>
      {pseudo && <div className="p-3 bg-white border-2 border-black rounded-xl font-mono text-center font-black">{pseudo}</div>}
    </Card>
  );
};

const VeraModule = () => (
  <Card className="bg-blue-600 text-white border-blue-900">
    <h2 className="text-xl font-black uppercase mb-2">Vera Fact-Check</h2>
    <p className="text-[10px] font-bold mb-4 opacity-80 uppercase">IA citoyenne de vérification</p>
    <a href="https://www.askvera.org" target="_blank" rel="noopener noreferrer" className="block w-full bg-white text-blue-600 py-3 rounded-xl font-black uppercase text-xs text-center shadow-lg">Interroger</a>
  </Card>
);

const NewsFeed = () => {
  const [news, setNews] = useState<any[]>([]);
  useEffect(() => {
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://www.cert.ssi.gouv.fr/feed/&count=3&t=${Date.now()}`)
      .then(res => res.json()).then(data => { if (data.items) setNews(data.items); });
  }, []);
  return (
    <Card>
      <h2 className="text-xl font-black uppercase mb-4 flex items-center gap-2"><Radio size={18} className="text-red-500 animate-pulse"/> Alertes</h2>
      <div className="space-y-3">
        {news.length > 0 ? news.map((n, i) => (
          <a key={i} href={n.link} target="_blank" rel="noopener noreferrer" className="block p-3 bg-gray-50 border-2 border-black rounded-xl hover:bg-yellow-50 text-[10px] font-black uppercase leading-tight">{n.title}</a>
        )) : <div className="text-[10px] font-black uppercase opacity-30 animate-pulse">Synchronisation...</div>}
      </div>
    </Card>
  );
};

const PasswordTool = () => {
  const [mode, setMode] = useState<'pass' | 'phrase'>('pass');
  const [res, setRes] = useState("");
  const gen = () => {
    if(mode === 'pass') {
      const c = "ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()";
      let r = ""; for(let i=0; i<16; i++) r += c.charAt(Math.floor(Math.random()*c.length));
      setRes(r);
    } else {
      const w = ["ocean", "vitesse", "calme", "argent", "foret", "secret"];
      let r = []; for(let i=0; i<4; i++) r.push(w[Math.floor(Math.random()*w.length)]);
      setRes(r.join("-"));
    }
  };
  return (
    <Card className="bg-black text-white border-zinc-800">
      <h2 className="text-xl font-black uppercase mb-4 flex items-center gap-2"><Key size={18} className="text-blue-400"/> Coffre-Fort</h2>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setMode('pass')} className={`flex-1 py-1 rounded-lg text-[8px] font-black uppercase border-2 ${mode === 'pass' ? 'bg-blue-600 border-blue-400' : 'border-zinc-700 opacity-50'}`}>Pass</button>
        <button onClick={() => setMode('phrase')} className={`flex-1 py-1 rounded-lg text-[8px] font-black uppercase border-2 ${mode === 'phrase' ? 'bg-blue-600 border-blue-400' : 'border-zinc-700 opacity-50'}`}>Phrase</button>
      </div>
      <button onClick={gen} className="w-full bg-blue-600 py-3 rounded-xl font-black uppercase text-xs">Générer</button>
      {res && <div className="mt-3 p-3 bg-zinc-800 text-blue-300 rounded-xl font-mono text-[10px] text-center border border-blue-500/30">{res}</div>}
    </Card>
  );
};

const CyberQuiz = () => (
  <Card className="bg-purple-600 text-white border-purple-900">
     <h2 className="text-xl font-black uppercase mb-4">Cyber Quiz</h2>
     <p className="font-bold text-sm mb-6">Testez vos connaissances en 4 questions.</p>
     <button className="w-full bg-white text-purple-600 py-3 rounded-xl font-black uppercase text-xs">Lancer</button>
  </Card>
);

const SecurityChecklist = () => (
  <Card className="bg-green-500 text-white border-green-900">
     <h2 className="text-xl font-black uppercase mb-4">Checklist</h2>
     <div className="h-2 bg-black/20 rounded-full overflow-hidden mb-4"><div className="h-full bg-white w-[20%]" /></div>
     <button className="w-full bg-black text-white py-3 rounded-xl font-black uppercase text-xs">Ouvrir</button>
  </Card>
);

function App() {
  const [view, setView] = useState<'gateway' | 'shield' | 'academy'>('gateway');
  
  useEffect(() => {
    const s = document.createElement("script"); s.src = "https://embed.tawk.to/69ee706ebd68fb1c32a82772/1jn5mech0"; s.async = true; document.head.appendChild(s);
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Mon Bouclier Numérique | Protection & Apprentissage</title>
      </Helmet>
      {view === 'gateway' && <Gateway onChoose={setView} />}
      {view === 'shield' && <ShieldSection onBack={() => setView('gateway')} />}
      {view === 'academy' && <AcademySection onBack={() => setView('gateway')} />}
    </HelmetProvider>
  );
}

export default App;