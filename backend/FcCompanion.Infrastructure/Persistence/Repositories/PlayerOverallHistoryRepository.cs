using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FcCompanion.Infrastructure.Persistence.Repositories;

public class PlayerOverallHistoryRepository(AppDbContext context)
    : Repository<PlayerOverallHistory>(context), IPlayerOverallHistoryRepository
{
    public async Task<IEnumerable<PlayerOverallHistory>> GetBySeasonIdAsync(Guid seasonId)
        => await _dbSet
            .Where(h => h.SeasonId == seasonId)
            .ToListAsync();

    public async Task AddRangeAsync(IEnumerable<PlayerOverallHistory> entries)
        => await _dbSet.AddRangeAsync(entries);
}
