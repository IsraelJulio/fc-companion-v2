namespace FcCompanion.Application.DTOs;

public record SeasonDto(Guid Id, string Name, string Status);
public record SaveDto(Guid Id, string Name, SeasonDto? CurrentSeason, DateTime CreatedAt);
public record CreateSaveRequest(string Name, string FirstSeasonName);
public record UpdateSaveRequest(string Name);

public record ClubSummaryDto(Guid Id, string Name, string? LogoUrl, string League);
public record ClubDetailDto(
    Guid Id, string Name, string ShortName, string League, string Country, string? LogoUrl,
    IEnumerable<PlayerListItemDto> Squad,
    IEnumerable<TitleDto> Titles,
    IEnumerable<ClubSeasonHistoryDto> SeasonHistory,
    IEnumerable<PlayerListItemDto> TopScorers);
public record ClubSeasonHistoryDto(string SeasonName, int? Position, int? Goals, int? Assists);

public record PlayerListItemDto(
    Guid Id, string FullName, string Position, int Overall,
    ClubSummaryDto? CurrentClub, string? PhotoUrl);
public record PlayerDetailDto(
    Guid Id, string FirstName, string LastName, string? Nationality,
    DateOnly? DateOfBirth, string Position, string PreferredFoot,
    int Overall, string? PhotoUrl, long? MarketValue,
    bool IsCustom, ClubSummaryDto? CurrentClub,
    IEnumerable<PlayerSeasonStatsDto> SeasonHistory);
public record CreatePlayerRequest(
    string FirstName, string LastName, string Position, Guid CurrentClubId,
    int Overall, string? Nationality, DateOnly? DateOfBirth, string PreferredFoot = "right");
public record UpdatePlayerRequest(
    string? FirstName, string? LastName, string? Position,
    int? Overall, long? MarketValue, string? PreferredFoot);
public record PlayerSeasonStatsDto(
    Guid Id, Guid SeasonId, string SeasonName, Guid ClubId, string ClubName,
    int Goals, int Assists, int Appearances, int MinutesPlayed);
public record UpdatePlayerSeasonStatsRequest(
    int Goals, int Assists, int Appearances, int MinutesPlayed);

public record TransferDto(
    Guid Id, Guid PlayerId, string PlayerName,
    ClubSummaryDto FromClub, ClubSummaryDto ToClub,
    string SeasonName, DateOnly TransferDate);
public record CreateTransferRequest(Guid PlayerId, Guid ToClubId, DateOnly TransferDate);

public record TitleDto(Guid Id, string Competition, int Year, string Source, string? SeasonName);
public record CreateTitleRequest(string Competition, int Year, Guid? SeasonId);

public record StandingDto(
    Guid Id, ClubSummaryDto Club, int Position, int Points,
    int Wins, int Draws, int Losses, int GoalsFor, int GoalsAgainst);
public record UpdateStandingRequest(
    int Position, int Points, int Wins, int Draws, int Losses, int GoalsFor, int GoalsAgainst);
public record LeaguePlayerRankingDto(
    Guid PlayerId, string PlayerName, string Position, int Overall,
    ClubSummaryDto Club, int Value);
public record TitleHistoryEntryDto(
    Guid Id, string Competition, int Year, string Source, string? SeasonName, ClubSummaryDto Club);

public record SeedRequest(IEnumerable<int> LeagueIds);
public record SeedResultDto(int ClubsImported, int PlayersImported, int TitlesImported);

public record CloseSeasonRequest(string NextSeasonName);
public record CloseSeasonResponse(SeasonDto ClosedSeason, SeasonDto NewSeason);

public record DashboardSummaryDto(
    PlayerListItemDto? TopScorer, PlayerListItemDto? TopAssister,
    PlayerListItemDto? HighestOverall, int TotalPlayers, int TotalClubs);
public record OverallHistoryDto(string SeasonName, int Overall);

public record PagedResult<T>(IEnumerable<T> Items, int Total, int Page, int PageSize);
