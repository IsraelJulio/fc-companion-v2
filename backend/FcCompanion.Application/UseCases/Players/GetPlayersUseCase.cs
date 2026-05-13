using AutoMapper;
using FcCompanion.Application.DTOs;
using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Common;

namespace FcCompanion.Application.UseCases.Players;

public class GetPlayersUseCase(IPlayerRepository playerRepository, IMapper mapper)
{
    public async Task<Result<PagedResult<PlayerListItemDto>>> ExecuteAsync(
        Guid saveId, string? search, string? position, Guid? clubId, string? league, int page, int pageSize)
    {
        var (items, total) = await playerRepository.GetPagedBySaveIdAsync(
            saveId, search, position, clubId, league, page, pageSize);

        var dtos = mapper.Map<IEnumerable<PlayerListItemDto>>(items);
        return Result<PagedResult<PlayerListItemDto>>.Ok(
            new PagedResult<PlayerListItemDto>(dtos, total, page, pageSize));
    }
}
