using AutoMapper;
using FcCompanion.Application.DTOs;
using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Common;

namespace FcCompanion.Application.UseCases.Leagues;

public class GetTopAssistsByLeagueUseCase(
    IPlayerSeasonStatsRepository statsRepository,
    ISeasonRepository seasonRepository,
    IMapper mapper)
{
    public async Task<Result<IEnumerable<LeaguePlayerRankingDto>>> ExecuteAsync(
        Guid saveId, Guid? seasonId, string? league, int limit)
    {
        var targetSeasonId = seasonId;
        if (targetSeasonId is null)
        {
            var activeSeason = await seasonRepository.GetActiveSeasonBySaveIdAsync(saveId);
            if (activeSeason is null)
                return Result<IEnumerable<LeaguePlayerRankingDto>>.Fail("Active season not found.");

            targetSeasonId = activeSeason.Id;
        }
        else
        {
            var season = await seasonRepository.GetByIdAsync(targetSeasonId.Value);
            if (season is null || season.SaveId != saveId)
                return Result<IEnumerable<LeaguePlayerRankingDto>>.Fail("Season not found for this save.");
        }

        var stats = await statsRepository.GetTopAssistsBySeasonAndLeagueAsync(targetSeasonId.Value, league, limit);

        return Result<IEnumerable<LeaguePlayerRankingDto>>.Ok(
            stats.Select(s => new LeaguePlayerRankingDto(
                s.PlayerId,
                $"{s.Player.FirstName} {s.Player.LastName}",
                s.Player.Position,
                s.Player.Overall,
                mapper.Map<ClubSummaryDto>(s.Club),
                s.Assists)));
    }
}
