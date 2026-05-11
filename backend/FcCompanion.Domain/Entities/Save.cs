using FcCompanion.Domain.Common;

namespace FcCompanion.Domain.Entities;

public class Save : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public ICollection<Season> Seasons { get; set; } = new List<Season>();
    public ICollection<Club> Clubs { get; set; } = new List<Club>();
    public ICollection<Player> Players { get; set; } = new List<Player>();
}
