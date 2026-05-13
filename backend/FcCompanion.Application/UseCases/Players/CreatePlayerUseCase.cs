using AutoMapper;
using FcCompanion.Application.DTOs;
using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Common;
using FcCompanion.Domain.Entities;

namespace FcCompanion.Application.UseCases.Players;

public class CreatePlayerUseCase(
    IPlayerRepository playerRepository,
    IPlayerSeasonStatsRepository statsRepository,
    ISeasonRepository seasonRepository,
    IMapper mapper)
{
    public async Task<Result<PlayerDetailDto>> ExecuteAsync(Guid saveId, CreatePlayerRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.FirstName))
            return Result<PlayerDetailDto>.Fail("First name is required.");
        if (string.IsNullOrWhiteSpace(request.LastName))
            return Result<PlayerDetailDto>.Fail("Last name is required.");
        if (string.IsNullOrWhiteSpace(request.Position))
            return Result<PlayerDetailDto>.Fail("Position is required.");

        var player = new Player
        {
            SaveId = saveId,
            CurrentClubId = request.CurrentClubId,
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Position = request.Position,
            Overall = request.Overall,
            Nationality = request.Nationality,
            DateOfBirth = request.DateOfBirth,
            PreferredFoot = request.PreferredFoot,
            IsCustom = true
        };

        await playerRepository.AddAsync(player);

        var activeSeason = await seasonRepository.GetActiveSeasonBySaveIdAsync(saveId);
        if (activeSeason is not null)
        {
            var stats = new PlayerSeasonStats
            {
                PlayerId = player.Id,
                SeasonId = activeSeason.Id,
                ClubId = request.CurrentClubId
            };
            await statsRepository.AddAsync(stats);
        }

        await playerRepository.SaveChangesAsync();

        var created = await playerRepository.GetWithDetailsAsync(player.Id);
        return Result<PlayerDetailDto>.Ok(mapper.Map<PlayerDetailDto>(created!));
    }
}
