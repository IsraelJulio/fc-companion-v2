using FcCompanion.Domain.Common;

namespace FcCompanion.Domain.Entities;

public class Player : BaseEntity
{
    public Guid SaveId { get; set; }
    public Guid CurrentClubId { get; set; }
    public int? ExternalId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Nationality { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string Position { get; set; } = string.Empty;
    public string PreferredFoot { get; set; } = "right";
    public int Overall { get; set; } = 75;
    public int? OverallBase { get; set; }
    public string? PhotoUrl { get; set; }
    public long? MarketValue { get; set; }
    public bool IsCustom { get; set; } = false;
    public Save Save { get; set; } = null!;
    public Club CurrentClub { get; set; } = null!;
    public ICollection<PlayerSeasonStats> SeasonStats { get; set; } = new List<PlayerSeasonStats>();
    public ICollection<PlayerOverallHistory> OverallHistory { get; set; } = new List<PlayerOverallHistory>();
    public ICollection<Transfer> Transfers { get; set; } = new List<Transfer>();
}
