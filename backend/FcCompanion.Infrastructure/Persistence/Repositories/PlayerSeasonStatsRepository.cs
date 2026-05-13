using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FcCompanion.Infrastructure.Persistence.Repositories;

public class PlayerSeasonStatsRepository(AppDbContext context) : Repository<PlayerSeasonStats>(context), IPlayerSeasonStatsRepository
{
    public async Task<PlayerSeasonStats?> GetByPlayerAndSeasonAsync(Guid playerId, Guid seasonId)
        => await _dbSet
            .Include(s => s.Season)
            .Include(s => s.Club)
            .FirstOrDefaultAsync(s => s.PlayerId == playerId && s.SeasonId == seasonId);

    public async Task<IEnumerable<PlayerSeasonStats>> GetByPlayerIdAsync(Guid playerId)
        => await _dbSet
            .Include(s => s.Season)
            .Include(s => s.Club)
            .Where(s => s.PlayerId == playerId)
            .OrderByDescending(s => s.Season.StartedAt)
            .ToListAsync();
}
