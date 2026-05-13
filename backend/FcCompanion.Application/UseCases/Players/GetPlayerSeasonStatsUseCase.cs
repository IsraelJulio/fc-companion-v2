using AutoMapper;
using FcCompanion.Application.DTOs;
using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Common;

namespace FcCompanion.Application.UseCases.Players;

public class GetPlayerSeasonStatsUseCase(IPlayerSeasonStatsRepository statsRepository, IMapper mapper)
{
    public async Task<Result<IEnumerable<PlayerSeasonStatsDto>>> ExecuteAsync(Guid playerId)
    {
        var stats = await statsRepository.GetByPlayerIdAsync(playerId);
        return Result<IEnumerable<PlayerSeasonStatsDto>>.Ok(
            mapper.Map<IEnumerable<PlayerSeasonStatsDto>>(stats));
    }
}
