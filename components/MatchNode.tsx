import React from 'react';
import { Match, Player } from '../types';
import { Crown, Skull, Swords } from 'lucide-react';

interface MatchNodeProps {
  match: Match;
  onClick: (match: Match) => void;
  className?: string;
}

export const MatchNode: React.FC<MatchNodeProps> = ({ match, onClick, className = '' }) => {
  const isP1Winner = match.winner?.id === match.player1?.id;
  const isP2Winner = match.winner?.id === match.player2?.id;

  // Check if match is ready to be played (both players exist, no winner yet)
  const isReady = !!match.player1 && !!match.player2 && !match.winner;
  const isFinished = !!match.winner;

  const handleNodeClick = () => {
    if (isReady) {
      onClick(match);
    }
  };

  const PlayerSlot = ({ 
    player, 
    isWinner, 
    isLoser,
    isTop 
  }: { 
    player: Player | null, 
    isWinner: boolean, 
    isLoser: boolean,
    isTop: boolean 
  }) => {
    // If waiting for opponent
    if (!player) {
      return (
        <div className={`h-12 flex items-center px-4 bg-gray-900/40 text-gray-600 text-xs font-mono border-l-2 border-gray-800 ${isTop ? 'border-b border-gray-800' : ''}`}>
          <span className="animate-pulse">Đang chờ đối thủ...</span>
        </div>
      );
    }

    const isBye = player.isBye;
    
    return (
      <div 
        className={`
          h-12 flex items-center justify-between px-4 relative transition-all duration-300
          ${isTop ? 'border-b border-gray-800' : ''}
          ${isWinner ? 'bg-gradient-to-r from-blood-900/90 to-blood-800/40 text-white shadow-[inset_0_0_20px_rgba(220,38,38,0.3)]' : ''}
          ${isLoser ? 'bg-black/60 text-gray-600 decoration-line-through grayscale' : 'bg-gray-800/50 text-gray-200'}
          ${isBye ? 'text-gray-500 italic' : ''}
        `}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {isWinner && <Crown className="w-4 h-4 text-yellow-500 shrink-0" />}
          <span className={`font-mono font-bold truncate max-w-[140px] ${isWinner ? 'text-lg' : 'text-sm'}`}>
            {player.name}
          </span>
        </div>
        
        {isLoser && <Skull className="w-4 h-4 text-gray-700" />}
      </div>
    );
  };

  return (
    <div 
      onClick={handleNodeClick}
      className={`
        w-64 border rounded-lg overflow-hidden select-none transition-all duration-300 relative group
        ${isReady ? 'cursor-pointer border-blood-600/50 hover:border-blood-500 hover:shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:scale-105 bg-gray-900' : 'border-gray-800 bg-gray-900/80'}
        ${isFinished ? 'opacity-80 hover:opacity-100' : ''}
        ${className}
      `}
    >
      {/* Ready Indicator */}
      {isReady && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
           <div className="bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blood-500 flex items-center gap-2">
             <Swords className="w-4 h-4 text-blood-500" />
             <span className="text-xs font-bold text-blood-500 uppercase tracking-widest">Bắt đầu</span>
           </div>
        </div>
      )}

      <div className="flex flex-col">
        <PlayerSlot 
          player={match.player1} 
          isWinner={isP1Winner} 
          isLoser={!!match.winner && !isP1Winner}
          isTop={true}
        />
        <PlayerSlot 
          player={match.player2} 
          isWinner={isP2Winner} 
          isLoser={!!match.winner && !isP2Winner}
          isTop={false}
        />
      </div>
    </div>
  );
};