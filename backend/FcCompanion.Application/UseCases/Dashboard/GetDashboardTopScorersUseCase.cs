using AutoMapper;
using FcCompanion.Application.DTOs;
using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Common;

namespace FcCompanion.Application.UseCases.Dashboard;

public class GetDashboardTopScorersUseCase(
    ISeasonRepository seasonRepository,
    IPlayerSeasonStatsRepository playerSeasonStatsRepository,
    IMapper mapper)
{
    public async Task<Result<IEnumerable<LeaguePlayerRankingDto>>> ExecuteAsync(Guid saveId, Guid? seasonId, int limit)
    {
        var targetSeasonId = seasonId;
        if (targetSeasonId is null)
        {
            var activeSeason = await seasonRepository.GetActiveSeasonBySaveIdAsync(saveId);
            if (activeSeason is null)
                return Result<IEnumerable<LeaguePlayerRankingDto>>.Fail("No active season found for this save.");

            targetSeasonId = activeSeason.Id;
        }
        else
        {
            var season = await seasonRepository.GetByIdAsync(targetSeasonId.Value);
            if (season is null || season.SaveId != saveId)
                return Result<IEnumerable<LeaguePlayerRankingDto>>.Fail("Season not found for this save.");
        }

        var stats = await playerSeasonStatsRepository.GetTopScorersBySeasonAndLeagueAsync(targetSeasonId.Value, null, limit);

        return Result<IEnumerable<LeaguePlayerRankingDto>>.Ok(
            stats.Select(s => new LeaguePlayerRankingDto(
                s.PlayerId,
                $"{s.Player.FirstName} {s.Player.LastName}",
                s.Player.Position,
                s.Player.Overall,
                mapper.Map<ClubSummaryDto>(s.Club),
                s.Goals)));
    }
}
