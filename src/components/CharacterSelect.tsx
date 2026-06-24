/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { CHARACTERS } from "../data";
import { CharacterDef, FighterId } from "../types";
import { Swords, ShieldAlert, Award, Compass, Sparkles, Flame, Zap } from "lucide-react";

interface CharacterSelectProps {
  isVsCpu: boolean;
  onSelectComplete: (p1Id: FighterId, p2Id: FighterId) => void;
  onBack: () => void;
}

export default function CharacterSelect({ isVsCpu, onSelectComplete, onBack }: CharacterSelectProps) {
  const [p1Selected, setP1Selected] = useState<FighterId | null>(null);
  const [p2Selected, setP2Selected] = useState<FighterId | null>(null);
  const [activeHover, setActiveHover] = useState<FighterId>(FighterId.RADAMA);

  // Auto-select CPU if it's CPU mode and P1 has selected
  useEffect(() => {
    if (isVsCpu && p1Selected && !p2Selected) {
      // Pick a random fighter that is not necessarily P1 (or could be the same for mirror matches)
      const otherFighters = CHARACTERS.map(c => c.id);
      const randomId = otherFighters[Math.floor(Math.random() * otherFighters.length)];
      
      // Delay slightly for dramatic effect
      const timer = setTimeout(() => {
        setP2Selected(randomId);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [p1Selected, isVsCpu, p2Selected]);

  // Handle choice selection
  const handleSelect = (id: FighterId) => {
    if (!p1Selected) {
      setP1Selected(id);
      // For local 2P, let P2 hover on something else
      const nextHover = CHARACTERS.find(c => c.id !== id)?.id || FighterId.RADAMA;
      setActiveHover(nextHover);
    } else if (!p2Selected && !isVsCpu) {
      setP2Selected(id);
    }
  };

  const handleReset = () => {
    setP1Selected(null);
    setP2Selected(null);
    setActiveHover(FighterId.RADAMA);
  };

  // Confirm selection once both are picked
  useEffect(() => {
    if (p1Selected && p2Selected) {
      const timer = setTimeout(() => {
        onSelectComplete(p1Selected, p2Selected);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [p1Selected, p2Selected, onSelectComplete]);

  const p1Character = CHARACTERS.find(c => c.id === (p1Selected || activeHover)) as CharacterDef;
  const p2Character = CHARACTERS.find(c => c.id === (p2Selected || (p1Selected ? activeHover : FighterId.KALA))) as CharacterDef;

  return (
    <div id="character-selection-screen" className="flex flex-col min-h-screen bg-transparent text-slate-100 p-4 md:p-8 select-none relative z-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-orange-500 flex items-center gap-3 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
            <Swords className="w-8 h-8 text-cyan-400 animate-pulse" />
            SÉLECTION DU GUERRIER
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {isVsCpu ? "Choisissez votre combattant (VS l'ordinateur)" : "Joueur 1, puis Joueur 2 : Choisissez vos combattants"}
          </p>
        </div>
        <div className="flex gap-3">
          {(p1Selected || p2Selected) && (
            <button
              id="reset-selection-btn"
              onClick={handleReset}
              className="px-4 py-2 bg-[#121420] hover:bg-[#1a1c2c] border border-slate-800 rounded-lg text-sm font-semibold transition cursor-pointer"
            >
              Réinitialiser
            </button>
          )}
          <button
            id="back-to-menu-btn"
            onClick={onBack}
            className="px-4 py-2 bg-[#0c0d12]/80 hover:bg-[#121420] border border-slate-800 rounded-lg text-sm font-semibold text-slate-300 transition cursor-pointer"
          >
            Retour au Menu
          </button>
        </div>
      </div>

      {/* ACTIVE SCREEN STATE INSTRUCTION */}
      <div className="w-full text-center py-3 mb-6 rounded-2xl bg-[#0d0e14]/90 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.15)] backdrop-blur-md">
        <span className="text-lg font-black tracking-wide uppercase">
          {!p1Selected ? (
            <span className="text-red-500 animate-pulse drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">JOUEUR 1 : SÉLECTIONNEZ VOTRE GUERRIER</span>
          ) : !p2Selected ? (
            isVsCpu ? (
              <span className="text-cyan-400 animate-pulse drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">L'ORDINATEUR CHOISIT SA REVANCHE...</span>
            ) : (
              <span className="text-cyan-400 animate-pulse drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">JOUEUR 2 : SÉLECTIONNEZ VOTRE GUERRIER</span>
            )
          ) : (
            <span className="text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-neon-pulse">PRESTIGE ET TRADITION ! COMBAT IMMINENT...</span>
          )}
        </span>
      </div>

      {/* CORE HERO CHOSEN PREVIEWS & STATS SCREEN */}
      <div className="grid lg:grid-cols-12 gap-6 items-stretch flex-grow">
        {/* PLAYER 1 PANEL */}
        <div 
          id="p1-preview-panel" 
          className={`lg:col-span-3 rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 backdrop-blur-md ${
            p1Selected 
              ? "bg-[#0d0e14]/90 border-red-500/60 shadow-[0_0_25px_rgba(239,68,68,0.15)]" 
              : "bg-[#0d0e14]/60 border-slate-800/80"
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="px-2.5 py-1 text-xs font-black bg-red-600 text-white rounded">P1</span>
              {p1Selected && <span className="text-xs font-bold text-red-400 animate-pulse">PRÊT</span>}
            </div>

            <div className="text-center py-6 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-red-500/80 mb-4 shadow-[0_0_20px_rgba(239,68,68,0.4)] bg-[#0d0e14]">
                <img 
                  src={p1Character.avatar} 
                  alt={p1Character.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h2 className="text-2xl font-black tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]" style={{ color: p1Character.themeColor }}>
                {p1Character.name}
              </h2>
              <p className="text-sm font-semibold text-amber-500 italic mt-0.5">{p1Character.title}</p>
              <p className="text-xs text-slate-400 flex items-center justify-center gap-1 mt-1.5">
                <Compass className="w-3.5 h-3.5 text-slate-500" /> {p1Character.origin}
              </p>
            </div>

            <div className="bg-[#0c0d12]/90 p-3.5 rounded-xl border border-white/5 text-xs text-slate-300 leading-relaxed min-h-[100px]">
              {p1Character.description}
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 mt-4">
            <h4 className="text-xs font-black text-slate-400 mb-2 uppercase tracking-wider">Capacités Spéciales</h4>
            <div className="space-y-2 text-xs">
              <div className="p-2 rounded bg-black/40 border border-white/5">
                <span className="font-bold text-amber-400">Attaque Rapide (F) : </span>
                <span className="text-slate-300">{p1Character.moves.light.split(" : ")[0]}</span>
              </div>
              <div className="p-2 rounded bg-black/40 border border-white/5">
                <span className="font-bold text-orange-400">Attaque Lourde (G) : </span>
                <span className="text-slate-300">{p1Character.moves.heavy.split(" : ")[0]}</span>
              </div>
              <div className="p-2 rounded bg-black/40 border border-white/5">
                <span className="font-bold text-red-400">Spécial (H) : </span>
                <span className="text-slate-300">{p1Character.moves.special.split(" : ")[0]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CHARACTER GRID SELECTION */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {CHARACTERS.map((char) => {
              const isP1 = p1Selected === char.id;
              const isP2 = p2Selected === char.id;
              const isHovered = activeHover === char.id;
              
              // Custom borders/shadow classes
              let borderClass = "border-white/5 bg-[#0d0e14]/70 hover:border-cyan-500/30 hover:bg-[#121420]/75";
              if (isP1) {
                borderClass = "border-red-500 ring-2 ring-red-500/40 bg-red-950/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]";
              } else if (isP2) {
                borderClass = "border-cyan-400 ring-2 ring-cyan-500/40 bg-cyan-950/20 shadow-[0_0_20px_rgba(34,211,238,0.2)]";
              } else if (isHovered) {
                borderClass = "border-cyan-500 bg-[#121420]/90 shadow-[0_0_15px_rgba(34,211,238,0.15)]";
              }

              return (
                <button
                  id={`char-select-${char.id}`}
                  key={char.id}
                  onClick={() => handleSelect(char.id)}
                  onMouseEnter={() => {
                    if (!p1Selected || (!p2Selected && !isVsCpu)) {
                      setActiveHover(char.id);
                    }
                  }}
                  className={`relative rounded-2xl p-4 border flex flex-col items-center justify-center transition-all duration-250 cursor-pointer text-center group backdrop-blur-sm ${borderClass}`}
                  disabled={!!(p1Selected && p2Selected)}
                >
                  {/* Selector Badge overlays */}
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    {isP1 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-black bg-red-600 text-white rounded-md shadow">P1</span>
                    )}
                    {isP2 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-black bg-cyan-500 text-slate-950 rounded-md shadow">
                        {isVsCpu ? "CPU" : "P2"}
                      </span>
                    )}
                  </div>

                  {/* Character Avatar/Emoji */}
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border border-white/10 group-hover:scale-110 transition duration-300 shadow-inner bg-[#0d0e14]">
                    <img 
                      src={char.avatar} 
                      alt={char.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <h3 className="text-lg font-black tracking-wide group-hover:text-cyan-300 transition" style={{ color: (isP1 || isP2) ? undefined : char.themeColor }}>
                    {char.name}
                  </h3>
                  <p className="text-xs text-slate-400 italic mt-0.5">{char.title}</p>

                  {/* MINI STATS */}
                  <div className="flex gap-1.5 mt-3 justify-center text-[10px] font-bold text-slate-500">
                    <span className="px-1.5 py-0.5 bg-black/60 border border-white/5 rounded">PUIS: {char.stats.power}/5</span>
                    <span className="px-1.5 py-0.5 bg-black/60 border border-white/5 rounded">VIT: {char.stats.speed}/5</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* DETAIL STATS COMPARATOR PANELS */}
          <div className="bg-[#0d0e14]/90 border border-white/5 backdrop-blur-md rounded-2xl p-5 shadow-2xl">
            <h3 className="text-xs font-black text-cyan-400 tracking-widest uppercase mb-3.5 flex items-center gap-1.5 animate-neon-pulse">
              <Award className="w-4 h-4 text-cyan-400" /> Comparatif des Attributs de Combat
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3.5">
              {/* Power */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
                  <span>Puissance d'attaque</span>
                  <span className="text-red-400 font-bold">{p1Character.stats.power} / 5</span>
                </div>
                <div className="h-1.5 bg-black/60 rounded-full overflow-hidden flex">
                  <div className="bg-red-500 h-full rounded-full transition-all duration-300" style={{ width: `${p1Character.stats.power * 20}%` }}></div>
                </div>
              </div>
              {/* Range */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
                  <span>Allonge de combat</span>
                  <span className="text-orange-400 font-bold">{p1Character.stats.range} / 5</span>
                </div>
                <div className="h-1.5 bg-black/60 rounded-full overflow-hidden flex">
                  <div className="bg-orange-500 h-full rounded-full transition-all duration-300" style={{ width: `${p1Character.stats.range * 20}%` }}></div>
                </div>
              </div>
              {/* Speed */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
                  <span>Vitesse & Agilité</span>
                  <span className="text-emerald-400 font-bold">{p1Character.stats.speed} / 5</span>
                </div>
                <div className="h-1.5 bg-black/60 rounded-full overflow-hidden flex">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${p1Character.stats.speed * 20}%` }}></div>
                </div>
              </div>
              {/* Difficulty */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
                  <span>Difficulté d'utilisation</span>
                  <span className="text-purple-400 font-bold">{p1Character.stats.difficulty} / 5</span>
                </div>
                <div className="h-1.5 bg-black/60 rounded-full overflow-hidden flex">
                  <div className="bg-purple-500 h-full rounded-full transition-all duration-300" style={{ width: `${p1Character.stats.difficulty * 20}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PLAYER 2 PANEL */}
        <div 
          id="p2-preview-panel" 
          className={`lg:col-span-3 rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 backdrop-blur-md ${
            p2Selected 
              ? "bg-[#0d0e14]/90 border-cyan-400/60 shadow-[0_0_25px_rgba(34,211,238,0.15)]" 
              : "bg-[#0d0e14]/60 border-slate-800/80"
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="px-2.5 py-1 text-xs font-black bg-cyan-500 text-slate-950 rounded">
                {isVsCpu ? "CPU" : "P2"}
              </span>
              {p2Selected && <span className="text-xs font-bold text-cyan-400 animate-pulse">PRÊT</span>}
            </div>

            <div className="text-center py-6 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-cyan-500/80 mb-4 shadow-[0_0_20px_rgba(34,211,238,0.4)] bg-[#0d0e14]">
                <img 
                  src={p2Character.avatar} 
                  alt={p2Character.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h2 className="text-2xl font-black tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]" style={{ color: p2Character.themeColor }}>
                {p2Character.name}
              </h2>
              <p className="text-sm font-semibold text-amber-500 italic mt-0.5">{p2Character.title}</p>
              <p className="text-xs text-slate-400 flex items-center justify-center gap-1 mt-1.5">
                <Compass className="w-3.5 h-3.5 text-slate-500" /> {p2Character.origin}
              </p>
            </div>

            <div className="bg-[#0c0d12]/90 p-3.5 rounded-xl border border-white/5 text-xs text-slate-300 leading-relaxed min-h-[100px]">
              {p2Character.description}
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 mt-4">
            <h4 className="text-xs font-black text-slate-400 mb-2 uppercase tracking-wider">Capacités Spéciales</h4>
            <div className="space-y-2 text-xs">
              <div className="p-2 rounded bg-black/40 border border-white/5">
                <span className="font-bold text-amber-400">Attaque Rapide (I) : </span>
                <span className="text-slate-300">{p2Character.moves.light.split(" : ")[0]}</span>
              </div>
              <div className="p-2 rounded bg-black/40 border border-white/5">
                <span className="font-bold text-orange-400">Attaque Lourde (O) : </span>
                <span className="text-slate-300">{p2Character.moves.heavy.split(" : ")[0]}</span>
              </div>
              <div className="p-2 rounded bg-black/40 border border-white/5">
                <span className="font-bold text-cyan-400">Spécial (P) : </span>
                <span className="text-slate-300">{p2Character.moves.special.split(" : ")[0]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
