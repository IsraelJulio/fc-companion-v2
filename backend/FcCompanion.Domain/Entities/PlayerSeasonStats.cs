using FcCompanion.Domain.Common;

namespace FcCompanion.Domain.Entities;

public class PlayerSeasonStats : BaseEntity
{
    public Guid PlayerId { get; set; }
    public Guid SeasonId { get; set; }
    public Guid ClubId { get; set; }
    public int Goals { get; set; } = 0;
    public int Assists { get; set; } = 0;
    public int Appearances { get; set; } = 0;
    public int MinutesPlayed { get; set; } = 0;
    public Player Player { get; set; } = null!;
    public Season Season { get; set; } = null!;
    public Club Club { get; set; } = null!;
}
