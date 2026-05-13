using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FcCompanion.Infrastructure.Persistence.Repositories;

public class PlayerRepository(AppDbContext context) : Repository<Player>(context), IPlayerRepository
{
    public async Task<(IEnumerable<Player> Items, int Total)> GetPagedBySaveIdAsync(
        Guid saveId, string? search, string? position, Guid? clubId, string? league, int page, int pageSize)
    {
        var query = _context.Players
            .Include(p => p.CurrentClub)
            .Where(p => p.SaveId == saveId);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(p => (p.FirstName + " " + p.LastName).ToLower().Contains(search.ToLower()));

        if (!string.IsNullOrWhiteSpace(position))
            query = query.Where(p => p.Position == position);

        if (clubId.HasValue)
            query = query.Where(p => p.CurrentClubId == clubId.Value);

        if (!string.IsNullOrWhiteSpace(league))
            query = query.Where(p => p.CurrentClub.League == league);

        var total = await query.CountAsync();
        var items = await query
            .OrderBy(p => p.LastName)
            .ThenBy(p => p.FirstName)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, total);
    }

    public async Task<Player?> GetWithDetailsAsync(Guid playerId)
        => await _context.Players
            .Include(p => p.CurrentClub)
            .Include(p => p.SeasonStats)
                .ThenInclude(s => s.Season)
            .Include(p => p.SeasonStats)
                .ThenInclude(s => s.Club)
            .Include(p => p.OverallHistory)
            .FirstOrDefaultAsync(p => p.Id == playerId);
}
