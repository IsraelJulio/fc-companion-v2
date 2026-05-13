using AutoMapper;
using FcCompanion.Application.DTOs;
using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Common;

namespace FcCompanion.Application.UseCases.Players;

public class UpdatePlayerSeasonStatsUseCase(IPlayerSeasonStatsRepository statsRepository, IMapper mapper)
{
    public async Task<Result<PlayerSeasonStatsDto>> ExecuteAsync(
        Guid playerId, Guid seasonId, UpdatePlayerSeasonStatsRequest request)
    {
        var stats = await statsRepository.GetByPlayerAndSeasonAsync(playerId, seasonId);
        if (stats is null)
            return Result<PlayerSeasonStatsDto>.Fail("Season stats not found.");

        stats.Goals = request.Goals;
        stats.Assists = request.Assists;
        stats.Appearances = request.Appearances;
        stats.MinutesPlayed = request.MinutesPlayed;

        await statsRepository.UpdateAsync(stats);
        await statsRepository.SaveChangesAsync();

        return Result<PlayerSeasonStatsDto>.Ok(mapper.Map<PlayerSeasonStatsDto>(stats));
    }
}
