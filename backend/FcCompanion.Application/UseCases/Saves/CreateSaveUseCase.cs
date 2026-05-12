using AutoMapper;
using FcCompanion.Application.DTOs;
using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Common;
using FcCompanion.Domain.Entities;
using FcCompanion.Domain.Enums;

namespace FcCompanion.Application.UseCases.Saves;

public class CreateSaveUseCase(ISaveRepository saveRepository, IMapper mapper)
{
    public async Task<Result<SaveDto>> ExecuteAsync(CreateSaveRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return Result<SaveDto>.Fail("Name is required.");
        if (string.IsNullOrWhiteSpace(request.FirstSeasonName))
            return Result<SaveDto>.Fail("Season name is required.");

        var season = new Season
        {
            Name = request.FirstSeasonName.Trim(),
            Status = SeasonStatus.Active,
            StartedAt = DateOnly.FromDateTime(DateTime.UtcNow)
        };

        var save = new Save { Name = request.Name.Trim() };
        save.Seasons.Add(season);

        await saveRepository.AddAsync(save);
        await saveRepository.SaveChangesAsync();

        return Result<SaveDto>.Ok(mapper.Map<SaveDto>(save));
    }
}
