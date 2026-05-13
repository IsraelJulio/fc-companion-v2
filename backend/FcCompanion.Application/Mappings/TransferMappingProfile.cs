using AutoMapper;
using FcCompanion.Application.DTOs;
using FcCompanion.Domain.Entities;

namespace FcCompanion.Application.Mappings;

public class TransferMappingProfile : Profile
{
    public TransferMappingProfile()
    {
        CreateMap<Transfer, TransferDto>()
            .ConstructUsing((src, ctx) => new TransferDto(
                src.Id,
                src.PlayerId,
                $"{src.Player.FirstName} {src.Player.LastName}",
                ctx.Mapper.Map<ClubSummaryDto>(src.FromClub),
                ctx.Mapper.Map<ClubSummaryDto>(src.ToClub),
                src.Season.Name,
                src.TransferDate));
    }
}
