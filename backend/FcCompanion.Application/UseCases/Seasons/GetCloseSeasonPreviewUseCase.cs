using FcCompanion.Application.DTOs;
using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Common;

namespace FcCompanion.Application.UseCases.Seasons;

public class GetCloseSeasonPreviewUseCase(
    ISeasonRepository seasonRepository,
    IPlayerRepository playerRepository,
    IClubRepository clubRepository,
    ITitleRepository titleRepository,
    ITransferRepository transferRepository,
    IStandingRepository standingRepository,
    IPlayerSeasonStatsRepository playerSeasonStatsRepository)
{
    public async Task<Result<CloseSeasonPreviewDto>> ExecuteAsync(Guid saveId)
    {
        var activeSeason = await seasonRepository.GetActiveSeasonBySaveIdAsync(saveId);
        if (activeSeason is null)
            return Result<CloseSeasonPreviewDto>.Fail("No active season found for this save.");

        var players = await playerRepository.GetBySaveIdAsync(saveId);
        var clubs = await clubRepository.GetBySaveIdAsync(saveId);
        var titles = await titleRepository.GetBySaveIdAsync(saveId);
        var transfers = await transferRepository.GetBySaveIdAsync(saveId, null, null, null);
        var standings = await standingRepository.GetBySeasonAndLeagueAsync(activeSeason.Id, null);
        var seasonStats = await playerSeasonStatsRepository.GetBySeasonIdAsync(activeSeason.Id);

        return Result<CloseSeasonPreviewDto>.Ok(new CloseSeasonPreviewDto(
            CurrentSeasonName: activeSeason.Name,
            PlayersCount: players.Count(),
            ClubsCount: clubs.Count(),
            TitlesCount: titles.Count(),
            TransfersCount: transfers.Count(),
            StandingsCount: standings.Count(),
            SeasonStatsToReset: seasonStats.Count(),
            OverallSnapshotsToSave: players.Count()));
    }
}
