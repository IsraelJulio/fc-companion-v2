using AutoMapper;
using FcCompanion.Application.DTOs;
using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Common;

namespace FcCompanion.Application.UseCases.Dashboard;

public class GetDashboardTitleHistoryUseCase(ITitleRepository titleRepository, IMapper mapper)
{
    public async Task<Result<IEnumerable<TitleHistoryEntryDto>>> ExecuteAsync(Guid saveId)
    {
        var titles = await titleRepository.GetBySaveIdAsync(saveId);

        return Result<IEnumerable<TitleHistoryEntryDto>>.Ok(
            titles
                .OrderByDescending(t => t.Year)
                .ThenBy(t => t.Competition)
                .Select(t => new TitleHistoryEntryDto(
                    t.Id,
                    t.Competition,
                    t.Year,
                    t.Source,
                    t.Season?.Name,
                    mapper.Map<ClubSummaryDto>(t.Club))));
    }
}
