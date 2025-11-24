
import React, { useState, useEffect } from 'react';
import GameCanvas from './components/GameCanvas';
import MainMenu from './components/MainMenu';
import { GameState, Obstacle, GameMode, LeaderboardEntry } from './types';
import { DEFAULT_LEVEL_OBSTACLES, BASE_SPEED } from './constants';
import { initAudio, startMusic, stopMusic, setCustomTrack, playGameOverAlarm, stopGameOverAlarm } from './services/audioService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [gameMode, setGameMode] = useState<GameMode>('NORMAL');
  const [levelObstacles, setLevelObstacles] = useState<Obstacle[]>(DEFAULT_LEVEL_OBSTACLES);
  const [score, setScore] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState(BASE_SPEED);
  
  // Custom Media State
  const [songName, setSongName] = useState<string | undefined>(undefined);
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>(undefined);
  const [avatarBase64, setAvatarBase64] = useState<string | undefined>(undefined); // For storage

  // Persistence State
  const [highScore, setHighScore] = useState(0);
  const [playerName, setPlayerName] = useState('Player 1');
  const [dedicationText, setDedicationText] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Load Record from LocalStorage
  useEffect(() => {
    // Personal Record
    const savedData = localStorage.getItem('neonDashRecord');
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            if (parsed.score) setHighScore(parsed.score);
            if (parsed.name) setPlayerName(parsed.name);
            if (parsed.dedication) setDedicationText(parsed.dedication);
            // If they had a previous session avatar saved (optional enhancement), we could load it here
        } catch (e) {
            console.error("Failed to parse high score");
        }
    }

    // Universal Leaderboard
    const savedLeaderboard = localStorage.getItem('neonDashLeaderboard');
    if (savedLeaderboard) {
        try {
            const parsed = JSON.parse(savedLeaderboard);
            if (Array.isArray(parsed)) {
                setLeaderboard(parsed);
            }
        } catch (e) {
            console.error("Failed to parse leaderboard");
        }
    }
  }, []);

  // Save Record on Game Over
  useEffect(() => {
    // Manage background music and alarms based on game state
    if (gameState === GameState.PLAYING) {
       stopGameOverAlarm(); // Ensure alarm is off
       startMusic();
    } else if (gameState === GameState.GAME_OVER) {
       stopMusic(); // Cut the music immediately
       playGameOverAlarm(); // Start the emergency siren
       
       // 1. Update Personal High Score
       if (score > highScore) {
           setHighScore(score);
       }
       
       // 2. Update Universal Leaderboard
       if (score > 0) {
           const newEntry: LeaderboardEntry = {
               name: playerName || 'Anonymous',
               score: score,
               avatarBase64: avatarBase64,
               timestamp: Date.now()
           };

           setLeaderboard(prev => {
               const updated = [...prev, newEntry];
               // Sort descending by score
               updated.sort((a, b) => b.score - a.score);
               // Keep top 20
               const sliced = updated.slice(0, 20);
               localStorage.setItem('neonDashLeaderboard', JSON.stringify(sliced));
               return sliced;
           });
       }

       // Save Personal Settings always
       localStorage.setItem('neonDashRecord', JSON.stringify({
           name: playerName,
           score: Math.max(score, highScore),
           dedication: dedicationText
       }));
       
    } else if (gameState === GameState.MENU) {
       stopMusic();
       stopGameOverAlarm();
    }
  }, [gameState, score, highScore, playerName, dedicationText, avatarBase64]);

  const handleStart = () => {
    initAudio(); // Initialize audio context on user interaction
    setGameMode('NORMAL');
    setLevelObstacles([...DEFAULT_LEVEL_OBSTACLES]);
    setSpeedMultiplier(BASE_SPEED);
    setGameState(GameState.PLAYING);
    setScore(0);
  };

  const handleRestart = () => {
    stopGameOverAlarm(); // Stop alarm immediately on retry
    setGameState(GameState.MENU);
  };

  const handleUploadMusic = (file: File) => {
      if (file) {
          const url = URL.createObjectURL(file);
          setCustomTrack(url);
          setSongName(file.name);
          initAudio(); // Ensure context is ready
      }
  };

  // Helper to convert file to Base64 for storage
  const convertToBase64 = (file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
          setAvatarBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
  };

  const handleUploadAvatar = (file: File) => {
      if (file) {
          // 1. Create URL for immediate display in GameCanvas (efficient)
          const url = URL.createObjectURL(file);
          setAvatarSrc(url);
          
          // 2. Convert to Base64 for Leaderboard persistence
          convertToBase64(file);
      }
  }

  return (
    <div className="relative w-full h-screen bg-slate-900 flex items-center justify-center overflow-hidden">
      {/* HUD: Score */}
      <div className="absolute top-4 left-4 z-20 text-white font-mono text-xl drop-shadow-md select-none pointer-events-none">
        SCORE: <span className="text-neon-green">{score.toString().padStart(6, '0')}</span>
      </div>

      {/* Main Game Canvas */}
      <GameCanvas 
        gameState={gameState}
        gameMode={gameMode}
        setGameState={setGameState}
        levelObstacles={levelObstacles}
        onScoreUpdate={setScore}
        speedMultiplier={speedMultiplier}
        avatarImageSrc={avatarSrc}
      />

      {/* Main Menu Overlay */}
      {gameState === GameState.MENU && (
        <MainMenu 
          onStart={handleStart} 
          onUploadMusic={handleUploadMusic}
          currentSongName={songName}
          onUploadAvatar={handleUploadAvatar}
          hasAvatar={!!avatarSrc}
          avatarSrc={avatarSrc}
          highScore={highScore}
          playerName={playerName}
          setPlayerName={setPlayerName}
          dedicationText={dedicationText}
          setDedicationText={setDedicationText}
          leaderboard={leaderboard}
        />
      )}

      {/* Game Over Screen */}
      {gameState === GameState.GAME_OVER && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 z-30">
          <h1 className="text-8xl font-black text-neon-red animate-pulse-fast drop-shadow-[0_0_30px_rgba(255,0,0,0.8)] tracking-tighter select-none">
            GAME OVER
          </h1>
          <div className="mt-8 text-2xl text-white font-mono select-none flex flex-col items-center gap-2">
             <div>FINAL SCORE: <span className="text-neon-green">{score}</span></div>
             {score >= highScore && score > 0 && (
                 <div className="text-neon-pink animate-bounce font-bold">NEW RECORD!</div>
             )}
          </div>
          <button 
            onClick={handleRestart}
            className="mt-12 px-8 py-3 bg-white text-black font-bold text-xl hover:bg-neon-red hover:text-white transition-colors uppercase tracking-widest rounded-sm shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
