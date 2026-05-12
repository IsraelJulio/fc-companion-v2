using FcCompanion.Application.DTOs;
using FcCompanion.Application.UseCases.Seasons;
using Microsoft.AspNetCore.Mvc;

namespace FcCompanion.API.Controllers;

[ApiController]
[Route("api/v1/saves/{saveId}/seasons")]
public class SeasonsController(CloseSeasonUseCase closeSeasonUseCase) : ControllerBase
{
    [HttpPost("close")]
    public async Task<IActionResult> Close(Guid saveId, [FromBody] CloseSeasonRequest request)
    {
        var result = await closeSeasonUseCase.ExecuteAsync(saveId, request);
        return result.IsSuccess
            ? Ok(result.Value)
            : BadRequest(new { error = result.Error });
    }
}
