/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum GameState {
  MENU = "MENU",
  CHARACTER_SELECT = "CHARACTER_SELECT",
  ARENA_SELECT = "ARENA_SELECT",
  PLAYING = "PLAYING",
  PAUSED = "PAUSED",
  ROUND_OVER = "ROUND_OVER",
  GAME_OVER = "GAME_OVER",
}

export enum FighterId {
  RADAMA = "radama",
  KALA = "kala",
  MARO = "maro",
  VOLA = "vola",
}

export enum ArenaId {
  BAOBABS = "baobabs",
  AMBOHIMANGA = "ambohimanga",
  RANOMAFANA = "ranomafana",
}

export interface CharacterStats {
  power: number; // 1 to 5 stars
  speed: number;  // 1 to 5 stars
  range: number;  // 1 to 5 stars
  difficulty: number; // 1 to 5 stars
}

export interface CharacterDef {
  id: FighterId;
  name: string;
  title: string;
  origin: string;
  description: string;
  avatar: string;
  themeColor: string; // Tailwind hex or rgb color for visual accents
  secondaryColor: string;
  stats: CharacterStats;
  moves: {
    light: string;
    heavy: string;
    special: string;
  };
}

export interface ArenaDef {
  id: ArenaId;
  name: string;
  location: string;
  description: string;
  bgImage: string;
  ambientColor: string;
}

export interface FighterState {
  id: FighterId;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  direction: 1 | -1; // 1 = right, -1 = left
  health: number;
  maxHealth: number;
  shield: number; // Block strength or general shielding
  isGrounded: boolean;
  isCrouching: boolean;
  isBlocking: boolean;
  isHurting: boolean;
  hurtTimer: number;
  isDashing: boolean;
  dashTimer: number;
  comboCount: number;
  comboTimer: number;
  
  // Combat state
  action: FighterAction;
  actionTimer: number;
  actionDuration: number;
  
  // Specific controls tracking (for movement and buffering)
  lastAttackType: "light" | "heavy" | "special" | null;
}

export enum FighterAction {
  IDLE = "IDLE",
  WALK = "WALK",
  JUMP = "JUMP",
  FALL = "FALL",
  CROUCH = "CROUCH",
  BLOCK = "BLOCK",
  LIGHT_ATTACK = "LIGHT_ATTACK",
  HEAVY_ATTACK = "HEAVY_ATTACK",
  SPECIAL_ATTACK = "SPECIAL_ATTACK",
  HURT = "HURT",
  DASH = "DASH",
  KO = "KO",
}

export interface AttackHitbox {
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
  damage: number;
  knockbackX: number;
  knockbackY: number;
  hitStun: number; // Frames of stun on hit
  isProjectile?: boolean;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  type: "spark" | "dust" | "wind" | "lightning" | "leaf" | "hit" | "projectile";
}

export interface Projectile {
  id: string;
  ownerIndex: 0 | 1;
  x: number;
  y: number;
  vx: number;
  width: number;
  height: number;
  damage: number;
  color: string;
  effectType: "fire" | "spirit" | "leaf" | "bolt";
}

export interface GameControls {
  // Player 1
  p1Left: boolean;
  p1Right: boolean;
  p1Jump: boolean;
  p1Crouch: boolean;
  p1Light: boolean;
  p1Heavy: boolean;
  p1Special: boolean;
  
  // Player 2
  p2Left: boolean;
  p2Right: boolean;
  p2Jump: boolean;
  p2Crouch: boolean;
  p2Light: boolean;
  p2Heavy: boolean;
  p2Special: boolean;
}
