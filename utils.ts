import { Player, Match, Round } from './types';

// Shuffle array (Fisher-Yates)
export const shufflePlayers = (array: Player[]): Player[] => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

// Calculate next power of 2
export const getNextPowerOfTwo = (n: number): number => {
  let count = 0;
  if (n && !(n & (n - 1))) return n; // Already power of 2
  while(n !== 0) {
    n >>= 1;
    count += 1;
  }
  return 1 << count;
};

// Generate the initial bracket structure
export const generateBracket = (participants: Player[]): Round[] => {
  const totalSlots = getNextPowerOfTwo(participants.length);
  const byesNeeded = totalSlots - participants.length;
  
  // Create a pool of players mixed with "Byes"
  const players: Player[] = [...participants];
  for (let i = 0; i < byesNeeded; i++) {
    players.push({ id: `bye-${i}`, name: 'BYE', isBye: true });
  }

  // Calculate total rounds needed (log2 of totalSlots)
  const totalRounds = Math.log2(totalSlots);
  const rounds: Round[] = [];

  let matchCounter = 0;
  let matchesInCurrentRound = totalSlots / 2;

  // Generate Rounds
  for (let r = 0; r < totalRounds; r++) {
    const roundMatches: Match[] = [];
    
    for (let m = 0; m < matchesInCurrentRound; m++) {
      roundMatches.push({
        id: `r${r}-m${m}`,
        roundIndex: r,
        matchIndex: m,
        player1: null,
        player2: null,
        winner: null,
        nextMatchId: null // To be linked
      });
      matchCounter++;
    }

    const roundName = 
      r === totalRounds - 1 ? "CHUNG KẾT (Finals)" : 
      r === totalRounds - 2 ? "Bán Kết (Semi-Finals)" : 
      `Vòng ${r + 1}`;

    rounds.push({
      index: r,
      name: roundName,
      matches: roundMatches
    });

    matchesInCurrentRound /= 2;
  }

  // Link Matches (Winner of R0-M0 & R0-M1 -> R1-M0, etc.)
  for (let r = 0; r < rounds.length - 1; r++) {
    const currentRound = rounds[r];
    // The next round has half the number of matches
    // Match m in this round feeds into match floor(m/2) in next round
    for (let m = 0; m < currentRound.matches.length; m++) {
      const nextRoundMatchIndex = Math.floor(m / 2);
      const nextMatchId = `r${r + 1}-m${nextRoundMatchIndex}`;
      currentRound.matches[m].nextMatchId = nextMatchId;
    }
  }

  // Populate Round 0 with players
  const round0 = rounds[0];
  for (let i = 0; i < round0.matches.length; i++) {
    round0.matches[i].player1 = players[i * 2];
    round0.matches[i].player2 = players[i * 2 + 1];
    
    // Auto-resolve Byes immediately
    if (round0.matches[i].player1?.isBye && round0.matches[i].player2) {
       // P1 is bye, P2 wins automatically
       // Wait, "Bye" usually means the real player fights no one. 
       // If P2 is a real player and P1 is BYE, P2 advances.
       // However, we usually structure it so the Bye is P2.
       // Let's just handle auto-win logic in the main loop if one is bye.
    }
  }

  return rounds;
};