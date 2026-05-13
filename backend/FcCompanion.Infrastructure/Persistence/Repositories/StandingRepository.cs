using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FcCompanion.Infrastructure.Persistence.Repositories;

public class StandingRepository(AppDbContext context) : Repository<Standing>(context), IStandingRepository
{
    public async Task<Standing?> GetWithClubAsync(Guid id)
        => await _dbSet
            .Include(s => s.Club)
            .FirstOrDefaultAsync(s => s.Id == id);

    public async Task<IEnumerable<Standing>> GetBySeasonAndLeagueAsync(Guid seasonId, string? league)
    {
        var query = _dbSet
            .Include(s => s.Club)
            .Include(s => s.Season)
            .Where(s => s.SeasonId == seasonId);

        if (!string.IsNullOrWhiteSpace(league))
            query = query.Where(s => s.League == league);

        return await query
            .OrderBy(s => s.Position)
            .ThenByDescending(s => s.Points)
            .ThenByDescending(s => s.GoalsFor - s.GoalsAgainst)
            .ThenByDescending(s => s.GoalsFor)
            .ThenBy(s => s.Club.Name)
            .ToListAsync();
    }
}
