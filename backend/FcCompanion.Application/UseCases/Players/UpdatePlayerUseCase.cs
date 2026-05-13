using AutoMapper;
using FcCompanion.Application.DTOs;
using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Common;

namespace FcCompanion.Application.UseCases.Players;

public class UpdatePlayerUseCase(IPlayerRepository playerRepository, IMapper mapper)
{
    public async Task<Result<PlayerDetailDto>> ExecuteAsync(Guid playerId, UpdatePlayerRequest request)
    {
        var player = await playerRepository.GetWithDetailsAsync(playerId);
        if (player is null)
            return Result<PlayerDetailDto>.Fail("Player not found.");

        if (request.FirstName is not null) player.FirstName = request.FirstName.Trim();
        if (request.LastName is not null) player.LastName = request.LastName.Trim();
        if (request.Position is not null) player.Position = request.Position;
        if (request.Overall.HasValue) player.Overall = request.Overall.Value;
        if (request.MarketValue.HasValue) player.MarketValue = request.MarketValue.Value;
        if (request.PreferredFoot is not null) player.PreferredFoot = request.PreferredFoot;

        await playerRepository.UpdateAsync(player);
        await playerRepository.SaveChangesAsync();

        return Result<PlayerDetailDto>.Ok(mapper.Map<PlayerDetailDto>(player));
    }
}
