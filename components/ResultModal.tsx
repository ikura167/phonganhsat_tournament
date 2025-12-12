import React from 'react';
import { Match, Player } from '../types';
import { X, Sword } from 'lucide-react';

interface ResultModalProps {
  match: Match;
  onConfirm: (winner: Player) => void;
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ match, onConfirm, onClose }) => {
  if (!match.player1 || !match.player2) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fade-in p-4">
      <div className="max-w-4xl w-full bg-gray-900 border border-blood-600 rounded-2xl overflow-hidden relative shadow-[0_0_50px_rgba(220,38,38,0.3)] flex flex-col">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-20 hover:rotate-90 duration-300"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Header */}
        <div className="text-center py-6 bg-gradient-to-b from-blood-900/40 to-transparent border-b border-white/5">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sword className="w-6 h-6 text-blood-500" />
            <h2 className="text-2xl font-display font-bold text-white uppercase tracking-[0.2em]">
              Khu Vực Giao Chiến
            </h2>
            <Sword className="w-6 h-6 text-blood-500 flip-x" style={{ transform: 'scaleX(-1)' }} />
          </div>
          <p className="text-gray-400 font-mono text-sm">Ai là kẻ sống sót?</p>
        </div>

        {/* Body */}
        <div className="flex flex-col md:flex-row h-[400px] relative">
          
          {/* Player 1 Section */}
          <button 
            onClick={() => onConfirm(match.player1!)}
            className="flex-1 relative group cursor-pointer border-b md:border-b-0 md:border-r border-gray-800 hover:bg-blood-900/20 transition-all duration-500 flex flex-col items-center justify-center p-8 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blood-900/0 via-transparent to-transparent group-hover:from-blood-600/20 transition-all duration-500"></div>
            
            {/* Hover Indicator */}
            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-blood-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300 flex flex-col items-center">
              <span className="text-6xl mb-4 opacity-20 font-display font-black text-white group-hover:text-blood-500 group-hover:opacity-40 transition-all">01</span>
              <h3 className="text-3xl md:text-5xl font-display font-black text-white text-center drop-shadow-2xl break-all">
                {match.player1.name}
              </h3>
            </div>
            
            <span className="mt-8 px-6 py-2 border border-gray-600 text-gray-400 text-xs font-mono uppercase tracking-widest rounded group-hover:bg-blood-600 group-hover:border-blood-500 group-hover:text-white transition-all z-10">
              Xác nhận thắng
            </span>
          </button>

          {/* VS Badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
            <div className="w-20 h-20 bg-black border-4 border-blood-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.6)] animate-pulse">
              <span className="font-display font-black text-white text-2xl italic pr-1">VS</span>
            </div>
          </div>

          {/* Player 2 Section */}
          <button 
            onClick={() => onConfirm(match.player2!)}
            className="flex-1 relative group cursor-pointer border-t md:border-t-0 md:border-l border-gray-800 hover:bg-blood-900/20 transition-all duration-500 flex flex-col items-center justify-center p-8 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blood-900/0 via-transparent to-transparent group-hover:from-blood-600/20 transition-all duration-500"></div>
            
             {/* Hover Indicator */}
             <div className="absolute bottom-0 md:top-0 w-full h-1 bg-gradient-to-r from-transparent via-blood-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300 flex flex-col items-center">
              <span className="text-6xl mb-4 opacity-20 font-display font-black text-white group-hover:text-blood-500 group-hover:opacity-40 transition-all">02</span>
              <h3 className="text-3xl md:text-5xl font-display font-black text-white text-center drop-shadow-2xl break-all">
                {match.player2.name}
              </h3>
            </div>

            <span className="mt-8 px-6 py-2 border border-gray-600 text-gray-400 text-xs font-mono uppercase tracking-widest rounded group-hover:bg-blood-600 group-hover:border-blood-500 group-hover:text-white transition-all z-10">
              Xác nhận thắng
            </span>
          </button>

        </div>
      </div>
    </div>
  );
};