using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FcCompanion.Infrastructure.Persistence.Repositories;

public class ClubRepository(AppDbContext context) : Repository<Club>(context), IClubRepository
{
    public async Task<IEnumerable<Club>> GetBySaveIdAsync(Guid saveId, string? league = null)
    {
        var query = _context.Clubs.Where(c => c.SaveId == saveId);
        if (!string.IsNullOrWhiteSpace(league))
            query = query.Where(c => c.League == league);
        return await query.OrderBy(c => c.Name).ToListAsync();
    }

    public async Task<Club?> GetWithDetailsAsync(Guid clubId)
        => await _context.Clubs
            .Include(c => c.Players).ThenInclude(p => p.CurrentClub)
            .Include(c => c.Titles).ThenInclude(t => t.Season)
            .Include(c => c.Standings).ThenInclude(s => s.Season)
            .FirstOrDefaultAsync(c => c.Id == clubId);

    public async Task<IEnumerable<(Player Player, int TotalGoals)>> GetTopScorersByClubIdAsync(Guid clubId, int limit)
    {
        var stats = await _context.PlayerSeasonStats
            .Include(s => s.Player).ThenInclude(p => p.CurrentClub)
            .Where(s => s.ClubId == clubId)
            .ToListAsync();

        return stats
            .GroupBy(s => s.Player)
            .Select(g => (Player: g.Key, TotalGoals: g.Sum(s => s.Goals)))
            .OrderByDescending(x => x.TotalGoals)
            .Take(limit);
    }
}
