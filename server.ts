import express from "express";
import { createServer as createViteServer } from "vite";
import { createServer } from "http";
import { GameState } from "./src/types";
import { INITIAL_SEGMENTS_GROUPS, getQuestionsForSection } from "./src/constants";

async function startServer() {
  const app = express();
  app.use(express.json());
  const server = createServer(app);

  const PORT = 3000;

  // Initial Game State
  let gameState = {
    status: 'lobby' as const,
    currentSection: 'groups' as const,
    currentQuestionIndex: -1,
    segments: INITIAL_SEGMENTS_GROUPS,
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
        const questions = getQuestionsForSection(gameState.currentSection);
        const currentQuestion = questions[gameState.currentQuestionIndex];
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
        gameState.currentSection = 'groups';
        gameState.currentQuestionIndex = -1;
        gameState.revealedColumns = [];
        gameState.players = [];
        gameState.isAnswerRevealed = false;
        gameState.votes = {};
        gameState.segments = INITIAL_SEGMENTS_GROUPS;
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
