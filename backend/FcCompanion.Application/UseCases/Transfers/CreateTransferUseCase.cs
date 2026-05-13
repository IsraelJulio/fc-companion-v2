using AutoMapper;
using FcCompanion.Application.DTOs;
using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Common;
using FcCompanion.Domain.Entities;

namespace FcCompanion.Application.UseCases.Transfers;

public class CreateTransferUseCase(
    IPlayerRepository playerRepository,
    IClubRepository clubRepository,
    ISeasonRepository seasonRepository,
    ITransferRepository transferRepository,
    IMapper mapper)
{
    public async Task<Result<TransferDto>> ExecuteAsync(Guid saveId, CreateTransferRequest request)
    {
        var player = await playerRepository.GetByIdAsync(request.PlayerId);
        if (player is null || player.SaveId != saveId)
            return Result<TransferDto>.Fail("Player not found in this save.");

        if (player.CurrentClubId == request.ToClubId)
            return Result<TransferDto>.Fail("Player is already at this club.");

        var toClub = await clubRepository.GetByIdAsync(request.ToClubId);
        if (toClub is null || toClub.SaveId != saveId)
            return Result<TransferDto>.Fail("Destination club not found in this save.");

        var activeSeason = await seasonRepository.GetActiveSeasonBySaveIdAsync(saveId);
        if (activeSeason is null)
            return Result<TransferDto>.Fail("No active season found.");

        var transfer = new Transfer
        {
            PlayerId = player.Id,
            SeasonId = activeSeason.Id,
            FromClubId = player.CurrentClubId,
            ToClubId = request.ToClubId,
            TransferDate = request.TransferDate
        };

        await transferRepository.AddAsync(transfer);

        player.CurrentClubId = request.ToClubId;
        await playerRepository.UpdateAsync(player);

        await transferRepository.SaveChangesAsync();

        var created = await transferRepository.GetWithDetailsAsync(transfer.Id);
        return Result<TransferDto>.Ok(mapper.Map<TransferDto>(created!));
    }
}
