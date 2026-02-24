export interface Segment {
  id: number;
  name: string;
  clients: number;
  assets: number; // Total assets
  principality: number; // % of assets (0-1)
  earningPower: number;
}

export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface GameState {
  status: 'lobby' | 'playing' | 'results';
  currentSection: 'groups' | 'personas' | 'empresas';
  currentQuestionIndex: number;
  segments: Segment[];
  revealedColumns: string[];
  players: Player[];
  isAnswerRevealed: boolean;
  votes: Record<number, number>; // optionIndex -> count
}

export interface Question {
  id: number;
  text: string;
  revealColumn: string;
  correctOptionIndex: number;
  options: {
    text: string;
    impact: {
      segmentId: number;
      metric: keyof Omit<Segment, 'id' | 'name'>;
      change: number;
    }[];
  }[];
}
