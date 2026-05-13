using FcCompanion.Application.DTOs;
using FcCompanion.Application.UseCases.Standings;
using Microsoft.AspNetCore.Mvc;

namespace FcCompanion.API.Controllers;

[ApiController]
[Route("api/v1/saves/{saveId}/standings")]
public class StandingsController(
    GetStandingsUseCase getStandingsUseCase,
    UpdateStandingUseCase updateStandingUseCase) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(Guid saveId, [FromQuery] string? league, [FromQuery] Guid? seasonId)
    {
        var result = await getStandingsUseCase.ExecuteAsync(saveId, seasonId, league);
        return result.IsSuccess ? Ok(result.Value) : BadRequest(new { error = result.Error });
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid saveId, Guid id, [FromBody] UpdateStandingRequest request)
    {
        var result = await updateStandingUseCase.ExecuteAsync(saveId, id, request);
        return result.IsSuccess ? Ok(result.Value) : NotFound(new { error = result.Error });
    }
}
