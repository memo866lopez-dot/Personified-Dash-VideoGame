
export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  GENERATING_LEVEL = 'GENERATING_LEVEL',
}

export type GameMode = 'NORMAL' | 'INFINITE';

export type PlayerMode = 'CUBE' | 'ROCKET';

export enum ObstacleType {
  SPIKE = 'SPIKE',
  BLOCK = 'BLOCK',
  FLOOR_GAP = 'FLOOR_GAP',
  COIN = 'COIN',
  FIRE_RING = 'FIRE_RING',
  ROCKET_PICKUP = 'ROCKET_PICKUP',
  SPINNING_BLADE = 'SPINNING_BLADE',
  MOVING_SPIKE = 'MOVING_SPIKE',
  MOVING_PLATFORM = 'MOVING_PLATFORM'
}

export interface Obstacle {
  x: number;
  y: number;
  initialY?: number; // Base position for oscillating obstacles
  width: number;
  height: number;
  type: ObstacleType;
  passed?: boolean;    // To track if player passed this obstacle for score
  collected?: boolean; // To track if coin was collected
}

export interface LevelData {
  name: string;
  obstacles: Obstacle[];
  speed: number;
  backgroundColor: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
  gravity?: number;
}

export interface Shard {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  vr: number; // angular velocity
  color: string;
  size: number;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  avatarBase64?: string; // Stored as string for persistence
  timestamp: number;
}
