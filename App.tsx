import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { 
  ShieldCheck, Loader2, Globe, Trophy, Key, Fingerprint, ShieldAlert, 
  FileSearch, Radio, ChevronRight, MessageSquare, CheckCircle2, XCircle
} from 'lucide-react';
import { pipeline } from '@xenova/transformers';

// --- 1. FIL D'ARIANE ---
const Breadcrumbs = () => (
  <nav className="max-w-7xl mx-auto mb-8 px-4 py-2 bg-gray-100 rounded-lg flex items-center gap-3 text-sm font-bold text-gray-600">
    <ol className="flex items-center gap-2">
      <li><a href="/" className="hover:text-black">Accueil</a></li>
      <ChevronRight size={14} />
      <li className="text-black font-black italic">Protection Numérique</li>
    </ol>
  </nav>
);

// --- 2. SCANNER PHISHING IA ---
const ScamAI = () => {
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
      const isSuspect = result[0].label === 'NEGATIVE' || /(banque|ameli|urgent|impots|virement|lot)/i.test(text);

      setAnalysis({
        score: isSuspect ? score : 100 - score,
        level: isSuspect ? "CRITIQUE" : "FAIBLE",
        color: isSuspect ? "text-red-600" : "text-green-600",
        advice: isSuspect ? "🚨 Arnaque probable détectée par l'IA." : "✅ Aucun danger immédiat détecté.",
      });
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <article className="bg-white p-6 md:p-8 rounded-[2.5rem] border-4 border-black shadow-2xl h-full flex flex-col text-left">
      <header className="flex items-center gap-4 mb-6">
        <div className="bg-yellow-400 p-3 rounded-2xl border-2 border-black rotate-[-5deg] shadow-lg"><ShieldAlert size={28}/></div>
        <h2 className="font-black italic uppercase text-2xl tracking-tighter">Scanner IA</h2>
      </header>
      <textarea className="w-full h-40 p-4 bg-gray-50 border-2 border-black rounded-2xl font-bold text-sm focus:ring-4 ring-yellow-400 outline-none text-black mb-4" placeholder="Collez le message suspect..." value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={analyzeReal} disabled={loading || text.length < 10} className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase hover:bg-yellow-400 hover:text-black transition-all disabled:opacity-30">
        {loading ? <Loader2 className="animate-spin mx-auto" /> : "Analyser avec mon IA"}
      </button>
      {analysis && (
        <div className="mt-6 p-5 bg-gray-100 rounded-2xl border-2 border-black">
          <p className={`font-black uppercase italic ${analysis.color}`}>{analysis.level} ({analysis.score}%)</p>
          <p className="font-bold text-sm mt-2">{analysis.advice}</p>
        </div>
      )}
    </article>
  );
};

// --- 3. MODULE VERA (Dédié) ---
const VeraModule = () => (
  <section className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-2xl border-4 border-black flex flex-col justify-center text-left">
    <div className="bg-white text-blue-600 p-3 rounded-xl inline-block w-fit mb-4 shadow-lg"><Globe size={28}/></div>
    <h2 className="font-black italic uppercase text-2xl mb-2">Vérification VERA</h2>
    <p className="text-sm font-bold opacity-90 mb-6">Un doute sur une info ? L'IA Vera vérifie les faits pour vous en temps réel.</p>
    <a href="https://www.askvera.org" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 py-4 rounded-xl font-black uppercase text-center hover:bg-blue-50 transition-all shadow-xl">Ouvrir Vera</a>
  </section>
);

// --- 4. TESTEUR DE MOT DE PASSE (Fixé) ---
const PasswordTool = () => {
  const [pass, setPass] = useState("");
  const [generated, setGenerated] = useState("");
  
  const getStrength = (p: string) => {
    let s = 0;
    if (p.length > 10) s += 25;
    if (/[A-Z]/.test(p)) s += 25;
    if (/[0-9]/.test(p)) s += 25;
    if (/[^A-Za-z0-9]/.test(p)) s += 25;
    return s;
  };

  const strength = getStrength(pass);
  const generatePass = () => {
    const chars = "ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()";
    const array = new Uint32Array(16);
    window.crypto.getRandomValues(array);
    let res = "";
    for (let i = 0; i < 16; i++) { res += chars.charAt(array[i] % chars.length); }
    setGenerated(res);
  };

  return (
    <section className="bg-black p-6 md:p-8 rounded-[2.5rem] text-white shadow-2xl text-left">
      <h2 className="font-black italic uppercase text-2xl mb-6 flex items-center gap-3">Le Coffre-Fort <Key className="text-blue-400"/></h2>
      <input type="text" className="w-full p-4 bg-zinc-900 border-2 border-zinc-700 rounded-2xl font-mono text-blue-400 mb-4 outline-none focus:border-blue-500" placeholder="Testez un mot de passe..." value={pass} onChange={(e) => setPass(e.target.value)} />
      <div className="h-2 bg-zinc-800 rounded-full mb-4 overflow-hidden">
        <div className={`h-full transition-all duration-500 ${strength > 75 ? 'bg-green-500' : strength > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${strength}%` }} />
      </div>
      <button onClick={generatePass} className="w-full py-4 bg-blue-600 rounded-xl font-black uppercase text-xs hover:bg-blue-400 transition-all shadow-lg">Générer un mot de passe sûr</button>
      {generated && <div className="mt-4 p-3 bg-white text-black rounded-lg font-mono text-center text-sm cursor-pointer" onClick={() => navigator.clipboard.writeText(generated)}>{generated}</div>}
    </section>
  );
};

// --- 5. CYBER QUIZ (Enrichi) ---
const CyberQuiz = () => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  const questions = [
    { q: "Un ami demande de l'argent en urgence par SMS ?", r: "Faux", e: "C'est souvent une usurpation d'identité. Appelez toujours votre ami pour confirmer." },
    { q: "Le petit cadenas (HTTPS) garantit que le site est honnête ?", r: "Faux", e: "Le HTTPS chiffre la connexion, mais un pirate peut aussi l'utiliser sur un faux site." },
    { q: "L'IA peut imiter parfaitement la voix de vos proches ?", r: "Vrai", e: "C'est le 'Deepfake vocal'. Définissez un mot de passe secret avec votre famille." },
    { q: "Utiliser le même mot de passe partout est sans risque ?", r: "Faux", e: "Si un seul site fuit, tous vos comptes deviennent vulnérables." }
  ];

  const handleAns = (ans: string) => {
    if (ans === questions[step].r) setScore(score + 1);
    setShowExplanation(true);
  };

  const next = () => {
    setShowExplanation(false);
    if (step < questions.length - 1) setStep(step + 1); else setShowFinal(true);
  };

  return (
    <section className="bg-purple-600 p-8 rounded-[2.5rem] text-white shadow-2xl border-4 border-black h-full flex flex-col justify-center text-left">
      <h2 className="font-black italic uppercase text-2xl mb-4 tracking-tighter">Cyber Quiz</h2>
      {!showFinal ? (
        <div className="bg-white/10 p-4 rounded-xl">
          <p className="font-bold text-base mb-6 leading-tight">{questions[step].q}</p>
          {!showExplanation ? (
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleAns("Vrai")} className="bg-white text-purple-600 py-3 rounded-xl font-black uppercase text-xs">Vrai</button>
              <button onClick={() => handleAns("Faux")} className="bg-black text-white py-3 rounded-xl font-black uppercase text-xs">Faux</button>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <p className="text-xs font-bold mb-4 bg-white/20 p-3 rounded-lg italic">"{questions[step].e}"</p>
              <button onClick={next} className="w-full bg-white text-purple-600 py-2 rounded-lg font-black uppercase text-[10px]">Continuer</button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <Trophy size={48} className="mx-auto mb-4 text-yellow-400"/>
          <p className="font-black text-2xl uppercase">Score : {score}/{questions.length}</p>
          <button onClick={() => {setStep(0); setScore(0); setShowFinal(false)}} className="mt-4 text-[10px] font-black uppercase underline">Rejouer</button>
        </div>
      )}
    </section>
  );
};

// --- 6. ACTUALITÉS (Fixé) ---
const NewsFeed = () => {
  const [news, setNews] = useState<any[]>([]);
  useEffect(() => {
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://www.cert.ssi.gouv.fr/feed/&api_key=oy87v9rzn6pndl2v7mx8x17p57v0n0p8v8p8v8p8`)
      .then(res => res.json()).then(data => { if (data.items) setNews(data.items.slice(0, 3)); });
  }, []);
  return (
    <section className="bg-white p-6 md:p-8 rounded-[2.5rem] border-4 border-black shadow-2xl h-full text-left">
      <h2 className="font-black uppercase italic text-xl mb-6 flex items-center gap-2"><Radio className="text-red-500" /> Alertes ANSSI</h2>
      <div className="space-y-4">
        {news.length > 0 ? news.map((item, i) => (
          <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="block p-3 bg-gray-50 border-2 border-black rounded-xl hover:bg-yellow-50 transition-colors">
            <h3 className="font-black text-[10px] uppercase leading-tight line-clamp-2">{item.title}</h3>
            <p className="text-[8px] text-gray-400 font-bold mt-1 uppercase">CERT-FR • {new Date(item.pubDate).toLocaleDateString()}</p>
          </a>
        )) : <div className="text-xs font-bold text-gray-400 uppercase">Chargement des alertes...</div>}
      </div>
    </section>
  );
};

function App() {
  useEffect(() => {
    const s = document.createElement("script"); s.src = "https://embed.tawk.to/69ee706ebd68fb1c32a82772/1jn5mech0"; s.async = true;
    document.getElementsByTagName("head")[0].appendChild(s);
  }, []);

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-[#F0F0F0] font-sans text-black pb-20 p-4 md:p-10">
        <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-black p-3 rounded-2xl text-yellow-400 shadow-xl"><ShieldCheck size={32} /></div>
            <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter leading-none text-left">Mon Bouclier<br/><span className="text-yellow-500 text-2xl md:text-3xl">Numérique</span></h1>
          </div>
          <a href="/Bouclier%20Cyber%20.apk" download className="bg-[#ffde59] px-6 py-3 rounded-2xl font-black uppercase border-4 border-black shadow-xl hover:scale-105 transition-all text-sm">📥 App Android</a>
        </header>
        <Breadcrumbs />
        <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <article className="lg:col-span-2 bg-white p-6 rounded-[3rem] shadow-2xl border-4 border-black text-left">
            <div className="aspect-video rounded-[2.5rem] overflow-hidden border-4 border-black bg-gray-100">
              <iframe width="100%" height="100%" src="https://www.youtube.com/embed/LVYqk4O4wBw" frameBorder="0" allowFullScreen></iframe>
            </div>
            <div className="mt-8">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter">Hygiène Numérique</h2>
              <p className="text-base font-bold text-gray-600 mt-2">Apprenez à identifier les pièges du web avec nos outils dopés à l'IA locale.</p>
            </div>
          </article>
          <ScamAI />
          <VeraModule />
          <NewsFeed />
          <PasswordTool />
          <section className="bg-white p-8 rounded-[3rem] border-4 border-black shadow-2xl text-center flex flex-col justify-center">
              <div className="p-4 rounded-2xl bg-blue-500 text-white inline-block mb-4 mx-auto shadow-md"><FileSearch size={32} /></div>
              <h2 className="font-black uppercase text-xl mb-4 text-left">Analyse Fichier</h2>
              <a href="https://www.virustotal.com/" target="_blank" rel="noopener noreferrer" className="w-full block py-4 bg-blue-600 text-white rounded-xl font-black text-xs uppercase hover:bg-black transition-all shadow-lg active:scale-95">VirusTotal</a>
          </section>
          <CyberQuiz />
          <section className="lg:col-span-3 bg-red-600 p-8 md:p-12 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden border-4 border-black text-left">
             <div className="absolute top-0 right-0 p-10 opacity-10"><Fingerprint size={160}/></div>
             <div className="relative z-10 text-left">
               <h2 className="font-black uppercase italic text-3xl md:text-4xl leading-none text-left">Fuites de données ?</h2>
               <p className="text-sm font-black uppercase text-red-200 mt-3 text-left">Vérifiez vos emails sur Have I Been Pwned.</p>
             </div>
             <a href="https://haveibeenpwned.com/" target="_blank" rel="noopener noreferrer" className="w-full md:w-auto px-12 py-5 bg-white text-red-600 rounded-2xl font-black uppercase text-sm relative z-10 shadow-2xl hover:scale-105 transition-all text-center">Scanner mes comptes</a>
          </section>
        </main>
      </div>
    </HelmetProvider>
  );
}

export default App;