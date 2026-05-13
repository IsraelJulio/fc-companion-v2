using FcCompanion.Application.DTOs;
using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Common;
using FcCompanion.Domain.Entities;

namespace FcCompanion.Application.UseCases.Titles;

public class CreateTitleUseCase(
    ITitleRepository titleRepository,
    IClubRepository clubRepository,
    ISeasonRepository seasonRepository)
{
    public async Task<Result<TitleDto>> ExecuteAsync(Guid saveId, Guid clubId, CreateTitleRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Competition))
            return Result<TitleDto>.Fail("Competition is required.");
        if (request.Year < 1800 || request.Year > 3000)
            return Result<TitleDto>.Fail("Year is invalid.");

        var club = await clubRepository.GetByIdAsync(clubId);
        if (club is null || club.SaveId != saveId)
            return Result<TitleDto>.Fail("Club not found in this save.");

        Season? season = null;
        if (request.SeasonId is not null)
        {
            season = await seasonRepository.GetByIdAsync(request.SeasonId.Value);
            if (season is null || season.SaveId != saveId)
                return Result<TitleDto>.Fail("Season not found in this save.");
        }

        var title = new Title
        {
            ClubId = clubId,
            SeasonId = request.SeasonId,
            Competition = request.Competition.Trim(),
            Year = request.Year,
            Source = "save"
        };

        await titleRepository.AddAsync(title);
        await titleRepository.SaveChangesAsync();

        return Result<TitleDto>.Ok(new TitleDto(title.Id, title.Competition, title.Year, title.Source, season?.Name));
    }
}
