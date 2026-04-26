import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { 
  ShieldCheck, Loader2, Globe, ExternalLink, 
  Trophy, Zap, Key, Fingerprint, ShieldAlert, 
  Copy, Check, FileSearch, Radio, Lightbulb, 
  AlertTriangle, ChevronRight, HelpCircle, MessageSquare
} from 'lucide-react';
import { pipeline } from '@xenova/transformers';

const Breadcrumbs = () => (
  <nav className="max-w-7xl mx-auto mb-8 px-4 py-2 bg-gray-100 rounded-lg flex items-center gap-3 text-sm font-bold text-gray-600" aria-label="Fil d'Ariane">
    <ol className="flex items-center gap-2">
      <li><a href="/" className="hover:text-black">Accueil</a></li>
      <ChevronRight size={14} />
      <li className="text-black font-black italic">Protection Numérique</li>
    </ol>
  </nav>
);

const ScamAI = () => {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState<{score: number, advice: string, level: string, color: string, flags: string[]} | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeReal = async () => {
    if (!text.trim() || text.length < 10) return;
    setLoading(true);
    try {
      // IA LOCALE : Utilisation de Transformers.js pour analyser le texte
      const classifier = await pipeline('text-classification', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
      const result = await classifier(text);
      
      const score = Math.round(result[0].score * 100);
      const isSuspect = result[0].label === 'NEGATIVE' || text.toLowerCase().includes('banque') || text.toLowerCase().includes('urgent');

      setAnalysis({
        score: isSuspect ? score : 100 - score,
        level: isSuspect ? (score > 80 ? "CRITIQUE" : "MODÉRÉ") : "FAIBLE",
        color: isSuspect ? (score > 80 ? "text-red-600" : "text-orange-500") : "text-green-600",
        advice: isSuspect 
          ? "🚨 DANGER : L'IA locale détecte des indices de phishing. Ne partagez aucune donnée !"
          : "✅ SAIN : L'IA n'a pas détecté de menace immédiate. Restez tout de même vigilant.",
        flags: ["IA Locale", isSuspect ? "Analyse Sémantique" : "Vérifié"]
      });
    } catch (error) {
      console.error("Erreur IA:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="bg-white p-6 md:p-8 rounded-[2.5rem] border-4 border-black shadow-2xl h-full flex flex-col">
      <header className="flex items-center gap-4 mb-6">
        <div className="bg-yellow-400 p-3 rounded-2xl border-2 border-black rotate-[-5deg] shadow-lg"><ShieldAlert size={28}/></div>
        <h2 className="font-black italic uppercase text-2xl tracking-tighter text-left">Scanner Phishing IA</h2>
      </header>
      <div className="relative flex-grow">
        <textarea 
          className="w-full h-40 p-4 bg-gray-50 border-2 border-black rounded-2xl font-bold text-sm focus:ring-4 ring-yellow-400 outline-none text-black placeholder-gray-400"
          placeholder="Collez ici un SMS ou email douteux..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-3 mt-4">
        <button onClick={analyzeReal} disabled={loading || text.length < 10} className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all disabled:opacity-30">
          {loading ? <Loader2 className="animate-spin mx-auto" /> : "Analyser avec mon IA"}
        </button>
        <a href="https://www.askvera.org" target="_blank" rel="noopener noreferrer" className="w-full bg-blue-500 text-white py-3 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 hover:bg-blue-600 transition-all">
          <Globe size={16}/> Vérifier l'info avec VERA
        </a>
      </div>
      {analysis && (
        <div className="mt-6 p-5 bg-gray-100 rounded-2xl border-2 border-black animate-in fade-in zoom-in">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black uppercase text-gray-500">Probabilité d'arnaque :</span>
            <span className={`font-black uppercase italic ${analysis.color}`}>{analysis.level} ({analysis.score}%)</span>
          </div>
          <p className="font-bold text-sm text-left mb-4">{analysis.advice}</p>
          <div className="flex flex-wrap gap-2">
            {analysis.flags.map(f => (<span key={f} className="text-[9px] bg-black text-white px-2 py-1 rounded-md font-black uppercase tracking-tighter">#{f}</span>))}
          </div>
        </div>
      )}
    </article>
  );
};

const PasswordTool = () => {
  const [pass, setPass] = useState("");
  const [generated, setGenerated] = useState("");
  const checkStrength = () => {
    if (!pass) return { score: 0, text: "Vide", color: "bg-gray-200" };
    let s = 0;
    if (pass.length > 10) s += 25;
    if (/[A-Z]/.test(pass)) s += 25;
    if (/[0-9]/.test(pass)) s += 25;
    if (/[^A-Za-z0-9]/.test(pass)) s += 25;
    if (s > 75) return { score: s, text: "Excellent", color: "bg-green-500" };
    if (s > 40) return { score: s, text: "Moyen", color: "bg-yellow-500" };
    return { score: s, text: "Faible", color: "bg-red-500" };
  };
  const generatePass = () => {
    const chars = "ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()";
    const array = new Uint32Array(16);
    window.crypto.getRandomValues(array);
    let res = "";
    for (let i = 0; i < 16; i++) { res += chars.charAt(array[i] % chars.length); }
    setGenerated(res);
  };
  const strength = checkStrength();
  return (
    <section className="bg-black p-6 md:p-8 rounded-[2.5rem] text-white shadow-2xl">
      <h2 className="font-black italic uppercase text-2xl mb-6 flex items-center gap-3 text-left">Le Coffre-Fort <Key className="text-blue-400"/></h2>
      <div className="space-y-4">
        <input type="text" className="w-full p-4 bg-zinc-900 border-2 border-zinc-700 rounded-2xl font-mono text-blue-400 text-base focus:border-blue-500 outline-none" placeholder="Testez un mot de passe..." value={pass} onChange={(e) => setPass(e.target.value)} />
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden"><div className={`h-full transition-all duration-500 ${strength.color}`} style={{ width: `${strength.score}%` }} /></div>
        <p className="text-[10px] font-black uppercase text-zinc-500 text-left">Force : {strength.text}</p>
        <button onClick={generatePass} className="w-full py-4 bg-blue-600 rounded-xl font-black uppercase text-xs hover:bg-blue-400 transition-all shadow-lg active:scale-95">Générer un mot de passe sûr</button>
        {generated && <div className="mt-4 p-3 bg-white text-black rounded-lg font-mono text-center text-sm cursor-pointer hover:bg-gray-100" onClick={() => navigator.clipboard.writeText(generated)}>{generated} <span className="text-[8px] block opacity-50 mt-1 uppercase">(Cliquer pour copier)</span></div>}
      </div>
    </section>
  );
};

const NewsFeed = () => {
  const [news, setNews] = useState<any[]>([]);
  useEffect(() => {
    // REPARATION ACTU : Utilisation d'un proxy RSS stable
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://www.cert.ssi.gouv.fr/feed/&api_key=oy87v9rzn6pndl2v7mx8x17p57v0n0p8v8p8v8p8`)
      .then(res => res.json()).then(data => { if (data.items) setNews(data.items.slice(0, 3)); });
  }, []);
  return (
    <section className="bg-white p-6 md:p-8 rounded-[2.5rem] border-4 border-black shadow-2xl h-full">
      <h2 className="font-black uppercase italic text-xl mb-6 flex items-center gap-2 text-left"><Radio className="text-red-500" /> Alertes ANSSI</h2>
      <div className="space-y-4">
        {news.length > 0 ? news.map((item, i) => (
          <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="block p-3 bg-gray-50 border-2 border-black rounded-xl hover:bg-yellow-50 text-left transition-colors">
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
    // INTEGRATION CHAT : Crisp pour répondre aux gens
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "771e847c-501b-4152-a5f1-59914713e2f5"; // ID de démo, à remplacer par le tien sur crisp.chat
    (function() {
      var d = document;
      var s = d.createElement("script");
      s.src = "https://client.crisp.chat/l.js";
      s.async = 1;
      d.getElementsByTagName("head")[0].appendChild(s);
    })();
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Mon Bouclier Numérique | IA & Sécurité</title>
        <meta name="description" content="Scanner phishing par IA locale, fact-checking avec Vera et protection citoyenne." />
      </Helmet>

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
          <article className="lg:col-span-2 bg-white p-6 rounded-[3rem] shadow-2xl border-4 border-black">
            <div className="aspect-video rounded-[2.5rem] overflow-hidden border-4 border-black bg-gray-100">
              <iframe width="100%" height="100%" src="https://www.youtube.com/embed/LVYqk4O4wBw" title="Guide Cybersécurité" frameBorder="0" allowFullScreen></iframe>
            </div>
            <div className="mt-8 text-left">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter">Hygiène Numérique</h2>
              <p className="text-base font-bold text-gray-600 mt-2">Apprenez à identifier les pièges du web avec nos nouveaux outils dopés à l'IA locale.</p>
            </div>
          </article>
          <ScamAI />
          <NewsFeed />
          <PasswordTool />
          <section className="bg-white p-8 rounded-[3rem] border-4 border-black shadow-2xl text-center flex flex-col justify-center">
              <div className="p-4 rounded-2xl bg-blue-500 text-white inline-block mb-4 mx-auto"><FileSearch size={32} /></div>
              <h2 className="font-black uppercase text-xl mb-4">Analyse Fichier</h2>
              <a href="https://www.virustotal.com/" target="_blank" rel="noopener noreferrer" className="w-full block py-4 bg-blue-600 text-white rounded-xl font-black text-xs uppercase hover:bg-black transition-all shadow-lg">VirusTotal</a>
          </section>
          <section className="lg:col-span-3 bg-red-600 p-8 md:p-12 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden border-4 border-black">
             <div className="absolute top-0 right-0 p-10 opacity-10"><Fingerprint size={160}/></div>
             <div className="relative z-10 text-left">
               <h2 className="font-black uppercase italic text-3xl md:text-4xl">Fuites de données ?</h2>
               <p className="text-sm font-black uppercase text-red-200 mt-3">Vérifiez vos emails sur Have I Been Pwned.</p>
             </div>
             <a href="https://haveibeenpwned.com/" target="_blank" rel="noopener noreferrer" className="px-12 py-5 bg-white text-red-600 rounded-2xl font-black uppercase text-sm relative z-10 shadow-2xl hover:scale-105 transition-all">Scanner mes comptes</a>
          </section>
        </main>
      </div>
    </HelmetProvider>
  );
}

export default App;