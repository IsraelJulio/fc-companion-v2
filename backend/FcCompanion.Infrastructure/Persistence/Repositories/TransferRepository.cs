using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FcCompanion.Infrastructure.Persistence.Repositories;

public class TransferRepository(AppDbContext context) : Repository<Transfer>(context), ITransferRepository
{
    public async Task<IEnumerable<Transfer>> GetBySaveIdAsync(Guid saveId, Guid? playerId, Guid? clubId, Guid? seasonId)
    {
        var query = _context.Transfers
            .Include(t => t.Player)
            .Include(t => t.Season)
            .Include(t => t.FromClub)
            .Include(t => t.ToClub)
            .Where(t => t.Player.SaveId == saveId);

        if (playerId.HasValue)
            query = query.Where(t => t.PlayerId == playerId.Value);
        if (clubId.HasValue)
            query = query.Where(t => t.FromClubId == clubId.Value || t.ToClubId == clubId.Value);
        if (seasonId.HasValue)
            query = query.Where(t => t.SeasonId == seasonId.Value);

        return await query.OrderByDescending(t => t.TransferDate).ToListAsync();
    }

    public async Task<Transfer?> GetWithDetailsAsync(Guid transferId)
        => await _context.Transfers
            .Include(t => t.Player)
            .Include(t => t.Season)
            .Include(t => t.FromClub)
            .Include(t => t.ToClub)
            .FirstOrDefaultAsync(t => t.Id == transferId);
}
