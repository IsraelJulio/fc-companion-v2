using AutoMapper;
using FcCompanion.Application.DTOs;
using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Common;

namespace FcCompanion.Application.UseCases.Saves;

public class GetAllSavesUseCase(ISaveRepository saveRepository, IMapper mapper)
{
    public async Task<Result<IEnumerable<SaveDto>>> ExecuteAsync()
    {
        var saves = await saveRepository.GetAllWithCurrentSeasonAsync();
        return Result<IEnumerable<SaveDto>>.Ok(mapper.Map<IEnumerable<SaveDto>>(saves));
    }
}
