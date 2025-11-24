
import { Obstacle, ObstacleType } from "./types";

// Physics Base Values (Brick Fall Style - Fast & Heavy)
export const GRAVITY = 1.6;
export const JUMP_FORCE = -19.0;
export const BASE_SPEED = 10.5;
export const TERMINAL_VELOCITY = 25;

// Speed Progression
export const SPEED_STEP_INCREASE = 1.5; // How much speed to add
export const SCORE_THRESHOLD_FOR_SPEED = 3500; // Every 3500 points
export const MAX_SPEED = 35; 

// Infinite Mode (Fallback constants if needed)
export const CHUNK_SIZE = 15;

// Dimensions
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 450;
export const PLAYER_SIZE = 30;
export const COIN_SIZE = 20;
export const RING_SIZE = 80;
export const BLADE_SIZE = 50;
export const FLOOR_HEIGHT = 100;

// Colors
export const COLORS = {
  PLAYER: '#00f3ff', // Cyan Neon
  SPIKE: '#ff003c',  // Cyber Red
  BLOCK: '#7df9ff',  // Electric Blue/Purple block
  COIN: '#ffd700',   // Gold
  FIRE_RING: '#ff5500', // Bright Orange
  SPINNING_BLADE: '#ff0099', // Neon Magenta/Red for blades
  MOVING_SPIKE: '#ff3333', // Bright red for moving traps
  MOVING_PLATFORM: '#00ff99', // Neon Green/Teal
  ROCKET_PICKUP: '#39ff14', // Neon Green
  FLOOR: '#0b0f19',  // Darker Slate
  BACKGROUND: '#050510', // Deep Space Blue/Black
  
  // City Layers
  LAYER_FAR: '#0f0518', // Deep Purple Black
  LAYER_MID: '#1a103c', // Dark Violet
  LAYER_NEAR: '#2d1b4e', // Lighter Violet
  
  NEON_PINK: '#ff00ff',
  NEON_CYAN: '#00f3ff',
  NEON_PURPLE: '#bf00ff',
  NEON_BLUE: '#4d4dff',
};

// Procedural Generation Helper
export const generateProceduralChunk = (startX: number, count: number): Obstacle[] => {
  const obstacles: Obstacle[] = [];
  let currentX = startX;
  const densityMultiplier = 0.9; // Standard density

  for (let i = 0; i < count; i++) {
    const r = Math.random();
    const baseGap = 350 * densityMultiplier; 
    const varGap = (Math.random() * 200) * densityMultiplier;
    
    currentX += baseGap + varGap; 

    // Special logic for Spinning Blades (Air obstacles)
    if (r > 0.85) {
       // SPINNING BLADE
       const elevation = Math.random() > 0.5 ? 40 : 100; 
       obstacles.push({ 
           x: currentX, 
           y: elevation, 
           initialY: elevation,
           width: BLADE_SIZE, 
           height: BLADE_SIZE, 
           type: ObstacleType.SPINNING_BLADE 
       });
       if (Math.random() > 0.5) {
           obstacles.push({ x: currentX + 10, y: elevation + 60, width: 20, height: 20, type: ObstacleType.COIN });
       }
    }
    else if (r > 0.78 && r <= 0.85) {
       // RING OF FIRE
       obstacles.push({ x: currentX, y: 50, width: 30, height: 15, type: ObstacleType.ROCKET_PICKUP });
       const ringX = currentX + 350;
       obstacles.push({ x: ringX, y: 70, width: RING_SIZE, height: RING_SIZE, type: ObstacleType.FIRE_RING });
       currentX = ringX + 100; 
    }
    else if (r < 0.25) {
      // Single Spike
      obstacles.push({ x: currentX, y: 0, width: 30, height: 30, type: ObstacleType.SPIKE });
    } else if (r < 0.4) {
      // Double Spike
      obstacles.push({ x: currentX, y: 0, width: 30, height: 30, type: ObstacleType.SPIKE });
      obstacles.push({ x: currentX + 35, y: 0, width: 30, height: 30, type: ObstacleType.SPIKE });
    } else if (r < 0.5) {
      // MOVING SPIKE
      obstacles.push({ 
          x: currentX, 
          y: 0, 
          initialY: 0, 
          width: 30, 
          height: 35, 
          type: ObstacleType.MOVING_SPIKE 
      });
    } else if (r < 0.65) {
      // Block Jump
      obstacles.push({ x: currentX, y: 0, width: 40, height: 40, type: ObstacleType.BLOCK });
      if (Math.random() > 0.5) {
        obstacles.push({ x: currentX + 250, y: 0, width: 30, height: 30, type: ObstacleType.SPIKE });
      }
    } else if (r <= 0.78) {
      // Triple Spike
      obstacles.push({ x: currentX, y: 0, width: 30, height: 30, type: ObstacleType.SPIKE });
      obstacles.push({ x: currentX + 30, y: 0, width: 30, height: 30, type: ObstacleType.SPIKE });
      obstacles.push({ x: currentX + 60, y: 0, width: 30, height: 30, type: ObstacleType.SPIKE });
      obstacles.push({ x: currentX + 30, y: 100, width: 20, height: 20, type: ObstacleType.COIN });
    } else {
      // Coin Path
      obstacles.push({ x: currentX, y: 50, width: 20, height: 20, type: ObstacleType.COIN });
      obstacles.push({ x: currentX + 100, y: 80, width: 20, height: 20, type: ObstacleType.COIN });
    }
  }
  return obstacles;
};

// Initial Level
export const DEFAULT_LEVEL_OBSTACLES = [
  // INTRO
  { x: 500, y: 0, width: 30, height: 30, type: 'SPIKE' },
  { x: 800, y: 0, width: 30, height: 30, type: 'SPIKE' },
  { x: 1100, y: 0, width: 40, height: 40, type: 'BLOCK' },
  { x: 1400, y: 50, width: 20, height: 20, type: 'COIN' },
  { x: 1500, y: 0, initialY: 0, width: 30, height: 35, type: 'MOVING_SPIKE' }, 
  
  // RHYTHM SECTION
  { x: 2000, y: 0, width: 30, height: 30, type: 'SPIKE' },
  { x: 2300, y: 0, width: 30, height: 30, type: 'SPIKE' },
  { x: 2600, y: 0, width: 40, height: 40, type: 'BLOCK' },
  { x: 2900, y: 0, width: 30, height: 30, type: 'SPIKE' },
  { x: 3200, y: 0, width: 40, height: 40, type: 'BLOCK' },
  { x: 3350, y: 80, width: 20, height: 20, type: 'COIN' },
  
  // RING INTRO
  { x: 3250, y: 50, width: 30, height: 15, type: 'ROCKET_PICKUP' }, 
  { x: 3500, y: 60, width: 80, height: 80, type: 'FIRE_RING' },

  // STAIRS
  { x: 3600, y: 0, width: 40, height: 40, type: 'BLOCK' },
  { x: 3850, y: 40, width: 40, height: 40, type: 'BLOCK' },
  { x: 4100, y: 80, width: 40, height: 40, type: 'BLOCK' },
  { x: 4300, y: 0, width: 30, height: 30, type: 'SPIKE' },
  
  // DROP
  { x: 4600, y: 0, width: 30, height: 30, type: 'SPIKE' },
  { x: 4635, y: 0, width: 30, height: 30, type: 'SPIKE' },
  { x: 4670, y: 0, width: 30, height: 30, type: 'SPIKE' }, // Triple
  
  { x: 5000, y: 0, width: 40, height: 40, type: 'BLOCK' },
  { x: 5300, y: 0, initialY: 0, width: 30, height: 35, type: 'MOVING_SPIKE' },
  { x: 5500, y: 40, width: 40, height: 40, type: 'BLOCK' },
  { x: 5700, y: 40, width: 40, height: 40, type: 'BLOCK' },
  { x: 5900, y: 80, width: 20, height: 20, type: 'COIN' },
  
  // SPINNING BLADE INTRO
  { x: 6200, y: 50, initialY: 50, width: BLADE_SIZE, height: BLADE_SIZE, type: 'SPINNING_BLADE' },
  
  // RING CHALLENGE
  { x: 6400, y: 50, width: 30, height: 15, type: 'ROCKET_PICKUP' }, 
  { x: 6700, y: 70, width: 80, height: 80, type: 'FIRE_RING' },
  { x: 6780, y: 50, width: 30, height: 15, type: 'ROCKET_PICKUP' }, 
  { x: 7050, y: 70, width: 80, height: 80, type: 'FIRE_RING' }, 

  // ENDURANCE
  { x: 7300, y: 0, width: 30, height: 30, type: 'SPIKE' },
  { x: 7600, y: 0, width: 40, height: 40, type: 'BLOCK' },
  { x: 7900, y: 0, width: 30, height: 30, type: 'SPIKE' },
  { x: 8000, y: 0, width: 30, height: 30, type: 'SPIKE' },
  { x: 8300, y: 0, width: 40, height: 40, type: 'BLOCK' },
  
  // CLIMAX
  { x: 8600, y: 0, width: 30, height: 30, type: 'SPIKE' },
  { x: 8635, y: 0, width: 30, height: 30, type: 'SPIKE' },
  { x: 8670, y: 0, width: 30, height: 30, type: 'SPIKE' },
  
  { x: 9000, y: 40, width: 40, height: 40, type: 'BLOCK' },
  { x: 9300, y: 80, width: 40, height: 40, type: 'BLOCK' },
  { x: 9600, y: 40, width: 40, height: 40, type: 'BLOCK' },
  { x: 9900, y: 0, width: 40, height: 40, type: 'BLOCK' },

  // MOVING PLATFORMS SECTOR
  { x: 10200, y: 40, initialY: 40, width: 60, height: 20, type: 'MOVING_PLATFORM' },
  { x: 10450, y: 80, initialY: 80, width: 60, height: 20, type: 'MOVING_PLATFORM' },
  { x: 10700, y: 40, initialY: 40, width: 60, height: 20, type: 'MOVING_PLATFORM' },
  { x: 10850, y: 150, width: 20, height: 20, type: 'COIN' },
  
  { x: 11000, y: 0, width: 30, height: 30, type: 'SPIKE' },
  { x: 11035, y: 0, width: 30, height: 30, type: 'SPIKE' },

  // RING GAUNTLET
  { x: 11300, y: 50, width: 30, height: 15, type: 'ROCKET_PICKUP' },
  { x: 11500, y: 60, width: 80, height: 80, type: 'FIRE_RING' },
  { x: 11800, y: 100, width: 80, height: 80, type: 'FIRE_RING' },
  { x: 12100, y: 40, width: 80, height: 80, type: 'FIRE_RING' },
  { x: 12400, y: 80, width: 80, height: 80, type: 'FIRE_RING' },

  // FINAL STRETCH
  { x: 12800, y: 0, width: 30, height: 30, type: 'SPIKE' },
  { x: 13000, y: 50, width: 40, height: 40, type: 'BLOCK' },
  { x: 13200, y: 100, initialY: 100, width: 60, height: 20, type: 'MOVING_PLATFORM' },
  { x: 13500, y: 0, width: 30, height: 30, type: 'SPIKE' },
  { x: 13535, y: 0, width: 30, height: 30, type: 'SPIKE' },

] as Obstacle[];
