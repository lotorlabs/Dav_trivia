import React, { useState } from 'react';
import { GameState, Question } from '../types';
import { QUESTIONS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, ChevronRight, User, Send } from 'lucide-react';

  interface Props {
    state: GameState;
    onAnswer: (question: Question, optionIdx: number) => void;
    onStart: () => void;
    onReset: () => void;
    onJoin: (name: string) => void;
    role?: string;
  }

  export const PlayerInterface: React.FC<Props> = ({ state, onAnswer, onStart, onReset, onJoin, role }) => {
  const [playerName, setPlayerName] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Reset selected option when question changes
  // Moved to top to follow Rules of Hooks
  React.useEffect(() => {
    setSelectedOption(null);
  }, [state.currentQuestionIndex]);

  const currentQuestion = (state.currentQuestionIndex >= 0 && state.currentQuestionIndex < QUESTIONS.length) 
    ? QUESTIONS[state.currentQuestionIndex] 
    : null;

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onJoin(playerName.trim());
      setIsJoined(true);
    }
  };

  if (!isJoined && role === 'player') {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-black/5 p-12 text-center border border-black/5"
        >
          <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center mx-auto mb-10 rotate-6 shadow-xl shadow-red-600/20">
            <User className="text-white" size={36} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">Unirse al Juego</h1>
          <p className="text-gray-400 mb-10">Ingresa tu apodo para participar</p>
          
          <form onSubmit={handleJoin} className="space-y-4">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Tu apodo..."
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-red-600 focus:bg-white rounded-2xl outline-none transition-all text-lg font-medium"
              autoFocus
            />
            <button
              type="submit"
              disabled={!playerName.trim()}
              className="w-full py-4 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-20 flex items-center justify-center gap-2"
            >
              Entrar al Lobby
              <Send size={18} />
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (state.currentQuestionIndex >= QUESTIONS.length) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-black/5 p-10 text-center"
        >
          <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-8">
            <RotateCcw className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Juego Completado!</h2>
          <p className="text-gray-500 mb-10">Has analizado todos los escenarios estratégicos.</p>
          <button
            onClick={onReset}
            className="w-full py-4 bg-black text-white rounded-2xl font-semibold text-lg hover:bg-gray-800 transition-all"
          >
            Reiniciar
          </button>
        </motion.div>
      </div>
    );
  }

  if (state.status === 'lobby' || !currentQuestion) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Ya estás dentro!</h2>
          <p className="text-gray-500 mb-8">
            {state.status === 'lobby' 
              ? 'Esperando a que el presentador inicie el juego...' 
              : 'Preparando la siguiente pregunta...'}
          </p>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 inline-flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
              {playerName.charAt(0).toUpperCase() || 'P'}
            </div>
            <span className="font-bold text-gray-800">{playerName || 'Jugador'}</span>
          </div>
        </motion.div>
      </div>
    );
  }

  const optionColors = [
    'bg-red-500 hover:bg-red-600',
    'bg-blue-500 hover:bg-blue-600',
    'bg-yellow-500 hover:bg-yellow-600',
    'bg-green-500 hover:bg-green-600'
  ];

  const handleOptionClick = (idx: number) => {
    if (selectedOption !== null || !currentQuestion) return;
    setSelectedOption(idx);
    onAnswer(currentQuestion, idx);
  };

  // Final fallback to prevent blank screen
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-medium">Sincronizando con el servidor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6 md:p-12 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="px-4 py-1 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest">
              Pregunta {state.currentQuestionIndex + 1} / {QUESTIONS.length}
            </div>
          </div>
          <div className="font-bold text-gray-400 uppercase text-xs tracking-widest">
            {playerName}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold text-gray-900 leading-tight text-center mb-12">
              {currentQuestion.text}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.options.map((option, idx) => {
                const isCorrect = idx === currentQuestion.correctOptionIndex;
                const isSelected = selectedOption === idx;
                const showResult = state.isAnswerRevealed;

                return (
                  <button
                    key={idx}
                    disabled={selectedOption !== null && !showResult}
                    onClick={() => handleOptionClick(idx)}
                    className={`
                      relative h-44 rounded-2xl transition-all p-6 text-left flex flex-col justify-between overflow-hidden
                      ${optionColors[idx]} text-white shadow-lg active:scale-95
                      ${selectedOption !== null && !isSelected ? 'opacity-40 grayscale' : ''}
                      ${showResult && isCorrect ? 'ring-8 ring-white ring-inset' : ''}
                      ${showResult && isSelected && !isCorrect ? 'opacity-40 grayscale' : ''}
                    `}
                  >
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center font-bold text-xl">
                      {String.fromCharCode(65 + idx)}
                    </div>

                    <span className="text-xl font-bold leading-tight">
                      {option.text}
                    </span>
                    
                    {showResult && isCorrect && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 right-4 bg-white text-black w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <Play fill="currentColor" size={20} className="ml-1" />
                      </motion.div>
                    )}

                    {isSelected && !showResult && (
                      <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        Seleccionado
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {state.isAnswerRevealed && selectedOption !== null && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-8 rounded-3xl text-center shadow-xl ${
                  selectedOption === currentQuestion.correctOptionIndex 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-red-600 text-white'
                }`}
              >
                <div className="text-5xl mb-4">
                  {selectedOption === currentQuestion.correctOptionIndex ? '🎉' : '😅'}
                </div>
                <h3 className="text-3xl font-bold mb-2">
                  {selectedOption === currentQuestion.correctOptionIndex ? '¡Correcto!' : '¡Oops! Incorrecto'}
                </h3>
                <p className="opacity-90">
                  {selectedOption === currentQuestion.correctOptionIndex 
                    ? 'Has acertado el escenario estratégico.' 
                    : `La respuesta correcta era la ${String.fromCharCode(65 + currentQuestion.correctOptionIndex)}.`}
                </p>
              </motion.div>
            )}

            {selectedOption !== null && !state.isAnswerRevealed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-400 font-medium italic"
              >
                Respuesta enviada. Esperando al presentador...
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

