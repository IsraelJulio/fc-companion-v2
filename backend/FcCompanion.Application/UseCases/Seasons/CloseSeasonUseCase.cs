using AutoMapper;
using FcCompanion.Application.DTOs;
using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Common;
using FcCompanion.Domain.Entities;
using FcCompanion.Domain.Enums;

namespace FcCompanion.Application.UseCases.Seasons;

public class CloseSeasonUseCase(ISeasonRepository seasonRepository, IMapper mapper)
{
    public async Task<Result<CloseSeasonResponse>> ExecuteAsync(Guid saveId, CloseSeasonRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.NextSeasonName))
            return Result<CloseSeasonResponse>.Fail("Next season name is required.");

        var activeSeason = await seasonRepository.GetActiveSeasonBySaveIdAsync(saveId);
        if (activeSeason is null)
            return Result<CloseSeasonResponse>.Fail("No active season found for this save.");

        activeSeason.Status = SeasonStatus.Closed;
        activeSeason.EndedAt = DateOnly.FromDateTime(DateTime.UtcNow);
        await seasonRepository.UpdateAsync(activeSeason);

        var newSeason = new Season
        {
            SaveId = saveId,
            Name = request.NextSeasonName.Trim(),
            Status = SeasonStatus.Active,
            StartedAt = DateOnly.FromDateTime(DateTime.UtcNow)
        };
        await seasonRepository.AddAsync(newSeason);
        await seasonRepository.SaveChangesAsync();

        return Result<CloseSeasonResponse>.Ok(new CloseSeasonResponse(
            mapper.Map<SeasonDto>(activeSeason),
            mapper.Map<SeasonDto>(newSeason)));
    }
}
