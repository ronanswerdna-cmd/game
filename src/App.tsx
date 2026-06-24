/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { GameState, FighterId, ArenaId } from "./types";
import CharacterSelect from "./components/CharacterSelect";
import ArenaSelect from "./components/ArenaSelect";
import GameCanvas from "./components/GameCanvas";
import HowToPlay from "./components/HowToPlay";
import { Swords, HelpCircle, User, Users, Compass, Shield, Flame } from "lucide-react";

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [isVsCpu, setIsVsCpu] = useState<boolean>(true);
  
  // Selection State Storage
  const [p1Fighter, setP1Fighter] = useState<FighterId | null>(null);
  const [p2Fighter, setP2Fighter] = useState<FighterId | null>(null);
  const [selectedArena, setSelectedArena] = useState<ArenaId | null>(null);

  // Overlay state
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);

  // Event Handlers
  const handleSelectMode = (vsCpu: boolean) => {
    setIsVsCpu(vsCpu);
    setGameState(GameState.CHARACTER_SELECT);
  };

  const handleCharacterSelectComplete = (p1Id: FighterId, p2Id: FighterId) => {
    setP1Fighter(p1Id);
    setP2Fighter(p2Id);
    setGameState(GameState.ARENA_SELECT);
  };

  const handleArenaSelectComplete = (arenaId: ArenaId) => {
    setSelectedArena(arenaId);
    setGameState(GameState.PLAYING);
  };

  const handleExitGame = () => {
    // Reset all states and return to selection or menu
    setP1Fighter(null);
    setP2Fighter(null);
    setSelectedArena(null);
    setGameState(GameState.CHARACTER_SELECT);
  };

  const handleBackToMenu = () => {
    setP1Fighter(null);
    setP2Fighter(null);
    setSelectedArena(null);
    setGameState(GameState.MENU);
  };

  return (
    <div className="min-h-screen bg-[#0c0d12] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-x-hidden">
      
      {/* Immersive UI Global Background Atmosphere */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[#0c0d12]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c2c] via-transparent to-transparent opacity-60"></div>
        {/* Stylized Fantasy Baobab Silhouettes */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#08090d] rounded-t-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 left-1/4 w-48 h-[600px] bg-[#121420] rounded-full blur-2xl opacity-30"></div>
        <div className="absolute bottom-0 right-1/4 w-60 h-[700px] bg-[#121420] rounded-full blur-2xl opacity-30"></div>
        {/* Distant Glowing Highlands */}
        <div className="absolute bottom-32 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent shadow-[0_0_50px_rgba(6,182,212,0.5)]"></div>
        
        {/* Malagasy Pattern Borders */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[repeating-linear-gradient(90deg,#facc15,#facc15_12px,#000_12px,#000_24px)] opacity-35"></div>
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[repeating-linear-gradient(90deg,#facc15,#facc15_12px,#000_12px,#000_24px)] opacity-35"></div>
      </div>

      {/* 1. WELCOME MAIN MENU SCREEN */}
      {gameState === GameState.MENU && (
        <div id="main-menu" className="flex-grow flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden bg-transparent z-10">
          {/* Core Content Box */}
          <div className="max-w-xl w-full text-center space-y-8 z-10 bg-[#0d0e14]/85 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl shadow-black/60">
            {/* Title & Brand logo */}
            <div className="space-y-4">
              <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-400 via-cyan-500 to-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.4)] border-2 border-cyan-300 rotate-3 hover:rotate-6 transition duration-300">
                <Swords className="w-10 h-10 text-white" />
              </div>
              
              <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-orange-500 uppercase font-sans drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                MORAINGY
              </h1>
              <p className="text-cyan-400 font-sans uppercase tracking-[0.25em] text-xs font-bold animate-neon-pulse">
                — L'Arène Fantastique Malgache —
              </p>
              <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                Incarnez les légendes sacrées de Madagascar et affrontez-vous dans des combats de Moraingy 1v1 d'une fluidité arcade légendaire.
              </p>
            </div>

            {/* Main Action buttons */}
            <div className="space-y-4 pt-2">
              <button
                id="mode-vs-cpu-btn"
                onClick={() => handleSelectMode(true)}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-lg transition duration-250 transform hover:scale-[1.01] shadow-xl shadow-cyan-950/20 flex items-center justify-center gap-3 cursor-pointer"
              >
                <User className="w-5 h-5 text-white" />
                JOUEUR vs ORDINATEUR (CPU)
              </button>

              <button
                id="mode-local-1v1-btn"
                onClick={() => handleSelectMode(false)}
                className="w-full py-4 px-6 rounded-2xl bg-[#0c0d12]/95 hover:bg-[#121420] text-slate-100 font-extrabold text-lg border border-cyan-500/30 transition duration-250 transform hover:scale-[1.01] shadow-xl flex items-center justify-center gap-3 cursor-pointer hover:border-cyan-400/60"
              >
                <Users className="w-5 h-5 text-cyan-400" />
                COMBAT LOCAL 1 VS 1 (CLAVIER)
              </button>

              <button
                id="how-to-play-toggle-btn"
                onClick={() => setShowHowToPlay(true)}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#0c0d12]/40 hover:bg-[#121420]/60 text-slate-400 hover:text-slate-200 font-semibold text-sm border border-slate-800/80 transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-orange-400" />
                Comment Jouer & Contrôles
              </button>
            </div>

            {/* Cultural Footnote */}
            <div className="pt-6 border-t border-slate-800/80 flex justify-center gap-6 text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-slate-600" /> Madagascar Mythos
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-slate-600" /> Moraingy Tradition
              </span>
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-slate-600" /> 100% Hors-ligne / Local
              </span>
            </div>
          </div>

          {/* HOW TO PLAY MODAL OVERLAY */}
          {showHowToPlay && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <HowToPlay onClose={() => setShowHowToPlay(false)} />
            </div>
          )}
        </div>
      )}

      {/* 2. CHARACTER SELECTION SCREEN */}
      {gameState === GameState.CHARACTER_SELECT && (
        <div className="relative z-10 flex-grow bg-transparent flex flex-col">
          <CharacterSelect
            isVsCpu={isVsCpu}
            onSelectComplete={handleCharacterSelectComplete}
            onBack={handleBackToMenu}
          />
        </div>
      )}

      {/* 3. ARENA SELECTION SCREEN */}
      {gameState === GameState.ARENA_SELECT && (
        <div className="relative z-10 flex-grow bg-transparent flex flex-col">
          <ArenaSelect
            onSelectComplete={handleArenaSelectComplete}
            onBack={() => setGameState(GameState.CHARACTER_SELECT)}
          />
        </div>
      )}

      {/* 4. ACTIVE COMBAT PLAYING STAGE */}
      {gameState === GameState.PLAYING && p1Fighter && p2Fighter && selectedArena && (
        <div className="relative z-10 flex-grow bg-transparent flex flex-col">
          <GameCanvas
            p1Id={p1Fighter}
            p2Id={p2Fighter}
            arenaId={selectedArena}
            isVsCpu={isVsCpu}
            onExit={handleExitGame}
          />
        </div>
      )}
    </div>
  );
}
