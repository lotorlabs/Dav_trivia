import { Question, Segment } from "./types";

export const INITIAL_SEGMENTS_GROUPS: Segment[] = [
  { id: 101, name: "Banca Personas", clients: 8600, assets: 18000, principality: 0.25, earningPower: 800 },
  { id: 102, name: "Banca Empresas", clients: 1200, assets: 25000, principality: 0.35, earningPower: 1200 },
];

export const INITIAL_SEGMENTS_PERSONAS: Segment[] = [
  { id: 1, name: "Banca privada", clients: 50, assets: 8000, principality: 0.45, earningPower: 320 },
  { id: 2, name: "Premium Plus", clients: 250, assets: 4500, principality: 0.35, earningPower: 210 },
  { id: 3, name: "Premium", clients: 800, assets: 3200, principality: 0.25, earningPower: 140 },
  { id: 4, name: "Clásico", clients: 2500, assets: 1800, principality: 0.15, earningPower: 90 },
  { id: 5, name: "Inclusión", clients: 5000, assets: 500, principality: 0.05, earningPower: 40 },
];

export const INITIAL_SEGMENTS_EMPRESAS: Segment[] = [
  { id: 11, name: "Corporativo", clients: 40, assets: 12000, principality: 0.55, earningPower: 500 },
  { id: 12, name: "Empresarial", clients: 120, assets: 6500, principality: 0.45, earningPower: 350 },
  { id: 13, name: "Pyme Grande", clients: 350, assets: 4200, principality: 0.35, earningPower: 220 },
  { id: 14, name: "Pyme Pequeña", clients: 850, assets: 1800, principality: 0.25, earningPower: 110 },
  { id: 15, name: "Mi Pyme", clients: 2200, assets: 500, principality: 0.15, earningPower: 45 },
];

export const QUESTIONS_GROUPS: Question[] = [
  {
    id: 101,
    text: "¿Cuál es el Earning Power total estimado de Banca Empresas?",
    revealColumn: "earningPower",
    correctOptionIndex: 0,
    options: [
      { text: "$1200M", impact: [] },
      { text: "$800M", impact: [] },
      { text: "$2000M", impact: [] },
      { text: "$500M", impact: [] }
    ]
  },
  {
    id: 102,
    text: "¿Qué porcentaje de principalidad tiene Banca Personas?",
    revealColumn: "principality",
    correctOptionIndex: 0,
    options: [
      { text: "25.0%", impact: [] },
      { text: "35.0%", impact: [] },
      { text: "45.0%", impact: [] },
      { text: "15.0%", impact: [] }
    ]
  }
];

export const QUESTIONS_PERSONAS: Question[] = [
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

export const QUESTIONS_EMPRESAS: Question[] = [
  {
    id: 201,
    text: "¿Cuál es el segmento con mayor Earning Power en Banca Empresas?",
    revealColumn: "earningPower",
    correctOptionIndex: 0,
    options: [
      { text: "Corporativo", impact: [] },
      { text: "Empresarial", impact: [] },
      { text: "Pyme Grande", impact: [] },
      { text: "Mi Pyme", impact: [] }
    ]
  },
  {
    id: 202,
    text: "¿Cuántos clientes tiene el segmento Mi Pyme?",
    revealColumn: "clients",
    correctOptionIndex: 0,
    options: [
      { text: "2,200", impact: [] },
      { text: "850", impact: [] },
      { text: "350", impact: [] },
      { text: "120", impact: [] }
    ]
  },
  {
    id: 203,
    text: "¿Cuál es la principalidad del segmento Pyme Grande?",
    revealColumn: "principality",
    correctOptionIndex: 0,
    options: [
      { text: "35.0%", impact: [] },
      { text: "45.0%", impact: [] },
      { text: "25.0%", impact: [] },
      { text: "55.0%", impact: [] }
    ]
  },
  {
    id: 204,
    text: "¿Qué segmento tiene 120 clientes?",
    revealColumn: "name",
    correctOptionIndex: 0,
    options: [
      { text: "Empresarial", impact: [] },
      { text: "Corporativo", impact: [] },
      { text: "Pyme Grande", impact: [] },
      { text: "Pyme Pequeña", impact: [] }
    ]
  }
];

// Helper to get questions based on section
export const getQuestionsForSection = (section: string) => {
  if (section === 'groups') return QUESTIONS_GROUPS;
  if (section === 'personas') return QUESTIONS_PERSONAS;
  if (section === 'empresas') return QUESTIONS_EMPRESAS;
  return [];
};
