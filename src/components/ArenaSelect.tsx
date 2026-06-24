/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { ARENAS } from "../data";
import { ArenaId, ArenaDef } from "../types";
import { Map, MapPin, Sparkles, Swords } from "lucide-react";

interface ArenaSelectProps {
  onSelectComplete: (arenaId: ArenaId) => void;
  onBack: () => void;
}

export default function ArenaSelect({ onSelectComplete, onBack }: ArenaSelectProps) {
  const [selectedArena, setSelectedArena] = useState<ArenaId>(ArenaId.BAOBABS);

  const activeArena = ARENAS.find(a => a.id === selectedArena) as ArenaDef;

  return (
    <div id="arena-selection-screen" className="flex flex-col min-h-screen bg-transparent text-slate-100 p-4 md:p-8 select-none relative z-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-orange-500 flex items-center gap-3 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
            <Map className="w-8 h-8 text-cyan-400" />
            LIEU DES AFFRONTEMENTS
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Sélectionnez l'arène de combat sacrée inspirée de la splendeur de Madagascar.
          </p>
        </div>
        <button
          id="back-to-chars-btn"
          onClick={onBack}
          className="px-4 py-2 bg-[#0c0d12]/80 hover:bg-[#121420] border border-slate-800 rounded-lg text-sm font-semibold text-slate-300 transition cursor-pointer"
        >
          Retour aux Personnages
        </button>
      </div>

      {/* CORE ARENA SELECT PANEL */}
      <div className="grid lg:grid-cols-12 gap-8 items-stretch flex-grow">
        {/* LEFT STAGES LIST */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {ARENAS.map((arena) => {
              const isSelected = selectedArena === arena.id;
              return (
                <button
                  id={`arena-select-${arena.id}`}
                  key={arena.id}
                  onClick={() => setSelectedArena(arena.id)}
                  className={`w-full rounded-2xl p-5 border text-left flex items-center gap-4 transition duration-250 cursor-pointer backdrop-blur-sm ${
                    isSelected 
                      ? "bg-[#0d0e14]/90 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.15)]" 
                      : "bg-[#0d0e14]/60 border-white/5 hover:border-cyan-500/30 hover:bg-[#121420]/50"
                  }`}
                >
                  {/* Thumb Preview */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden relative border border-white/5 shrink-0">
                    <img 
                      src={arena.bgImage} 
                      alt={arena.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                        <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-black flex items-center gap-1.5" style={{ color: isSelected ? "#22d3ee" : "#F3F4F6" }}>
                      {arena.name}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {arena.location}
                    </p>
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-1">
                      {arena.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* CHOOSE STAGE ACTION BTN */}
          <button
            id="start-moraingy-btn"
            onClick={() => onSelectComplete(selectedArena)}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 font-extrabold text-white text-lg shadow-xl shadow-cyan-950/40 hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-wider drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            <Swords className="w-5 h-5" /> Lancer le Combat !
          </button>
        </div>

        {/* RIGHT FULLSCREEN ARENA LORE PREVIEW */}
        <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-white/10 bg-[#0d0e14]/85 flex flex-col justify-between shadow-2xl relative min-h-[400px] backdrop-blur-md">
          {/* Main Background Image Preview with Ambient Overlay */}
          <div className="relative h-64 md:h-80 overflow-hidden border-b border-white/5">
            <img 
              id="active-arena-preview"
              src={activeArena.bgImage} 
              alt={activeArena.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter saturate-[1.1] scale-100 transition duration-500 animate-fade-in" 
            />
            {/* Dark bottom vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-transparent to-transparent"></div>
            {/* Top gradient */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#0c0d12]/90 backdrop-blur-md px-3.5 py-1.5 border border-white/5 rounded-full text-xs">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Arène active</span>
            </div>
          </div>

          {/* Lore and Meta description */}
          <div className="p-6 md:p-8 space-y-4 flex-grow bg-transparent">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-3 gap-2">
              <div>
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-orange-500 tracking-wide font-sans uppercase">
                  {activeArena.name}
                </h2>
                <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1 mt-1 font-serif italic">
                  <MapPin className="w-3.5 h-3.5" /> {activeArena.location}
                </span>
              </div>
            </div>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              {activeArena.description}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 text-xs">
              <div className="p-3 bg-black/40 border border-white/5 rounded-xl">
                <span className="text-slate-500 font-bold block uppercase tracking-wide text-[10px]">Type d'Atmosphère</span>
                <span className="text-slate-200 mt-1 block font-medium">
                  {selectedArena === ArenaId.BAOBABS && "Crépusculaire & Ensoleillé"}
                  {selectedArena === ArenaId.AMBOHIMANGA && "Brumeux & Royal"}
                  {selectedArena === ArenaId.RANOMAFANA && "Équatorial & Luminescent"}
                </span>
              </div>
              <div className="p-3 bg-black/40 border border-white/5 rounded-xl">
                <span className="text-slate-500 font-bold block uppercase tracking-wide text-[10px]">Musique de Combat</span>
                <span className="text-slate-200 mt-1 block font-medium">
                  {selectedArena === ArenaId.BAOBABS && "Tambours du Sud & Sodina (Flûte)"}
                  {selectedArena === ArenaId.AMBOHIMANGA && "Kabosy & Chants Valiha Royaux"}
                  {selectedArena === ArenaId.RANOMAFANA && "Basse Tribale & Bruits de la Forêt"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
