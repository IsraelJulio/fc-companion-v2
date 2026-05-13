using AutoMapper;
using FcCompanion.Application.DTOs;
using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Common;

namespace FcCompanion.Application.UseCases.Leagues;

public class GetChampionsHistoryUseCase(ITitleRepository titleRepository, IMapper mapper)
{
    public async Task<Result<IEnumerable<TitleHistoryEntryDto>>> ExecuteAsync(Guid saveId, string? competition)
    {
        var titles = await titleRepository.GetBySaveIdAsync(saveId, competition);

        return Result<IEnumerable<TitleHistoryEntryDto>>.Ok(
            titles
                .OrderBy(t => t.Competition)
                .ThenByDescending(t => t.Year)
                .Select(t => new TitleHistoryEntryDto(
                    t.Id,
                    t.Competition,
                    t.Year,
                    t.Source,
                    t.Season?.Name,
                    mapper.Map<ClubSummaryDto>(t.Club))));
    }
}
