using FcCompanion.Domain.Common;

namespace FcCompanion.Domain.Entities;

public class Transfer : BaseEntity
{
    public Guid PlayerId { get; set; }
    public Guid SeasonId { get; set; }
    public Guid FromClubId { get; set; }
    public Guid ToClubId { get; set; }
    public DateOnly TransferDate { get; set; }
    public Player Player { get; set; } = null!;
    public Season Season { get; set; } = null!;
    public Club FromClub { get; set; } = null!;
    public Club ToClub { get; set; } = null!;
}
