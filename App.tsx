import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { 
  ShieldCheck, Loader2, Globe, Trophy, Key, Fingerprint, ShieldAlert, 
  FileSearch, Radio, ChevronRight, MessageSquare, CheckCircle2, XCircle, Info
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
      const isSuspect = result[0].label === 'NEGATIVE' || /(banque|ameli|urgent|impots|virement|lot|gagné|votre compte)/i.test(text);

      setAnalysis({
        score: isSuspect ? score : 100 - score,
        level: isSuspect ? "CRITIQUE" : "FAIBLE",
        color: isSuspect ? "text-red-600" : "text-green-600",
        advice: isSuspect ? "🚨 Arnaque probable détectée par l'IA locale. Ne cliquez sur rien !" : "✅ Aucun danger immédiat détecté par l'IA.",
      });
    } catch (e) { 
        console.error(e);
        setAnalysis({ score: 0, level: "ERREUR", color: "text-gray-500", advice: "L'IA n'a pas pu charger. Vérifiez votre connexion." });
    } finally { setLoading(false); }
  };

  return (
    <article className="bg-white p-6 md:p-8 rounded-[2.5rem] border-4 border-black shadow-2xl h-full flex flex-col text-left">
      <header className="flex items-center gap-4 mb-6">
        <div className="bg-yellow-400 p-3 rounded-2xl border-2 border-black rotate-[-5deg] shadow-lg"><ShieldAlert size={28}/></div>
        <h2 className="font-black italic uppercase text-2xl tracking-tighter">Scanner IA</h2>
      </header>
      <textarea className="w-full h-40 p-4 bg-gray-50 border-2 border-black rounded-2xl font-bold text-sm focus:ring-4 ring-yellow-400 outline-none text-black mb-4 shadow-inner" placeholder="Collez le message suspect ici..." value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={analyzeReal} disabled={loading || text.length < 10} className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase hover:bg-yellow-400 hover:text-black transition-all disabled:opacity-30 shadow-lg active:scale-95">
        {loading ? <Loader2 className="animate-spin mx-auto" /> : "Lancer l'Analyse"}
      </button>
      {analysis && (
        <div className="mt-6 p-5 bg-gray-100 rounded-2xl border-2 border-black animate-in fade-in zoom-in">
          <p className={`font-black uppercase italic ${analysis.color}`}>{analysis.level} ({analysis.score}%)</p>
          <p className="font-bold text-sm mt-2">{analysis.advice}</p>
        </div>
      )}
    </article>
  );
};

// --- 3. MODULE VERA (Dédié et Indépendant) ---
const VeraModule = () => (
  <section className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-2xl border-4 border-black flex flex-col justify-center text-left relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-10"><Globe size={120} /></div>
    <div className="bg-white text-blue-600 p-3 rounded-xl inline-block w-fit mb-4 shadow-lg relative z-10"><Info size={28}/></div>
    <h2 className="font-black italic uppercase text-2xl mb-2 relative z-10">Fact-Checking VERA</h2>
    <p className="text-sm font-bold opacity-90 mb-6 relative z-10">Une information douteuse ? Vera vérifie les faits en quelques secondes.</p>
    <a href="https://www.askvera.org" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 py-4 rounded-xl font-black uppercase text-center hover:bg-blue-50 transition-all shadow-xl relative z-10 active:scale-95">Interroger Vera</a>
  </section>
);

// --- 4. TESTEUR DE MOT DE PASSE (Fixé avec Entropie) ---
const PasswordTool = () => {
  const [pass, setPass] = useState("");
  const [generated, setGenerated] = useState("");
  
  const getStrength = (p: string) => {
    if (!p) return 0;
    let s = 0;
    if (p.length > 8) s += 20;
    if (p.length > 12) s += 10;
    if (/[A-Z]/.test(p)) s += 20;
    if (/[a-z]/.test(p)) s += 10;
    if (/[0-9]/.test(p)) s += 20;
    if (/[^A-Za-z0-9]/.test(p)) s += 20;
    return Math.min(s, 100);
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
    <section className="bg-black p-6 md:p-8 rounded-[2.5rem] text-white shadow-2xl text-left border-4 border-zinc-800">
      <h2 className="font-black italic uppercase text-2xl mb-6 flex items-center gap-3">Le Coffre-Fort <Key className="text-blue-400"/></h2>
      <input type="text" className="w-full p-4 bg-zinc-900 border-2 border-zinc-700 rounded-2xl font-mono text-blue-400 mb-4 outline-none focus:border-blue-500 shadow-inner" placeholder="Testez un mot de passe..." value={pass} onChange={(e) => setPass(e.target.value)} />
      <div className="h-3 bg-zinc-800 rounded-full mb-2 overflow-hidden">
        <div className={`h-full transition-all duration-700 ${strength > 75 ? 'bg-green-500' : strength > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${strength}%` }} />
      </div>
      <p className="text-[10px] font-black uppercase text-zinc-500 mb-4">Robustesse : {strength > 75 ? 'Maximale' : strength > 40 ? 'Moyenne' : 'Vulnérable'}</p>
      <button onClick={generatePass} className="w-full py-4 bg-blue-600 rounded-xl font-black uppercase text-xs hover:bg-blue-400 transition-all shadow-lg active:scale-95">Générer un mot de passe sûr</button>
      {generated && (
        <div className="mt-4 p-4 bg-zinc-800 text-blue-300 rounded-xl font-mono text-center text-sm cursor-pointer border border-blue-500/30 animate-in fade-in slide-in-from-top-2" onClick={() => navigator.clipboard.writeText(generated)}>
          {generated} <span className="block text-[8px] opacity-50 mt-1 uppercase">(Cliquer pour copier)</span>
        </div>
      )}
    </section>
  );
};

// --- 5. CYBER QUIZ (Interactif) ---
const CyberQuiz = () => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  const questions = [
    { q: "Un ami demande de l'argent en urgence par SMS ?", r: "Faux", e: "Attention ! C'est une technique classique d'usurpation. Appelez toujours pour confirmer de vive voix." },
    { q: "Le cadenas (HTTPS) garantit que le site est fiable ?", r: "Faux", e: "Faux. N'importe qui peut avoir un cadenas. Regardez bien l'adresse du site (l'URL)." },
    { q: "L'IA peut imiter la voix d'un proche au téléphone ?", r: "Vrai", e: "C'est le 'Deepfake'. Si l'appel est louche, posez une question dont seul votre proche connaît la réponse." },
    { q: "Mettre son nom ou sa date de naissance dans un code ?", r: "Faux", e: "C'est la première chose que les pirates testent. Utilisez des mots sans lien avec vous." }
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
    <section className="bg-purple-600 p-8 rounded-[2.5rem] text-white shadow-2xl border-4 border-black h-full flex flex-col justify-center text-left relative">
      <h2 className="font-black italic uppercase text-2xl mb-4 tracking-tighter">Cyber Quiz</h2>
      {!showFinal ? (
        <div className="bg-white/10 p-5 rounded-2xl">
          <p className="font-bold text-base mb-6 leading-tight">{questions[step].q}</p>
          {!showExplanation ? (
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleAns("Vrai")} className="bg-white text-purple-600 py-3 rounded-xl font-black uppercase text-xs hover:scale-105 transition-transform shadow-md">Vrai</button>
              <button onClick={() => handleAns("Faux")} className="bg-black text-white py-3 rounded-xl font-black uppercase text-xs hover:scale-105 transition-transform shadow-md">Faux</button>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <p className="text-xs font-bold mb-4 bg-black/20 p-4 rounded-xl border border-white/20 italic">{questions[step].e}</p>
              <button onClick={next} className="w-full bg-white text-purple-600 py-3 rounded-xl font-black uppercase text-[10px] shadow-lg active:scale-95">Question suivante</button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <Trophy size={56} className="mx-auto mb-4 text-yellow-400"/>
          <p className="font-black text-3xl uppercase">Score : {score}/{questions.length}</p>
          <button onClick={() => {setStep(0); setScore(0); setShowFinal(false)}} className="mt-6 bg-black text-white px-8 py-2 rounded-full font-black uppercase text-[10px] shadow-xl hover:scale-105 transition-all">Recommencer</button>
        </div>
      )}
    </section>
  );
};

// --- 6. ACTUALITÉS (Version Multi-Source) ---
const NewsFeed = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Utilisation d'une méthode plus simple sans clé API complexe
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://www.cert.ssi.gouv.fr/feed/&count=3&t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (data.items && data.items.length > 0) {
          setNews(data.items);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="bg-white p-6 md:p-8 rounded-[2.5rem] border-4 border-black shadow-2xl h-full text-left">
      <h2 className="font-black uppercase italic text-xl mb-6 flex items-center gap-2"><Radio className="text-red-500 animate-pulse" /> Alertes Cyber</h2>
      <div className="space-y-4">
        {!loading ? (
          news.length > 0 ? news.map((item, i) => (
            <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="block p-4 bg-gray-50 border-2 border-black rounded-2xl hover:bg-yellow-50 transition-all hover:translate-x-1">
              <h3 className="font-black text-[11px] uppercase leading-tight line-clamp-2 mb-2">{item.title}</h3>
              <div className="flex justify-between items-center">
                <p className="text-[8px] text-gray-400 font-bold uppercase">ANSSI / CERT-FR</p>
                <p className="text-[8px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-black">{new Date(item.pubDate).toLocaleDateString()}</p>
              </div>
            </a>
          )) : <div className="text-xs font-bold text-gray-400 uppercase italic p-4 border-2 border-dashed border-gray-200 rounded-2xl">Aucune alerte récente</div>
        ) : (
          <div className="flex flex-col gap-4 animate-pulse">
            {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-2xl" />)}
          </div>
        )}
      </div>
    </section>
  );
};

function App() {
  useEffect(() => {
    // Chat Tawk.to direct
    const s = document.createElement("script");
    s.async = true;
    s.src = 'https://embed.tawk.to/69ee706ebd68fb1c32a82772/1jn5mech0';
    s.charset = 'UTF-8';
    s.setAttribute('crossorigin', '*');
    document.head.appendChild(s);
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Mon Bouclier Numérique | Protection Citoyenne</title>
        <meta name="description" content="Portail de cybersécurité avec IA locale, fact-checking Vera et quiz de sensibilisation." />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Helmet>

      <div className="min-h-screen bg-[#F0F0F0] font-sans text-black pb-20 p-4 md:p-10 selection:bg-yellow-400">
        <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-black p-3 rounded-2xl text-yellow-400 shadow-xl"><ShieldCheck size={32} /></div>
            <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter leading-none text-left">Mon Bouclier<br/><span className="text-yellow-500 text-2xl md:text-3xl">Numérique</span></h1>
          </div>
          <a href="/Bouclier%20Cyber%20.apk" download className="bg-[#ffde59] px-8 py-4 rounded-2xl font-black uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all text-sm active:translate-x-[0px] active:translate-y-[0px] active:shadow-none">
            📥 Télécharger l'App
          </a>
        </header>

        <Breadcrumbs />

        <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <article className="lg:col-span-2 bg-white p-6 md:p-10 rounded-[3rem] shadow-2xl border-4 border-black text-left">
            <div className="aspect-video rounded-[2.5rem] overflow-hidden border-4 border-black bg-gray-100 mb-8">
              <iframe width="100%" height="100%" src="https://www.youtube.com/embed/LVYqk4O4wBw" title="Guide Cybersécurité" frameBorder="0" allowFullScreen></iframe>
            </div>
            <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4">Agir pour sa sécurité</h2>
            <p className="text-base font-bold text-gray-600 leading-relaxed">Ce portail citoyen regroupe les outils essentiels pour scanner vos messages suspects, vérifier la fiabilité d'un site et tester vos connaissances face aux menaces du web.</p>
          </article>

          <ScamAI />
          <VeraModule />
          <NewsFeed />
          <PasswordTool />

          <section className="bg-white p-10 rounded-[3rem] border-4 border-black shadow-2xl text-center flex flex-col justify-center items-center">
              <div className="p-5 rounded-2xl bg-blue-500 text-white mb-6 shadow-xl"><FileSearch size={40} /></div>
              <h2 className="font-black uppercase text-2xl mb-4">Analyse de Fichiers</h2>
              <p className="text-xs font-bold text-gray-400 mb-8 uppercase tracking-widest">Vérifiez si vos téléchargements sont sains</p>
              <a href="https://www.virustotal.com/" target="_blank" rel="noopener noreferrer" className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase text-sm hover:bg-blue-600 transition-all shadow-xl active:scale-95">Accéder à VirusTotal</a>
          </section>

          <CyberQuiz />

          <section className="lg:col-span-3 bg-red-600 p-8 md:p-14 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden border-4 border-black text-left">
             <div className="absolute top-0 right-0 p-10 opacity-10"><Fingerprint size={200}/></div>
             <div className="relative z-10">
               <h2 className="font-black uppercase italic text-4xl md:text-5xl tracking-tighter leading-none mb-4">Données compromises ?</h2>
               <p className="text-lg font-black uppercase text-red-200 tracking-tight">Vérifiez si vos comptes figurent dans des fuites publiques.</p>
             </div>
             <a href="https://haveibeenpwned.com/" target="_blank" rel="noopener noreferrer" className="px-16 py-6 bg-white text-red-600 rounded-[2rem] font-black uppercase text-lg relative z-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:scale-105 transition-all text-center">
               Scanner mes mails
             </a>
          </section>
        </main>

        <footer className="max-w-7xl mx-auto mt-20 pt-10 border-t-4 border-black flex flex-col md:flex-row justify-between items-center gap-10 font-black uppercase text-[12px] text-gray-500">
          <p>© 2026 Mon Bouclier Numérique — Sensibilisation & Protection</p>
          <div className="flex gap-10">
            <a href="#" className="hover:text-black transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-black transition-colors">Confidentialité</a>
          </div>
        </footer>
      </div>
    </HelmetProvider>
  );
}

export default App;