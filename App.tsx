import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { 
  ShieldCheck, Loader2, Globe, Trophy, Key, Fingerprint, ShieldAlert, 
  FileSearch, Radio, ChevronRight, MessageSquare, CheckCircle2, XCircle, Info, Send, VideoOff, Type
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

// --- 2. BANNIERE ALERTE URGENTE ---
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
        body: JSON.stringify({ 
          text: analysis.text, 
          score: analysis.score, 
          level: analysis.level, 
          source: "Mon Bouclier Numérique (Julian)",
          timestamp: new Date().toISOString()
        })
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
      <button onClick={analyzeReal} disabled={loading || text.length < 10} className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase hover:bg-yellow-400 hover:text-black transition-all mb-3 shadow-lg active:scale-95">
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

// --- 4. ALERTE DEEPFAKE ---
const DeepfakeAlert = () => (
  <section className="bg-zinc-900 p-8 rounded-[2.5rem] border-4 border-black shadow-2xl text-white flex flex-col justify-center text-left relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-10"><VideoOff size={140} /></div>
    <div className="bg-red-500 text-white p-3 rounded-xl inline-block w-fit mb-4 shadow-lg relative z-10"><VideoOff size={28}/></div>
    <h2 className="font-black italic uppercase text-2xl mb-2 relative z-10">Alerte Deepfake</h2>
    <p className="text-sm font-bold opacity-90 mb-6 relative z-10">L'IA peut imiter les voix et les visages (Hypertrucage). Soyez vigilant lors de vos appels.</p>
    <a href="https://www.cnil.fr/fr/hypertrucage-deepfake" target="_blank" rel="noopener noreferrer" className="bg-red-500 text-white py-4 rounded-xl font-black uppercase text-center hover:bg-red-600 transition-all shadow-xl relative z-10 active:scale-95">Guide de la CNIL</a>
  </section>
);

// --- 5. IDENTITÉ FANTÔME ---
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
      {pseudo && <div className="p-4 bg-white border-2 border-black rounded-xl font-mono text-center font-black text-lg">{pseudo}</div>}
    </section>
  );
};

// --- 6. TESTEUR DE MOT DE PASSE (Avec Option Phrase de Passe) ---
const PasswordTool = () => {
  const [pass, setPass] = useState("");
  const [generated, setGenerated] = useState("");
  const [mode, setMode] = useState<'pass' | 'phrase'>('pass');
  
  const getStrength = (p: string) => {
    if (!p) return 0;
    let s = 0;
    if (p.length > 10) s += 25; if (/[A-Z]/.test(p)) s += 25; if (/[0-9]/.test(p)) s += 25; if (/[^A-Za-z0-9]/.test(p)) s += 25;
    return Math.min(s, 100);
  };

  const strength = getStrength(pass);

  const generatePass = () => {
    const chars = "ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()";
    const array = new Uint32Array(16); window.crypto.getRandomValues(array);
    let res = ""; for (let i = 0; i < 16; i++) { res += chars.charAt(array[i] % chars.length); }
    setGenerated(res);
  };

  const generatePhrase = () => {
    const words = ["ocean", "vitesse", "calme", "argent", "foret", "spectre", "nuage", "hiver", "flamme", "pierre", "ombre", "soleil", "pilote", "faucon", "secret", "pixel"];
    const array = new Uint32Array(4); window.crypto.getRandomValues(array);
    const res = Array.from(array).map(v => words[v % words.length]).join("-");
    setGenerated(res);
  };

  return (
    <section className="bg-black p-6 md:p-8 rounded-[2.5rem] text-white shadow-2xl text-left border-4 border-zinc-800">
      <h2 className="font-black italic uppercase text-2xl mb-6 flex items-center gap-3">Le Coffre-Fort <Key className="text-blue-400"/></h2>
      <input type="text" className="w-full p-4 bg-zinc-900 border-2 border-zinc-700 rounded-2xl font-mono text-blue-400 mb-4 outline-none focus:border-blue-500 shadow-inner" placeholder="Testez un mot de passe..." value={pass} onChange={(e) => setPass(e.target.value)} />
      <div className="h-3 bg-zinc-800 rounded-full mb-2 overflow-hidden">
        <div className={`h-full transition-all duration-700 ${strength > 75 ? 'bg-green-500' : strength > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${strength}%` }} />
      </div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setMode('pass')} className={`flex-1 py-2 rounded-lg font-black uppercase text-[9px] border-2 ${mode === 'pass' ? 'bg-blue-600 border-blue-400' : 'bg-transparent border-zinc-700 opacity-50'}`}>Mot de passe</button>
        <button onClick={() => setMode('phrase')} className={`flex-1 py-2 rounded-lg font-black uppercase text-[9px] border-2 ${mode === 'phrase' ? 'bg-blue-600 border-blue-400' : 'bg-transparent border-zinc-700 opacity-50'}`}>Phrase de passe</button>
      </div>
      <button onClick={mode === 'pass' ? generatePass : generatePhrase} className="w-full py-4 bg-blue-600 rounded-xl font-black uppercase text-xs hover:bg-blue-400 transition-all active:scale-95 shadow-lg">
        {mode === 'pass' ? "Générer un mot de passe sûr" : "Générer une phrase de passe"}
      </button>
      {generated && <div className="mt-4 p-3 bg-zinc-800 text-blue-300 rounded-xl font-mono text-center text-sm cursor-pointer border border-blue-500/30 animate-in fade-in" onClick={() => navigator.clipboard.writeText(generated)}>{generated}</div>}
    </section>
  );
};

// --- 7. VERA MODULE ---
const VeraModule = () => (
  <section className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-2xl border-4 border-black flex flex-col justify-center text-left relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-10"><Globe size={120} /></div>
    <div className="bg-white text-blue-600 p-3 rounded-xl inline-block w-fit mb-4 shadow-lg relative z-10"><Info size={28}/></div>
    <h2 className="font-black italic uppercase text-2xl mb-2 relative z-10">Fact-Checking VERA</h2>
    <p className="text-sm font-bold opacity-90 mb-6 relative z-10">Vérifiez les faits en quelques secondes avec Vera.</p>
    <a href="https://www.askvera.org" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 py-4 rounded-xl font-black uppercase text-center hover:bg-blue-50 transition-all shadow-xl relative z-10 active:scale-95">Interroger Vera</a>
  </section>
);

// --- 8. NEWS FEED (Fixed for robustness) ---
const NewsFeed = () => {
  const [news, setNews] = useState<any[]>([]);
  const [error, setError] = useState(false);
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
      }).catch(() => setError(true));
  }, []);
  return (
    <section className="bg-white p-6 md:p-8 rounded-[2.5rem] border-4 border-black shadow-2xl h-full text-left">
      <h2 className="font-black uppercase italic text-xl mb-6 flex items-center gap-2"><Radio className="text-red-500 animate-pulse" /> Alertes ANSSI</h2>
      <div className="space-y-4">
        {news.length > 0 ? news.map((item, i) => (
          <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="block p-4 bg-gray-50 border-2 border-black rounded-2xl hover:bg-yellow-50 transition-all">
            <h3 className="font-black text-[11px] uppercase leading-tight mb-2">{item.title}</h3>
            <p className="text-[8px] bg-red-100 text-red-600 w-fit px-2 py-0.5 rounded font-black">{new Date(item.pubDate!).toLocaleDateString()}</p>
          </a>
        )) : error ? <div className="text-xs font-bold text-red-500">Erreur flux</div> : <div className="text-xs font-bold text-gray-400 animate-pulse">Chargement...</div>}
      </div>
    </section>
  );
};

// --- 9. CYBER QUIZ (Interactif) ---
const CyberQuiz = () => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  const questions = [
    { q: "Un ami demande de l'argent en urgence par SMS ?", r: "Faux", e: "C'est une arnaque classique (smishing). Appelez toujours pour confirmer de vive voix." },
    { q: "Le cadenas (HTTPS) garantit que le site est fiable ?", r: "Faux", e: "Le cadenas chiffre la connexion, mais le site peut être frauduleux. Vérifiez toujours l'URL." },
    { q: "L'IA peut imiter la voix d'un proche au téléphone ?", r: "Vrai", e: "C'est le 'Deepfake'. Si l'appel est louche, posez une question dont seul votre proche connaît la réponse." },
    { q: "Utiliser le même mot de passe partout est sans risque ?", r: "Faux", e: "Si un seul site fuit, tous vos comptes deviennent vulnérables. Utilisez un gestionnaire." }
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
              <button onClick={() => handleAns("Vrai")} className="bg-white text-purple-600 py-3 rounded-xl font-black uppercase text-xs hover:scale-105 transition-transform">Vrai</button>
              <button onClick={() => handleAns("Faux")} className="bg-black text-white py-3 rounded-xl font-black uppercase text-xs hover:scale-105 transition-transform">Faux</button>
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
          <button onClick={() => {setStep(0); setScore(0); setShowFinal(false)}} className="mt-6 bg-black text-white px-8 py-2 rounded-full font-black uppercase text-[10px] shadow-xl hover:scale-105 transition-all">Rejouer</button>
        </div>
      )}
    </section>
  );
};

// --- 10. CHECKLIST SECURITE ---
const SecurityChecklist = () => {
  const [items, setItems] = useState([
    { id: 1, text: "Double authentification (2FA) activée", checked: false },
    { id: 2, text: "Mots de passe complexes et uniques", checked: false },
    { id: 3, text: "Dernières mises à jour système faites", checked: false },
    { id: 4, text: "Sauvegardes régulières effectuées", checked: false },
    { id: 5, text: "Méfiance envers les emails inconnus", checked: false },
  ]);
  const toggle = (id: number) => { setItems(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i)); };
  const progress = Math.round((items.filter(i => i.checked).length / items.length) * 100);
  return (
    <section className="bg-green-500 p-8 rounded-[2.5rem] text-white shadow-2xl border-4 border-black h-full flex flex-col justify-center text-left relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10"><CheckCircle2 size={120} /></div>
      <h2 className="font-black italic uppercase text-2xl mb-4 relative z-10">Checklist Hygiène</h2>
      <div className="space-y-3 relative z-10 mb-6">
        {items.map(i => (
          <div key={i.id} onClick={() => toggle(i.id)} className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-6 h-6 border-2 border-black rounded flex items-center justify-center transition-colors ${i.checked ? 'bg-black' : 'bg-white'}`}>{i.checked && <CheckCircle2 size={14} className="text-green-500" />}</div>
            <span className={`text-sm font-bold ${i.checked ? 'line-through opacity-70' : ''}`}>{i.text}</span>
          </div>
        ))}
      </div>
      <div className="relative z-10">
        <div className="h-4 bg-black/20 rounded-full overflow-hidden border-2 border-black"><div className="h-full bg-white transition-all duration-500" style={{ width: `${progress}%` }} /></div>
        <p className="text-[10px] font-black uppercase mt-2">Protection : {progress}%</p>
      </div>
    </section>
  );
};

function App() {
  useEffect(() => {
    const s = document.createElement("script"); s.src = "https://embed.tawk.to/69ee706ebd68fb1c32a82772/1jn5mech0"; s.async = true; document.head.appendChild(s);
  }, []);

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-[#F0F0F0] font-sans text-black pb-20 selection:bg-yellow-400">
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
                <iframe width="100%" height="100%" src="https://www.youtube.com/embed/LVYqk4O4wBw" title="Guide Cybersécurité" frameBorder="0" allowFullScreen></iframe>
              </div>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4">Agir pour sa sécurité</h2>
              <p className="text-base font-bold text-gray-600">Utilisez nos outils pilotés par l'IA pour tester vos messages suspects et protéger vos identités.</p>
            </article>
            <ScamAI />
            <SecurityChecklist />
            <DeepfakeAlert />
            <IdentityPhantom />
            <VeraModule />
            <NewsFeed />
            <PasswordTool />
            <CyberQuiz />
            <section className="lg:col-span-3 bg-red-600 p-8 md:p-14 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden border-4 border-black text-left">
              <div className="absolute top-0 right-0 p-10 opacity-10"><Fingerprint size={200}/></div>
              <div className="relative z-10">
                <h2 className="font-black uppercase italic text-4xl md:text-5xl">Fuite de données ?</h2>
                <p className="text-lg font-black uppercase text-red-200 tracking-tight">Vérifiez si vos mails sont dans une base piratée.</p>
              </div>
              <a href="https://haveibeenpwned.com/" target="_blank" rel="noopener noreferrer" className="px-16 py-6 bg-white text-red-600 rounded-[2rem] font-black uppercase text-lg relative z-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:scale-105 transition-all text-center">Scanner mes mails</a>
            </section>
            <section className="bg-white p-10 rounded-[3rem] border-4 border-black shadow-2xl flex flex-col justify-center items-center">
                <div className="p-5 rounded-2xl bg-blue-500 text-white mb-6"><FileSearch size={40} /></div>
                <h2 className="font-black uppercase text-2xl mb-4 text-center">VirusTotal</h2>
                <a href="https://www.virustotal.com/" target="_blank" rel="noopener noreferrer" className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase text-sm hover:bg-blue-600 transition-all shadow-xl">Analyser un fichier</a>
            </section>
          </main>
        </div>
      </div>
    </HelmetProvider>
  );
}

export default App;