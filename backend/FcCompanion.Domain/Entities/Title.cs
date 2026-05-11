using FcCompanion.Domain.Common;

namespace FcCompanion.Domain.Entities;

public class Title : BaseEntity
{
    public Guid ClubId { get; set; }
    public Guid? SeasonId { get; set; }
    public string Competition { get; set; } = string.Empty;
    public int Year { get; set; }
    public string Source { get; set; } = "save"; // real ou save
    public Club Club { get; set; } = null!;
    public Season? Season { get; set; }
}
