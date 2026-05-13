export interface LeagueFilters {
  league: string;
  seasonId: string | null;
  competition: string;
}

export interface StandingEditForm {
  position: number;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
}
