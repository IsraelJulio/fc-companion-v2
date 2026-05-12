using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Entities;
using FcCompanion.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace FcCompanion.Infrastructure.Persistence.Repositories;

public class SaveRepository(AppDbContext context) : Repository<Save>(context), ISaveRepository
{
    public async Task<IEnumerable<Save>> GetAllWithCurrentSeasonAsync()
        => await _context.Saves
            .Include(s => s.Seasons.Where(se => se.Status == SeasonStatus.Active))
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();
}
