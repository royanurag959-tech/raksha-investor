import React from 'react';
import { ShieldCheck, Globe, Type, AlertCircle } from 'lucide-react';

export default function Navbar({ 
  lang, 
  setLang, 
  t, 
  fontSize, 
  setFontSize, 
  activeTab, 
  setActiveTab 
}) {
  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const navItems = [
    { id: 'analyzer', label: t.navMessage },
    { id: 'claim', label: t.navClaim },
    { id: 'link', label: t.navLink },
    { id: 'demo', label: t.navDemo, highlight: true },
    { id: 'checklist', label: t.navChecklist },
    { id: 'guardrails', label: t.navPrivacy },
    { id: 'about', label: t.navAbout },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-600 to-indigo-600 p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-amber-400 group-hover:text-amber-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {t.brand}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                  Bharat Shield
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium tracking-wide">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Right Action Controls: Accessibility + Language Switcher */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Font Size Accessibility Modifier (Elder Friendly) */}
            <div className="hidden md:flex items-center bg-slate-800/80 rounded-lg p-1 border border-slate-700/60" title="Elderly-Friendly Text Sizing">
              <span className="text-xs text-slate-400 px-2 flex items-center gap-1">
                <Type className="w-3.5 h-3.5" />
              </span>
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                  fontSize === 'sm' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                }`}
                title="Small text"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                  fontSize === 'base' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                }`}
                title="Normal text"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                  fontSize === 'lg' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                }`}
                title="Large text (Senior Citizen Mode)"
              >
                A+
              </button>
            </div>

            {/* Language Switcher Button (1-Click Toggle) */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 border border-slate-600 text-slate-100 text-xs sm:text-sm font-semibold shadow-sm transition-all hover:border-amber-400"
            >
              <Globe className="w-4 h-4 text-amber-400" />
              <span>{lang === 'en' ? '🇮🇳 हिन्दी' : '🇮🇳 English'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 border-t border-slate-800/80 scrollbar-none text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
              activeTab === 'home'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {t.navHome}
          </button>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
                activeTab === item.id
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : item.highlight
                  ? 'text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.highlight && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping mr-1" />}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

      </div>
    </header>
  );
}
