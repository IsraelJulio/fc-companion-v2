using AutoMapper;
using FcCompanion.Application.DTOs;
using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Common;

namespace FcCompanion.Application.UseCases.Seasons;

public class GetSeasonsUseCase(ISeasonRepository seasonRepository, IMapper mapper)
{
    public async Task<Result<IEnumerable<SeasonDto>>> ExecuteAsync(Guid saveId)
    {
        var seasons = await seasonRepository.GetAllBySaveIdAsync(saveId);
        return Result<IEnumerable<SeasonDto>>.Ok(mapper.Map<IEnumerable<SeasonDto>>(seasons));
    }
}
