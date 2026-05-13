using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Common;

namespace FcCompanion.Application.UseCases.Titles;

public class DeleteTitleUseCase(ITitleRepository titleRepository, IClubRepository clubRepository)
{
    public async Task<Result<bool>> ExecuteAsync(Guid saveId, Guid clubId, Guid titleId)
    {
        var club = await clubRepository.GetByIdAsync(clubId);
        if (club is null || club.SaveId != saveId)
            return Result<bool>.Fail("Club not found in this save.");

        var title = await titleRepository.GetByIdAsync(titleId);
        if (title is null || title.ClubId != clubId)
            return Result<bool>.Fail("Title not found for this club.");

        await titleRepository.DeleteAsync(title);
        await titleRepository.SaveChangesAsync();

        return Result<bool>.Ok(true);
    }
}
