import express from "express";
import { createServer as createViteServer } from "vite";
import { createServer } from "http";
import { GameState } from "./src/types";
import { QUESTIONS } from "./src/constants";

async function startServer() {
  const app = express();
  app.use(express.json());
  const server = createServer(app);

  const PORT = 3000;

  // Initial Game State
  let gameState = {
    status: 'lobby' as const,
    currentQuestionIndex: -1,
    segments: [
      { id: 1, name: "Banca privada", clients: 50, assets: 8000, principality: 0.45, earningPower: 320 },
      { id: 2, name: "Premium Plus", clients: 250, assets: 4500, principality: 0.35, earningPower: 210 },
      { id: 3, name: "Premium", clients: 800, assets: 3200, principality: 0.25, earningPower: 140 },
      { id: 4, name: "Clásico", clients: 2500, assets: 1800, principality: 0.15, earningPower: 90 },
      { id: 5, name: "Inclusión", clients: 5000, assets: 500, principality: 0.05, earningPower: 40 },
    ],
    revealedColumns: [],
    players: [] as any[],
    isAnswerRevealed: false,
    votes: {} as Record<number, number>,
    history: [] as any[]
  };

  // API Routes for Polling
  app.get("/api/state", (req, res) => {
    res.json(gameState);
  });

  app.post("/api/action", (req, res) => {
    const data = req.body;
    try {
      if (data.type === "PLAYER_JOIN") {
        const newPlayer = {
          id: Math.random().toString(36).substr(2, 9),
          name: data.name,
          score: 0
        };
        gameState.players.push(newPlayer);
      }

      if (data.type === "UPDATE_STATE") {
        if (data.state.currentQuestionIndex !== undefined && data.state.currentQuestionIndex !== gameState.currentQuestionIndex) {
          gameState.votes = {};
        }
        gameState = { ...gameState, ...data.state };
      }

      if (data.type === "REVEAL_ANSWER") {
        gameState.isAnswerRevealed = true;
        const currentQuestion = QUESTIONS[gameState.currentQuestionIndex];
        if (currentQuestion && currentQuestion.revealColumn && !gameState.revealedColumns.includes(currentQuestion.revealColumn)) {
          gameState.revealedColumns.push(currentQuestion.revealColumn);
        }
      }

      if (data.type === "PLAYER_ANSWER") {
        const { optionIdx } = data.payload;
        if (optionIdx !== undefined) {
          gameState.votes[optionIdx] = (gameState.votes[optionIdx] || 0) + 1;
        }
      }

      if (data.type === "RESET") {
        gameState.status = 'lobby';
        gameState.currentQuestionIndex = -1;
        gameState.revealedColumns = [];
        gameState.players = [];
        gameState.isAnswerRevealed = false;
        gameState.votes = {};
        gameState.segments = [
          { id: 1, name: "Banca privada", clients: 50, assets: 8000, principality: 0.45, earningPower: 320 },
          { id: 2, name: "Premium Plus", clients: 250, assets: 4500, principality: 0.35, earningPower: 210 },
          { id: 3, name: "Premium", clients: 800, assets: 3200, principality: 0.25, earningPower: 140 },
          { id: 4, name: "Clásico", clients: 2500, assets: 1800, principality: 0.15, earningPower: 90 },
          { id: 5, name: "Inclusión", clients: 5000, assets: 500, principality: 0.05, earningPower: 40 },
        ];
      }
      res.json({ success: true, state: gameState });
    } catch (e) {
      console.error("Error processing action", e);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
