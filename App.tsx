import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { 
  ShieldCheck, Loader2, Globe, Trophy, Key, Fingerprint, ShieldAlert, 
  FileSearch, Radio, ChevronRight, MessageSquare, CheckCircle2, XCircle, Info, Send, VideoOff, Type, GraduationCap, Shield, Copy, Check
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
    <p className="mt-12 font-black uppercase text-[10px] tracking-widest opacity-30 italic">v6.2 - Automatisé par Cyber Assistant</p>
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
  const [reported, setReported] = useState(false);

  const analyzeReal = async () => {
    if (!text.trim() || text.length < 10) return;
    setLoading(true);
    try {
      const classifier = await pipeline('text-classification', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
      const result = await classifier(text);
      const score = Math.round(result[0].score * 100);
      const scamTerms = /(banque|ameli|urgent|impots|virement|lot|gagné|factures|paiement|suspens|colis|livraison|compte|bloqué|sécurité|vérification|connecter|identifiants|remboursement|amende|antai|cpf|netflix|disney|caf|impot|gouv|chronopost|ups|mondial)/i;
      const isSuspect = result[0].label === 'NEGATIVE' || scamTerms.test(text);
      setAnalysis({ score: isSuspect ? score : 100-score, level: isSuspect ? "CRITIQUE" : "FAIBLE", color: isSuspect ? "text-red-600" : "text-green-600", advice: isSuspect ? "🚨 DANGER : Arnaque probable !" : "✅ SAIN : Pas de menace détectée.", text });
    } catch (e) { setAnalysis({ level: "ERREUR", color: "text-gray-500", advice: "IA indisponible." }); } finally { setLoading(false); }
  };

  const reportToN8N = async () => {
    if (!analysis) return;
    try {
      await fetch('https://cyberwolfx.app.n8n.cloud/webhook/scam-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: analysis.text, source: "Mon Bouclier Numérique (Julian)" })
      });
      setReported(true);
    } catch (e) { console.error("Erreur n8n", e); }
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] animate-in slide-in-from-right duration-500 pb-20">
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
              {analysis && (
                <div className="mt-4">
                  <div className={`p-4 bg-gray-100 rounded-xl border-2 border-black font-black uppercase italic text-xs ${analysis.color}`}>{analysis.level}: {analysis.advice}</div>
                  <button onClick={reportToN8N} disabled={reported} className="w-full mt-2 bg-red-100 text-red-600 py-2 rounded-xl font-black uppercase text-[9px] flex items-center justify-center gap-2">{reported ? "Signalé !" : "Signaler à n8n"}</button>
                </div>
              )}
           </Card>

           <SecurityChecklist />
           <DeepfakeAlert />
           <IdentityPhantom />
           <VeraModule />
           <NewsFeed />
           <PasswordTool />
           <CyberQuiz />
           
           <Card className="lg:col-span-3 bg-red-600 text-white border-red-900 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-left text-white">
                <h2 className="text-3xl font-black uppercase italic">Fuites de données ?</h2>
                <p className="font-bold opacity-80">Vérifiez si vos comptes sont compromis.</p>
              </div>
              <a href="https://haveibeenpwned.com/" target="_blank" rel="noopener noreferrer" className="bg-white text-red-600 px-10 py-4 rounded-2xl font-black uppercase shadow-xl hover:scale-105 transition-all">Scanner mes mails</a>
           </Card>

           <Card className="lg:col-span-3 flex flex-col items-center justify-center py-10">
              <div className="p-5 rounded-2xl bg-blue-500 text-white mb-6"><FileSearch size={40} /></div>
              <h2 className="font-black uppercase text-2xl mb-4 text-center">VirusTotal</h2>
              <p className="text-xs font-bold text-gray-400 mb-8 uppercase tracking-widest">Vérifiez si vos téléchargements sont sains</p>
              <a href="https://www.virustotal.com/" target="_blank" rel="noopener noreferrer" className="px-12 py-5 bg-black text-white rounded-2xl font-black uppercase text-sm hover:bg-blue-600 transition-all">Accéder à VirusTotal</a>
           </Card>
        </main>
      </div>
    </div>
  );
};

// --- 4. SECTION ACADEMIE ---
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
      <p className="text-xl font-bold text-zinc-500 mb-12">Tes cours de hacking éthique et tes défis OSINT arrivent.</p>
      <div className="p-8 border-4 border-blue-500 rounded-[3rem] bg-zinc-900">
        <p className="font-mono text-blue-400 text-sm">$> loading_expertise_modules... 40%</p>
        <div className="w-full h-2 bg-zinc-800 rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-blue-500 w-[40%]" />
        </div>
      </div>
    </div>
  </div>
);

// --- MODULES OPTIMISÉS ---
const IdentityPhantom = () => {
  const [pseudo, setPseudo] = useState("");
  const gen = () => {
    const p = ["Neon", "Cyber", "Void", "Astro", "Shadow", "Alpha", "Digital", "Silent"];
    const c = ["Wolf", "Spectre", "Kernel", "Phantom", "Blade", "Runner", "Watcher", "Seeker"];
    setPseudo(`${p[Math.floor(Math.random()*p.length)]}_${c[Math.floor(Math.random()*c.length)]}_${Math.floor(Math.random()*999)}`);
  };
  return (
    <Card className="bg-yellow-400 text-black">
      <h2 className="text-xl font-black uppercase mb-2">Identité Fantôme</h2>
      <p className="text-[10px] font-bold mb-4 opacity-70 uppercase">Pseudo anonyme pour vos comptes</p>
      <button onClick={gen} className="w-full bg-black text-white py-3 rounded-xl font-black uppercase text-xs mb-4 shadow-md">Générer</button>
      {pseudo && <div className="p-3 bg-white border-2 border-black rounded-xl font-mono text-center font-black">{pseudo}</div>}
    </Card>
  );
};

const VeraModule = () => (
  <Card className="bg-blue-600 text-white border-blue-900 flex flex-col">
    <h2 className="text-xl font-black uppercase mb-2">Vera Fact-Check</h2>
    <p className="text-[10px] font-bold mb-4 opacity-80 uppercase flex-grow">IA citoyenne de vérification</p>
    <a href="https://www.askvera.org" target="_blank" rel="noopener noreferrer" className="block w-full bg-white text-blue-600 py-3 rounded-xl font-black uppercase text-xs text-center shadow-lg">Interroger</a>
  </Card>
);

const DeepfakeAlert = () => (
  <Card className="bg-zinc-900 text-white border-black flex flex-col relative overflow-hidden">
    <div className="absolute -right-4 -top-4 opacity-10 rotate-12"><VideoOff size={100}/></div>
    <h2 className="text-xl font-black uppercase mb-2 text-red-500">Alerte Deepfake</h2>
    <p className="text-[10px] font-bold mb-4 opacity-70 uppercase flex-grow">Protégez-vous des voix et visages imités</p>
    <a href="https://www.cnil.fr/fr/hypertrucage-deepfake" target="_blank" rel="noopener noreferrer" className="block w-full bg-red-600 text-white py-3 rounded-xl font-black uppercase text-xs text-center">Guide CNIL</a>
  </Card>
);

const NewsFeed = () => {
  const [news, setNews] = useState<any[]>([]);
  useEffect(() => {
    fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://www.cert.ssi.gouv.fr/feed/')}`)
      .then(res => res.json()).then(data => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, "text/xml");
        const items = Array.from(xmlDoc.querySelectorAll("item")).slice(0, 3).map(el => ({
          title: el.querySelector("title")?.textContent,
          link: el.querySelector("link")?.textContent,
          pubDate: el.querySelector("pubDate")?.textContent,
        }));
        setNews(items);
      }).catch(() => {});
  }, []);
  return (
    <Card>
      <h2 className="text-xl font-black uppercase mb-4 flex items-center gap-2"><Radio size={18} className="text-red-500 animate-pulse"/> Alertes ANSSI</h2>
      <div className="space-y-3">
        {news.length > 0 ? news.map((n, i) => (
          <a key={i} href={n.link} target="_blank" rel="noopener noreferrer" className="block p-3 bg-gray-50 border-2 border-black rounded-xl hover:bg-yellow-50 text-[9px] font-black uppercase leading-tight">{n.title}</a>
        )) : <div className="text-[10px] font-black uppercase opacity-30 animate-pulse">Synchronisation...</div>}
      </div>
    </Card>
  );
};

const PasswordTool = () => {
  const [mode, setMode] = useState<'pass' | 'phrase'>('pass');
  const [res, setRes] = useState("");
  const [copied, setCopied] = useState(false);
  const gen = () => {
    setCopied(false);
    if(mode === 'pass') {
      const c = "ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()";
      let r = ""; for(let i=0; i<16; i++) r += c.charAt(Math.floor(Math.random()*c.length));
      setRes(r);
    } else {
      const w = ["ocean", "vitesse", "calme", "argent", "foret", "secret", "spectre", "nuage", "hiver", "flamme", "pierre", "ombre", "soleil", "pilote", "faucon", "pixel"];
      let r = []; for(let i=0; i<4; i++) r.push(w[Math.floor(Math.random()*w.length)]);
      setRes(r.join("-"));
    }
  };
  const copy = () => {
    if(!res) return;
    navigator.clipboard.writeText(res);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Card className="bg-black text-white border-zinc-800">
      <h2 className="text-xl font-black uppercase mb-4 flex items-center gap-2"><Key size={18} className="text-blue-400"/> Coffre-Fort</h2>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setMode('pass')} className={`flex-1 py-1 rounded-lg text-[8px] font-black uppercase border-2 ${mode === 'pass' ? 'bg-blue-600 border-blue-400' : 'border-zinc-700 opacity-50'}`}>Pass</button>
        <button onClick={() => setMode('phrase')} className={`flex-1 py-1 rounded-lg text-[8px] font-black uppercase border-2 ${mode === 'phrase' ? 'bg-blue-600 border-blue-400' : 'border-zinc-700 opacity-50'}`}>Phrase</button>
      </div>
      <button onClick={gen} className="w-full bg-blue-600 py-3 rounded-xl font-black uppercase text-xs hover:bg-blue-400 transition-all">Générer</button>
      {res && (
        <div onClick={copy} className="mt-3 p-3 bg-zinc-800 text-blue-300 rounded-xl font-mono text-[10px] text-center border border-blue-500/30 cursor-pointer flex items-center justify-center gap-2">
          <span className="break-all">{res}</span>
          {copied ? <Check size={12} className="text-green-400"/> : <Copy size={12} className="opacity-50 group-hover:opacity-100"/>}
        </div>
      )}
    </Card>
  );
};

const CyberQuiz = () => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const questions = [
    { q: "Un ami demande de l'argent en urgence par SMS ?", r: "Faux", e: "C'est une arnaque classique (smishing). Appelez toujours pour confirmer de vive voix." },
    { q: "Le cadenas (HTTPS) garantit que le site est fiable ?", r: "Faux", e: "Faux. Le cadenas chiffre la connexion, mais le site peut être frauduleux. Vérifiez toujours l'URL." },
    { q: "L'IA peut imiter la voix d'un proche au téléphone ?", r: "Vrai", e: "C'est le 'Deepfake'. Si l'appel est louche, posez une question dont seul votre proche connaît la réponse." },
    { q: "Utiliser le même mot de passe partout est sans risque ?", r: "Faux", e: "Si un seul site fuit, tous vos comptes deviennent vulnérables. Utilisez un gestionnaire." }
  ];
  const handleAns = (ans: string) => {
    if (ans === questions[step].r) setScore(score + 1);
    setShowExplanation(true);
  };
  return (
    <Card className="bg-purple-600 text-white border-purple-900 flex flex-col">
      <h2 className="text-xl font-black uppercase mb-4">Cyber Quiz</h2>
      {!showFinal ? (
        <div className="bg-white/10 p-4 rounded-xl flex-grow">
          <p className="font-bold text-sm mb-4 leading-tight">{questions[step].q}</p>
          {!showExplanation ? (
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => handleAns("Vrai")} className="bg-white text-purple-600 py-2 rounded-xl font-black uppercase text-xs shadow-md">Vrai</button>
              <button onClick={() => handleAns("Faux")} className="bg-black text-white py-2 rounded-xl font-black uppercase text-xs shadow-md">Faux</button>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <p className="text-[10px] font-bold mb-3 bg-black/20 p-3 rounded-lg italic">{questions[step].e}</p>
              <button onClick={() => { setShowExplanation(false); if (step < questions.length - 1) setStep(step + 1); else setShowFinal(true); }} className="w-full bg-white text-purple-600 py-2 rounded-xl font-black uppercase text-[10px]">Suivant</button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <Trophy size={40} className="mx-auto mb-2 text-yellow-400"/>
          <p className="font-black text-xl uppercase">Score : {score}/{questions.length}</p>
          <button onClick={() => {setStep(0); setScore(0); setShowFinal(false)}} className="mt-4 bg-black text-white px-6 py-2 rounded-full font-black uppercase text-[9px]">Rejouer</button>
        </div>
      )}
    </Card>
  );
};

const SecurityChecklist = () => {
  const [items, setItems] = useState([
    { id: 1, text: "Double authentification (2FA) active", checked: false, cat: "🔐" },
    { id: 2, text: "Mots de passe uniques par site", checked: false, cat: "🔑" },
    { id: 3, text: "Gestionnaire de mots de passe utilisé", checked: false, cat: "🗄️" },
    { id: 4, text: "Mises à jour système effectuées", checked: false, cat: "⚙️" },
    { id: 5, text: "VPN utilisé sur Wi-Fi public", checked: false, cat: "🌐" },
    { id: 6, text: "Sauvegardes régulières faites", checked: false, cat: "💾" },
    { id: 7, text: "Méfiance face aux emails inconnus", checked: false, cat: "🕵️" },
  ]);
  const toggle = (id: number) => { setItems(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i)); };
  const progress = Math.round((items.filter(i => i.checked).length / items.length) * 100);
  return (
    <Card className="bg-green-500 text-white border-green-900">
      <h2 className="text-xl font-black uppercase mb-4">Checklist</h2>
      <div className="h-2 bg-black/20 rounded-full overflow-hidden mb-4 border-2 border-black">
        <div className="h-full bg-white transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
        {items.map(i => (
          <button key={i.id} onClick={() => toggle(i.id)} className={`w-full text-left p-2 rounded-xl border-2 transition-all flex items-center gap-2 ${i.checked ? 'bg-black text-green-500 border-white' : 'bg-green-600 border-green-700 text-white/80'}`}>
            <span className="text-xs">{i.cat}</span>
            <span className={`text-[10px] font-black uppercase ${i.checked ? 'line-through opacity-50' : ''}`}>{i.text}</span>
          </button>
        ))}
      </div>
      <p className="text-[9px] font-black uppercase mt-4 text-center">Protection : {progress}%</p>
    </Card>
  );
};

function App() {
  const [view, setView] = useState<'gateway' | 'shield' | 'academy'>('gateway');
  
  useEffect(() => {
    const s = document.createElement("script"); s.src = "https://embed.tawk.to/69ee706ebd68fb1c32a82772/1jn5mech0"; s.async = true; document.head.appendChild(s);
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Mon Bouclier Numérique | Protection & Apprentissage</title>
        <meta name="description" content="Portail de cybersécurité avec IA locale, formation au hacking éthique et outils de protection." />
      </Helmet>
      {view === 'gateway' && <Gateway onChoose={setView} />}
      {view === 'shield' && <ShieldSection onBack={() => setView('gateway')} />}
      {view === 'academy' && <AcademySection onBack={() => setView('gateway')} />}
    </HelmetProvider>
  );
}

export default App;