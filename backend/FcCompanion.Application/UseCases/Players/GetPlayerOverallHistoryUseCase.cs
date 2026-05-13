using FcCompanion.Application.DTOs;
using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Common;

namespace FcCompanion.Application.UseCases.Players;

public class GetPlayerOverallHistoryUseCase(
    IPlayerRepository playerRepository,
    IPlayerOverallHistoryRepository playerOverallHistoryRepository)
{
    public async Task<Result<IEnumerable<OverallHistoryDto>>> ExecuteAsync(Guid saveId, Guid playerId)
    {
        var player = await playerRepository.GetByIdAsync(playerId);
        if (player is null || player.SaveId != saveId)
            return Result<IEnumerable<OverallHistoryDto>>.Fail("Player not found in this save.");

        var history = await playerOverallHistoryRepository.GetByPlayerIdAsync(playerId);

        return Result<IEnumerable<OverallHistoryDto>>.Ok(
            history.Select(item => new OverallHistoryDto(item.Season.Name, item.Overall)));
    }
}
