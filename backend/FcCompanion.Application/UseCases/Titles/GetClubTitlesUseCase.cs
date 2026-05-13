using FcCompanion.Application.DTOs;
using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Common;

namespace FcCompanion.Application.UseCases.Titles;

public class GetClubTitlesUseCase(ITitleRepository titleRepository, IClubRepository clubRepository)
{
    public async Task<Result<IEnumerable<TitleDto>>> ExecuteAsync(Guid saveId, Guid clubId)
    {
        var club = await clubRepository.GetByIdAsync(clubId);
        if (club is null || club.SaveId != saveId)
            return Result<IEnumerable<TitleDto>>.Fail("Club not found in this save.");

        var titles = await titleRepository.GetByClubIdAsync(clubId);
        return Result<IEnumerable<TitleDto>>.Ok(
            titles.Select(t => new TitleDto(t.Id, t.Competition, t.Year, t.Source, t.Season?.Name)));
    }
}
