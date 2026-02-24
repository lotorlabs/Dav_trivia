import React, { useEffect, useState, useRef } from 'react';
import { GameState, Question } from './types';
import { PresenterDashboard } from './components/PresenterDashboard';
import { PlayerInterface } from './components/PlayerInterface';
import { LobbyView } from './components/LobbyView';
import { HostQuestionView } from './components/HostQuestionView';

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
    // Polling mechanism instead of WebSocket
    const fetchState = async () => {
      try {
        const response = await fetch('/api/state');
        if (response.ok) {
          const data = await response.json();
          setState(data);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    };

    fetchState(); // Initial fetch
    const interval = setInterval(fetchState, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const sendAction = async (action: any) => {
    try {
      const response = await fetch('/api/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action)
      });
      if (response.ok) {
        const data = await response.json();
        setState(data.state);
      }
    } catch (err) {
      console.error('Action error:', err);
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
    const nextQuestion = state.currentQuestionIndex + 1;
    
    sendAction({
      type: 'UPDATE_STATE',
      state: { 
        currentQuestionIndex: nextQuestion,
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
        currentQuestionIndex: 0,
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
