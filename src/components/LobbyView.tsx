import React from 'react';
import { GameState } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Users } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface Props {
  state: GameState;
  onStart: () => void;
  onJoin: (name: string) => void;
}

export const LobbyView: React.FC<Props> = ({ state, onStart, onJoin }) => {
  const playerUrl = `${window.location.origin}?role=player`;

  const handleStart = () => {
    // Open the two windows for the host/presenter
    window.open(`${window.location.origin}?role=presenter`, 'presenter_view', 'width=1200,height=800');
    window.open(`${window.location.origin}?role=host`, 'host_view', 'width=800,height=600');
    onStart();
  };

  if (state.status === 'playing') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-12 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg"
        >
          <div className="w-24 h-24 bg-red-600/10 border border-red-600/50 rounded-full flex items-center justify-center mx-auto mb-8">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <h2 className="text-4xl font-bold italic font-serif mb-4">Juego en Progreso</h2>
          <p className="text-white/40 uppercase tracking-widest text-sm mb-12 leading-relaxed">
            El juego ha comenzado. Utiliza los botones de abajo para acceder a las diferentes vistas si las ventanas no se abrieron automáticamente.
          </p>
          
          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={() => window.location.href = `${window.location.origin}?role=host`}
              className="w-full py-6 bg-red-600 text-white rounded-2xl font-bold text-xl hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-red-600/20"
            >
              <Play fill="currentColor" size={24} />
              IR A CONTROL DE HOST
            </button>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => window.open(`${window.location.origin}?role=presenter`, 'presenter_view')}
                className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
              >
                Abrir Matriz (Popup)
              </button>
              <button 
                onClick={() => window.location.href = `${window.location.origin}?role=presenter`}
                className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
              >
                Ver Matriz Aquí
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-12 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-7xl font-bold tracking-tighter italic font-serif mb-4">
          Trivia <span className="text-red-600">Davivienda</span>
        </h1>
        <p className="text-white/40 uppercase tracking-[0.3em] text-sm">Lobby de Espera</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl w-full items-center">
        <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-red-600/10 flex flex-col items-center">
          <div className="mb-6 text-black/40 uppercase text-[10px] font-bold tracking-widest">Escanea para Unirte</div>
          <QRCodeSVG value={playerUrl} size={256} level="H" includeMargin={true} />
          <div className="mt-6 text-black font-mono text-sm font-bold truncate max-w-full">{playerUrl}</div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-end border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-2xl font-serif italic">
              <Users className="text-red-600" />
              Jugadores Conectados
            </div>
            <span className="text-red-600 font-mono text-xl">{state.players.length}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence>
              {state.players.map((player) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium truncate">{player.name}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {state.players.length === 0 && (
              <div className="col-span-2 py-12 text-center text-white/20 italic font-serif">
                Esperando a que los jugadores se unan...
              </div>
            )}
          </div>

          <button
            onClick={handleStart}
            disabled={state.players.length === 0}
            className="w-full py-6 bg-red-600 text-white rounded-2xl font-bold text-xl hover:bg-red-700 transition-all disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-red-600/20"
          >
            <Play fill="currentColor" size={24} />
            Iniciar Juego
          </button>

          <div className="pt-4 flex justify-center">
            <button 
              onClick={() => {
                onJoin(`Test Player ${state.players.length + 1}`);
              }}
              className="text-[10px] uppercase tracking-widest text-white/20 hover:text-white/60 transition-colors border border-white/5 px-4 py-2 rounded-full"
            >
              + Simular Jugador
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
