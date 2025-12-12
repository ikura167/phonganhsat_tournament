import React, { useRef, useEffect, useState } from 'react';
import { Match, Player, Round } from '../types';
import { MatchNode } from './MatchNode';
import { ResultModal } from './ResultModal';
import { ArrowLeft, Trophy } from 'lucide-react';

interface BracketScreenProps {
  rounds: Round[];
  champion: Player | null;
  onSelectWinner: (matchId: string, winner: Player) => void;
  onReset: (isFinished?: boolean) => void;
}

export const BracketScreen: React.FC<BracketScreenProps> = ({ 
  rounds, 
  champion, 
  onSelectWinner, 
  onReset 
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  // Auto scroll to center initially
  useEffect(() => {
    if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        container.scrollLeft = 0;
    }
  }, []);

  const handleMatchClick = (match: Match) => {
    setSelectedMatch(match);
  };

  const handleConfirmWinner = (winner: Player) => {
    if (selectedMatch) {
      onSelectWinner(selectedMatch.id, winner);
      setSelectedMatch(null);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[#050505]">
      {/* Modal */}
      {selectedMatch && (
        <ResultModal 
          match={selectedMatch} 
          onConfirm={handleConfirmWinner} 
          onClose={() => setSelectedMatch(null)} 
        />
      )}

      {/* Header */}
      <header className="h-16 border-b border-gray-800 bg-black/80 flex items-center justify-between px-6 z-10 backdrop-blur-md">
        <button 
          onClick={() => onReset(false)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-mono text-sm uppercase">Cấu hình lại</span>
        </button>

        <h1 className="text-xl font-display font-bold text-blood-500 uppercase tracking-widest">
          Sơ Đồ Thi Đấu
        </h1>

        <div className="w-20"></div> {/* Spacer for balance */}
      </header>

      {/* Champion Overlay */}
      {champion && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/90 animate-fade-in backdrop-blur-sm">
          <div className="relative">
             <div className="absolute inset-0 bg-blood-600 blur-[100px] opacity-30 rounded-full"></div>
             <Trophy className="w-32 h-32 text-yellow-500 mb-6 relative drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] animate-bounce" />
          </div>
          <h2 className="text-2xl font-mono text-gray-400 uppercase tracking-widest mb-2">Vô Địch Sát Thủ</h2>
          <h1 className="text-6xl md:text-8xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-2xl text-center px-4">
            {champion.name}
          </h1>
          <button 
            onClick={() => onReset(true)}
            className="mt-12 px-8 py-3 bg-blood-600 text-white font-bold uppercase tracking-widest hover:bg-blood-500 transition-all border border-blood-400"
          >
            Giải Đấu Mới
          </button>
        </div>
      )}

      {/* Bracket Container */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-auto cursor-grab active:cursor-grabbing p-12 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed"
      >
        <div className="flex flex-row gap-20 min-w-max h-full items-center justify-center pl-10 pr-10">
          
          {rounds.map((round, rIndex) => (
            <div key={round.index} className="flex flex-col relative min-w-[256px]">
              
              {/* Round Title */}
              <div className="absolute -top-16 left-0 w-full text-center">
                <h3 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">
                  {round.name}
                </h3>
              </div>

              {/* Matches Column */}
              <div className="flex flex-col justify-around gap-12 h-full py-8">
                {round.matches.map((match, mIndex) => {
                   const isLastRound = rIndex === rounds.length - 1;
                   
                   return (
                    <div key={match.id} className="relative flex flex-col justify-center">
                      <MatchNode match={match} onClick={handleMatchClick} />
                      
                      {/* Connector Lines */}
                      {!isLastRound && (
                        <>
                          {/* Horizontal line exiting match */}
                          <div className="absolute top-1/2 -right-10 w-10 h-[2px] bg-gray-800"></div>
                          
                          {/* Vertical Connector and Dots */}
                          {mIndex % 2 === 0 ? (
                            // Even match (Top of pair)
                            <>
                              {/* Vertical Line Down */}
                              <div className="absolute top-1/2 -right-10 w-[2px] h-[calc(50%+3rem)] bg-gray-800 translate-y-full origin-top transform translate-x-[0px]" 
                                   style={{ height: 'calc(100% + 3rem)' }}> 
                              </div>
                              <div className="absolute top-1/2 -right-[42px] w-[2px] h-[calc(100%+3rem)] bg-gray-800 z-0"></div>
                            </>
                          ) : (
                             // Odd match (Bottom of pair)
                             null
                          )}

                          {/* Connection Dot */}
                          <div className={`absolute top-1/2 -right-2 w-2 h-2 rounded-full border border-black z-10 ${match.winner ? 'bg-blood-600' : 'bg-gray-700'}`}></div>
                        </>
                      )}

                      {/* Incoming line from left (except first round) */}
                      {rIndex > 0 && (
                        <div className={`absolute top-1/2 -left-10 w-10 h-[2px] ${match.player1 || match.player2 ? 'bg-gray-800' : 'bg-gray-900'}`}></div>
                      )}

                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          
          {/* Winner Podium Placeholder */}
          {champion && !rounds[rounds.length-1].matches[0].winner && (
             <div className="w-64 flex items-center justify-center opacity-0 animate-fade-in">
             </div>
          )}
        </div>
      </div>
    </div>
  );
};