using AutoMapper;
using FcCompanion.Application.DTOs;
using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Common;

namespace FcCompanion.Application.UseCases.Standings;

public class GetStandingsUseCase(
    IStandingRepository standingRepository,
    ISeasonRepository seasonRepository,
    IMapper mapper)
{
    public async Task<Result<IEnumerable<StandingDto>>> ExecuteAsync(Guid saveId, Guid? seasonId, string? league)
    {
        var targetSeasonId = seasonId;
        if (targetSeasonId is null)
        {
            var activeSeason = await seasonRepository.GetActiveSeasonBySaveIdAsync(saveId);
            if (activeSeason is null)
                return Result<IEnumerable<StandingDto>>.Fail("Active season not found.");

            targetSeasonId = activeSeason.Id;
        }
        else
        {
            var season = await seasonRepository.GetByIdAsync(targetSeasonId.Value);
            if (season is null || season.SaveId != saveId)
                return Result<IEnumerable<StandingDto>>.Fail("Season not found for this save.");
        }

        var standings = await standingRepository.GetBySeasonAndLeagueAsync(targetSeasonId.Value, league);

        return Result<IEnumerable<StandingDto>>.Ok(
            standings.Select(s => new StandingDto(
                s.Id,
                mapper.Map<ClubSummaryDto>(s.Club),
                s.Position,
                s.Points,
                s.Wins,
                s.Draws,
                s.Losses,
                s.GoalsFor,
                s.GoalsAgainst)));
    }
}
