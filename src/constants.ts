import { Question } from "./types";

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "¿Cuántos clientes hay en el segmento Inclusión?",
    revealColumn: "clients",
    correctOptionIndex: 0,
    options: [
      { text: "5,000", impact: [] },
      { text: "2,500", impact: [] },
      { text: "800", impact: [] },
      { text: "250", impact: [] }
    ]
  },
  {
    id: 2,
    text: "¿Cuál es el porcentaje de clientes activos en el segmento Clásico?",
    revealColumn: "assets",
    correctOptionIndex: 0,
    options: [
      { text: "15.0%", impact: [] },
      { text: "10.0%", impact: [] },
      { text: "25.0%", impact: [] },
      { text: "5.0%", impact: [] }
    ]
  },
  {
    id: 3,
    text: "¿Cuál es el porcentaje de principalidad en el segmento Premium?",
    revealColumn: "principality",
    correctOptionIndex: 0,
    options: [
      { text: "25.0%", impact: [] },
      { text: "35.0%", impact: [] },
      { text: "15.0%", impact: [] },
      { text: "45.0%", impact: [] }
    ]
  },
  {
    id: 4,
    text: "¿Cuál es el Earning Power de un cliente Premium Plus?",
    revealColumn: "earningPower",
    correctOptionIndex: 0,
    options: [
      { text: "$210M", impact: [] },
      { text: "$320M", impact: [] },
      { text: "$140M", impact: [] },
      { text: "$90M", impact: [] }
    ]
  }
];
