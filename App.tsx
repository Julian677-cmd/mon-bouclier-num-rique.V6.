import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { 
  ShieldCheck, Loader2, Globe, Trophy, Key, Fingerprint, ShieldAlert, 
  FileSearch, Radio, ChevronRight, MessageSquare, CheckCircle2, XCircle, Info, Send
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

// --- 2. BANNIERE ALERTE URGENTE (Lien Fixé) ---
const UrgentAlert = () => (
  <a 
    href="https://www.cybermalveillance.gouv.fr/tous-nos-contenus/actualites/alertecyber-faille-securite-critique-adobe-acrobat-acrobat-reader" 
    target="_blank" 
    rel="noopener noreferrer"
    className="block bg-red-600 text-white py-3 px-4 text-center font-black uppercase text-[10px] md:text-xs tracking-widest animate-pulse hover:bg-red-700 transition-colors"
  >
    🚨 Alerte Critique : Faille Adobe Acrobat. Cliquez ici pour voir comment vous protéger !
  </a>
);

// --- 3. SCANNER PHISHING IA ---
const ScamAI = () => {
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
      const isSuspect = result[0].label === 'NEGATIVE' || /(banque|ameli|urgent|impots|virement|lot|gagné|votre compte)/i.test(text);

      setAnalysis({
        text: text,
        score: isSuspect ? score : 100 - score,
        level: isSuspect ? "CRITIQUE" : "FAIBLE",
        color: isSuspect ? "text-red-600" : "text-green-600",
        advice: isSuspect ? "🚨 Arnaque probable détectée par l'IA locale. Ne cliquez sur rien !" : "✅ Aucun danger immédiat détecté par l'IA.",
      });
    } catch (e) { 
        setAnalysis({ score: 0, level: "ERREUR", color: "text-gray-500", advice: "L'IA n'a pas pu charger." });
    } finally { setLoading(false); }
  };

  const reportToN8N = async () => {
    if (!analysis) return;
    try {
      await fetch('https://cyberwolfx.app.n8n.cloud/webhook/scam-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: analysis.text, source: "Bouclier Numérique" })
      });
      setReported(true);
    } catch (e) { console.error("Erreur n8n", e); }
  };

  return (
    <article className="bg-white p-6 md:p-8 rounded-[2.5rem] border-4 border-black shadow-2xl h-full flex flex-col text-left">
      <header className="flex items-center gap-4 mb-6">
        <div className="bg-yellow-400 p-3 rounded-2xl border-2 border-black rotate-[-5deg] shadow-lg"><ShieldAlert size={28}/></div>
        <h2 className="font-black italic uppercase text-2xl tracking-tighter">Scanner IA</h2>
      </header>
      <textarea className="w-full h-40 p-4 bg-gray-50 border-2 border-black rounded-2xl font-bold text-sm focus:ring-4 ring-yellow-400 outline-none text-black mb-4" placeholder="Collez le message suspect ici..." value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={analyzeReal} disabled={loading || text.length < 10} className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase hover:bg-yellow-400 hover:text-black transition-all mb-3">
        {loading ? <Loader2 className="animate-spin mx-auto" /> : "Lancer l'Analyse"}
      </button>
      {analysis && (
        <div className="mt-2 animate-in fade-in zoom-in">
          <div className="p-5 bg-gray-100 rounded-2xl border-2 border-black">
            <p className={`font-black uppercase italic ${analysis.color}`}>{analysis.level} ({analysis.score}%)</p>
            <p className="font-bold text-sm mt-2">{analysis.advice}</p>
          </div>
          <button onClick={reportToN8N} disabled={reported} className="w-full mt-3 bg-red-100 text-red-600 py-3 rounded-xl font-black uppercase text-[10px] flex items-center justify-center gap-2 hover:bg-red-200 transition-all">
            <Send size={14} /> {reported ? "Signalé à n8n !" : "Signaler cette arnaque"}
          </button>
        </div>
      )}
    </article>
  );
};

// --- 4. IDENTITÉ FANTÔME (Générateur de Pseudo) ---
const IdentityPhantom = () => {
  const [pseudo, setPseudo] = useState("");
  const generate = () => {
    const prefixes = ["Neon", "Cyber", "Shadow", "Silver", "Ghost", "Void", "Astro", "Dark"];
    const cores = ["Wolf", "Spectre", "Kernel", "Phantom", "Rogue", "Pilot", "Nerve", "Pulse"];
    const suffixes = ["X", "77", "Alpha", "Zero", "Prime", "Omega", "99"];
    const res = `${prefixes[Math.floor(Math.random()*prefixes.length)]}_${cores[Math.floor(Math.random()*cores.length)]}_${suffixes[Math.floor(Math.random()*suffixes.length)]}`;
    setPseudo(res);
  };
  return (
    <section className="bg-yellow-400 p-8 rounded-[2.5rem] border-4 border-black shadow-2xl flex flex-col justify-center text-left relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck size={120} /></div>
      <h2 className="font-black italic uppercase text-2xl mb-2 relative z-10">Identité Fantôme</h2>
      <p className="text-xs font-bold mb-6 relative z-10">Générez un pseudo anonyme pour vos comptes.</p>
      <button onClick={generate} className="bg-black text-white py-4 rounded-xl font-black uppercase text-xs mb-4 shadow-lg hover:bg-zinc-800 transition-all">Générer</button>
      {pseudo && (
        <div className="p-4 bg-white border-2 border-black rounded-xl font-mono text-center font-black text-lg cursor-pointer" onClick={() => navigator.clipboard.writeText(pseudo)}>
          {pseudo}
        </div>
      )}
    </section>
  );
};

// --- 5. TESTEUR DE MOT DE PASSE ---
const PasswordTool = () => {
  const [pass, setPass] = useState("");
  const [generated, setGenerated] = useState("");
  const getStrength = (p: string) => {
    if (!p) return 0;
    let s = 0;
    if (p.length > 8) s += 20; if (p.length > 12) s += 10; if (/[A-Z]/.test(p)) s += 20; if (/[0-9]/.test(p)) s += 20; if (/[^A-Za-z0-9]/.test(p)) s += 30;
    return Math.min(s, 100);
  };
  const strength = getStrength(pass);
  const generatePass = () => {
    const chars = "ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()";
    const array = new Uint32Array(16); window.crypto.getRandomValues(array);
    let res = ""; for (let i = 0; i < 16; i++) { res += chars.charAt(array[i] % chars.length); }
    setGenerated(res);
  };
  return (
    <section className="bg-black p-6 md:p-8 rounded-[2.5rem] text-white shadow-2xl text-left border-4 border-zinc-800">
      <h2 className="font-black italic uppercase text-2xl mb-6 flex items-center gap-3">Le Coffre-Fort <Key className="text-blue-400"/></h2>
      <input type="text" className="w-full p-4 bg-zinc-900 border-2 border-zinc-700 rounded-2xl font-mono text-blue-400 mb-4 outline-none focus:border-blue-500" placeholder="Testez un mot de passe..." value={pass} onChange={(e) => setPass(e.target.value)} />
      <div className="h-3 bg-zinc-800 rounded-full mb-2 overflow-hidden"><div className={`h-full transition-all duration-700 ${strength > 75 ? 'bg-green-500' : strength > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${strength}%` }} /></div>
      <button onClick={generatePass} className="w-full py-4 bg-blue-600 rounded-xl font-black uppercase text-xs hover:bg-blue-400 transition-all active:scale-95 shadow-lg">Générer un mot de passe sûr</button>
      {generated && <div className="mt-4 p-3 bg-zinc-800 text-blue-300 rounded-xl font-mono text-center text-sm cursor-pointer border border-blue-500/30" onClick={() => navigator.clipboard.writeText(generated)}>{generated}</div>}
    </section>
  );
};

// --- 6. VERA MODULE ---
const VeraModule = () => (
  <section className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-2xl border-4 border-black flex flex-col justify-center text-left relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-10"><Globe size={120} /></div>
    <div className="bg-white text-blue-600 p-3 rounded-xl inline-block w-fit mb-4"><Info size={28}/></div>
    <h2 className="font-black italic uppercase text-2xl mb-2">Vérification VERA</h2>
    <p className="text-sm font-bold opacity-90 mb-6">Vérifiez les faits en quelques secondes.</p>
    <a href="https://www.askvera.org" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 py-4 rounded-xl font-black uppercase text-center hover:bg-blue-50 transition-all shadow-xl active:scale-95">Interroger Vera</a>
  </section>
);

// --- 7. NEWS FEED ---
const NewsFeed = () => {
  const [news, setNews] = useState<any[]>([]);
  useEffect(() => {
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://www.cert.ssi.gouv.fr/feed/&count=3&t=${Date.now()}`)
      .then(res => res.json()).then(data => { if (data.items) setNews(data.items); });
  }, []);
  return (
    <section className="bg-white p-6 md:p-8 rounded-[2.5rem] border-4 border-black shadow-2xl h-full text-left">
      <h2 className="font-black uppercase italic text-xl mb-6 flex items-center gap-2"><Radio className="text-red-500 animate-pulse" /> Alertes ANSSI</h2>
      <div className="space-y-4">
        {news.length > 0 ? news.map((item, i) => (
          <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="block p-4 bg-gray-50 border-2 border-black rounded-2xl hover:bg-yellow-50 transition-all">
            <h3 className="font-black text-[11px] uppercase leading-tight mb-2">{item.title}</h3>
            <p className="text-[8px] bg-red-100 text-red-600 w-fit px-2 py-0.5 rounded font-black">{new Date(item.pubDate).toLocaleDateString()}</p>
          </a>
        )) : <div className="text-xs font-bold text-gray-400 uppercase">Chargement...</div>}
      </div>
    </section>
  );
};

// --- 8. CYBER QUIZ ---
const CyberQuiz = () => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  const questions = [
    { q: "Un ami demande de l'argent en urgence par SMS ?", r: "Faux", e: "C'est une arnaque classique. Appelez toujours pour confirmer. Pour en savoir plus sur les arnaques aux sentiments et deepfakes : https://www.cybermalveillance.gouv.fr" },
    { q: "Le cadenas (HTTPS) garantit la fiabilité d'un site ?", r: "Faux", e: "Le cadenas chiffre la connexion, mais le site peut être frauduleux. Vérifiez toujours l'URL." },
    { q: "L'IA peut imiter la voix d'un proche ?", r: "Vrai", e: "C'est le deepfake vocal. Soyez vigilant lors d'appels suspects demandant de l'argent." },
    { q: "Utiliser le même mot de passe partout ?", r: "Faux", e: "Utilisez un gestionnaire de mots de passe pour avoir une clé unique par site." }
  ];

  const handleAns = (ans: string) => {
    if (ans === questions[step].r) setScore(score + 1);
    setShowExplanation(true);
  };

  return (
    <section className="bg-purple-600 p-8 rounded-[2.5rem] text-white shadow-2xl border-4 border-black h-full flex flex-col justify-center text-left relative">
      <h2 className="font-black italic uppercase text-2xl mb-4 tracking-tighter">Cyber Quiz</h2>
      {!showFinal ? (
        <div className="bg-white/10 p-5 rounded-2xl">
          <p className="font-bold text-base mb-6">{questions[step].q}</p>
          {!showExplanation ? (
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleAns("Vrai")} className="bg-white text-purple-600 py-3 rounded-xl font-black uppercase text-xs">Vrai</button>
              <button onClick={() => handleAns("Faux")} className="bg-black text-white py-3 rounded-xl font-black uppercase text-xs">Faux</button>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <p className="text-xs font-bold mb-4 bg-black/20 p-4 rounded-xl border border-white/20 italic">{questions[step].e}</p>
              <button onClick={() => { setShowExplanation(false); if (step < questions.length - 1) setStep(step + 1); else setShowFinal(true); }} className="w-full bg-white text-purple-600 py-3 rounded-xl font-black uppercase text-[10px]">Suivant</button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <Trophy size={56} className="mx-auto mb-4 text-yellow-400"/>
          <p className="font-black text-3xl uppercase">Score : {score}/{questions.length}</p>
          <button onClick={() => {setStep(0); setScore(0); setShowFinal(false)}} className="mt-6 bg-black text-white px-8 py-2 rounded-full font-black uppercase text-[10px]">Recommencer</button>
        </div>
      )}
    </section>
  );
};

function App() {
  useEffect(() => {
    const s = document.createElement("script"); s.src = "https://embed.tawk.to/69ee706ebd68fb1c32a82772/1jn5mech0"; s.async = true; document.head.appendChild(s);
  }, []);

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-[#F0F0F0] font-sans text-black pb-20">
        <UrgentAlert />
        <div className="p-4 md:p-10">
          <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-black p-3 rounded-2xl text-yellow-400 shadow-xl"><ShieldCheck size={32} /></div>
              <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter leading-none text-left">Mon Bouclier<br/><span className="text-yellow-500 text-2xl md:text-3xl">Numérique</span></h1>
            </div>
            <a href="/Bouclier%20Cyber%20.apk" download className="bg-[#ffde59] px-8 py-4 rounded-2xl font-black uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all text-sm active:translate-x-[0px] shadow-none">📥 App Android</a>
          </header>
          <Breadcrumbs />
          <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <article className="lg:col-span-2 bg-white p-6 md:p-10 rounded-[3rem] shadow-2xl border-4 border-black text-left">
              <div className="aspect-video rounded-[2.5rem] overflow-hidden border-4 border-black bg-gray-100 mb-8">
                <iframe width="100%" height="100%" src="https://www.youtube.com/embed/LVYqk4O4wBw" frameBorder="0" allowFullScreen></iframe>
              </div>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4">Hygiène Numérique</h2>
              <p className="text-base font-bold text-gray-600">Protégez votre identité et vos données avec nos outils pilotés par l'intelligence artificielle locale.</p>
            </article>
            <ScamAI />
            <IdentityPhantom />
            <VeraModule />
            <NewsFeed />
            <PasswordTool />
            <CyberQuiz />
            <section className="bg-white p-10 rounded-[3rem] border-4 border-black shadow-2xl flex flex-col justify-center items-center">
                <div className="p-5 rounded-2xl bg-blue-500 text-white mb-6"><FileSearch size={40} /></div>
                <h2 className="font-black uppercase text-2xl mb-4">VirusTotal</h2>
                <a href="https://www.virustotal.com/" target="_blank" rel="noopener noreferrer" className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase text-sm hover:bg-blue-600 transition-all shadow-xl active:scale-95">Scanner un fichier</a>
            </section>
          </main>
        </div>
      </div>
    </HelmetProvider>
  );
}

export default App;