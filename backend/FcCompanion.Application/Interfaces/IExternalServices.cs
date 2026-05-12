namespace FcCompanion.Application.Interfaces;

public interface IFootballApiService
{
    Task<IEnumerable<FootballApiTeam>> GetTeamsByLeagueAsync(int leagueId, int season = 2024);
    Task<IEnumerable<FootballApiPlayer>> GetSquadByTeamAsync(int teamId);
    Task<IEnumerable<FootballApiTrophy>> GetTrophiesByTeamAsync(int teamId);
}

public record FootballApiTeam(int Id, string Name, string ShortName, string Country, string? LogoUrl);
public record FootballApiPlayer(int Id, string Name, string Position, string? PhotoUrl, int? Age);
public record FootballApiTrophy(string League, string Country, string Season, string Place);
