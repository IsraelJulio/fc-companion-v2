using AutoMapper;
using FcCompanion.Application.DTOs;
using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Common;

namespace FcCompanion.Application.UseCases.Clubs;

public class GetClubsUseCase(IClubRepository clubRepository, IMapper mapper)
{
    public async Task<Result<IEnumerable<ClubSummaryDto>>> ExecuteAsync(Guid saveId, string? league)
    {
        var clubs = await clubRepository.GetBySaveIdAsync(saveId, league);
        return Result<IEnumerable<ClubSummaryDto>>.Ok(mapper.Map<IEnumerable<ClubSummaryDto>>(clubs));
    }
}
