using FcCompanion.Domain.Entities;

namespace FcCompanion.Application.Interfaces;

public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(Guid id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(T entity);
    Task SaveChangesAsync();
}

public interface ISaveRepository : IRepository<Save>
{
    Task<IEnumerable<Save>> GetAllWithCurrentSeasonAsync();
}

public interface ISeasonRepository : IRepository<Season>
{
    Task<Season?> GetActiveSeasonBySaveIdAsync(Guid saveId);
    Task<IEnumerable<Season>> GetAllBySaveIdAsync(Guid saveId);
}

public interface IClubRepository : IRepository<Club>
{
    Task<IEnumerable<Club>> GetBySaveIdAsync(Guid saveId, string? league = null);
    Task<Club?> GetWithDetailsAsync(Guid clubId);
}

public interface IPlayerRepository : IRepository<Player>
{
    Task<(IEnumerable<Player> Items, int Total)> GetPagedBySaveIdAsync(
        Guid saveId, string? search, string? position, Guid? clubId, string? league, int page, int pageSize);
    Task<Player?> GetWithDetailsAsync(Guid playerId);
}

public interface IPlayerSeasonStatsRepository : IRepository<PlayerSeasonStats>
{
    Task<PlayerSeasonStats?> GetByPlayerAndSeasonAsync(Guid playerId, Guid seasonId);
    Task<IEnumerable<PlayerSeasonStats>> GetByPlayerIdAsync(Guid playerId);
}

public interface ITransferRepository : IRepository<Transfer>
{
    Task<IEnumerable<Transfer>> GetBySaveIdAsync(Guid saveId, Guid? playerId, Guid? clubId, Guid? seasonId);
}

public interface ITitleRepository : IRepository<Title>
{
    Task<IEnumerable<Title>> GetByClubIdAsync(Guid clubId);
}

public interface IStandingRepository : IRepository<Standing>
{
    Task<IEnumerable<Standing>> GetBySeasonAndLeagueAsync(Guid seasonId, string? league);
}

public interface ISeedRepository
{
    Task<Dictionary<int, Guid>> GetExistingClubMappingsAsync(Guid saveId);
    Task<HashSet<int>> GetExistingPlayerExternalIdsAsync(Guid saveId);
    Task<HashSet<(Guid ClubId, string Competition, int Year)>> GetExistingTitleKeysAsync(Guid saveId);
    Task AddRangeAsync(
        IEnumerable<Club> clubs,
        IEnumerable<Player> players,
        IEnumerable<PlayerOverallHistory> histories,
        IEnumerable<Title> titles);
}
