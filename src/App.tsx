import React, { useEffect, useState, useRef } from 'react';
import { GameState, Question } from './types';
import { PresenterDashboard } from './components/PresenterDashboard';
import { PlayerInterface } from './components/PlayerInterface';
import { LobbyView } from './components/LobbyView';
import { HostQuestionView } from './components/HostQuestionView';
import { db, ref, onValue, set, update, push } from './firebase';
import { 
  QUESTIONS_GROUPS, 
  QUESTIONS_PERSONAS, 
  QUESTIONS_EMPRESAS, 
  INITIAL_SEGMENTS_GROUPS, 
  INITIAL_SEGMENTS_PERSONAS, 
  INITIAL_SEGMENTS_EMPRESAS,
  getQuestionsForSection 
} from './constants';

export default function App() {
  const [state, setState] = useState<GameState | null>(null);
  const [role, setRole] = useState<'player' | 'presenter' | 'host' | 'lobby'>(() => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    if (roleParam === 'presenter') return 'presenter';
    if (roleParam === 'host') return 'host';
    if (roleParam === 'player') return 'player';
    return 'lobby';
  });

  useEffect(() => {
    const gameRef = ref(db, 'gameState');
    
    // Escuchar cambios en tiempo real
    const unsubscribe = onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convertir el objeto de jugadores de Firebase a un array
        const playersArray = data.players 
          ? Object.entries(data.players).map(([key, value]: [string, any]) => ({
              ...value,
              firebaseKey: key // Opcional, por si necesitas borrarlo luego
            }))
          : [];
        
        setState({
          ...data,
          players: playersArray,
          votes: data.votes || {}
        });
      } else {
        // Inicializar estado si está vacío
        const initialState: GameState = {
          status: 'lobby',
          currentSection: 'groups',
          currentQuestionIndex: -1,
          segments: INITIAL_SEGMENTS_GROUPS,
          revealedColumns: [],
          players: [],
          isAnswerRevealed: false,
          votes: {}
        };
        set(gameRef, initialState);
      }
    });

    return () => unsubscribe();
  }, []);

  const sendAction = async (action: any) => {
    const gameRef = ref(db, 'gameState');
    
    if (action.type === 'PLAYER_JOIN') {
      const playersRef = ref(db, 'gameState/players');
      push(playersRef, {
        id: Math.random().toString(36).substr(2, 9),
        name: action.name,
        score: 0
      });
    }

    if (action.type === 'UPDATE_STATE') {
      // Si cambia la pregunta, reseteamos votos
      if (action.state.currentQuestionIndex !== undefined && action.state.currentQuestionIndex !== state?.currentQuestionIndex) {
        update(gameRef, { ...action.state, votes: {} });
      } else {
        update(gameRef, action.state);
      }
    }

    if (action.type === 'REVEAL_ANSWER') {
      if (!state) return;
      const questions = getQuestionsForSection(state.currentSection);
      const currentQuestion = questions[state.currentQuestionIndex];
      let newRevealed = [...(state.revealedColumns || [])];
      
      if (currentQuestion) {
        if (currentQuestion.revealColumn === 'all') {
          // Revelar todas las métricas clave
          const allMetrics = ['clients', 'activeClients', 'assets', 'principality', 'earningPower'];
          allMetrics.forEach(m => {
            if (!newRevealed.includes(m)) newRevealed.push(m);
          });
        } else if (!newRevealed.includes(currentQuestion.revealColumn)) {
          newRevealed.push(currentQuestion.revealColumn);
        }
      }
      update(gameRef, { isAnswerRevealed: true, revealedColumns: newRevealed });
    }

    if (action.type === 'PLAYER_ANSWER') {
      const { optionIdx } = action.payload;
      const voteRef = ref(db, `gameState/votes/${optionIdx}`);
      const currentVotes = state?.votes?.[optionIdx] || 0;
      set(voteRef, currentVotes + 1);
    }

    if (action.type === 'RESET') {
      set(gameRef, null); // Esto disparará la reinicialización en el useEffect
    }
  };

  const handleAnswer = (question: Question, optionIdx: number) => {
    if (!state) return;
    sendAction({
      type: 'PLAYER_ANSWER',
      payload: { questionId: question.id, optionIdx }
    });
  };

  const handleReveal = () => {
    sendAction({ type: 'REVEAL_ANSWER' });
  };

  const handleNext = () => {
    if (!state) return;
    
    const questions = getQuestionsForSection(state.currentSection);
    let nextQuestion = state.currentQuestionIndex + 1;
    let nextSection = state.currentSection;
    let nextSegments = state.segments;
    let nextStatus = state.status;
    let nextRevealedColumns = state.revealedColumns;

    if (nextQuestion >= questions.length) {
      // Transition to next section
      if (state.currentSection === 'groups') {
        nextSection = 'personas';
        nextSegments = INITIAL_SEGMENTS_PERSONAS;
        nextQuestion = 0;
        nextRevealedColumns = [];
      } else if (state.currentSection === 'personas') {
        nextSection = 'empresas';
        nextSegments = INITIAL_SEGMENTS_EMPRESAS;
        nextQuestion = 0;
        nextRevealedColumns = [];
      } else {
        nextStatus = 'results';
      }
    }
    
    sendAction({
      type: 'UPDATE_STATE',
      state: { 
        currentSection: nextSection,
        currentQuestionIndex: nextQuestion,
        segments: nextSegments,
        status: nextStatus,
        revealedColumns: nextRevealedColumns,
        isAnswerRevealed: false
      }
    });
  };

  const handleJoin = (name: string) => {
    sendAction({ type: 'PLAYER_JOIN', name });
  };

  const handleStart = () => {
    sendAction({
      type: 'UPDATE_STATE',
      state: { 
        status: 'playing',
        currentSection: 'groups',
        currentQuestionIndex: 0,
        segments: INITIAL_SEGMENTS_GROUPS,
        revealedColumns: [],
        isAnswerRevealed: false
      }
    });
  };

  const handleReset = () => {
    sendAction({ type: 'RESET' });
  };

  const handleSimulateVote = (optionIdx: number) => {
    sendAction({
      type: 'PLAYER_ANSWER',
      payload: { optionIdx }
    });
  };

  if (!state) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-white/50 font-mono text-xs uppercase tracking-widest">Conectando...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Floating Role Switcher for Testing */}
      <div className="fixed bottom-4 left-4 z-[9999] flex flex-wrap gap-2 max-w-[300px]">
        <button 
          onClick={() => setRole('lobby')}
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
            role === 'lobby' ? 'bg-white text-black' : 'bg-white/10 text-white/40 hover:bg-white/20'
          }`}
        >
          Lobby
        </button>
        <button 
          onClick={() => {
            if (!state.players.find(p => p.name === 'Test Player')) {
              handleJoin('Test Player');
            }
            setRole('player');
          }}
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
            role === 'player' ? 'bg-red-600 text-white' : 'bg-white/10 text-white/40 hover:bg-white/20'
          }`}
        >
          Jugador
        </button>
        <button 
          onClick={() => setRole('host')}
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
            role === 'host' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/40 hover:bg-white/20'
          }`}
        >
          Host
        </button>
        <button 
          onClick={() => setRole('presenter')}
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
            role === 'presenter' ? 'bg-emerald-600 text-white' : 'bg-white/10 text-white/40 hover:bg-white/20'
          }`}
        >
          Matriz
        </button>
      </div>

      {role === 'presenter' && <PresenterDashboard state={state} onReset={handleReset} />}
      {role === 'host' && <HostQuestionView state={state} onReveal={handleReveal} onNext={handleNext} onReset={handleReset} onStart={handleStart} onSimulateVote={handleSimulateVote} />}
      {role === 'player' && <PlayerInterface state={state} onAnswer={handleAnswer} onStart={handleStart} onReset={handleReset} onJoin={handleJoin} role={role} />}
      {role === 'lobby' && <LobbyView state={state} onStart={handleStart} onJoin={handleJoin} />}
    </>
  );
}
