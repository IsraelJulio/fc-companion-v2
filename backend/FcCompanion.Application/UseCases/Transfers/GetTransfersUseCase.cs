using AutoMapper;
using FcCompanion.Application.DTOs;
using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Common;

namespace FcCompanion.Application.UseCases.Transfers;

public class GetTransfersUseCase(ITransferRepository transferRepository, IMapper mapper)
{
    public async Task<Result<IEnumerable<TransferDto>>> ExecuteAsync(
        Guid saveId, Guid? playerId, Guid? clubId, Guid? seasonId)
    {
        var transfers = await transferRepository.GetBySaveIdAsync(saveId, playerId, clubId, seasonId);
        return Result<IEnumerable<TransferDto>>.Ok(mapper.Map<IEnumerable<TransferDto>>(transfers));
    }
}
