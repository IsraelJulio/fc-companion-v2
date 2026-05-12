using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Entities;
using FcCompanion.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace FcCompanion.Infrastructure.Persistence.Repositories;

public class SeasonRepository(AppDbContext context) : Repository<Season>(context), ISeasonRepository
{
    public async Task<Season?> GetActiveSeasonBySaveIdAsync(Guid saveId)
        => await _context.Seasons
            .FirstOrDefaultAsync(s => s.SaveId == saveId && s.Status == SeasonStatus.Active);

    public async Task<IEnumerable<Season>> GetAllBySaveIdAsync(Guid saveId)
        => await _context.Seasons
            .Where(s => s.SaveId == saveId)
            .OrderByDescending(s => s.StartedAt)
            .ToListAsync();
}
