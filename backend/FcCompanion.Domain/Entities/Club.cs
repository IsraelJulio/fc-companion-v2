using FcCompanion.Domain.Common;

namespace FcCompanion.Domain.Entities;

public class Club : BaseEntity
{
    public Guid SaveId { get; set; }
    public int? ExternalId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ShortName { get; set; } = string.Empty;
    public string League { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
    public Save Save { get; set; } = null!;
    public ICollection<Player> Players { get; set; } = new List<Player>();
    public ICollection<Title> Titles { get; set; } = new List<Title>();
    public ICollection<Standing> Standings { get; set; } = new List<Standing>();
}
