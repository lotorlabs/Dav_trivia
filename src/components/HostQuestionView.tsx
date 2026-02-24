import React from 'react';
import { GameState } from '../types';
import { getQuestionsForSection } from '../constants';
import { motion } from 'motion/react';
import { Eye, ChevronRight, RotateCcw, Play } from 'lucide-react';

interface Props {
  state: GameState;
  onReveal: () => void;
  onNext: () => void;
  onReset: () => void;
  onStart: () => void;
  onSimulateVote: (optionIdx: number) => void;
}

export const HostQuestionView: React.FC<Props> = ({ state, onReveal, onNext, onReset, onStart, onSimulateVote }) => {
  const questions = getQuestionsForSection(state.currentSection);
  const currentQuestion = questions[state.currentQuestionIndex];

  if (state.status === 'lobby') {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center p-8 font-sans">
        <div className="text-center max-w-md">
          <h2 className="text-4xl font-bold mb-4 italic font-serif">Trivia Davivienda</h2>
          <p className="text-white/40 mb-12 uppercase tracking-widest text-sm">El juego aún no ha comenzado</p>
          
          <button 
            onClick={onStart}
            className="w-full py-6 bg-red-600 text-white rounded-2xl font-bold text-xl hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-red-600/20"
          >
            <Play fill="currentColor" size={24} />
            INICIAR JUEGO AHORA
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center p-8">
        <h2 className="text-3xl font-bold mb-4">Fin del Juego</h2>
        <button 
          onClick={onReset}
          className="px-8 py-4 bg-white text-black rounded-2xl font-bold flex items-center gap-2"
        >
          <RotateCcw size={20} /> Reiniciar Todo
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8 font-sans flex flex-col">
      <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Panel de Control del Host</h1>
          <p className="text-white/40 text-sm uppercase tracking-widest">
            {state.currentSection === 'groups' && 'Fase 1: Grupos'}
            {state.currentSection === 'personas' && 'Fase 2: Personas'}
            {state.currentSection === 'empresas' && 'Fase 3: Empresas'}
            {' | '} Pregunta {state.currentQuestionIndex + 1} de {questions.length}
          </p>
        </div>
        <button onClick={onReset} className="text-white/20 hover:text-white transition-colors">
          <RotateCcw size={20} />
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
        <motion.div 
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold leading-tight mb-8 italic font-serif">
            {currentQuestion.text}
          </h2>

          <div className="grid grid-cols-2 gap-4 w-full">
            {currentQuestion.options.map((option, idx) => (
              <div 
                key={idx}
                className={`p-6 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${
                  state.isAnswerRevealed && idx === currentQuestion.correctOptionIndex
                    ? 'border-red-600 bg-red-600/10'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                  state.isAnswerRevealed && idx === currentQuestion.correctOptionIndex
                    ? 'bg-red-600 text-white'
                    : 'bg-white/10 text-white/60'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <div className="flex-1 flex justify-between items-center">
                  <span className="text-xl font-medium">{option.text}</span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSimulateVote(idx);
                      }}
                      className="w-6 h-6 rounded bg-white/5 hover:bg-white/20 flex items-center justify-center text-[10px] text-white/40"
                      title="Simular Voto"
                    >
                      +1
                    </button>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-white/40 uppercase tracking-tighter">Votos</span>
                      <span className="text-xl font-mono font-bold">{state.votes[idx] || 0}</span>
                    </div>
                    {state.isAnswerRevealed && idx === currentQuestion.correctOptionIndex && (
                      <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase">Correcta</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="flex gap-4 w-full max-w-md">
          {!state.isAnswerRevealed ? (
            <button
              onClick={onReveal}
              className="flex-1 py-6 bg-white text-black rounded-2xl font-bold text-xl hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-3"
            >
              <Eye size={24} />
              Mostrar Respuesta
            </button>
          ) : (
            <button
              onClick={onNext}
              className="flex-1 py-6 bg-red-600 text-white rounded-2xl font-bold text-xl hover:bg-red-700 transition-all flex items-center justify-center gap-3"
            >
              Siguiente Pregunta
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      </main>

      <footer className="mt-12 pt-6 border-t border-white/10 flex justify-between text-[10px] uppercase tracking-widest text-white/20">
        <div>Jugadores: {state.players.length}</div>
        <div>Estado: {state.isAnswerRevealed ? 'Respuesta Revelada' : 'Esperando Respuestas'}</div>
      </footer>
    </div>
  );
};
