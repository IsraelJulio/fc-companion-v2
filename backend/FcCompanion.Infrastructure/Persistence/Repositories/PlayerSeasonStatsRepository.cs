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

    public async Task<IEnumerable<PlayerSeasonStats>> GetTopScorersBySeasonAndLeagueAsync(Guid seasonId, string? league, int limit)
    {
        var query = _dbSet
            .Include(s => s.Player).ThenInclude(p => p.CurrentClub)
            .Include(s => s.Club)
            .Where(s => s.SeasonId == seasonId);

        if (!string.IsNullOrWhiteSpace(league))
            query = query.Where(s => s.Club.League == league);

        return await query
            .OrderByDescending(s => s.Goals)
            .ThenByDescending(s => s.Assists)
            .ThenByDescending(s => s.Appearances)
            .ThenBy(s => s.Player.LastName)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<IEnumerable<PlayerSeasonStats>> GetTopAssistsBySeasonAndLeagueAsync(Guid seasonId, string? league, int limit)
    {
        var query = _dbSet
            .Include(s => s.Player).ThenInclude(p => p.CurrentClub)
            .Include(s => s.Club)
            .Where(s => s.SeasonId == seasonId);

        if (!string.IsNullOrWhiteSpace(league))
            query = query.Where(s => s.Club.League == league);

        return await query
            .OrderByDescending(s => s.Assists)
            .ThenByDescending(s => s.Goals)
            .ThenByDescending(s => s.Appearances)
            .ThenBy(s => s.Player.LastName)
            .Take(limit)
            .ToListAsync();
    }
}
