import React from 'react';
import { GameState } from '../types';
import { getQuestionsForSection } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { Users, TrendingUp, ShieldCheck, Zap, RotateCcw } from 'lucide-react';

interface Props {
  state: GameState;
  onReset: () => void;
}

export const PresenterDashboard: React.FC<Props> = ({ state, onReset }) => {
  const formatPercent = (val: number) => (val * 100).toFixed(1) + '%';
  const formatNumber = (val: number) => val.toLocaleString();
  const formatCurrencyM = (val: number) => `$${val}M`;

  const totalAssets = state.segments.reduce((acc, s) => acc + s.assets, 0);
  const questions = getQuestionsForSection(state.currentSection);
  const currentQuestion = questions[state.currentQuestionIndex];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans">
      <header className="mb-12 flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <h1 className="text-5xl font-bold tracking-tighter uppercase italic font-serif">
            Trivia Davivienda <span className="text-red-600">Live</span>
          </h1>
          <p className="text-white/50 mt-2 uppercase tracking-widest text-xs">
            {state.currentSection === 'groups' && 'Fase 1: Grupos de Banca'}
            {state.currentSection === 'personas' && 'Fase 2: Segmentos Banca Personas'}
            {state.currentSection === 'empresas' && 'Fase 3: Segmentos Banca Empresas'}
          </p>
        </div>
        
        <div className="text-right">
          <button onClick={onReset} className="text-white/20 hover:text-white transition-colors mb-2">
            <RotateCcw size={16} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="font-mono text-sm uppercase tracking-tighter text-white/40">Sincronización Activa</span>
          </div>
        </div>
      </header>

      {state.status === 'playing' && state.currentQuestionIndex >= 0 && currentQuestion && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center"
        >
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-[0.3em] text-red-600 font-bold mb-2">Pregunta en Curso</div>
            <h2 className="text-4xl font-serif italic font-medium leading-tight">
              {currentQuestion.text}
            </h2>
          </div>
          
          <div className="flex gap-4">
            {currentQuestion.options.map((option, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg mb-2 ${
                  state.isAnswerRevealed && idx === currentQuestion.correctOptionIndex
                    ? 'bg-red-600 text-white'
                    : 'bg-white/10 text-white/40'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <div className="text-2xl font-mono font-bold">{state.votes[idx] || 0}</div>
                <div className="text-[10px] uppercase tracking-tighter text-white/20">Votos</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {/* Header Row */}
        <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-white/5 rounded-t-xl border border-white/10 text-[10px] uppercase tracking-widest font-bold text-white/40">
          <div className="col-span-1">Segmento</div>
          <div className="flex items-center gap-2"><Users size={12} /> Clientes</div>
          <div className="flex items-center gap-2"><TrendingUp size={12} /> Activos (%)</div>
          <div className="flex items-center gap-2"><ShieldCheck size={12} /> Principalidad</div>
          <div className="flex items-center gap-2"><Zap size={12} /> Earning Power</div>
        </div>

        {/* Data Rows */}
        {state.segments.map((segment, idx) => {
          const assetsPercent = totalAssets > 0 ? segment.assets / totalAssets : 0;
          const isRevealed = (col: string) => state.revealedColumns.includes(col);
          
          return (
            <motion.div
              layout
              key={segment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="grid grid-cols-5 gap-4 bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors rounded-xl items-stretch group overflow-hidden"
            >
              <div className="col-span-1 bg-white/5 p-6 border-r border-white/10 flex flex-col justify-center">
                <h3 className="text-2xl font-serif italic font-medium group-hover:text-red-500 transition-colors">
                  {segment.name}
                </h3>
                <div className="text-[10px] text-white/20 uppercase tracking-tighter mt-1">ID: 00{segment.id}</div>
              </div>

              <div className="flex flex-col justify-center p-6">
                <AnimatePresence mode="wait">
                  {isRevealed('clients') ? (
                    <motion.div
                      key="revealed"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <span className="text-3xl font-mono font-light tracking-tighter">
                        {formatNumber(segment.clients)}
                      </span>
                      <div className="w-full bg-white/5 h-1 mt-2 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (segment.clients / 2500) * 100)}%` }}
                          className="bg-red-600 h-full" 
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-10 w-full bg-white/5 rounded-lg animate-pulse flex items-center justify-center">
                      <span className="text-[10px] text-white/10 uppercase tracking-widest">Oculto</span>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col justify-center p-6">
                <AnimatePresence mode="wait">
                  {isRevealed('assets') || isRevealed('assetsPerClient') ? (
                    <motion.div
                      key="revealed"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <span className="text-3xl font-mono font-light tracking-tighter">
                        {formatPercent(assetsPercent)}
                      </span>
                      <span className="text-[10px] text-white/30 uppercase mt-1">Cuota de Activos</span>
                    </motion.div>
                  ) : (
                    <div className="h-10 w-full bg-white/5 rounded-lg animate-pulse flex items-center justify-center">
                      <span className="text-[10px] text-white/10 uppercase tracking-widest">Oculto</span>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col justify-center p-6">
                <AnimatePresence mode="wait">
                  {isRevealed('principality') ? (
                    <motion.div
                      key="revealed"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <span className="text-3xl font-mono font-light tracking-tighter text-red-600">
                        {formatPercent(segment.principality)}
                      </span>
                      <div className="flex gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <div 
                            key={i} 
                            className={`h-1 w-4 rounded-full ${i < segment.principality * 5 ? 'bg-red-600' : 'bg-white/10'}`} 
                          />
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-10 w-full bg-white/5 rounded-lg animate-pulse flex items-center justify-center">
                      <span className="text-[10px] text-white/10 uppercase tracking-widest">Oculto</span>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col items-end justify-center p-6">
                <AnimatePresence mode="wait">
                  {isRevealed('earningPower') ? (
                    <motion.div
                      key="revealed"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-end"
                    >
                      <span className="text-4xl font-mono font-bold tracking-tighter text-white">
                        {formatCurrencyM(segment.earningPower)}
                      </span>
                      <span className="text-[10px] text-white/30 uppercase mt-1">Earning Power</span>
                    </motion.div>
                  ) : (
                    <div className="h-10 w-full bg-white/5 rounded-lg animate-pulse flex items-center justify-center">
                      <span className="text-[10px] text-white/10 uppercase tracking-widest">Oculto</span>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      <footer className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center text-[10px] uppercase tracking-widest text-white/20">
        <div>© 2024 Corporate Strategy Visualization</div>
        <div className="flex gap-6">
          <span>Data Source: Live Simulation</span>
          <span>Version: 2.4.1-PRO</span>
        </div>
      </footer>
    </div>
  );
};


