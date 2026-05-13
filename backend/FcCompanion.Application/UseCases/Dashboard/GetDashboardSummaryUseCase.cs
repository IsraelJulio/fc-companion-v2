using AutoMapper;
using FcCompanion.Application.DTOs;
using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Common;

namespace FcCompanion.Application.UseCases.Dashboard;

public class GetDashboardSummaryUseCase(
    ISeasonRepository seasonRepository,
    IPlayerRepository playerRepository,
    IClubRepository clubRepository,
    IPlayerSeasonStatsRepository playerSeasonStatsRepository,
    IMapper mapper)
{
    public async Task<Result<DashboardSummaryDto>> ExecuteAsync(Guid saveId)
    {
        var players = (await playerRepository.GetBySaveIdAsync(saveId)).ToList();
        var clubs = (await clubRepository.GetBySaveIdAsync(saveId)).ToList();
        var activeSeason = await seasonRepository.GetActiveSeasonBySaveIdAsync(saveId);

        PlayerListItemDto? topScorer = null;
        PlayerListItemDto? topAssister = null;

        if (activeSeason is not null)
        {
            var topScorerStats = (await playerSeasonStatsRepository.GetTopScorersBySeasonAndLeagueAsync(activeSeason.Id, null, 1)).FirstOrDefault();
            var topAssisterStats = (await playerSeasonStatsRepository.GetTopAssistsBySeasonAndLeagueAsync(activeSeason.Id, null, 1)).FirstOrDefault();

            topScorer = topScorerStats is not null ? mapper.Map<PlayerListItemDto>(topScorerStats.Player) : null;
            topAssister = topAssisterStats is not null ? mapper.Map<PlayerListItemDto>(topAssisterStats.Player) : null;
        }

        var highestOverall = players
            .OrderByDescending(p => p.Overall)
            .ThenBy(p => p.LastName)
            .ThenBy(p => p.FirstName)
            .FirstOrDefault();

        return Result<DashboardSummaryDto>.Ok(new DashboardSummaryDto(
            topScorer,
            topAssister,
            highestOverall is not null ? mapper.Map<PlayerListItemDto>(highestOverall) : null,
            players.Count,
            clubs.Count));
    }
}
