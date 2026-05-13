using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FcCompanion.Infrastructure.Persistence.Repositories;

public class SeedRepository(AppDbContext context) : ISeedRepository
{
    public async Task<Dictionary<int, Guid>> GetExistingClubMappingsAsync(Guid saveId)
        => await context.Clubs
            .Where(c => c.SaveId == saveId && c.ExternalId.HasValue)
            .ToDictionaryAsync(c => c.ExternalId!.Value, c => c.Id);

    public async Task<HashSet<int>> GetExistingPlayerExternalIdsAsync(Guid saveId)
    {
        var ids = await context.Players
            .Where(p => p.SaveId == saveId && p.ExternalId.HasValue)
            .Select(p => p.ExternalId!.Value)
            .ToListAsync();
        return [.. ids];
    }

    public async Task<HashSet<(Guid ClubId, string Competition, int Year)>> GetExistingTitleKeysAsync(Guid saveId)
    {
        var keys = await context.Titles
            .Where(t => t.Club.SaveId == saveId)
            .Select(t => new { t.ClubId, t.Competition, t.Year })
            .ToListAsync();
        return keys.Select(k => (k.ClubId, k.Competition, k.Year)).ToHashSet();
    }

    public async Task AddRangeAsync(
        IEnumerable<Club> clubs,
        IEnumerable<Player> players,
        IEnumerable<PlayerOverallHistory> histories,
        IEnumerable<PlayerSeasonStats> seasonStats,
        IEnumerable<Title> titles)
    {
        context.Clubs.AddRange(clubs);
        context.Players.AddRange(players);
        context.PlayerOverallHistories.AddRange(histories);
        context.PlayerSeasonStats.AddRange(seasonStats);
        context.Titles.AddRange(titles);
        await context.SaveChangesAsync();
    }
}
