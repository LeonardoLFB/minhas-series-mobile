export type Serie = {
  id: number;
  titulo: string;
  plataforma: string;
  temporadas: number;
  nota: number | null;
  concluida: number;
  createdAt: string;
};

export type CreateSerieInput = {
  titulo: string;
  plataforma: string;
  temporadas: number;
  nota: number | null;
};

export type UpdateSerieInput = {
  titulo: string;
  plataforma: string;
  temporadas: number;
  nota: number | null;
};

export type SerieFilter = 'todas' | 'assistindo' | 'concluidas';