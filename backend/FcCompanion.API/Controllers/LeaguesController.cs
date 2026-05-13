using FcCompanion.Application.UseCases.Leagues;
using Microsoft.AspNetCore.Mvc;

namespace FcCompanion.API.Controllers;

[ApiController]
[Route("api/v1/saves/{saveId}/leagues")]
public class LeaguesController(
    GetTopScorersByLeagueUseCase getTopScorersUseCase,
    GetTopAssistsByLeagueUseCase getTopAssistsUseCase,
    GetChampionsHistoryUseCase getChampionsHistoryUseCase) : ControllerBase
{
    [HttpGet("rankings/top-scorers")]
    public async Task<IActionResult> GetTopScorers(
        Guid saveId,
        [FromQuery] string? league,
        [FromQuery] Guid? seasonId,
        [FromQuery] int limit = 10)
    {
        var result = await getTopScorersUseCase.ExecuteAsync(saveId, seasonId, league, limit);
        return result.IsSuccess ? Ok(result.Value) : BadRequest(new { error = result.Error });
    }

    [HttpGet("rankings/top-assists")]
    public async Task<IActionResult> GetTopAssists(
        Guid saveId,
        [FromQuery] string? league,
        [FromQuery] Guid? seasonId,
        [FromQuery] int limit = 10)
    {
        var result = await getTopAssistsUseCase.ExecuteAsync(saveId, seasonId, league, limit);
        return result.IsSuccess ? Ok(result.Value) : BadRequest(new { error = result.Error });
    }

    [HttpGet("champions-history")]
    public async Task<IActionResult> GetChampionsHistory(Guid saveId, [FromQuery] string? competition)
    {
        var result = await getChampionsHistoryUseCase.ExecuteAsync(saveId, competition);
        return result.IsSuccess ? Ok(result.Value) : BadRequest(new { error = result.Error });
    }
}
