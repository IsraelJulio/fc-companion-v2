using AutoMapper;
using FcCompanion.Application.DTOs;
using FcCompanion.Domain.Entities;

namespace FcCompanion.Application.Mappings;

public class PlayerMappingProfile : Profile
{
    public PlayerMappingProfile()
    {
        CreateMap<Club, ClubSummaryDto>()
            .ConstructUsing(src => new ClubSummaryDto(src.Id, src.Name, src.LogoUrl, src.League));

        CreateMap<PlayerSeasonStats, PlayerSeasonStatsDto>()
            .ConstructUsing(src => new PlayerSeasonStatsDto(
                src.Id, src.SeasonId, src.Season.Name, src.ClubId, src.Club.Name,
                src.Goals, src.Assists, src.Appearances, src.MinutesPlayed));

        CreateMap<Player, PlayerListItemDto>()
            .ConstructUsing((src, ctx) => new PlayerListItemDto(
                src.Id,
                $"{src.FirstName} {src.LastName}",
                src.Position,
                src.Overall,
                src.CurrentClub != null ? ctx.Mapper.Map<ClubSummaryDto>(src.CurrentClub) : null,
                src.PhotoUrl));

        CreateMap<Player, PlayerDetailDto>()
            .ConstructUsing((src, ctx) => new PlayerDetailDto(
                src.Id,
                src.FirstName,
                src.LastName,
                src.Nationality,
                src.DateOfBirth,
                src.Position,
                src.PreferredFoot,
                src.Overall,
                src.PhotoUrl,
                src.MarketValue,
                src.IsCustom,
                src.CurrentClub != null ? ctx.Mapper.Map<ClubSummaryDto>(src.CurrentClub) : null,
                ctx.Mapper.Map<IEnumerable<PlayerSeasonStatsDto>>(src.SeasonStats)));
    }
}
