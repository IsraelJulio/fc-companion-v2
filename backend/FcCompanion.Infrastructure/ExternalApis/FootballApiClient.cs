using System.Net.Http.Json;
using FcCompanion.Application.Interfaces;

namespace FcCompanion.Infrastructure.ExternalApis;

public class FootballApiClient(HttpClient httpClient) : IFootballApiService
{
    public async Task<IEnumerable<FootballApiTeam>> GetTeamsByLeagueAsync(int leagueId, int season = 2024)
    {
        var response = await httpClient.GetFromJsonAsync<ApiResponse<TeamEntry>>(
            $"teams?league={leagueId}&season={season}");

        return response?.Response?.Select(e => new FootballApiTeam(
            e.Team.Id,
            e.Team.Name,
            string.IsNullOrWhiteSpace(e.Team.Code) ? e.Team.Name[..Math.Min(3, e.Team.Name.Length)] : e.Team.Code,
            e.Team.Country,
            e.Team.Logo))
            ?? [];
    }

    public async Task<IEnumerable<FootballApiPlayer>> GetSquadByTeamAsync(int teamId)
    {
        var response = await httpClient.GetFromJsonAsync<ApiResponse<SquadEntry>>(
            $"players/squads?team={teamId}");

        return response?.Response?.SelectMany(e => e.Players.Select(p =>
            new FootballApiPlayer(p.Id, p.Name, p.Position ?? string.Empty, p.Photo, p.Age)))
            ?? [];
    }

    public async Task<IEnumerable<FootballApiTrophy>> GetTrophiesByTeamAsync(int teamId)
    {
        var response = await httpClient.GetFromJsonAsync<ApiResponse<FootballApiTrophy>>(
            $"trophies?team={teamId}");

        return response?.Response ?? [];
    }

    // Internal deserialization records
    private sealed record ApiResponse<T>(T[]? Response);
    private sealed record TeamEntry(TeamData Team);
    private sealed record TeamData(int Id, string Name, string? Code, string Country, string? Logo);
    private sealed record SquadEntry(TeamData Team, PlayerData[] Players);
    private sealed record PlayerData(int Id, string Name, int Age, string? Position, string? Photo);
}
