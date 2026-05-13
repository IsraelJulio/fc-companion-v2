export interface SeasonDto {
  id: string;
  name: string;
  status: 'active' | 'closed';
}

export interface SaveDto {
  id: string;
  name: string;
  currentSeason: SeasonDto | null;
  createdAt: string;
}

export interface ClubSummaryDto {
  id: string;
  name: string;
  logoUrl: string | null;
  league: string;
}

export interface PlayerListItemDto {
  id: string;
  fullName: string;
  position: string;
  overall: number;
  currentClub: ClubSummaryDto | null;
  photoUrl: string | null;
}

export interface PlayerSeasonStatsDto {
  id: string;
  seasonId: string;
  seasonName: string;
  clubId: string;
  clubName: string;
  goals: number;
  assists: number;
  appearances: number;
  minutesPlayed: number;
}

export interface PlayerDetailDto extends PlayerListItemDto {
  firstName: string;
  lastName: string;
  nationality: string | null;
  dateOfBirth: string | null;
  preferredFoot: string;
  marketValue: number | null;
  isCustom: boolean;
  seasonHistory: PlayerSeasonStatsDto[];
}

export interface ClubDetailDto extends ClubSummaryDto {
  shortName: string;
  country: string;
  squad: PlayerListItemDto[];
  titles: TitleDto[];
  seasonHistory: ClubSeasonHistoryDto[];
  topScorers: PlayerListItemDto[];
}

export interface ClubSeasonHistoryDto {
  seasonName: string;
  position: number | null;
  goals: number | null;
  assists: number | null;
}

export interface TransferDto {
  id: string;
  playerId: string;
  playerName: string;
  fromClub: ClubSummaryDto;
  toClub: ClubSummaryDto;
  seasonName: string;
  transferDate: string;
}

export interface TitleDto {
  id: string;
  competition: string;
  year: number;
  source: 'real' | 'save';
  seasonName: string | null;
}

export interface StandingDto {
  id: string;
  club: ClubSummaryDto;
  position: number;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface LeaguePlayerRankingDto {
  playerId: string;
  playerName: string;
  position: string;
  overall: number;
  club: ClubSummaryDto;
  value: number;
}

export interface TitleHistoryEntryDto {
  id: string;
  competition: string;
  year: number;
  source: 'real' | 'save';
  seasonName: string | null;
  club: ClubSummaryDto;
}

export interface DashboardSummaryDto {
  topScorer: PlayerListItemDto | null;
  topAssister: PlayerListItemDto | null;
  highestOverall: PlayerListItemDto | null;
  totalPlayers: number;
  totalClubs: number;
}

export interface OverallHistoryDto {
  seasonName: string;
  overall: number;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CloseSeasonRequest {
  nextSeasonName: string;
}

export interface CloseSeasonResponse {
  closedSeason: SeasonDto;
  newSeason: SeasonDto;
}
