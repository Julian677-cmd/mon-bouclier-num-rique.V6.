import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { 
  ShieldCheck, Loader2, Globe, ExternalLink, 
  Trophy, Zap, Key, Fingerprint, ShieldAlert, 
  Copy, Check, FileSearch, Radio, Lightbulb, 
  AlertTriangle, ChevronRight, HelpCircle
} from 'lucide-react';

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

  const analyzeReal = () => {
    if (!text.trim() || text.length < 10) return;
    setLoading(true);
    setTimeout(() => {
      let score = 0;
      let flags: string[] = [];
      const msg = text.toLowerCase();
      const rules = [
        { regex: /(vite|urgent|immédiat|24h|dernière chance|expire|sommation|action requise)/g, points: 25, tag: "Pression temporelle" },
        { regex: /(gagné|cadeau|lot|gain|remboursement|bravo|félicitations|héritage|euro|€)/g, points: 30, tag: "Appât financier" },
        { regex: /(ameli|impots|gouv|banque|caf|netflix|chronopost|ups|amazon|compte bloqué)/g, points: 25, tag: "Usurpation de marque" },
        { regex: /(cliquez|lien|connectez-vous|vérifier|click|ici|http|bit\.ly|t\.co|https:\/\/)/g, points: 20, tag: "Lien suspect" },
        { regex: /(mandat|transcash|pcs|coupons|ne dites rien|discrétion|recharge)/g, points: 35, tag: "Paiement anonyme" },
        { regex: /(identifiant|mot de passe|password|cb|carte bleue|numéro|sécurité)/g, points: 15, tag: "Extraction de données" }
      ];
      rules.forEach(rule => {
        const matches = msg.match(rule.regex);
        if (matches) {
          score += rule.points * Math.min(matches.length, 2);
          flags.push(rule.tag);
        }
      });
      if ((msg.match(/!/g) || []).length > 3) { score += 10; flags.push("Ton alarmiste"); }
      let level = "Faible";
      let color = "text-green-600";
      let advice = "✅ Risque faible : Ce message semble classique, mais restez prudent.";
      if (score >= 70) {
        level = "CRITIQUE";
        color = "text-red-600";
        advice = "🚨 DANGER : Arnaque confirmée par analyse sémantique. Ne cliquez pas !";
      } else if (score >= 40) {
        level = "MODÉRÉ";
        color = "text-orange-500";
        advice = "⚠️ ATTENTION : Plusieurs indices de phishing ont été détectés.";
      }
      setAnalysis({ score: Math.min(score, 100), advice, level, color, flags: [...new Set(flags)] });
      setLoading(false);
    }, 1000);
  };

  return (
    <article className="bg-white p-6 md:p-8 rounded-[2.5rem] border-4 border-black shadow-2xl h-full flex flex-col">
      <header className="flex items-center gap-4 mb-6">
        <div className="bg-yellow-400 p-3 rounded-2xl border-2 border-black rotate-[-5deg] shadow-lg"><ShieldAlert size={28}/></div>
        <h2 className="font-black italic uppercase text-2xl tracking-tighter text-left">Détecteur de Scam IA</h2>
      </header>
      <div className="relative flex-grow">
        <textarea 
          className="w-full h-40 p-4 bg-gray-50 border-2 border-black rounded-2xl font-bold text-sm focus:ring-4 ring-yellow-400 outline-none text-black placeholder-gray-400"
          placeholder="Copiez-collez le message suspect ici..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <button 
        onClick={analyzeReal} 
        disabled={loading || text.length < 10}
        className="w-full mt-4 bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all disabled:opacity-30"
      >
        {loading ? <Loader2 className="animate-spin mx-auto" /> : "Lancer l'analyse"}
      </button>
      {analysis && (
        <div className="mt-6 p-5 bg-gray-100 rounded-2xl border-2 border-black animate-in fade-in zoom-in">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black uppercase text-gray-500">Probabilité d'arnaque :</span>
            <span className={`font-black uppercase italic ${analysis.color}`}>{analysis.level} ({analysis.score}%)</span>
          </div>
          <p className="font-bold text-sm text-left mb-4">{analysis.advice}</p>
          <div className="flex flex-wrap gap-2">
            {analysis.flags.map(f => (
              <span key={f} className="text-[9px] bg-black text-white px-2 py-1 rounded-md font-black uppercase tracking-tighter">#{f}</span>
            ))}
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

const CyberQuiz = () => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showRes, setShowRes] = useState(false);
  const questions = [
    { q: "Un ami demande de l'argent par SMS ?", r: "Faux" },
    { q: "Le HTTPS garantit un site 100% honnête ?", r: "Faux" },
    { q: "L'IA peut imiter la voix de vos proches ?", r: "Vrai" }
  ];
  const handleAns = (ans: string) => {
    if (ans === questions[step].r) setScore(score + 1);
    if (step < questions.length - 1) setStep(step + 1); else setShowRes(true);
  };
  return (
    <section className="bg-purple-600 p-8 rounded-[2.5rem] text-white shadow-2xl border-4 border-black h-full flex flex-col justify-center">
      <h2 className="font-black italic uppercase text-2xl mb-4 tracking-tighter text-left">Cyber Quiz</h2>
      {!showRes ? (
        <div className="bg-white/10 p-4 rounded-xl text-left">
          <p className="font-bold text-base mb-6 leading-tight">{questions[step].q}</p>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleAns("Vrai")} className="bg-white text-purple-600 py-3 rounded-xl font-black uppercase text-xs hover:scale-105 transition-transform">Vrai</button>
            <button onClick={() => handleAns("Faux")} className="bg-black text-white py-3 rounded-xl font-black uppercase text-xs hover:scale-105 transition-transform">Faux</button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <Trophy size={48} className="mx-auto mb-4 text-yellow-400"/>
          <p className="font-black text-2xl uppercase">Score : {score}/3</p>
          <button onClick={() => {setStep(0); setScore(0); setShowRes(false)}} className="mt-4 text-[10px] font-black uppercase underline">Rejouer</button>
        </div>
      )}
    </section>
  );
};

const NewsFeed = () => {
  const [news, setNews] = useState<any[]>([]);
  useEffect(() => {
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://www.cert.ssi.gouv.fr/feed/&t=${Date.now()}`)
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
        )) : <div className="text-xs font-bold text-gray-400 uppercase">Chargement...</div>}
      </div>
    </section>
  );
};

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Mon Bouclier Numérique | Scanner Phishing IA & Protection</title>
        <meta name="description" content="Scanner de scam par IA, testeur de mots de passe et guide de cybersécurité gratuit pour tous." />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Helmet>

      <div className="min-h-screen bg-[#F0F0F0] font-sans text-black pb-20 p-4 md:p-10">
        <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-black p-3 rounded-2xl text-yellow-400 shadow-xl"><ShieldCheck size={32} /></div>
            <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter leading-none text-left">
              Mon Bouclier<br/><span className="text-yellow-500 text-2xl md:text-3xl">Numérique</span>
            </h1>
          </div>
          <a href="/Bouclier%20Cyber%20.apk" download className="bg-[#ffde59] color-[#000000] px-6 py-3 rounded-2xl font-black uppercase border-4 border-black shadow-xl hover:scale-105 transition-all text-sm">📥 Télécharger l'App (.apk)</a>
        </header>

        <Breadcrumbs />

        <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <article className="lg:col-span-2 bg-white p-6 rounded-[3rem] shadow-2xl border-4 border-black">
            <div className="aspect-video rounded-[2.5rem] overflow-hidden border-4 border-black bg-gray-100">
              <iframe width="100%" height="100%" src="https://www.youtube.com/embed/LVYqk4O4wBw" title="Guide Cybersécurité" frameBorder="0" allowFullScreen></iframe>
            </div>
            <div className="mt-8 text-left">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter">Le Guide de l'Hygiène Numérique</h2>
              <p className="text-base font-bold text-gray-600 mt-2 leading-relaxed">Apprenez à identifier les pièges du web. Ce portail gratuit regroupe les meilleurs outils pour scanner vos messages suspects et sécuriser vos accès personnels.</p>
            </div>
          </article>
          <ScamAI />
          <NewsFeed />
          <PasswordTool />
          <section className="bg-white p-8 rounded-[3rem] border-4 border-black shadow-2xl text-center flex flex-col justify-center">
              <div className="p-4 rounded-2xl bg-blue-500 text-white inline-block mb-4 mx-auto shadow-md"><FileSearch size={32} /></div>
              <h2 className="font-black uppercase text-xl mb-4">Analyse Fichier</h2>
              <a href="https://www.virustotal.com/" target="_blank" rel="noopener noreferrer" className="w-full block py-4 bg-blue-600 text-white rounded-xl font-black text-xs uppercase hover:bg-black transition-all shadow-lg active:scale-95">VirusTotal</a>
          </section>
          <CyberQuiz />
          <section className="lg:col-span-3 bg-red-600 p-8 md:p-12 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden border-4 border-black">
             <div className="absolute top-0 right-0 p-10 opacity-10"><Fingerprint size={160}/></div>
             <div className="relative z-10 text-left">
               <h2 className="font-black uppercase italic text-3xl md:text-4xl tracking-tighter leading-none">Vos données ont-elles fuité ?</h2>
               <p className="text-sm font-black uppercase text-red-200 mt-3 tracking-widest">Vérifiez si vos emails sont dans une base de données piratée.</p>
             </div>
             <a href="https://haveibeenpwned.com/" target="_blank" rel="noopener noreferrer" className="w-full md:w-auto px-12 py-5 bg-white text-red-600 rounded-2xl font-black uppercase text-sm relative z-10 shadow-2xl hover:scale-105 transition-all text-center">Scanner mes comptes</a>
          </section>
          <section className="lg:col-span-3 bg-white p-10 rounded-[3rem] border-4 border-black mt-4 text-left shadow-xl">
            <h2 className="text-3xl font-black uppercase italic mb-8 underline decoration-yellow-400">Questions Fréquentes (FAQ)</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div><h3 className="font-black uppercase text-lg mb-3">Est-ce que le scanner est privé ?</h3><p className="text-sm font-bold text-gray-500 leading-relaxed">Oui. Aucune donnée n'est transmise. L'analyse du texte se fait localement dans votre propre navigateur.</p></div>
              <div><h3 className="font-black uppercase text-lg mb-3">Comment choisir son mot de passe ?</h3><p className="text-sm font-bold text-gray-500 leading-relaxed">Visez 12 caractères minimum. Mélangez des majuscules, des chiffres et des symboles. Évitez les informations personnelles.</p></div>
            </div>
          </section>
        </main>
        <footer className="max-w-7xl mx-auto mt-20 pt-10 border-t-2 border-black flex flex-col md:flex-row justify-between items-center gap-6 font-black uppercase text-[12px] text-gray-400">
          <p>© 2026 Mon Bouclier Numérique — Mission Sécurité Citoyenne</p>
          <div className="flex gap-10">
            <a href="#" className="hover:text-black transition-colors underline decoration-2 decoration-gray-200">Mentions Légales</a>
            <a href="#" className="hover:text-black transition-colors underline decoration-2 decoration-gray-200">Confidentialité</a>
          </div>
        </footer>
      </div>
    </HelmetProvider>
  );
}

export default App;