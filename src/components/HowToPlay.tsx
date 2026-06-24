/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Flame, Shield, Swords, Zap, HelpCircle } from "lucide-react";

interface HowToPlayProps {
  onClose?: () => void;
}

export default function HowToPlay({ onClose }: HowToPlayProps) {
  return (
    <div id="how-to-play-container" className="bg-[#0d0e14]/95 border border-white/10 rounded-3xl p-6 max-w-2xl w-full text-slate-100 shadow-2xl backdrop-blur-md overflow-y-auto max-h-[85vh]">
      <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
        <h2 className="text-2xl font-black flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300 font-sans tracking-tight">
          <HelpCircle className="w-6 h-6 text-cyan-400" /> Comment Jouer — Règles du Moraingy
        </h2>
        {onClose && (
          <button
            id="close-instructions"
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-[#121420] hover:bg-[#1a1c2c] border border-slate-800 rounded-lg px-3 py-1.5 text-sm font-semibold transition cursor-pointer"
          >
            Fermer
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Concept */}
        <div className="bg-[#121420]/80 p-4 rounded-2xl border border-white/5">
          <p className="text-slate-300 leading-relaxed text-sm">
            Inspiré du <strong className="text-cyan-400">Moraingy</strong> (le combat traditionnel malgache à mains nues) et de la mythologie de la Grande Île, ce jeu vous oppose en 1 contre 1 local. Vainquez votre adversaire en réduisant sa barre de santé à zéro pour remporter le KO !
          </p>
        </div>

        {/* CONTROLS GRID */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* PLAYER 1 */}
          <div className="bg-red-950/20 border border-red-900/30 p-4 rounded-xl">
            <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
              Joueur 1 (Gauche)
            </h3>
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Déplacement</span>
                <kbd className="px-2 py-1 bg-black/60 border border-white/5 rounded text-xs font-mono font-bold text-red-300">A / D</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Sauter</span>
                <kbd className="px-2 py-1 bg-black/60 border border-white/5 rounded text-xs font-mono font-bold text-red-300">W</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">S'accroupir / Garde</span>
                <kbd className="px-2 py-1 bg-black/60 border border-white/5 rounded text-xs font-mono font-bold text-red-300">S</kbd>
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-2.5">
                <span className="text-slate-300 font-medium">Attaque Rapide</span>
                <kbd className="px-2 py-1 bg-red-900/40 border border-red-700/50 rounded text-xs font-mono font-bold text-red-200">F</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">Attaque Lourde</span>
                <kbd className="px-2 py-1 bg-red-900/40 border border-red-700/50 rounded text-xs font-mono font-bold text-red-200">G</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">Pouvoir Spécial</span>
                <kbd className="px-2 py-1 bg-red-900/40 border border-red-700/50 rounded text-xs font-mono font-bold text-red-200">H</kbd>
              </div>
            </div>
          </div>

          {/* PLAYER 2 */}
          <div className="bg-blue-950/20 border border-blue-900/30 p-4 rounded-xl">
            <h3 className="text-cyan-400 font-bold mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
              Joueur 2 / CPU (Droite)
            </h3>
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Déplacement</span>
                <kbd className="px-2 py-1 bg-black/60 border border-white/5 rounded text-xs font-mono font-bold text-cyan-300">← / →</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Sauter</span>
                <kbd className="px-2 py-1 bg-black/60 border border-white/5 rounded text-xs font-mono font-bold text-cyan-300">↑</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">S'accroupir / Garde</span>
                <kbd className="px-2 py-1 bg-black/60 border border-white/5 rounded text-xs font-mono font-bold text-cyan-300">↓</kbd>
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-2.5">
                <span className="text-slate-300 font-medium">Attaque Rapide</span>
                <kbd className="px-2 py-1 bg-cyan-950/40 border border-cyan-700/50 rounded text-xs font-mono font-bold text-cyan-200">I</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">Attaque Lourde</span>
                <kbd className="px-2 py-1 bg-cyan-950/40 border border-cyan-700/50 rounded text-xs font-mono font-bold text-cyan-200">O</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">Pouvoir Spécial</span>
                <kbd className="px-2 py-1 bg-cyan-950/40 border border-cyan-700/50 rounded text-xs font-mono font-bold text-cyan-200">P</kbd>
              </div>
            </div>
          </div>
        </div>

        {/* COMBAT MECHANICS */}
        <div>
          <h3 className="text-md font-black text-cyan-400 mb-3.5 font-sans uppercase tracking-wider">Mécaniques Essentielles</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-black/40 border border-white/5 p-3 rounded-2xl text-center">
              <div className="mx-auto w-8 h-8 bg-cyan-500/10 text-cyan-400 flex items-center justify-center rounded-full mb-2">
                <Shield className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-200 mb-1">Garde active</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">Maintenez la touche S'accroupir (<kbd className="font-mono text-[9px] bg-slate-800 px-1 rounded">S</kbd> / <kbd className="font-mono text-[9px] bg-slate-800 px-1 rounded">↓</kbd>) pour bloquer les coups et réduire les dégâts de 80%.</p>
            </div>

            <div className="bg-black/40 border border-white/5 p-3 rounded-2xl text-center">
              <div className="mx-auto w-8 h-8 bg-red-500/10 text-red-500 flex items-center justify-center rounded-full mb-2">
                <Swords className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-200 mb-1">Combos Rapides</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">Enchaînez rapidement <span className="text-cyan-400">Rapide → Lourde</span> pour déstabiliser l'adversaire et accumuler les dégâts de combo.</p>
            </div>

            <div className="bg-black/40 border border-white/5 p-3 rounded-2xl text-center">
              <div className="mx-auto w-8 h-8 bg-cyan-500/10 text-cyan-400 flex items-center justify-center rounded-full mb-2">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-200 mb-1">Pouvoir Ancestral</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">La compétence spéciale déclenche un coup surpuissant ou un effet de déplacement magique propre à chaque héros.</p>
            </div>
          </div>
        </div>

        {/* TIPS */}
        <div className="border-t border-white/5 pt-4 text-xs text-slate-400 flex flex-col gap-1.5 list-disc pl-4">
          <p>💡 <strong>Astuce :</strong> Le jeu supporte un mode Solo contre l'ordinateur ! Si vous êtes seul(e), sélectionnez le mode "Joueur vs CPU" pour vous entraîner.</p>
          <p>💡 Les attaques lourdes projettent l'adversaire et peuvent interrompre les attaques rapides.</p>
        </div>
      </div>
    </div>
  );
}
