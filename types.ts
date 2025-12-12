export interface Player {
  id: string;
  name: string;
  isBye?: boolean; // True if this is a placeholder for a "Bye" (automatic win)
}

export interface Match {
  id: string;
  roundIndex: number;
  matchIndex: number; // Position in the round (0 top, 1 next down, etc.)
  player1: Player | null;
  player2: Player | null;
  winner: Player | null;
  nextMatchId: string | null; // ID of the match the winner goes to
}

export interface Round {
  index: number;
  name: string;
  matches: Match[];
}

export type TournamentStatus = 'SETUP' | 'BRACKET' | 'FINISHED';