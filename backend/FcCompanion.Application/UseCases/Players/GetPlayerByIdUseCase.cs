using AutoMapper;
using FcCompanion.Application.DTOs;
using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Common;

namespace FcCompanion.Application.UseCases.Players;

public class GetPlayerByIdUseCase(IPlayerRepository playerRepository, IMapper mapper)
{
    public async Task<Result<PlayerDetailDto>> ExecuteAsync(Guid playerId)
    {
        var player = await playerRepository.GetWithDetailsAsync(playerId);
        if (player is null)
            return Result<PlayerDetailDto>.Fail("Player not found.");

        return Result<PlayerDetailDto>.Ok(mapper.Map<PlayerDetailDto>(player));
    }
}
