/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import { 
  FighterId, 
  ArenaId, 
  FighterState, 
  FighterAction, 
  GameControls, 
  Particle, 
  Projectile, 
  AttackHitbox 
} from "../types";
import { CHARACTERS, ARENAS } from "../data";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Home, Swords, RefreshCw, Cpu } from "lucide-react";

// Web Audio API Synthesizer for instant retro arcade sound effects
class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  constructor() {
    // Initialized lazily on first user interaction to bypass browser policies
  }

  private init() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
    } catch (e) {
      console.warn("AudioContext initialization failed or is not supported in this environment:", e);
    }
  }

  playLight() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      console.warn("Error playing light sound:", e);
    }
  }

  playHeavy() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      // Sub-bass impact
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(100, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.18);

      // Friction/impact noise filter
      const noise = this.ctx.createBufferSource();
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      noise.buffer = buffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = "lowpass";
      noiseFilter.frequency.setValueAtTime(400, this.ctx.currentTime);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      noise.start();
      osc.stop(this.ctx.currentTime + 0.18);
      noise.stop(this.ctx.currentTime + 0.18);
    } catch (e) {
      console.warn("Error playing heavy sound:", e);
    }
  }

  playBlock() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(350, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {
      console.warn("Error playing block sound:", e);
    }
  }

  playSpecial() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(750, this.ctx.currentTime + 0.35);

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(250, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(2000, this.ctx.currentTime + 0.35);
      filter.Q.setValueAtTime(5, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    } catch (e) {
      console.warn("Error playing special sound:", e);
    }
  }

  playJump() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {
      console.warn("Error playing jump sound:", e);
    }
  }

  playHurt() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(45, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {
      console.warn("Error playing hurt sound:", e);
    }
  }

  playKO() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(90, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(20, this.ctx.currentTime + 0.8);

      osc2.type = "square";
      osc2.frequency.setValueAtTime(95, this.ctx.currentTime);
      osc2.frequency.linearRampToValueAtTime(15, this.ctx.currentTime + 0.8);

      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.8);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc2.start();
      osc.stop(this.ctx.currentTime + 0.8);
      osc2.stop(this.ctx.currentTime + 0.8);
    } catch (e) {
      console.warn("Error playing KO sound:", e);
    }
  }
}

// Global audio helper instance
const audio = new SoundEngine();

interface GameCanvasProps {
  p1Id: FighterId;
  p2Id: FighterId;
  arenaId: ArenaId;
  isVsCpu: boolean;
  onExit: () => void;
}

export default function GameCanvas({ p1Id, p2Id, arenaId, isVsCpu, onExit }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Sound toggling state
  const [soundOn, setSoundOn] = useState<boolean>(true);

  // Standard match parameters
  const [p1Wins, setP1Wins] = useState<number>(0);
  const [p2Wins, setP2Wins] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [roundTimer, setRoundTimer] = useState<number>(99);
  const [roundActive, setRoundActive] = useState<boolean>(false);
  const [fightAnnounce, setFightAnnounce] = useState<string>("ROUND 1");
  const [fightAnnounceSub, setFightAnnounceSub] = useState<string>("Préparez-vous !");
  const [winnerMessage, setWinnerMessage] = useState<string | null>(null);

  // CPU intelligence configuration state
  const [cpuDifficulty, setCpuDifficulty] = useState<"facile" | "moyen" | "legende">("moyen");

  // Peace-of-mind gameplay states (Pause & Manual Round Progression)
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [pendingNextRound, setPendingNextRound] = useState<number | null>(null);

  const isPausedRef = useRef<boolean>(false);
  const pendingNextRoundRef = useRef<boolean>(false);

  const activeTimeoutsRef = useRef<number[]>([]);

  const setCleanableTimeout = (fn: () => void, delay: number) => {
    const id = window.setTimeout(() => {
      activeTimeoutsRef.current = activeTimeoutsRef.current.filter((tid) => tid !== id);
      fn();
    }, delay);
    activeTimeoutsRef.current.push(id);
    return id;
  };

  const clearAllTimeouts = () => {
    activeTimeoutsRef.current.forEach((id) => clearTimeout(id));
    activeTimeoutsRef.current = [];
  };

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    pendingNextRoundRef.current = pendingNextRound !== null;
  }, [pendingNextRound]);

  // Game specifications internal size
  const GAME_WIDTH = 1024;
  const GAME_HEIGHT = 576;
  const GROUND_Y = 470;

  // React Refs to keep game loop running at perfect 60FPS with fresh values
  const fightersRef = useRef<[FighterState, FighterState]>([
    createInitialFighter(0, p1Id),
    createInitialFighter(1, p2Id),
  ]);
  const controlsRef = useRef<GameControls>({
    p1Left: false, p1Right: false, p1Jump: false, p1Crouch: false, p1Light: false, p1Heavy: false, p1Special: false,
    p2Left: false, p2Right: false, p2Jump: false, p2Crouch: false, p2Light: false, p2Heavy: false, p2Special: false,
  });

  const particlesRef = useRef<Particle[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const cameraShakeRef = useRef<number>(0);

  // Round over state refs to prevent multi-triggering
  const roundEndedRef = useRef<boolean>(false);
  const animationFrameId = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Visual background preloading
  const arena = ARENAS.find(a => a.id === arenaId) || ARENAS[0];
  const bgImageRef = useRef<HTMLImageElement | null>(null);

  // Initialize background image
  useEffect(() => {
    const img = new Image();
    img.src = arena.bgImage;
    img.onload = () => {
      bgImageRef.current = img;
    };
  }, [arenaId]);

  // Audio mute sync
  useEffect(() => {
    audio.enabled = soundOn;
  }, [soundOn]);

  // Create initial state for a fighter
  function createInitialFighter(index: 0 | 1, id: FighterId): FighterState {
    const char = CHARACTERS.find(c => c.id === id) || CHARACTERS[0];
    const initialX = index === 0 ? 250 : 774;
    return {
      id,
      name: char.name,
      x: initialX,
      y: GROUND_Y,
      vx: 0,
      vy: 0,
      width: 70,
      height: 120,
      direction: index === 0 ? 1 : -1,
      health: 100,
      maxHealth: 100,
      shield: 100,
      isGrounded: true,
      isCrouching: false,
      isBlocking: false,
      isHurting: false,
      hurtTimer: 0,
      isDashing: false,
      dashTimer: 0,
      comboCount: 0,
      comboTimer: 0,
      action: FighterAction.IDLE,
      actionTimer: 0,
      actionDuration: 0,
      lastAttackType: null,
    };
  }

  // Handle Keyboard Inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle pause on Escape
      if (e.key === "Escape" || e.key === "Esc") {
        e.preventDefault();
        if (!winnerMessage && !pendingNextRoundRef.current) {
          setIsPaused((prev) => !prev);
        }
        return;
      }

      const keys = controlsRef.current;
      const key = e.key.toLowerCase();

      // PLAYER 1 KEYS
      if (key === "a") keys.p1Left = true;
      if (key === "d") keys.p1Right = true;
      if (key === "w") keys.p1Jump = true;
      if (key === "s") keys.p1Crouch = true;
      if (key === "f") keys.p1Light = true;
      if (key === "g") keys.p1Heavy = true;
      if (key === "h") keys.p1Special = true;

      // PLAYER 2 KEYS (Only active if NOT vs CPU)
      if (!isVsCpu) {
        if (e.key === "ArrowLeft") keys.p2Left = true;
        if (e.key === "ArrowRight") keys.p2Right = true;
        if (e.key === "ArrowUp") keys.p2Jump = true;
        if (e.key === "ArrowDown") keys.p2Crouch = true;
        if (key === "i") keys.p2Light = true;
        if (key === "o") keys.p2Heavy = true;
        if (key === "p") keys.p2Special = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const keys = controlsRef.current;
      const key = e.key.toLowerCase();

      // PLAYER 1 KEYS
      if (key === "a") keys.p1Left = false;
      if (key === "d") keys.p1Right = false;
      if (key === "w") keys.p1Jump = false;
      if (key === "s") keys.p1Crouch = false;
      if (key === "f") keys.p1Light = false;
      if (key === "g") keys.p1Heavy = false;
      if (key === "h") keys.p1Special = false;

      // PLAYER 2 KEYS
      if (e.key === "ArrowLeft") keys.p2Left = false;
      if (e.key === "ArrowRight") keys.p2Right = false;
      if (e.key === "ArrowUp") keys.p2Jump = false;
      if (e.key === "ArrowDown") keys.p2Crouch = false;
      if (key === "i") keys.p2Light = false;
      if (key === "o") keys.p2Heavy = false;
      if (key === "p") keys.p2Special = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isVsCpu]);

  // Start a new Round
  const startRound = (rNum: number) => {
    clearAllTimeouts();
    roundEndedRef.current = false;
    fightersRef.current = [
      createInitialFighter(0, p1Id),
      createInitialFighter(1, p2Id),
    ];
    projectilesRef.current = [];
    particlesRef.current = [];
    setRound(rNum);
    setRoundTimer(99);
    setRoundActive(false);
    setWinnerMessage(null);
    setFightAnnounce(`ROUND ${rNum}`);
    setFightAnnounceSub("Préparez-vous !");

    // Intro dramatic sequence
    setCleanableTimeout(() => {
      setFightAnnounce("MORAINGY !");
      setFightAnnounceSub("BATTEZ-VOUS !");
      try {
        audio.playSpecial();
      } catch (e) {}

      setCleanableTimeout(() => {
        setFightAnnounce("");
        setRoundActive(true);
      }, 1000);
    }, 1500);
  };

  // Trigger once on load
  useEffect(() => {
    startRound(1);
    return () => {
      clearAllTimeouts();
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  // Timer Countdown Effect
  useEffect(() => {
    if (!roundActive || roundEndedRef.current || isPaused) return;

    const timer = setInterval(() => {
      setRoundTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          evaluateRoundTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [roundActive, isPaused]);

  // Evaluate timeout scenario
  function evaluateRoundTimeout() {
    if (roundEndedRef.current) return;
    roundEndedRef.current = true;
    setRoundActive(false);

    const [p1, p2] = fightersRef.current;

    if (p1.health > p2.health) {
      setP1Wins((w) => {
        const nextWins = w + 1;
        triggerRoundOverScreen(0, "TEMPS ÉCOULÉ !", nextWins, p2Wins);
        return nextWins;
      });
    } else if (p2.health > p1.health) {
      setP2Wins((w) => {
        const nextWins = w + 1;
        triggerRoundOverScreen(1, "TEMPS ÉCOULÉ !", p1Wins, nextWins);
        return nextWins;
      });
    } else {
      triggerRoundOverScreen(-1, "TEMPS ÉCOULÉ ! ÉGALITÉ", p1Wins, p2Wins);
    }
  }

  // Trigger active combat hit sparks
  function spawnSparks(x: number, y: number, color: string, count: number = 8, type: "spark" | "dust" | "wind" | "lightning" | "leaf" | "hit" = "spark") {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 2;
      particlesRef.current.push({
        id: Math.random().toString(),
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (type === "dust" ? 1 : 2),
        color,
        size: Math.random() * (type === "dust" ? 12 : 5) + (type === "dust" ? 5 : 3),
        life: 0,
        maxLife: Math.random() * 20 + 15,
        type,
      });
    }
  }

  // CPU AI Logic execution per tick
  function handleCpuAi(cpu: FighterState, enemy: FighterState) {
    const keys = controlsRef.current;
    
    // Clear previous CPU key states
    keys.p2Left = false;
    keys.p2Right = false;
    keys.p2Jump = false;
    keys.p2Crouch = false;
    keys.p2Light = false;
    keys.p2Heavy = false;
    keys.p2Special = false;

    if (cpu.action === FighterAction.KO || cpu.isHurting) return;

    const dx = enemy.x - cpu.x;
    const distance = Math.abs(dx);
    const facingEnemy = (dx > 0 && cpu.direction === 1) || (dx < 0 && cpu.direction === -1);

    // AI parameters based on selected difficulty level
    let reactChance = 0.03; // Attack frequency
    let blockChance = 0.4;  // Propensity to block
    if (cpuDifficulty === "facile") {
      reactChance = 0.015;
      blockChance = 0.2;
    } else if (cpuDifficulty === "legende") {
      reactChance = 0.055;
      blockChance = 0.7;
    }

    // Horizontal Movement Pathfinding
    if (distance > 160) {
      // Move closer
      if (dx > 0) keys.p2Right = true;
      else keys.p2Left = true;

      // Occasional random jump to close gaps
      if (Math.random() < 0.006) {
        keys.p2Jump = true;
      }
    } else if (distance < 60) {
      // Too close, move back or crouch
      if (dx > 0) keys.p2Left = true;
      else keys.p2Right = true;
      
      if (Math.random() < 0.2) {
        keys.p2Crouch = true;
      }
    } else {
      // In combat spacing. Stand ground or advance slightly
      if (Math.random() < 0.3) {
        if (dx > 0) keys.p2Right = true;
        else keys.p2Left = true;
      }
    }

    // Defensive Action: If enemy is actively attacking in close range, decide to block
    if (enemy.action === FighterAction.LIGHT_ATTACK || enemy.action === FighterAction.HEAVY_ATTACK || enemy.action === FighterAction.SPECIAL_ATTACK) {
      if (distance < 180 && Math.random() < blockChance) {
        keys.p2Crouch = true; // S'accroupir acts as heavy blocking stance
      }
    }

    // Offensive Action: Execute attack triggers
    if (cpu.action === FighterAction.IDLE || cpu.action === FighterAction.WALK) {
      if (distance < 150 && Math.random() < reactChance) {
        const attackChoice = Math.random();
        if (attackChoice < 0.55) {
          keys.p2Light = true;
        } else if (attackChoice < 0.85) {
          keys.p2Heavy = true;
        } else {
          keys.p2Special = true;
        }
      }
    }
  }

  // Core Game State Update (The Physics loop tick)
  function updateGame(dt: number) {
    const [p1, p2] = fightersRef.current;
    const keys = controlsRef.current;

    // Reset combat state calculations
    p1.isBlocking = false;
    p2.isBlocking = false;

    // Auto-update facing directions so fighters always look at each other
    if (p1.action !== FighterAction.KO && p2.action !== FighterAction.KO) {
      p1.direction = p1.x < p2.x ? 1 : -1;
      p2.direction = p2.x < p1.x ? 1 : -1;
    }

    // Execute CPU decisions if active
    if (isVsCpu && roundActive) {
      handleCpuAi(p2, p1);
    }

    // Update individual fighter physics
    updateFighterPhysics(p1, 0, keys);
    updateFighterPhysics(p2, 1, keys);

    // Solve screen boundaries and fighter collisions (prevent overlap)
    solveFighterCollisions(p1, p2);

    // Process Projectiles
    updateProjectiles(p1, p2);

    // Check attack frames and hitboxes
    if (roundActive) {
      processAttacks(p1, p2, 0);
      processAttacks(p2, p1, 1);
    }

    // Update Particles
    updateParticles();

    // Check round win thresholds
    checkMatchThresholds();

    // Decrease camera shake
    if (cameraShakeRef.current > 0) {
      cameraShakeRef.current *= 0.9;
      if (cameraShakeRef.current < 0.1) cameraShakeRef.current = 0;
    }
  }

  // Update position, physics forces, jump heights
  function updateFighterPhysics(p: FighterState, index: 0 | 1, keys: GameControls) {
    const isP1 = index === 0;

    // Manage general timers
    if (p.hurtTimer > 0) {
      p.hurtTimer--;
      if (p.hurtTimer <= 0) p.isHurting = false;
    }
    if (p.dashTimer > 0) {
      p.dashTimer--;
      if (p.dashTimer <= 0) p.isDashing = false;
    }
    if (p.comboTimer > 0) {
      p.comboTimer--;
      if (p.comboTimer <= 0) p.comboCount = 0;
    }

    // Block logic checks
    const isCrouchKey = isP1 ? keys.p1Crouch : keys.p2Crouch;
    const isLeftKey = isP1 ? keys.p1Left : keys.p2Left;
    const isRightKey = isP1 ? keys.p1Right : keys.p2Right;
    const isJumpKey = isP1 ? keys.p1Jump : keys.p2Jump;

    // Determine state
    if (p.action === FighterAction.KO) {
      p.vx *= 0.95;
      applyGravity(p);
      return;
    }

    // If hurting, lock controls but allow sliding/knockbacks
    if (p.isHurting) {
      p.action = FighterAction.HURT;
      p.vx *= 0.95;
      applyGravity(p);
      return;
    }

    // Handle Attack Active Sequences
    if (p.actionTimer > 0) {
      p.actionTimer--;
      p.vx *= 0.9; // Decelerate during attacks
      applyGravity(p);

      if (p.actionTimer <= 0) {
        p.action = FighterAction.IDLE;
        p.lastAttackType = null;
      }
      return;
    }

    // Crouch handling
    if (isCrouchKey && p.isGrounded) {
      p.isCrouching = true;
      p.isBlocking = true; // S'accroupir offers absolute low guard
      p.action = FighterAction.CROUCH;
      p.vx *= 0.7; // Slow glide
    } else {
      p.isCrouching = false;
    }

    // Move Left/Right
    if (!p.isCrouching) {
      const moveSpeed = getCharacterSpeed(p.id);
      if (isLeftKey) {
        p.vx = -moveSpeed;
        p.action = FighterAction.WALK;
        // SF / Tekken style back-block
        if (p.direction === 1) p.isBlocking = true;
      } else if (isRightKey) {
        p.vx = moveSpeed;
        p.action = FighterAction.WALK;
        if (p.direction === -1) p.isBlocking = true;
      } else {
        p.vx *= 0.82; // High decay friction
        if (p.vx < 0.1 && p.vx > -0.1) {
          p.vx = 0;
          p.action = FighterAction.IDLE;
        }
      }
    }

    // Jump handling
    if (isJumpKey && p.isGrounded) {
      p.vy = -16.5; // Jump strength force
      p.isGrounded = false;
      p.action = FighterAction.JUMP;
      audio.playJump();
      spawnSparks(p.x, GROUND_Y, "rgba(255, 255, 255, 0.4)", 4, "dust");
    }

    // Apply gravity
    applyGravity(p);

    // Apply attacks triggers
    const isLightKey = isP1 ? keys.p1Light : keys.p2Light;
    const isHeavyKey = isP1 ? keys.p1Heavy : keys.p2Heavy;
    const isSpecialKey = isP1 ? keys.p1Special : keys.p2Special;

    if (roundActive && p.actionTimer <= 0) {
      if (isLightKey) {
        triggerAttack(p, "light");
      } else if (isHeavyKey) {
        triggerAttack(p, "heavy");
      } else if (isSpecialKey) {
        triggerAttack(p, "special");
      }
    }
  }

  function applyGravity(p: FighterState) {
    if (!p.isGrounded) {
      p.vy += 0.75; // Gravity pull
      p.y += p.vy;
      p.x += p.vx;

      if (p.vy > 0) {
        p.action = FighterAction.FALL;
      }

      if (p.y >= GROUND_Y) {
        p.y = GROUND_Y;
        p.vy = 0;
        p.isGrounded = true;
        p.action = FighterAction.IDLE;
        spawnSparks(p.x, GROUND_Y, "rgba(255, 255, 255, 0.4)", 5, "dust");
      }
    } else {
      p.x += p.vx;
    }

    // Keep within logical screen boundary limits
    if (p.x < 50) p.x = 50;
    if (p.x > GAME_WIDTH - 50) p.x = GAME_WIDTH - 50;
  }

  // Get Speed stat modifications
  function getCharacterSpeed(id: FighterId): number {
    if (id === FighterId.VOLA) return 7.5;
    if (id === FighterId.KALA) return 5.8;
    if (id === FighterId.RADAMA) return 5.2;
    return 4.2; // MARO is slower but heavy
  }

  // Initiate an attack state
  function triggerAttack(p: FighterState, type: "light" | "heavy" | "special") {
    p.lastAttackType = type;
    
    if (type === "light") {
      p.action = FighterAction.LIGHT_ATTACK;
      p.actionDuration = 16; // frames
      p.actionTimer = 16;
      audio.playLight();
    } else if (type === "heavy") {
      p.action = FighterAction.HEAVY_ATTACK;
      p.actionDuration = 26;
      p.actionTimer = 26;
      audio.playHeavy();
      // minor forward lunge on heavy
      p.vx = 4 * p.direction;
    } else {
      p.action = FighterAction.SPECIAL_ATTACK;
      p.actionDuration = 36;
      p.actionTimer = 36;
      audio.playSpecial();

      // Launch Character unique powers
      if (p.id === FighterId.RADAMA) {
        // Tselatra Bolt Lightning Dash
        p.vx = 14 * p.direction;
        spawnSparks(p.x, p.y - 40, "rgba(245, 158, 11, 0.8)", 10, "lightning");
      } else if (p.id === FighterId.KALA) {
        // Spell projectile cast
        const projX = p.x + (40 * p.direction);
        const projY = p.y - 60;
        projectilesRef.current.push({
          id: Math.random().toString(),
          ownerIndex: fightersRef.current[0].id === p.id ? 0 : 1,
          x: projX,
          y: projY,
          vx: 10 * p.direction,
          width: 30,
          height: 30,
          damage: 15,
          color: "#8B5CF6",
          effectType: "spirit",
        });
        spawnSparks(projX, projY, "#8B5CF6", 6, "wind");
      } else if (p.id === FighterId.MARO) {
        // Tamboho Slam heavy charge
        p.vx = 11 * p.direction;
        spawnSparks(p.x, GROUND_Y, "rgba(245, 158, 11, 0.5)", 8, "dust");
      } else if (p.id === FighterId.VOLA) {
        // Vortex Leaves behind-dash
        const prevX = p.x;
        p.x += 240 * p.direction;
        // bound checking
        if (p.x < 50) p.x = 50;
        if (p.x > GAME_WIDTH - 50) p.x = GAME_WIDTH - 50;
        
        spawnSparks(prevX, p.y - 50, "#10B981", 12, "leaf");
        spawnSparks(p.x, p.y - 50, "#10B981", 10, "leaf");
      }
    }
  }

  // Handle collision boundaries between fighters to prevent walking through
  function solveFighterCollisions(p1: FighterState, p2: FighterState) {
    const minDistance = 75;
    const dx = p2.x - p1.x;
    const absDx = Math.abs(dx);

    if (absDx < minDistance) {
      // Push apart equally
      const overlap = minDistance - absDx;
      const pushX = (overlap / 2) * (dx > 0 ? 1 : -1);

      // Only push if both are alive
      if (p1.action !== FighterAction.KO && p2.action !== FighterAction.KO) {
        p1.x -= pushX;
        p2.x += pushX;

        // Keep bounds respected
        if (p1.x < 50) { p1.x = 50; p2.x = 50 + minDistance; }
        if (p2.x > GAME_WIDTH - 50) { p2.x = GAME_WIDTH - 50; p1.x = GAME_WIDTH - 50 - minDistance; }
      }
    }
  }

  // Update spell/magic projectiles
  function updateProjectiles(p1: FighterState, p2: FighterState) {
    const list = projectilesRef.current;
    projectilesRef.current = list.filter((proj) => {
      proj.x += proj.vx;

      // Spawn ambient trail particles
      if (Math.random() < 0.4) {
        particlesRef.current.push({
          id: Math.random().toString(),
          x: proj.x,
          y: proj.y + (Math.random() * 20 - 10),
          vx: -proj.vx * 0.2,
          vy: Math.random() * 2 - 1,
          color: proj.color,
          size: Math.random() * 4 + 2,
          life: 0,
          maxLife: 15,
          type: "projectile",
        });
      }

      // Check boundary death
      if (proj.x < -100 || proj.x > GAME_WIDTH + 100) return false;

      // Check hitting the opponent
      const target = proj.ownerIndex === 0 ? p2 : p1;
      
      // Box overlap
      const hitX = proj.x > target.x - target.width / 2 && proj.x < target.x + target.width / 2;
      const hitY = proj.y > target.y - target.height && proj.y < target.y;

      if (hitX && hitY && target.action !== FighterAction.KO) {
        // Trigger impact on target
        applyImpact(target, proj.damage, proj.vx > 0 ? 1 : -1, "light", "#8B5CF6");
        return false;
      }

      return true;
    });
  }

  // Apply hit impacts, blocks, damage mechanics, combos
  function applyImpact(target: FighterState, damage: number, direction: 1 | -1, forceType: "light" | "heavy", color: string) {
    if (target.action === FighterAction.KO) return;

    // Check guard mechanics
    if (target.isBlocking && !target.isHurting) {
      // Blocked impact
      audio.playBlock();
      const chipDamage = Math.floor(damage * 0.15); // 85% reduction
      target.health = Math.max(0, target.health - chipDamage);
      target.vx = 4.5 * direction; // Minor knockback slide
      spawnSparks(target.x - (15 * direction), target.y - 65, "#F59E0B", 6, "spark");
      
      // Combat feedback popup block text
      createBlockPopup(target.x, target.y - 120);
      return;
    }

    // Successful hit impact
    audio.playHurt();
    target.health = Math.max(0, target.health - damage);
    target.isHurting = true;
    target.hurtTimer = forceType === "heavy" ? 22 : 14;
    
    // Set Knockback velocities
    target.vx = (forceType === "heavy" ? 11 : 6.5) * direction;
    if (forceType === "heavy") {
      target.vy = -6; // Project slightly upwards
      target.isGrounded = false;
    }

    // Set camera shake intensity
    cameraShakeRef.current = forceType === "heavy" ? 12 : 5;

    // Update attacker combo trackers
    const attacker = target.name === fightersRef.current[0].name ? fightersRef.current[1] : fightersRef.current[0];
    attacker.comboCount++;
    attacker.comboTimer = 90; // Frames to sustain combo meter

    // Burst visual particles
    spawnSparks(target.x - (10 * direction), target.y - 60, color, forceType === "heavy" ? 16 : 8, "hit");

    // Splash beautiful physical sparks representing the soul
    if (forceType === "heavy") {
      spawnSparks(target.x, target.y - 40, "rgba(255, 255, 255, 0.3)", 5, "dust");
    }
  }

  // Create block graphics text
  function createBlockPopup(x: number, y: number) {
    // Canvas handles it via draw loop but we can trigger sparks
    spawnSparks(x, y + 20, "rgba(251, 191, 36, 0.8)", 3, "spark");
  }

  // Process collision frames for attacks
  function processAttacks(attacker: FighterState, defender: FighterState, attackerIndex: number) {
    // Check if on active attack hit frames
    const frame = attacker.actionDuration - attacker.actionTimer;
    let attack: AttackHitbox | null = null;
    let hitColor = "#FFFFFF";

    if (attacker.action === FighterAction.LIGHT_ATTACK) {
      // Light attack hits on frames 4-7
      if (frame >= 4 && frame <= 7) {
        attack = {
          offsetX: 35,
          offsetY: -70,
          width: 75,
          height: 45,
          damage: 6,
          knockbackX: 4,
          knockbackY: 0,
          hitStun: 14,
        };
        hitColor = attacker.id === FighterId.RADAMA ? "#EF4444" : attacker.id === FighterId.VOLA ? "#10B981" : "#F59E0B";
      }
    } else if (attacker.action === FighterAction.HEAVY_ATTACK) {
      // Heavy attack hits on frames 8-12
      if (frame >= 8 && frame <= 12) {
        attack = {
          offsetX: 40,
          offsetY: -85,
          width: 95,
          height: 60,
          damage: 14,
          knockbackX: 10,
          knockbackY: 6,
          hitStun: 22,
        };
        hitColor = "#F59E0B";
      }
    } else if (attacker.action === FighterAction.SPECIAL_ATTACK) {
      // Special attack specific hitboxes
      if (attacker.id === FighterId.RADAMA && frame >= 6 && frame <= 15) {
        // Lightning spear thrust
        attack = {
          offsetX: 45,
          offsetY: -80,
          width: 110,
          height: 50,
          damage: 18,
          knockbackX: 11,
          knockbackY: 2,
          hitStun: 26,
        };
        hitColor = "#F59E0B";
      } else if (attacker.id === FighterId.MARO && frame >= 12 && frame <= 20) {
        // Ground slam earthquake
        attack = {
          offsetX: 10,
          offsetY: -40,
          width: 140,
          height: 60,
          damage: 22,
          knockbackX: 13,
          knockbackY: 8,
          hitStun: 30,
        };
        hitColor = "#EF4444";
      } else if (attacker.id === FighterId.VOLA && frame >= 4 && frame <= 14) {
        // Agile dual slash
        attack = {
          offsetX: 30,
          offsetY: -75,
          width: 85,
          height: 70,
          damage: 16,
          knockbackX: 8,
          knockbackY: 4,
          hitStun: 20,
        };
        hitColor = "#10B981";
      }
      // Kala's projectile is processed separately
    }

    if (attack && defender.action !== FighterAction.KO && !defender.isHurting) {
      // Hitbox dimensions
      const hx = attacker.direction === 1 
        ? attacker.x + attack.offsetX 
        : attacker.x - attack.offsetX - attack.width;
      const hy = attacker.y + attack.offsetY;

      // Defender Box dimensions
      const dx = defender.x - defender.width / 2;
      const dy = defender.y - defender.height;

      // Box overlap collision detection
      const intersectX = hx + attack.width > dx && hx < dx + defender.width;
      const intersectY = hy + attack.height > dy && hy < dy + defender.height;

      if (intersectX && intersectY) {
        applyImpact(defender, attack.damage, attacker.direction, attacker.action === FighterAction.LIGHT_ATTACK ? "light" : "heavy", hitColor);
        // Deactivate attacker hit check so it only hits once per action
        attacker.actionTimer = attacker.actionTimer - 3; // expedite recovery
      }
    }
  }

  // Update physics for ambient particles
  function updateParticles() {
    particlesRef.current = particlesRef.current.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life++;

      if (p.type === "leaf") {
        p.vx += Math.sin(p.life * 0.1) * 0.15; // Flutter leaf sway
        p.vy += 0.02; // slow fall
      }

      return p.life < p.maxLife;
    });
  }

  // Check victory / KO conditions
  function checkMatchThresholds() {
    if (roundEndedRef.current) return;

    const [p1, p2] = fightersRef.current;

    if (p1.health <= 0 && p2.health <= 0) {
      // Double KO
      roundEndedRef.current = true;
      setRoundActive(false);
      p1.action = FighterAction.KO;
      p2.action = FighterAction.KO;
      try {
        audio.playKO();
      } catch (e) {}
      triggerRoundOverScreen(-1, "ÉGALITÉ ! DOUBLE KO", p1Wins, p2Wins);
    } else if (p1.health <= 0) {
      // P2 Wins
      roundEndedRef.current = true;
      setRoundActive(false);
      p1.action = FighterAction.KO;
      try {
        audio.playKO();
      } catch (e) {}
      setP2Wins((w) => {
        const nextWins = w + 1;
        triggerRoundOverScreen(1, isVsCpu ? "L'ORDINATEUR REPREND LE DESSUS !" : "JOUEUR 2 REMPORTE LA MANCHE !", p1Wins, nextWins);
        return nextWins;
      });
    } else if (p2.health <= 0) {
      // P1 Wins
      roundEndedRef.current = true;
      setRoundActive(false);
      p2.action = FighterAction.KO;
      try {
        audio.playKO();
      } catch (e) {}
      setP1Wins((w) => {
        const nextWins = w + 1;
        triggerRoundOverScreen(0, "JOUEUR 1 REMPORTE LA MANCHE !", nextWins, p2Wins);
        return nextWins;
      });
    }
  }

  // Render the game round end sequence
  function triggerRoundOverScreen(winnerIdx: number, message: string, customP1Wins: number = p1Wins, customP2Wins: number = p2Wins) {
    setFightAnnounce("K.O.");
    setFightAnnounceSub(message);

    setCleanableTimeout(() => {
      if (customP1Wins >= 2) {
        setWinnerMessage("VICTOIRE SUPRÊME DU JOUEUR 1 ! 🏆");
        try {
          audio.playSpecial();
        } catch (e) {}
      } else if (customP2Wins >= 2) {
        setWinnerMessage(isVsCpu ? "L'ORDINATEUR EST SACRÉ CHAMPION ! 🤖" : "VICTOIRE SUPRÊME DU JOUEUR 2 ! 🏆");
        try {
          audio.playSpecial();
        } catch (e) {}
      } else {
        // Offer manual start for the next round so the player can play peacefully
        setPendingNextRound(round + 1);
      }
    }, 3000);
  }

  // Handle restarting entire game
  const handleRestartMatch = () => {
    setP1Wins(0);
    setP2Wins(0);
    setPendingNextRound(null);
    setIsPaused(false);
    startRound(1);
  };

  // Canvas drawing master loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 16.66; // Normalized frame step
      lastTime = time;

      // Update calculations only if the game is active (not paused or pending next round)
      if (!isPausedRef.current && !pendingNextRoundRef.current) {
        updateGame(dt);
      }

      // Render calculations
      draw(ctx);

      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [p1Id, p2Id, arenaId, isVsCpu, roundActive]);

  // Main Graphics Render Execution
  function draw(ctx: CanvasRenderingContext2D) {
    ctx.save();

    // Implement Camera Shake
    if (cameraShakeRef.current > 0) {
      const shakeX = (Math.random() * 2 - 1) * cameraShakeRef.current;
      const shakeY = (Math.random() * 2 - 1) * cameraShakeRef.current;
      ctx.translate(shakeX, shakeY);
    }

    // DRAW BACKGROUND
    if (bgImageRef.current) {
      ctx.drawImage(bgImageRef.current, 0, 0, GAME_WIDTH, GAME_HEIGHT);
    } else {
      // Fallback colorful backdrop
      ctx.fillStyle = "#0F172A";
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }

    // Draw ambient overlay color
    ctx.fillStyle = arena.ambientColor;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // DRAW GROUND FLOOR
    ctx.fillStyle = "rgba(15, 23, 42, 0.4)";
    ctx.fillRect(0, GROUND_Y, GAME_WIDTH, GAME_HEIGHT - GROUND_Y);
    ctx.fillStyle = "rgba(251, 191, 36, 0.15)";
    ctx.fillRect(0, GROUND_Y, GAME_WIDTH, 4);

    // DRAW PARTICLE SYSTEM
    drawParticles(ctx);

    // DRAW PROJECTILES
    drawProjectiles(ctx);

    // DRAW FIGHTERS
    const [p1, p2] = fightersRef.current;
    drawFighter(ctx, p1, 0);
    drawFighter(ctx, p2, 1);

    // DRAW HUD COMBO EFFECTS
    drawCombos(ctx);

    ctx.restore();
  }

  // Draw active fighter model vectors
  function drawFighter(ctx: CanvasRenderingContext2D, p: FighterState, index: number) {
    const isP1 = index === 0;
    const color = CHARACTERS.find(c => c.id === p.id)?.themeColor || "#EF4444";
    const secColor = CHARACTERS.find(c => c.id === p.id)?.secondaryColor || "#FFFFFF";
    const isKo = p.action === FighterAction.KO;

    ctx.save();
    ctx.translate(p.x, p.y);

    // 1. Draw grounding shadow ellipse
    const shadowOpacity = Math.max(0.1, 1 - Math.abs(p.y - GROUND_Y) / 150);
    ctx.fillStyle = `rgba(0, 0, 0, ${shadowOpacity * 0.45})`;
    ctx.beginPath();
    ctx.ellipse(0, 0, 36, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Scale flip model depending on facing direction
    ctx.scale(p.direction, 1);

    // If KO stance, rotate body flat on ground
    if (isKo) {
      ctx.rotate(-Math.PI / 2);
      ctx.translate(30, 40); // Shift offset to rest on ground
    }

    // 2. Body Crouching height multipliers
    const heightScale = p.isCrouching ? 0.65 : 1;
    const bodyBob = Math.sin(performance.now() * 0.007) * (p.action === FighterAction.IDLE ? 3 : 1);

    // 3. Draw Legs (Walking / Jumping motions)
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#1E293B";
    ctx.lineCap = "round";

    const legWalkOffset = p.action === FighterAction.WALK 
      ? Math.sin(performance.now() * 0.012) * 22 
      : 0;

    // Left leg
    ctx.beginPath();
    ctx.moveTo(-10, -25);
    ctx.lineTo(-18 + legWalkOffset, -3);
    ctx.stroke();

    // Right leg
    ctx.beginPath();
    ctx.moveTo(10, -25);
    ctx.lineTo(18 - legWalkOffset, -3);
    ctx.stroke();

    // 4. Draw Torso / Royal Lamba Cloth Weaves
    ctx.fillStyle = color;
    ctx.strokeStyle = "#0F172A";
    ctx.lineWidth = 4;
    
    ctx.beginPath();
    // Rounded triangular robe/body
    ctx.moveTo(-20, -75 * heightScale + bodyBob);
    ctx.lineTo(20, -75 * heightScale + bodyBob);
    ctx.lineTo(14, -25);
    ctx.lineTo(-14, -25);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw traditional decorative stripe (Malagasy traditional wrap patterns)
    ctx.fillStyle = secColor;
    ctx.beginPath();
    ctx.moveTo(-8, -75 * heightScale + bodyBob);
    ctx.lineTo(8, -75 * heightScale + bodyBob);
    ctx.lineTo(2, -25);
    ctx.lineTo(-2, -25);
    ctx.closePath();
    ctx.fill();

    // 5. Draw Head with beautiful traditional accents (feathers, hats)
    ctx.fillStyle = "#E2E8F0"; // Ash white skin/paint tone
    ctx.beginPath();
    const headY = -92 * heightScale + bodyBob;
    ctx.arc(0, headY, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Fighter Eyes / Glowing soul lights
    ctx.fillStyle = p.isHurting ? "#EF4444" : "#10B981";
    ctx.beginPath();
    ctx.arc(6, headY - 2, 3, 0, Math.PI * 2);
    ctx.arc(-2, headY - 2, 2, 0, Math.PI * 2); // profile depth
    ctx.fill();

    // Traditional malagasy straw hat (Papanango) / or Royal crown for Radama
    if (p.id === FighterId.RADAMA) {
      // Crown
      ctx.fillStyle = "#F59E0B";
      ctx.beginPath();
      ctx.moveTo(-15, headY - 14);
      ctx.lineTo(-12, headY - 24);
      ctx.lineTo(-4, headY - 16);
      ctx.lineTo(0, headY - 28);
      ctx.lineTo(4, headY - 16);
      ctx.lineTo(12, headY - 24);
      ctx.lineTo(15, headY - 14);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (p.id === FighterId.KALA) {
      // Mystical hair hood
      ctx.fillStyle = "#475569";
      ctx.beginPath();
      ctx.arc(0, headY, 21, Math.PI, Math.PI * 2);
      ctx.fill();
    } else if (p.id === FighterId.MARO) {
      // Coastal feather hairband
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.moveTo(-10, headY - 16);
      ctx.lineTo(-14, headY - 32);
      ctx.lineTo(-5, headY - 18);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // White forehead stripe
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(-8, headY - 5, 16, 4);
    } else if (p.id === FighterId.VOLA) {
      // Forest flower crown
      ctx.fillStyle = "#10B981";
      ctx.beginPath();
      ctx.arc(-8, headY - 15, 5, 0, Math.PI*2);
      ctx.arc(0, headY - 17, 6, 0, Math.PI*2);
      ctx.arc(8, headY - 15, 5, 0, Math.PI*2);
      ctx.fill();
    }

    // 6. Draw Arms & Weapons (Reacting to Attacks)
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#1E293B";
    
    const attackFrame = p.actionDuration - p.actionTimer;
    
    if (p.action === FighterAction.LIGHT_ATTACK || p.action === FighterAction.HEAVY_ATTACK) {
      // Punch / Weapon slash pose forward
      ctx.beginPath();
      ctx.moveTo(10, -55 * heightScale + bodyBob);
      ctx.lineTo(32, -60 * heightScale + bodyBob);
      ctx.stroke();

      // Weapon overlays
      if (p.id === FighterId.RADAMA) {
        // Red spear swing trail
        ctx.strokeStyle = "#EF4444";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(10, -55, 65, -0.3, 0.4);
        ctx.stroke();
      } else if (p.id === FighterId.VOLA) {
        // Emerald dagger slash trail
        ctx.strokeStyle = "#10B981";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(20, -60, 45, -0.5, 0.8);
        ctx.stroke();
      }
    } else if (p.action === FighterAction.SPECIAL_ATTACK) {
      // Special pose
      ctx.beginPath();
      ctx.moveTo(10, -55 * heightScale + bodyBob);
      ctx.lineTo(24, -85 * heightScale + bodyBob);
      ctx.stroke();

      // Draw custom visual weapon overlays
      if (p.id === FighterId.RADAMA) {
        // Spear Thrust
        ctx.strokeStyle = "#F59E0B";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(0, -55);
        ctx.lineTo(85, -55);
        ctx.stroke();
        // Golden tip
        ctx.fillStyle = "#F59E0B";
        ctx.beginPath();
        ctx.moveTo(85, -58);
        ctx.lineTo(98, -55);
        ctx.lineTo(85, -52);
        ctx.fill();
      } else if (p.id === FighterId.KALA) {
        // Glowing magic halo spell ring
        ctx.strokeStyle = "#8B5CF6";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(30, -85, 20 + Math.sin(performance.now() * 0.05) * 4, 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.id === FighterId.VOLA) {
        // Dual crossed green daggers
        ctx.strokeStyle = "#10B981";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(15, -75); ctx.lineTo(45, -95);
        ctx.moveTo(15, -90); ctx.lineTo(45, -70);
        ctx.stroke();
      }
    } else {
      // Idle arms swinging
      ctx.beginPath();
      ctx.moveTo(-10, -55 * heightScale + bodyBob);
      ctx.lineTo(-22, -35 * heightScale + bodyBob);
      ctx.stroke();

      // Forward arm holding weapon/fist
      ctx.beginPath();
      ctx.moveTo(10, -55 * heightScale + bodyBob);
      ctx.lineTo(22, -35 * heightScale + bodyBob);
      ctx.stroke();

      // Static weapon idle renders
      if (p.id === FighterId.RADAMA) {
        // spear on shoulder
        ctx.strokeStyle = "#94A3B8";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(18, -25);
        ctx.lineTo(-5, -110);
        ctx.stroke();
        // gold tip
        ctx.fillStyle = "#F59E0B";
        ctx.beginPath();
        ctx.moveTo(-5, -110);
        ctx.lineTo(-8, -122);
        ctx.lineTo(-1, -114);
        ctx.fill();
      } else if (p.id === FighterId.VOLA) {
        // Emerald daggers at waist
        ctx.strokeStyle = "#10B981";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(12, -40); ctx.lineTo(20, -22);
        ctx.moveTo(-12, -40); ctx.lineTo(-20, -22);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  // Draw active projectiles
  function drawProjectiles(ctx: CanvasRenderingContext2D) {
    const list = projectilesRef.current;
    list.forEach((proj) => {
      ctx.save();
      ctx.translate(proj.x, proj.y);

      // Spirit/magic glowing orb
      const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, 15);
      grad.addColorStop(0, "#FFFFFF");
      grad.addColorStop(0.3, proj.color);
      grad.addColorStop(1, "rgba(139, 92, 246, 0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();

      // Magic dust ring
      ctx.strokeStyle = proj.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    });
  }

  // Draw combat particles
  function drawParticles(ctx: CanvasRenderingContext2D) {
    particlesRef.current.forEach((p) => {
      ctx.save();
      
      const lifePct = p.life / p.maxLife;
      ctx.globalAlpha = 1 - lifePct;

      if (p.type === "lightning") {
        // draw zig zag bolts
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + (Math.random()*16-8), p.y + (Math.random()*16-8));
        ctx.stroke();
      } else if (p.type === "leaf") {
        // draw rotating leaves
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.life * 0.15);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Standard sparks/dust
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - lifePct), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });
  }

  // Draw active combo indicators
  function drawCombos(ctx: CanvasRenderingContext2D) {
    const [p1, p2] = fightersRef.current;

    // Player 1 Combo
    if (p1.comboCount > 1) {
      ctx.save();
      ctx.fillStyle = "#EF4444";
      ctx.font = "italic 900 24px sans-serif";
      ctx.fillText(`${p1.comboCount} COUPS !`, 120, 160);
      ctx.restore();
    }

    // Player 2 Combo
    if (p2.comboCount > 1) {
      ctx.save();
      ctx.fillStyle = "#3B82F6";
      ctx.font = "italic 900 24px sans-serif";
      ctx.fillText(`${p2.comboCount} COUPS !`, GAME_WIDTH - 240, 160);
      ctx.restore();
    }
  }

  return (
    <div id="combat-arena-container" ref={containerRef} className="flex flex-col items-center justify-center min-h-screen bg-transparent p-4 select-none relative z-10">
      {/* HUD HEADER BAR */}
      <div className="w-full max-w-5xl flex justify-between items-center bg-[#0d0e14]/95 border border-white/10 rounded-t-2xl p-4 shadow-2xl backdrop-blur-md">
        {/* PLAYER 1 STATS */}
        <div id="p1-hud" className="w-5/12">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-md font-black tracking-wider text-red-500 uppercase flex items-center gap-1.5 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]">
              👑 {fightersRef.current[0].name}
            </span>
            <div className="flex gap-1.5">
              {[...Array(2)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-3.5 h-3.5 rounded-full border border-red-500/80 shadow-sm transition duration-300 ${i < p1Wins ? "bg-red-500 shadow-red-500/50" : "bg-transparent"}`}
                />
              ))}
            </div>
          </div>
          <div className="h-6 bg-black/60 rounded-full border border-white/5 p-0.5 overflow-hidden relative shadow-inner">
            <div 
              id="p1-health-bar"
              className="bg-gradient-to-r from-red-600 to-orange-500 h-full rounded-full transition-all duration-150 shadow-[0_0_10px_rgba(239,68,68,0.3)]"
              style={{ width: `${fightersRef.current[0].health}%` }}
            />
            {/* Health text percentage overlay */}
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white tracking-widest uppercase">
              {fightersRef.current[0].health} / 100 HP
            </span>
          </div>
        </div>

        {/* CLOCK TIMER HUD */}
        <div id="match-timer-hud" className="flex flex-col items-center justify-center bg-[#0c0d12]/95 border-2 border-cyan-500/40 rounded-2xl w-16 h-16 shadow-lg z-10 mx-4 shadow-cyan-500/10">
          <span className="text-2xl font-black text-cyan-400 font-mono tracking-tight animate-neon-pulse">
            {roundTimer}
          </span>
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
            Manche {round}
          </span>
        </div>

        {/* PLAYER 2 STATS */}
        <div id="p2-hud" className="w-5/12">
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex gap-1.5">
              {[...Array(2)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-3.5 h-3.5 rounded-full border border-cyan-500/80 shadow-sm transition duration-300 ${i < p2Wins ? "bg-cyan-400 shadow-cyan-400/50" : "bg-transparent"}`}
                />
              ))}
            </div>
            <span className="text-md font-black tracking-wider text-cyan-400 uppercase flex items-center gap-1.5 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
              {fightersRef.current[1].name} {isVsCpu ? "🤖" : "👤"}
            </span>
          </div>
          <div className="h-6 bg-black/60 rounded-full border border-white/5 p-0.5 overflow-hidden relative shadow-inner">
            <div 
              id="p2-health-bar"
              className="bg-gradient-to-l from-cyan-600 to-cyan-400 h-full rounded-full transition-all duration-150 ml-auto shadow-[0_0_10px_rgba(34,211,238,0.3)]"
              style={{ width: `${fightersRef.current[1].health}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white tracking-widest uppercase">
              {fightersRef.current[1].health} / 100 HP
            </span>
          </div>
        </div>
      </div>

      {/* CORE FIGHT CANVAS SCREEN */}
      <div className="relative w-full max-w-5xl aspect-video rounded-b-2xl border-x border-b border-white/10 overflow-hidden shadow-2xl bg-[#0d0e14]/90 backdrop-blur-[2px]">
        <canvas 
          id="fight-canvas"
          ref={canvasRef} 
          width={GAME_WIDTH} 
          height={GAME_HEIGHT} 
          className="w-full h-full object-cover block"
        />

        {/* ACTIVE ROUND ANNOUNCEMENTS POPUPS */}
        {fightAnnounce && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 backdrop-blur-[1px] animate-fade-in z-20">
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-orange-400 tracking-wider text-center drop-shadow-[0_0_15px_rgba(34,211,238,0.4)] font-sans">
              {fightAnnounce}
            </h1>
            <p className="text-lg md:text-xl font-bold text-slate-200 mt-3 font-sans">
              {fightAnnounceSub}
            </p>
          </div>
        )}

        {/* SUPREME GAME OVER MODAL SCREEN */}
        {winnerMessage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0c0d12]/95 backdrop-blur-md z-30 animate-fade-in p-6 text-center">
            <div className="max-w-md bg-[#0d0e14]/95 border border-cyan-500/30 rounded-3xl p-8 shadow-2xl relative shadow-cyan-950/20">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-tr from-cyan-400 via-cyan-500 to-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.4)] border-4 border-[#0c0d12]">
                <Swords className="w-12 h-12 text-white animate-pulse" />
              </div>

              <h2 className="text-3xl font-black text-cyan-400 mt-6 tracking-widest uppercase animate-neon-pulse">
                COMBAT ACHEVÉ !
              </h2>
              <p className="text-xl font-black text-white mt-4 font-sans">
                {winnerMessage}
              </p>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <button
                  id="rematch-btn"
                  onClick={handleRestartMatch}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-sm transition shadow-lg cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider"
                >
                  <RefreshCw className="w-4 h-4" /> REVANCHE
                </button>
                <button
                  id="exit-game-btn"
                  onClick={onExit}
                  className="py-3 px-4 rounded-xl bg-[#121420] hover:bg-[#1a1c2c] text-slate-300 font-extrabold text-sm transition border border-slate-800 cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider"
                >
                  <Home className="w-4 h-4" /> QUITTER
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PENDING NEXT ROUND MANUAL CONFIRMATION */}
        {pendingNextRound !== null && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 backdrop-blur-md z-25 animate-fade-in p-6 text-center">
            <div className="max-w-md w-full bg-[#0d0e14]/95 border border-cyan-500/30 rounded-3xl p-8 shadow-2xl relative shadow-cyan-950/20">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-tr from-cyan-400 via-cyan-500 to-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.4)] border-4 border-[#0c0d12]">
                <Swords className="w-12 h-12 text-white animate-pulse" />
              </div>

              <h2 className="text-3xl font-black text-cyan-400 mt-6 tracking-widest uppercase animate-neon-pulse">
                MANCHE TERMINÉE !
              </h2>
              <p className="text-xl font-black text-white mt-4 font-sans">
                Préparez-vous pour la manche {pendingNextRound} !
              </p>
              <p className="text-slate-400 text-xs mt-2 mb-8 leading-relaxed">
                Prenez un instant de répit. Le jeu ne démarrera pas automatiquement pour que vous puissiez jouer tranquille.
              </p>

              <button
                id="start-next-round-btn"
                onClick={() => {
                  startRound(pendingNextRound);
                  setPendingNextRound(null);
                }}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-md transition shadow-lg cursor-pointer flex items-center justify-center gap-2 uppercase tracking-widest"
              >
                <Play className="w-4 h-4" /> Commencer la manche {pendingNextRound}
              </button>
            </div>
          </div>
        )}

        {/* IS PAUSED OVERLAY */}
        {isPaused && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-30 animate-fade-in p-6 text-center">
            <div className="max-w-md w-full bg-[#0d0e14]/95 border border-cyan-500/30 rounded-3xl p-8 shadow-2xl relative shadow-cyan-950/20">
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-500 tracking-wider uppercase animate-neon-pulse mb-6">
                JEU EN PAUSE
              </h2>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Le combat est suspendu. Reprenez des forces avant de retourner dans l'arène de Moraingy !
              </p>

              <div className="flex flex-col gap-3">
                <button
                  id="resume-btn"
                  onClick={() => setIsPaused(false)}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-md transition shadow-lg cursor-pointer flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                  <Play className="w-4 h-4" /> Reprendre le combat
                </button>
                <button
                  id="restart-pause-btn"
                  onClick={() => {
                    setIsPaused(false);
                    handleRestartMatch();
                  }}
                  className="w-full py-3 px-6 rounded-xl bg-[#121420] hover:bg-[#1a1c2c] text-slate-200 font-bold text-sm transition border border-slate-800 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                  <RefreshCw className="w-4 h-4 text-orange-400" /> Recommencer le match
                </button>
                <button
                  id="exit-pause-btn"
                  onClick={onExit}
                  className="w-full py-3 px-6 rounded-xl bg-[#121420] hover:bg-[#1a1c2c] text-slate-400 hover:text-red-400 hover:border-red-500/40 font-bold text-sm transition border border-slate-800 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                  <Home className="w-4 h-4" /> Quitter l'arène
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QUICK GAME CONTROL FOOTER PANEL */}
      <div className="w-full max-w-5xl grid md:grid-cols-3 gap-4 mt-6 items-center bg-[#0d0e14]/85 backdrop-blur-md border border-white/5 p-4 rounded-2xl shadow-xl">
        {/* Sound toggler */}
        <div className="flex gap-4 justify-center md:justify-start">
          <button
            id="toggle-sound-btn"
            onClick={() => setSoundOn(!soundOn)}
            className="p-3 rounded-xl bg-[#121420]/80 hover:bg-[#1a1c2c] border border-slate-800/80 text-slate-300 transition cursor-pointer flex items-center gap-2 text-xs font-semibold"
            title="Activer/Désactiver le son"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-red-400" />}
            {soundOn ? "Effets : Activés" : "Effets : Muets"}
          </button>
          
          <button
            id="pause-match-btn"
            onClick={() => setIsPaused((prev) => !prev)}
            className="p-3 rounded-xl bg-[#121420]/80 hover:bg-[#1a1c2c] border border-slate-800/80 text-slate-300 transition cursor-pointer flex items-center gap-2 text-xs font-semibold"
            title="Mettre en pause (Echap)"
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-cyan-400" />}
            {isPaused ? "Reprendre" : "Pause"}
          </button>

          <button
            id="restart-match-btn"
            onClick={handleRestartMatch}
            className="p-3 rounded-xl bg-[#121420]/80 hover:bg-[#1a1c2c] border border-slate-800/80 text-slate-300 transition cursor-pointer flex items-center gap-2 text-xs font-semibold"
            title="Redémarrer le combat"
          >
            <RotateCcw className="w-4 h-4 text-orange-400 animate-spin-slow" />
            Recommencer
          </button>
        </div>

        {/* CPU Intelligence difficulty select panel */}
        {isVsCpu ? (
          <div className="flex items-center justify-center gap-2.5 bg-indigo-950/20 border border-indigo-900/30 px-3.5 py-1.5 rounded-xl">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
              <Cpu className="w-4 h-4" /> Difficulté IA :
            </span>
            <div className="flex gap-1.5">
              {(["facile", "moyen", "legende"] as const).map((dif) => (
                <button
                  id={`cpu-difficulty-${dif}`}
                  key={dif}
                  onClick={() => setCpuDifficulty(dif)}
                  className={`px-2 py-1 rounded text-[10px] font-extrabold uppercase transition cursor-pointer ${
                    cpuDifficulty === dif 
                      ? "bg-cyan-500 text-slate-950" 
                      : "bg-[#121420] text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  {dif === "facile" ? "Facile" : dif === "moyen" ? "Moyen" : "Légende"}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-xs text-slate-400 font-extrabold uppercase tracking-widest animate-neon-pulse">
            ⚔️ Multijoueur Local 1v1 Actif
          </div>
        )}

        {/* Controls Reminder Overlay Button */}
        <div className="text-center md:text-right">
          <button
            id="back-home-footer-btn"
            onClick={onExit}
            className="px-4 py-2 bg-[#121420]/80 hover:bg-[#1a1c2c] text-slate-300 font-bold rounded-lg border border-slate-800/80 text-xs transition cursor-pointer"
          >
            ← Retour aux choix de héros
          </button>
        </div>
      </div>
    </div>
  );
}
