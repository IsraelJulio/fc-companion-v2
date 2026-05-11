using FcCompanion.Domain.Common;
using FcCompanion.Domain.Enums;

namespace FcCompanion.Domain.Entities;

public class Season : BaseEntity
{
    public Guid SaveId { get; set; }
    public string Name { get; set; } = string.Empty;
    public SeasonStatus Status { get; set; } = SeasonStatus.Active;
    public DateOnly StartedAt { get; set; }
    public DateOnly? EndedAt { get; set; }
    public Save Save { get; set; } = null!;
    public ICollection<PlayerSeasonStats> PlayerSeasonStats { get; set; } = new List<PlayerSeasonStats>();
    public ICollection<Standing> Standings { get; set; } = new List<Standing>();
}
