using FcCompanion.Application.DTOs;
using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Common;
using FcCompanion.Domain.Entities;

namespace FcCompanion.Application.UseCases.Seed;

public class SeedSaveUseCase(
    IFootballApiService footballApi,
    ISeasonRepository seasonRepository,
    ISeedRepository seedRepository)
{
    private static readonly Dictionary<int, (string Name, string Country)> LeagueMap = new()
    {
        [39]  = ("Premier League", "England"),
        [140] = ("La Liga", "Spain"),
        [135] = ("Serie A", "Italy"),
        [78]  = ("Bundesliga", "Germany"),
        [61]  = ("Ligue 1", "France"),
        [2]   = ("Champions League", "Europe"),
    };

    public async Task<Result<SeedResultDto>> ExecuteAsync(Guid saveId, SeedRequest request)
    {
        var leagueIds = request.LeagueIds.ToList();
        if (leagueIds.Count == 0)
            return Result<SeedResultDto>.Fail("At least one league must be selected.");

        var activeSeason = await seasonRepository.GetActiveSeasonBySaveIdAsync(saveId);
        if (activeSeason is null)
            return Result<SeedResultDto>.Fail("No active season found for this save.");

        var clubMappings  = await seedRepository.GetExistingClubMappingsAsync(saveId);
        var existingPlayers = await seedRepository.GetExistingPlayerExternalIdsAsync(saveId);
        var existingTitles  = await seedRepository.GetExistingTitleKeysAsync(saveId);

        var newClubs    = new List<Club>();
        var newPlayers  = new List<Player>();
        var newHistories = new List<PlayerOverallHistory>();
        var newTitles   = new List<Title>();

        foreach (var leagueId in leagueIds)
        {
            if (!LeagueMap.TryGetValue(leagueId, out var leagueInfo))
                continue;

            IEnumerable<FootballApiTeam> teams;
            try { teams = await footballApi.GetTeamsByLeagueAsync(leagueId); }
            catch { continue; }

            foreach (var apiTeam in teams)
            {
                // Resolve or create club
                if (!clubMappings.TryGetValue(apiTeam.Id, out var clubId))
                {
                    var club = new Club
                    {
                        SaveId    = saveId,
                        ExternalId = apiTeam.Id,
                        Name      = apiTeam.Name,
                        ShortName = apiTeam.ShortName,
                        League    = leagueInfo.Name,
                        Country   = apiTeam.Country,
                        LogoUrl   = apiTeam.LogoUrl,
                    };
                    newClubs.Add(club);
                    clubMappings[apiTeam.Id] = club.Id;
                    clubId = club.Id;
                }

                // Squad
                IEnumerable<FootballApiPlayer> squad;
                try { squad = await footballApi.GetSquadByTeamAsync(apiTeam.Id); }
                catch { squad = []; }

                foreach (var apiPlayer in squad)
                {
                    if (existingPlayers.Contains(apiPlayer.Id)) continue;

                    var parts = apiPlayer.Name.Split(' ', 2);
                    var player = new Player
                    {
                        SaveId        = saveId,
                        ExternalId    = apiPlayer.Id,
                        CurrentClubId = clubId,
                        FirstName     = parts.Length > 1 ? parts[0] : string.Empty,
                        LastName      = parts.Length > 1 ? parts[1] : parts[0],
                        Position      = MapPosition(apiPlayer.Position),
                        PhotoUrl      = apiPlayer.PhotoUrl,
                        Overall       = 75,
                    };
                    newPlayers.Add(player);
                    newHistories.Add(new PlayerOverallHistory
                    {
                        PlayerId = player.Id,
                        SeasonId = activeSeason.Id,
                        Overall  = 75,
                    });
                    existingPlayers.Add(apiPlayer.Id);
                }

                // Trophies
                IEnumerable<FootballApiTrophy> trophies;
                try { trophies = await footballApi.GetTrophiesByTeamAsync(apiTeam.Id); }
                catch { trophies = []; }

                foreach (var trophy in trophies.Where(t => t.Place == "Winner"))
                {
                    var year = ExtractYear(trophy.Season);
                    if (year is null) continue;

                    var key = (clubId, trophy.League, year.Value);
                    if (existingTitles.Contains(key)) continue;

                    newTitles.Add(new Title
                    {
                        ClubId      = clubId,
                        Competition = trophy.League,
                        Year        = year.Value,
                        Source      = "real",
                    });
                    existingTitles.Add(key);
                }
            }
        }

        await seedRepository.AddRangeAsync(newClubs, newPlayers, newHistories, newTitles);

        return Result<SeedResultDto>.Ok(new SeedResultDto(
            newClubs.Count, newPlayers.Count, newTitles.Count));
    }

    private static string MapPosition(string? pos) => pos switch
    {
        "Goalkeeper" => "GK",
        "Defender"   => "CB",
        "Midfielder" => "CM",
        "Attacker"   => "ST",
        _            => "CM",
    };

    private static int? ExtractYear(string season)
    {
        var part = season.Split('/').Last().Trim();
        return int.TryParse(part, out var y) ? y : null;
    }
}
