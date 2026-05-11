namespace FcCompanion.Application.Interfaces;

public interface IFootballApiService
{
    Task<IEnumerable<FootballApiTeam>> GetTeamsByLeagueAsync(int leagueId, int season = 2024);
    Task<IEnumerable<FootballApiPlayer>> GetSquadByTeamAsync(int teamId);
    Task<IEnumerable<FootballApiTrophy>> GetTrophiesByTeamAsync(int teamId);
}

public interface IFutDbService
{
    Task<int?> GetOverallByNameAsync(string playerName);
}

public interface ISeedService
{
    Task<string> StartSeedAsync(Guid saveId, IEnumerable<int> leagueIds);
    Task<SeedStatus> GetSeedStatusAsync(string jobId);
}

public record FootballApiTeam(int Id, string Name, string ShortName, string Country, string? LogoUrl);
public record FootballApiPlayer(int Id, string Name, string Position, string? PhotoUrl, int? Age);
public record FootballApiTrophy(string League, string Country, string Season, string Place);
public record SeedStatus(string JobId, string Status, int Progress, string CurrentStep);
