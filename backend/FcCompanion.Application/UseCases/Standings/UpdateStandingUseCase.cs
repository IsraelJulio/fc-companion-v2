using AutoMapper;
using FcCompanion.Application.DTOs;
using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Common;

namespace FcCompanion.Application.UseCases.Standings;

public class UpdateStandingUseCase(IStandingRepository standingRepository, IMapper mapper)
{
    public async Task<Result<StandingDto>> ExecuteAsync(Guid saveId, Guid standingId, UpdateStandingRequest request)
    {
        var standing = await standingRepository.GetWithClubAsync(standingId);
        if (standing is null)
            return Result<StandingDto>.Fail("Standing not found.");
        if (standing.Club.SaveId != saveId)
            return Result<StandingDto>.Fail("Standing not found for this save.");

        standing.Position = request.Position;
        standing.Points = request.Points;
        standing.Wins = request.Wins;
        standing.Draws = request.Draws;
        standing.Losses = request.Losses;
        standing.GoalsFor = request.GoalsFor;
        standing.GoalsAgainst = request.GoalsAgainst;

        await standingRepository.UpdateAsync(standing);
        await standingRepository.SaveChangesAsync();

        var updated = await standingRepository.GetWithClubAsync(standingId);
        return Result<StandingDto>.Ok(new StandingDto(
            updated!.Id,
            mapper.Map<ClubSummaryDto>(updated.Club),
            updated.Position,
            updated.Points,
            updated.Wins,
            updated.Draws,
            updated.Losses,
            updated.GoalsFor,
            updated.GoalsAgainst));
    }
}
