using FcCompanion.Application.DTOs;
using FcCompanion.Application.UseCases.Transfers;
using Microsoft.AspNetCore.Mvc;

namespace FcCompanion.API.Controllers;

[ApiController]
[Route("api/v1/saves/{saveId}/transfers")]
public class TransfersController(GetTransfersUseCase getTransfers, CreateTransferUseCase createTransfer) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(
        Guid saveId,
        [FromQuery] Guid? playerId,
        [FromQuery] Guid? clubId,
        [FromQuery] Guid? seasonId)
    {
        var result = await getTransfers.ExecuteAsync(saveId, playerId, clubId, seasonId);
        return result.IsSuccess ? Ok(result.Value) : StatusCode(500, new { error = result.Error });
    }

    [HttpPost]
    public async Task<IActionResult> Create(Guid saveId, [FromBody] CreateTransferRequest request)
    {
        var result = await createTransfer.ExecuteAsync(saveId, request);
        return result.IsSuccess ? Created(string.Empty, result.Value) : BadRequest(new { error = result.Error });
    }
}
