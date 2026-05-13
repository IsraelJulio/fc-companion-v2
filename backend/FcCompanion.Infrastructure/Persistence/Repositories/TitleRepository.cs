using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FcCompanion.Infrastructure.Persistence.Repositories;

public class TitleRepository(AppDbContext context) : Repository<Title>(context), ITitleRepository
{
    public async Task<IEnumerable<Title>> GetByClubIdAsync(Guid clubId)
        => await _dbSet
            .Include(t => t.Season)
            .Include(t => t.Club)
            .Where(t => t.ClubId == clubId)
            .OrderByDescending(t => t.Year)
            .ToListAsync();

    public async Task<IEnumerable<Title>> GetBySaveIdAsync(Guid saveId, string? competition = null)
    {
        var query = _dbSet
            .Include(t => t.Season)
            .Include(t => t.Club)
            .Where(t => t.Club.SaveId == saveId);

        if (!string.IsNullOrWhiteSpace(competition))
            query = query.Where(t => t.Competition == competition);

        return await query
            .OrderBy(t => t.Competition)
            .ThenByDescending(t => t.Year)
            .ToListAsync();
    }
}
