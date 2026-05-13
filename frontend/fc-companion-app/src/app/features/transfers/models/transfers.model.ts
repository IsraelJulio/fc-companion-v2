export interface TransferFilters {
  playerSearch: string;
  clubId: string | null;
  seasonFilter: string;
}

export interface CreateTransferForm {
  playerId: string;
  toClubId: string;
  transferDate: string;
}
