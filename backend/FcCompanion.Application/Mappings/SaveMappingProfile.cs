using AutoMapper;
using FcCompanion.Application.DTOs;
using FcCompanion.Domain.Entities;

namespace FcCompanion.Application.Mappings;

public class SaveMappingProfile : Profile
{
    public SaveMappingProfile()
    {
        CreateMap<Season, SeasonDto>()
            .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString().ToLower()));

        CreateMap<Save, SaveDto>()
            .ForMember(d => d.CurrentSeason, o => o.MapFrom(s => s.Seasons.FirstOrDefault()));
    }
}
