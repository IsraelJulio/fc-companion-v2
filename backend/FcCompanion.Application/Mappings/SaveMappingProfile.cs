using AutoMapper;
using FcCompanion.Application.DTOs;
using FcCompanion.Domain.Entities;

namespace FcCompanion.Application.Mappings;

public class SaveMappingProfile : Profile
{
    public SaveMappingProfile()
    {
        CreateMap<Season, SeasonDto>()
            .ConstructUsing(src => new SeasonDto(src.Id, src.Name, src.Status.ToString().ToLower()));

        CreateMap<Save, SaveDto>()
            .ConstructUsing((src, ctx) => new SaveDto(
                src.Id,
                src.Name,
                src.Seasons.Any() ? ctx.Mapper.Map<SeasonDto>(src.Seasons.First()) : null,
                src.CreatedAt));
    }
}
