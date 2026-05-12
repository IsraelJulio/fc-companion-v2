export interface CreateSaveFormState {
  name: string;
  firstSeasonName: string;
}

export interface LeagueOption {
  id: number;
  name: string;
  country: string;
  abbr: string;
}

export interface SeedResponseDto {
  clubsImported: number;
  playersImported: number;
  titlesImported: number;
}
