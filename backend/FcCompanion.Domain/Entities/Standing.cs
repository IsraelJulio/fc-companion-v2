using FcCompanion.Domain.Common;

namespace FcCompanion.Domain.Entities;

public class Standing : BaseEntity
{
    public Guid ClubId { get; set; }
    public Guid SeasonId { get; set; }
    public string League { get; set; } = string.Empty;
    public int Position { get; set; }
    public int Points { get; set; }
    public int Wins { get; set; }
    public int Draws { get; set; }
    public int Losses { get; set; }
    public int GoalsFor { get; set; }
    public int GoalsAgainst { get; set; }
    public Club Club { get; set; } = null!;
    public Season Season { get; set; } = null!;
}
