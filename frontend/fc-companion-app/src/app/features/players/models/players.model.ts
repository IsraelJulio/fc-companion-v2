export interface PlayerFilters {
  search: string;
  position: string;
  clubId: string | null;
  league: string;
}

export interface UpdatePlayerForm {
  overall: number;
  marketValue: number | null;
  preferredFoot: string;
}

export interface UpdateStatsForm {
  goals: number;
  assists: number;
  appearances: number;
  minutesPlayed: number;
}

export interface CreatePlayerForm {
  firstName: string;
  lastName: string;
  position: string;
  currentClubId: string;
  overall: number;
  nationality: string | null;
  preferredFoot: string;
}

export const POSITIONS = [
  'GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'CF', 'ST'
] as const;

export const LEAGUES = [
  { label: 'Premier League', value: 'Premier League' },
  { label: 'La Liga', value: 'La Liga' },
  { label: 'Serie A', value: 'Serie A' },
  { label: 'Bundesliga', value: 'Bundesliga' },
  { label: "Ligue 1", value: 'Ligue 1' },
  { label: 'Champions League', value: 'UEFA Champions League' },
] as const;
