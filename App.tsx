import React, { useState, useEffect } from "react";
import { Player, Round, TournamentStatus, Match } from "./types";
import { shufflePlayers, generateBracket } from "./utils";
import { SetupScreen } from "./components/SetupScreen";
import { BracketScreen } from "./components/BracketScreen";

const App: React.FC = () => {
  const [status, setStatus] = useState<TournamentStatus>("SETUP");
  const [participants, setParticipants] = useState<Player[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [champion, setChampion] = useState<Player | null>(null);

  // Setup: Add Player
  const addPlayer = (name: string) => {
    const newPlayer: Player = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: name,
    };
    setParticipants((prev) => [...prev, newPlayer]);
  };

  // Setup: Remove Player
  const removePlayer = (id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  // Setup: Clear All Players
  const clearParticipants = () => {
    setParticipants([]);
  };

  // Start Tournament
  const startTournament = () => {
    if (participants.length < 2) return;

    // Shuffle and generate bracket
    // const shuffled = shufflePlayers([...participants]);
    const generatedRounds = generateBracket(participants);

    setRounds(generatedRounds);
    setStatus("BRACKET");
    setChampion(null);

    // Initial check for auto-wins (Byes) in the first round
    resolveByes(generatedRounds);
  };

  // Helper to auto-advance matches with BYEs
  const resolveByes = (currentRounds: Round[]) => {
    const newRounds = JSON.parse(JSON.stringify(currentRounds)) as Round[];
    let changed = false;

    // Only check Round 0 for initial BYEs
    newRounds[0].matches.forEach((match) => {
      if (!match.winner) {
        if (match.player1 && match.player2?.isBye) {
          match.winner = match.player1;
          advanceWinner(newRounds, match, match.player1);
          changed = true;
        } else if (match.player1?.isBye && match.player2) {
          match.winner = match.player2;
          advanceWinner(newRounds, match, match.player2);
          changed = true;
        }
      }
    });

    if (changed) {
      setRounds(newRounds);
    } else {
      setRounds(currentRounds);
    }
  };

  // Logic to move winner to next round
  const advanceWinner = (
    roundsDraft: Round[],
    currentMatch: Match,
    winner: Player
  ) => {
    // If there is a next match linked
    if (currentMatch.nextMatchId) {
      // Find the next match
      const nextRoundIndex = currentMatch.roundIndex + 1;
      if (nextRoundIndex < roundsDraft.length) {
        const nextRound = roundsDraft[nextRoundIndex];
        const nextMatch = nextRound.matches.find(
          (m) => m.id === currentMatch.nextMatchId
        );

        if (nextMatch) {
          // Determine slot based on current match index (even = p1, odd = p2)
          if (currentMatch.matchIndex % 2 === 0) {
            nextMatch.player1 = winner;
          } else {
            nextMatch.player2 = winner;
          }
        }
      }
    } else {
      // No next match? This is the final!
      setChampion(winner);
    }
  };

  // Handler when user clicks a winner
  const handleSelectWinner = (matchId: string, winner: Player) => {
    setRounds((prevRounds) => {
      const newRounds = JSON.parse(JSON.stringify(prevRounds)) as Round[]; // Deep clone

      // Find match
      for (const round of newRounds) {
        const match = round.matches.find((m) => m.id === matchId);
        if (match) {
          match.winner = winner;
          advanceWinner(newRounds, match, winner);
          break;
        }
      }
      return newRounds;
    });
  };

  // Reset Tournament
  // isFinished: If true, skips confirmation (used when champion is crowned)
  const resetTournament = (isFinished: boolean = false) => {
    // Ensure isFinished is a boolean (in case it comes from an event)
    const skipConfirm = isFinished === true;

    if (
      skipConfirm ||
      window.confirm(
        "Bạn có chắc muốn hủy giải đấu hiện tại và quay lại màn hình đăng ký?"
      )
    ) {
      setStatus("SETUP");
      setChampion(null);
      setRounds([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-blood-600 selection:text-white">
      {status === "SETUP" && (
        <div className="flex items-center justify-center min-h-screen bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat bg-fixed">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
          <div className="relative z-10 w-full">
            <SetupScreen
              participants={participants}
              onAddPlayer={addPlayer}
              onRemovePlayer={removePlayer}
              onClearAll={clearParticipants}
              onStartTournament={startTournament}
            />
          </div>
        </div>
      )}

      {status === "BRACKET" && (
        <BracketScreen
          rounds={rounds}
          champion={champion}
          onSelectWinner={handleSelectWinner}
          onReset={resetTournament}
        />
      )}
    </div>
  );
};

export default App;
