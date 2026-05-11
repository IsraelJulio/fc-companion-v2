using FcCompanion.Domain.Common;

namespace FcCompanion.Domain.Entities;

public class PlayerOverallHistory : BaseEntity
{
    public Guid PlayerId { get; set; }
    public Guid SeasonId { get; set; }
    public int Overall { get; set; }
    public Player Player { get; set; } = null!;
    public Season Season { get; set; } = null!;
}
