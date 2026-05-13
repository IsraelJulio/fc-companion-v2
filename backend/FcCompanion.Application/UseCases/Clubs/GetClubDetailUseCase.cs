using AutoMapper;
using FcCompanion.Application.DTOs;
using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Common;

namespace FcCompanion.Application.UseCases.Clubs;

public class GetClubDetailUseCase(IClubRepository clubRepository, IMapper mapper)
{
    public async Task<Result<ClubDetailDto>> ExecuteAsync(Guid clubId)
    {
        var club = await clubRepository.GetWithDetailsAsync(clubId);
        if (club is null)
            return Result<ClubDetailDto>.Fail("Club not found.");

        var topScorers = await clubRepository.GetTopScorersByClubIdAsync(clubId, 5);

        var dto = new ClubDetailDto(
            club.Id,
            club.Name,
            club.ShortName,
            club.League,
            club.Country,
            club.LogoUrl,
            Squad: mapper.Map<IEnumerable<PlayerListItemDto>>(club.Players),
            Titles: club.Titles
                .OrderByDescending(t => t.Year)
                .Select(t => new TitleDto(t.Id, t.Competition, t.Year, t.Source, t.Season?.Name)),
            SeasonHistory: club.Standings
                .OrderByDescending(s => s.Season.StartedAt)
                .Select(s => new ClubSeasonHistoryDto(s.Season.Name, s.Position, s.GoalsFor, null)),
            TopScorers: topScorers.Select(x => mapper.Map<PlayerListItemDto>(x.Player))
        );

        return Result<ClubDetailDto>.Ok(dto);
    }
}
