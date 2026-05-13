using AutoMapper;
using FcCompanion.Application.DTOs;
using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Common;
using FcCompanion.Domain.Entities;
using FcCompanion.Domain.Enums;

namespace FcCompanion.Application.UseCases.Seasons;

public class CloseSeasonUseCase(
    ISeasonRepository seasonRepository,
    IPlayerRepository playerRepository,
    IPlayerSeasonStatsRepository playerSeasonStatsRepository,
    IPlayerOverallHistoryRepository playerOverallHistoryRepository,
    IMapper mapper)
{
    public async Task<Result<CloseSeasonResponse>> ExecuteAsync(Guid saveId, CloseSeasonRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.NextSeasonName))
            return Result<CloseSeasonResponse>.Fail("Next season name is required.");

        var activeSeason = await seasonRepository.GetActiveSeasonBySaveIdAsync(saveId);
        if (activeSeason is null)
            return Result<CloseSeasonResponse>.Fail("No active season found for this save.");

        activeSeason.Status = SeasonStatus.Closed;
        activeSeason.EndedAt = DateOnly.FromDateTime(DateTime.UtcNow);
        await seasonRepository.UpdateAsync(activeSeason);

        var players = (await playerRepository.GetBySaveIdAsync(saveId)).ToList();
        var existingSnapshots = (await playerOverallHistoryRepository.GetBySeasonIdAsync(activeSeason.Id))
            .ToDictionary(h => h.PlayerId);

        foreach (var player in players)
        {
            if (existingSnapshots.TryGetValue(player.Id, out var snapshot))
            {
                snapshot.Overall = player.Overall;
                await playerOverallHistoryRepository.UpdateAsync(snapshot);
            }
            else
            {
                await playerOverallHistoryRepository.AddAsync(new PlayerOverallHistory
                {
                    PlayerId = player.Id,
                    SeasonId = activeSeason.Id,
                    Overall = player.Overall
                });
            }
        }

        var newSeason = new Season
        {
            SaveId = saveId,
            Name = request.NextSeasonName.Trim(),
            Status = SeasonStatus.Active,
            StartedAt = DateOnly.FromDateTime(DateTime.UtcNow)
        };
        await seasonRepository.AddAsync(newSeason);

        var freshSeasonStats = players.Select(player => new PlayerSeasonStats
        {
            PlayerId = player.Id,
            SeasonId = newSeason.Id,
            ClubId = player.CurrentClubId,
            Goals = 0,
            Assists = 0,
            Appearances = 0,
            MinutesPlayed = 0
        }).ToList();

        await playerSeasonStatsRepository.AddRangeAsync(freshSeasonStats);
        await seasonRepository.SaveChangesAsync();

        return Result<CloseSeasonResponse>.Ok(new CloseSeasonResponse(
            mapper.Map<SeasonDto>(activeSeason),
            mapper.Map<SeasonDto>(newSeason)));
    }
}
