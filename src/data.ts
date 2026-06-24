/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CharacterDef, ArenaDef, FighterId, ArenaId } from "./types";

export const CHARACTERS: CharacterDef[] = [
  {
    id: FighterId.RADAMA,
    name: "Radama",
    title: "Le Souverain du Lefona",
    origin: "Hautes Terres (Antananarivo)",
    description: "Souverain noble et stratège, il combat vêtu du Lamba rouge et blanc traditionnel des rois des Hautes Terres. Armé de son Lefona (lance sacrée en or), il domine l'arène avec une allonge exceptionnelle et des attaques de foudre royales inspirées des esprits des ancêtres.",
    avatar: "/src/assets/images/fighter_radama_1782314137850.jpg",
    themeColor: "#EF4444", // Crimson Red
    secondaryColor: "#FFFFFF",
    stats: {
      power: 4,
      speed: 3,
      range: 5,
      difficulty: 2,
    },
    moves: {
      light: "Thrust : Coup d'estoc rapide avec la pointe de la lance.",
      heavy: "Volcano Sweep : Attaque tournoyante balayant le sol de flammes rouges.",
      special: "Tselatra (Éclair ancestral) : Charge fulgurante entourée d'éclairs dorés.",
    }
  },
  {
    id: FighterId.KALA,
    name: "Kala",
    title: "La Magicienne du Sikidy",
    origin: "Terres du Sud (Toliara)",
    description: "Inspirée des rituels sacrés du Sikidy (la divination par les graines) et des talismans sacrés (Ody). Kala invoque les esprits des anciens Baobabs et les forces des vents arides pour repousser ses adversaires et manipuler l'espace avec de la magie élémentaire.",
    avatar: "/src/assets/images/fighter_kala_1782314152178.jpg",
    themeColor: "#8B5CF6", // Purple/Violet
    secondaryColor: "#F59E0B", // Amber
    stats: {
      power: 3,
      speed: 4,
      range: 4,
      difficulty: 4,
    },
    moves: {
      light: "Spirit Shot : Lance un projectile spirituel rapide à moyenne portée.",
      heavy: "Baobab Root : Invoque une racine noueuse du sol pour faire trébucher.",
      special: "Avoloa (Souffle des Ancêtres) : Éruption magique sous l'adversaire qui le projette en l'air.",
    }
  },
  {
    id: FighterId.MARO,
    name: "Maro",
    title: "Le Colosse du Moraingy",
    origin: "Côte Est (Toamasina)",
    description: "Champion invaincu du Moraingy, l'art martial traditionnel malgache de combat à mains nues. Maro est un guerrier de la côte arborant des peintures corporelles blanches sacrées et un Salaka de combat. Sa force brute lui permet de briser les gardes et de secouer le sol.",
    avatar: "/src/assets/images/fighter_maro_1782314164413.jpg",
    themeColor: "#F59E0B", // Amber Gold
    secondaryColor: "#3B82F6", // Ocean Blue
    stats: {
      power: 5,
      speed: 2,
      range: 2,
      difficulty: 1,
    },
    moves: {
      light: "Moraingy Jab : Enchaînement rapide de deux coups de poing directs.",
      heavy: "Earth Slam : Frappe le sol de ses poings, créant une onde de choc dévastatrice.",
      special: "Tamboho Charge : Une charge de taureau irrésistible qui saisit et écrase l'adversaire.",
    }
  },
  {
    id: FighterId.VOLA,
    name: "Vola",
    title: "La Gardienne de l'Aloalo",
    origin: "Forêts de l'Est (Masoala)",
    description: "Inspirée par l'agilité légendaire des lémuriens sacrés et la faune sauvage de Masoala. Vola se bat avec deux dagues en bois de rose bénies par un Aloalo mystique. Très agile, elle peut sauter extrêmement haut et fondre sur ses proies en effectuant des acrobaties mortelles.",
    avatar: "/src/assets/images/fighter_vola_1782314177012.jpg",
    themeColor: "#10B981", // Emerald Green
    secondaryColor: "#EC4899", // Forest Bloom Pink
    stats: {
      power: 2,
      speed: 5,
      range: 3,
      difficulty: 3,
    },
    moves: {
      light: "Forest Slash : Attaque croisée de dagues créant des sillages de feuilles vertes.",
      heavy: "Lemur Flip : Saut périlleux arrière assénant un coup de pied ascendant.",
      special: "Vortex Ala (Danse des Feuilles) : Se téléporte instantanément dans un tourbillon de feuilles vertes.",
    }
  }
];

export const ARENAS: ArenaDef[] = [
  {
    id: ArenaId.BAOBABS,
    name: "L'Allée des Baobabs",
    location: "Région de Menabe (Morondava)",
    description: "Combattez sous un ciel de feu au coucher du soleil, au milieu des silhouettes majestueuses des baobabs géants de Madagascar. La poussière de terre rouge tourbillonne à chaque coup porté.",
    bgImage: "/src/assets/images/baobab_sunset_arena_1782309985616.jpg",
    ambientColor: "rgba(239, 68, 68, 0.15)",
  },
  {
    id: ArenaId.AMBOHIMANGA,
    name: "Colline Royale d'Ambohimanga",
    location: "Région d'Analamanga",
    description: "Lieu sacré abritant les anciennes résidences royales. Les guerriers s'affrontent sur l'esplanade de pierre, entourés de murs ancestraux fortifiés et de brumes d'altitude mystiques.",
    bgImage: "/src/assets/images/ambohimanga_palace_arena_1782310004301.jpg",
    ambientColor: "rgba(139, 92, 246, 0.15)",
  },
  {
    id: ArenaId.RANOMAFANA,
    name: "Forêt Tropicale de Ranomafana",
    location: "Sud-Est de Madagascar",
    description: "Une jungle dense et humide à l'atmosphère magique, où cascade une eau cristalline au milieu de plantes exotiques géantes, de champignons luminescents et de chants d'esprits de la forêt.",
    bgImage: "/src/assets/images/ranomafana_jungle_arena_1782310020158.jpg",
    ambientColor: "rgba(16, 185, 129, 0.15)",
  }
];
