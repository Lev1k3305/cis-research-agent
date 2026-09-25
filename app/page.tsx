"use client";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import MatrixRain from "./components/MatrixRain";

// Typing эффект хук
function useTypewriter(text: string, speed: number = 5) {
  const [displayed, setDisplayed] = useState("");
  const [prevText, setPrevText] = useState("");

  if (text !== prevText) {
    setPrevText(text);
    setDisplayed("");
  }

  useEffect(() => {
    if (!text) return;
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayed };
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const step = target / 60;
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count.toLocaleString()}{suffix}</span>;
}

const languages = [
  { code: "ru", label: "RU", name: "Русский" },
  { code: "en", label: "EN", name: "English" },
  { code: "kz", label: "KZ", name: "Қазақша" },
  { code: "zh", label: "ZH", name: "中文" },
  { code: "de", label: "DE", name: "Deutsch" },
  { code: "fr", label: "FR", name: "Français" },
];

const countries = [
  { code: "global", flag: "🌍", name: { ru: "Весь мир", en: "Global", kz: "Бүкіл әлем", zh: "全球", de: "Global", fr: "Mondial" } },
  { code: "kz", flag: "🇰🇿", name: { ru: "Казахстан", en: "Kazakhstan", kz: "Қазақстан", zh: "哈萨克斯坦", de: "Kasachstan", fr: "Kazakhstan" } },
  { code: "ru", flag: "🇷🇺", name: { ru: "Россия", en: "Russia", kz: "Ресей", zh: "俄罗斯", de: "Russland", fr: "Russie" } },
  { code: "uz", flag: "🇺🇿", name: { ru: "Узбекистан", en: "Uzbekistan", kz: "Өзбекстан", zh: "乌兹别克斯坦", de: "Usbekistan", fr: "Ouzbékistan" } },
  { code: "de", flag: "🇩🇪", name: { ru: "Германия", en: "Germany", kz: "Германия", zh: "德国", de: "Deutschland", fr: "Allemagne" } },
  { code: "us", flag: "🇺🇸", name: { ru: "США", en: "USA", kz: "АҚШ", zh: "美国", de: "USA", fr: "États-Unis" } },
  { code: "gb", flag: "🇬🇧", name: { ru: "Великобритания", en: "UK", kz: "Ұлыбритания", zh: "英国", de: "Großbritannien", fr: "Royaume-Uni" } },
  { code: "fr", flag: "🇫🇷", name: { ru: "Франция", en: "France", kz: "Франция", zh: "法国", de: "Frankreich", fr: "France" } },
];

const examples: Record<string, string[]> = {
  ru: ["Flutter разработчик", "Data Science", "Backend Python", "UI/UX дизайнер", "DevOps инженер", "iOS разработчик", "Machine Learning"],
  en: ["Flutter developer", "Data Scientist", "Backend Python", "UI/UX designer", "DevOps engineer", "iOS developer", "ML engineer"],
  kz: ["Flutter әзірлеуші", "Деректер ғылымы", "Backend Python", "UI/UX дизайнер", "DevOps инженер"],
  zh: ["Flutter开发者", "数据科学家", "后端Python", "UI/UX设计师", "DevOps工程师"],
  de: ["Flutter Entwickler", "Data Scientist", "Backend Python", "UI/UX Designer", "DevOps Ingenieur"],
  fr: ["Développeur Flutter", "Data Scientist", "Backend Python", "Designer UI/UX", "Ingénieur DevOps"],
};

const t: Record<string, Record<string, string>> = {
  ru: {
    badge: "⚡ Powered by Bright Data + Gemini AI",
    title: "Global IT Research Agent",
    subtitle: "Живая аналитика IT рынка на основе реальных данных",
    placeholder: "Например: Flutter разработчик",
    analyze: "Анализировать",
    analyzing: "Анализ...",
    scraping: "Скрапим живые данные...",
    pipeline: "Bright Data → Gemini AI → Анализ",
    result: "Результат анализа",
    live: "✓ Live данные",
    query: "Запрос",
    recent: "🕐 Недавние запросы",
    source: "Источник",
    analysis: "Анализ",
    market: "Рынок",
    vacancies: "Вакансий проанализировано",
    cities: "Городов охвата",
    specs: "IT специальностей",
    countries: "Стран охвата",
    liveData: "Живые данные",
    liveDesc: "Bright Data скрапит в реальном времени",
    aiAnalysis: "AI анализ",
    aiDesc: "Gemini анализирует и структурирует",
    globalFocus: "Global фокус",
    globalDesc: "Весь мир — любая страна и рынок",
    builtBy: "Built by",
    hackathon: "• Hackathon 2026",
    selectCountry: "Выбери страну",
  },
  en: {
    badge: "⚡ Powered by Bright Data + Gemini AI",
    title: "Global IT Research Agent",
    subtitle: "Live IT market analytics based on real data",
    placeholder: "E.g.: Flutter developer",
    analyze: "Analyze",
    analyzing: "Analyzing...",
    scraping: "Scraping live data...",
    pipeline: "Bright Data → Gemini AI → Analysis",
    result: "Analysis Result",
    live: "✓ Live data",
    query: "Query",
    recent: "🕐 Recent searches",
    source: "Source",
    analysis: "Analysis",
    market: "Market",
    vacancies: "Vacancies analyzed",
    cities: "Cities covered",
    specs: "IT specialties",
    countries: "Countries covered",
    liveData: "Live Data",
    liveDesc: "Bright Data scrapes in real time",
    aiAnalysis: "AI Analysis",
    aiDesc: "Gemini analyzes and structures",
    globalFocus: "Global Focus",
    globalDesc: "Worldwide — any country and market",
    builtBy: "Built by",
    hackathon: "• Hackathon 2026",
    selectCountry: "Select country",
  },
  kz: {
    badge: "⚡ Bright Data + Gemini AI негізінде",
    title: "Global IT Research Agent",
    subtitle: "Нақты деректерге негізделген IT нарығының тірі аналитикасы",
    placeholder: "Мысалы: Flutter әзірлеуші",
    analyze: "Талдау",
    analyzing: "Талдануда...",
    scraping: "Тірі деректер жиналуда...",
    pipeline: "Bright Data → Gemini AI → Талдау",
    result: "Талдау нәтижесі",
    live: "✓ Тірі деректер",
    query: "Сұраныс",
    recent: "🕐 Соңғы сұраныстар",
    source: "Дереккөз",
    analysis: "Талдау",
    market: "Нарық",
    vacancies: "Талданған вакансиялар",
    cities: "Қалалар қамтуы",
    specs: "IT мамандықтар",
    countries: "Елдер қамтуы",
    liveData: "Тірі деректер",
    liveDesc: "Bright Data нақты уақытта жинайды",
    aiAnalysis: "AI талдау",
    aiDesc: "Gemini талдайды және құрылымдайды",
    globalFocus: "Жаһандық фокус",
    globalDesc: "Бүкіл әлем — кез келген ел және нарық",
    builtBy: "Жасаған",
    hackathon: "• Hackathon 2026",
    selectCountry: "Елді таңдаңыз",
  },
  zh: {
    badge: "⚡ 由 Bright Data + Gemini AI 提供支持",
    title: "Global IT Research Agent",
    subtitle: "基于真实数据的IT市场实时分析",
    placeholder: "例如：Flutter开发者",
    analyze: "分析",
    analyzing: "分析中...",
    scraping: "正在抓取实时数据...",
    pipeline: "Bright Data → Gemini AI → 分析",
    result: "分析结果",
    live: "✓ 实时数据",
    query: "查询",
    recent: "🕐 最近搜索",
    source: "来源",
    analysis: "分析",
    market: "市场",
    vacancies: "已分析职位",
    cities: "覆盖城市",
    specs: "IT专业",
    countries: "覆盖国家",
    liveData: "实时数据",
    liveDesc: "Bright Data实时抓取",
    aiAnalysis: "AI分析",
    aiDesc: "Gemini分析和结构化",
    globalFocus: "全球焦点",
    globalDesc: "全球——任何国家和市场",
    builtBy: "由...构建",
    hackathon: "• Hackathon 2026",
    selectCountry: "选择国家",
  },
  de: {
    badge: "⚡ Powered by Bright Data + Gemini AI",
    title: "Global IT Research Agent",
    subtitle: "Live IT-Marktanalyse basierend auf echten Daten",
    placeholder: "Z.B.: Flutter-Entwickler",
    analyze: "Analysieren",
    analyzing: "Analysiere...",
    scraping: "Scrape Live-Daten...",
    pipeline: "Bright Data → Gemini AI → Analyse",
    result: "Analyseergebnis",
    live: "✓ Live-Daten",
    query: "Anfrage",
    recent: "🕐 Letzte Suchen",
    source: "Quelle",
    analysis: "Analyse",
    market: "Markt",
    vacancies: "Analysierte Stellen",
    cities: "Städte abgedeckt",
    specs: "IT-Spezialitäten",
    countries: "Länder abgedeckt",
    liveData: "Live-Daten",
    liveDesc: "Bright Data scrapet in Echtzeit",
    aiAnalysis: "KI-Analyse",
    aiDesc: "Gemini analysiert und strukturiert",
    globalFocus: "Globaler Fokus",
    globalDesc: "Weltweit — jedes Land und jeder Markt",
    builtBy: "Erstellt von",
    hackathon: "• Hackathon 2026",
    selectCountry: "Land auswählen",
  },
  fr: {
    badge: "⚡ Propulsé par Bright Data + Gemini AI",
    title: "Global IT Research Agent",
    subtitle: "Analyse en direct du marché IT basée sur des données réelles",
    placeholder: "Ex: Développeur Flutter",
    analyze: "Analyser",
    analyzing: "Analyse...",
    scraping: "Extraction des données en direct...",
    pipeline: "Bright Data → Gemini AI → Analyse",
    result: "Résultat d'analyse",
    live: "✓ Données en direct",
    query: "Requête",
    recent: "🕐 Recherches récentes",
    source: "Source",
    analysis: "Analyse",
    market: "Marché",
    vacancies: "Postes analysés",
    cities: "Villes couvertes",
    specs: "Spécialités IT",
    countries: "Pays couverts",
    liveData: "Données en direct",
    liveDesc: "Bright Data scrape en temps réel",
    aiAnalysis: "Analyse IA",
    aiDesc: "Gemini analyse et structure",
    globalFocus: "Focus mondial",
    globalDesc: "Monde entier — tout pays et marché",
    builtBy: "Créé par",
    hackathon: "• Hackathon 2026",
    selectCountry: "Sélectionner un pays",
  },
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [compareMode, setCompareMode] = useState(false);
  const [query2, setQuery2] = useState("");
  const [result2, setResult2] = useState("");
  const [loading2, setLoading2] = useState(false);
  const [step, setStep] = useState(0);

  const steps = [
    "🔌 Подключаемся к Bright Data...",
    "🌐 Скрапим живые данные...",
    "🤖 Gemini анализирует...",
    "📊 Формируем отчёт...",
    "✅ Готово!",
  ];
  const { displayed: typedResult } = useTypewriter(result, 0);
  const [loading, setLoading] = useState(false);

  // Safe state lazy initialization from localStorage
  const [history, setHistory] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("search_history");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return [];
  });

  const [lang, setLang] = useState("ru");
  const [country, setCountry] = useState("kz");

  const reportRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, {
      backgroundColor: "#0a0a0f",
      scale: 2,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`report-${query}.pdf`);
  };

  const txt = t[lang];
  const activeCountry = countries.find(c => c.code === country);

  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q) return;
    setLoading(true);
    setResult("");

    const newHistory = [q, ...history.filter(h => h !== q)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem("search_history", JSON.stringify(newHistory));

    const countryName = activeCountry?.name[lang as keyof typeof activeCountry.name] || "Global";

    setStep(0);
    let currentStep = 0;
    const stepInterval = setInterval(() => {
      currentStep += 1;
      if (currentStep >= 4) {
        clearInterval(stepInterval);
      }
      setStep(currentStep);
    }, 1800);

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, country: countryName, lang }),
      });
      const data = await res.json();
      setResult(data.report);
    } catch {
      setResult("Error. Please try again.");
    } finally {
      setLoading(false);
      clearInterval(stepInterval);
    }
  };

  const handleSearch2 = async (searchQuery?: string) => {
    const q = searchQuery || query2;
    if (!q) return;
    setLoading2(true);
    setResult2("");
    setStep(0);

    let currentStep = 0;
    const stepInterval = setInterval(() => {
      currentStep += 1;
      if (currentStep >= 4) {
        clearInterval(stepInterval);
      }
      setStep(currentStep);
    }, 1800);

    const selectedCountry = countries.find(c => c.code === country);
    const countryName = selectedCountry?.name[lang as keyof typeof selectedCountry.name] || "Global";
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, country: countryName, lang }),
      });
      const data = await res.json();
      setResult2(data.report);
    } catch {
      setResult2("Ошибка.");
    } finally {
      setLoading2(false);
      clearInterval(stepInterval);
    }
  };

  const stats = [
    { value: 847, suffix: "+", label: txt.vacancies },
    { value: 12, suffix: "", label: txt.cities },
    { value: 40, suffix: "+", label: txt.specs },
    { value: 5, suffix: "", label: txt.countries },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="fixed inset-0 bg-[#0a0a0f]" style={{zIndex: -1}}/>
      <MatrixRain />
      <div className="fixed inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at top, rgba(10,31,10,0.5) 0%, rgba(10,10,15,0.7) 60%)",
        zIndex: 1
      }}/>
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(0,255,70,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,70,0.03) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        zIndex: 1
      }}/>

      <div className="relative z-10 flex flex-col items-center px-3 sm:px-6 pt-20 sm:pt-28 pb-16 max-w-full overflow-x-hidden">


        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-green-500/10 bg-black/40 backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-green-400 text-xs sm:text-sm font-mono font-bold">&gt;_</span>
                    </div>
                    <span className="text-white font-bold text-sm sm:text-lg truncate">Global IT Research Agent</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    <span className="text-zinc-500 text-[10px] sm:text-xs font-mono">v1.0.0</span>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
                        <span className="text-green-400 text-[10px] sm:text-xs">Live</span>
                    </div>
                </div>
            </div>
        </nav>

        {/* Language switcher */}
        <div className="flex flex-wrap sm:flex-nowrap justify-center gap-1 mb-6 bg-zinc-900/60 border border-zinc-700/30 rounded-xl p-1 max-w-full overflow-x-auto">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                lang === l.code
                  ? "bg-green-600 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Badge */}
        <div className="mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs sm:text-sm font-medium text-center">
          {txt.badge}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-center mb-3 sm:mb-4 bg-gradient-to-r from-white via-green-200 to-green-700 bg-clip-text text-transparent px-2">
          {txt.title}
        </h1>
        <p className="text-zinc-400 text-sm sm:text-lg text-center mb-8 sm:mb-10 max-w-xl px-2">
          {txt.subtitle}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-2xl mb-8 sm:mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-zinc-900/40 border border-zinc-700/30 rounded-xl p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-green-400">
                <AnimatedCounter target={stat.value} suffix={stat.suffix}/>
              </div>
              <div className="text-zinc-500 text-[10px] sm:text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Country selector */}
        <div className="w-full max-w-2xl mb-4">
          <p className="text-zinc-500 text-xs mb-2">{txt.selectCountry}</p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {countries.map((c) => (
              <button
                key={c.code}
                onClick={() => setCountry(c.code)}
                className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 ${
                  country === c.code
                    ? "bg-green-600/20 border-green-500/50 text-green-400"
                    : "bg-zinc-900/40 border-zinc-700/30 text-zinc-400 hover:text-green hover:border-zinc-500"
                }`}
              >
                {c.flag} {c.name[lang as keyof typeof c.name]}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="w-full max-w-2xl mb-4 mt-2 sm:mt-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-2 bg-zinc-900/80 border border-zinc-700/50 rounded-2xl backdrop-blur">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={txt.placeholder}
              className="flex-1 bg-transparent px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-zinc-500 focus:outline-none text-sm sm:text-base w-full"
            />
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleSearch()}
                disabled={loading}
                className="flex-1 sm:flex-initial bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                    {txt.analyzing}
                  </>
                ) : <>🔍 {txt.analyze}</>}
              </button>
              <button
                onClick={() => setCompareMode(!compareMode)}
                className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  compareMode
                    ? "bg-green-600/20 border-green-500/50 text-green-400"
                    : "bg-zinc-900/40 border-zinc-700/30 text-zinc-400 hover:text-white"
                }`}
              >
                ⚖️ Сравнить
              </button>
            </div>
          </div>
          {compareMode && (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-2 bg-zinc-900/80 border border-zinc-700/50 rounded-2xl backdrop-blur mt-3">
              <input
                type="text"
                value={query2}
                onChange={(e) => setQuery2(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch2()}
                placeholder="Вторая профессия для сравнения..."
                className="flex-1 bg-transparent px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-zinc-500 focus:outline-none text-sm sm:text-base w-full"
              />
              <button
                onClick={() => handleSearch2()}
                disabled={loading2}
                className="bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all flex items-center justify-center"
              >
                {loading2 ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                ) : <>🔍</>}
              </button>
            </div>
          )}
        </div>

        {/* Examples */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {(examples[lang] || examples["en"]).map((ex) => (
            <button
              key={ex}
              onClick={() => { setQuery(ex); handleSearch(ex); }}
              className="px-3 py-1.5 rounded-full bg-zinc-900/60 border border-green-500/20 text-zinc-400 text-sm hover:text-green-400 hover:border-green-500/50 transition-all"
            >
              {ex}
            </button>
          ))}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="w-full max-w-2xl mb-8">
            <p className="text-zinc-600 text-xs mb-2 text-center">{txt.recent}</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {history.map((h) => (
                <button
                  key={h}
                  onClick={() => { setQuery(h); handleSearch(h); }}
                  className="px-3 py-1.5 rounded-full bg-zinc-900/60 border border-zinc-700/30 text-zinc-500 text-xs hover:text-white hover:border-green-500/50 transition-all flex items-center gap-1"
                >
                  <span>↺</span> {h}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="w-full max-w-3xl">
            <div className="bg-zinc-900/50 border border-zinc-700/50 rounded-2xl p-6 sm:p-12">
             {/* Прогресс бар */}
             <div className="w-full bg-zinc-800 rounded-full h-1.5 mb-6 sm:mb-8">
               <div
               className="bg-green-500 h-1.5 rounded-full transition-all duration-700"
               style={{ width: `${((step + 1) / steps.length) * 100}%` }}
               />
             </div>

             {/* Шаги */}
             <div className="space-y-3">
             {steps.map((s, i) => (
  <div key={i} className={`flex items-center gap-3 transition-all duration-500 ${
    i <= step ? "opacity-100" : "opacity-20"
  }`}>
    <div className={`w-2.5 h-2.5 rounded-full shrink-0 transition-all duration-300 ${
      i < step ? "bg-green-500" :
      i === step ? "bg-green-400 animate-pulse scale-125" :
      "bg-zinc-600"
    }`}/>
    <span className={`text-xs sm:text-sm transition-all duration-300 ${
      i === step ? "text-green-400 font-bold" :
      i < step ? "text-green-600" :
      "text-zinc-500"
    }`}>
      {s}
    </span>
    {i < step && <span className="text-green-500 text-xs ml-auto">✓</span>}
  </div>
))}
      </div>

      <p className="text-zinc-600 text-xs mt-6 text-center">
        Bright Data &rarr; Gemini AI &rarr; Анализ
      </p>
    </div>
  </div>
)}

        {/* Result */}
        {result && !loading && (
          <div className={compareMode && result2 ? "grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-6xl" : "w-full max-w-3xl space-y-4"}>
            {/* Первый результат */}
            <div ref={reportRef} className="w-full space-y-4">
              <div className="bg-gradient-to-r from-green-600/20 to-purple-600/20 border border-green-500/30 rounded-2xl p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap sm:flex-nowrap">
                  <span className="text-xl sm:text-2xl">📊</span>
                  <h2 className="text-lg sm:text-xl font-bold text-white">{txt.result}</h2>
                  <span className="sm:ml-auto px-2.5 sm:px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs font-medium">
                    {txt.live}
                  </span>
                </div>
                <p className="text-zinc-400 text-xs sm:text-sm">{txt.query}: <span className="text-green-400 font-medium">&quot;{query}&quot;</span></p>
              </div>

              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-xl text-green-400 text-xs sm:text-sm hover:bg-green-600/30 transition-all"
              >
                📄 Скачать PDF
              </button>

              <div className="bg-zinc-900/60 border border-zinc-700/50 rounded-2xl p-4 sm:p-8 backdrop-blur">
                <ReactMarkdown
                  components={{
                    h2: ({children}) => (
                      <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4 first:mt-0 pb-3 border-b border-zinc-700/50">{children}</h2>
                    ),
                    h3: ({children}) => (
                      <div className="mt-5 sm:mt-6 mb-2 sm:mb-3 flex items-center gap-2">
                        <div className="w-1 h-4 sm:h-5 bg-green-500 rounded-full shrink-0"/>
                        <h3 className="text-base sm:text-lg font-semibold text-green-400">{children}</h3>
                      </div>
                    ),
                    p: ({children}) => <p className="text-zinc-300 leading-6 sm:leading-7 mb-3 sm:mb-4 text-sm sm:text-base">{children}</p>,
                    ul: ({children}) => <ul className="mb-3 sm:mb-4 space-y-2">{children}</ul>,
                    li: ({children}) => (
                      <li className="text-zinc-300 flex items-start gap-2.5 sm:gap-3 bg-zinc-800/40 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-base">
                        <span className="text-green-500 mt-0.5 text-xs sm:text-sm shrink-0">▸</span>
                        <span className="leading-relaxed">{children}</span>
                      </li>
                    ),
                    strong: ({children}) => <strong className="text-white font-semibold">{children}</strong>,
                  }}
                >
                  {typedResult}
                </ReactMarkdown>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: "🌐", label: txt.source, value: "Bright Data" },
                  { icon: "🤖", label: txt.analysis, value: "Gemini 2.5 Flash" },
                  { icon: "⚡", label: txt.market, value: activeCountry ? `${activeCountry.flag} ${activeCountry.name[lang as keyof typeof activeCountry.name]}` : "Global" },
                ].map((item) => (
                  <div key={item.label} className="bg-zinc-900/40 border border-zinc-700/30 rounded-xl p-3 sm:p-4 text-center">
                    <div className="text-lg sm:text-xl mb-1">{item.icon}</div>
                    <div className="text-zinc-500 text-[10px] sm:text-xs mb-1">{item.label}</div>
                    <div className="text-white text-xs sm:text-sm font-medium">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

          
            {/* Второй результат */}
            {compareMode && result2 && (
              <div className="w-full space-y-4">
                <div className="bg-gradient-to-r from-green-600/20 to-teal-600/20 border border-green-500/30 rounded-2xl p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl sm:text-2xl">📊</span>
                    <h2 className="text-lg sm:text-xl font-bold text-white">{txt.result}</h2>
                  </div>
                  <p className="text-zinc-400 text-xs sm:text-sm">{txt.query}: <span className="text-green-400 font-medium">&quot;{query2}&quot;</span></p>
                </div>
                <div className="bg-zinc-900/60 border border-zinc-700/50 rounded-2xl p-4 sm:p-8 backdrop-blur">
                  <ReactMarkdown components={{
                    h2: ({children}) => <h2 className="text-lg sm:text-xl font-bold text-white mt-5 sm:mt-6 mb-3 pb-2 border-b border-zinc-700/50">{children}</h2>,
                    h3: ({children}) => (
                      <div className="mt-4 mb-2 flex items-center gap-2">
                        <div className="w-1 h-4 bg-green-500 rounded-full shrink-0"/>
                        <h3 className="text-sm sm:text-base font-semibold text-green-400">{children}</h3>
                      </div>
                    ),
                    p: ({children}) => <p className="text-zinc-300 leading-6 mb-3 text-xs sm:text-sm">{children}</p>,
                    ul: ({children}) => <ul className="mb-3 space-y-1">{children}</ul>,
                    li: ({children}) => (
                      <li className="text-zinc-300 flex items-start gap-2 bg-zinc-800/40 rounded-lg px-3 py-2 text-xs sm:text-sm">
                        <span className="text-green-500 mt-0.5 text-xs shrink-0">▸</span>
                        <span>{children}</span>
                      </li>
                    ),
                    strong: ({children}) => <strong className="text-white font-semibold">{children}</strong>,
                  }}>
                    {result2}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}

        {!result && !loading && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-2xl">
            {[
              { icon: "🌐", title: txt.liveData, desc: txt.liveDesc },
              { icon: "🤖", title: txt.aiAnalysis, desc: txt.aiDesc },
              { icon: "⚡", title: txt.globalFocus, desc: txt.globalDesc },
            ].map((card) => (
              <div key={card.title} className="bg-zinc-900/40 border border-zinc-700/30 rounded-xl p-4 text-center">
                <div className="text-xl sm:text-2xl mb-2">{card.icon}</div>
                <div className="text-white font-medium text-xs sm:text-sm mb-1">{card.title}</div>
                <div className="text-zinc-500 text-[10px] sm:text-xs">{card.desc}</div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 mb-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-700/30">
            <span className="text-zinc-500 text-sm">{txt.builtBy}</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-400 font-bold text-sm">
              @Prosto_Proger
            </span>
            <span className="text-zinc-600 text-xs">{txt.hackathon}</span>
          </div>
        </div>

      </div>
    </div>
  );
}