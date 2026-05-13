using FcCompanion.Application.UseCases.Dashboard;
using Microsoft.AspNetCore.Mvc;

namespace FcCompanion.API.Controllers;

[ApiController]
[Route("api/v1/saves/{saveId}/dashboard")]
public class DashboardController(
    GetDashboardSummaryUseCase getDashboardSummaryUseCase,
    GetDashboardTopScorersUseCase getDashboardTopScorersUseCase,
    GetDashboardTitleHistoryUseCase getDashboardTitleHistoryUseCase) : ControllerBase
{
    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary(Guid saveId)
    {
        var result = await getDashboardSummaryUseCase.ExecuteAsync(saveId);
        return result.IsSuccess ? Ok(result.Value) : BadRequest(new { error = result.Error });
    }

    [HttpGet("top-scorers")]
    public async Task<IActionResult> GetTopScorers(Guid saveId, [FromQuery] Guid? seasonId, [FromQuery] int limit = 10)
    {
        var result = await getDashboardTopScorersUseCase.ExecuteAsync(saveId, seasonId, limit);
        return result.IsSuccess ? Ok(result.Value) : BadRequest(new { error = result.Error });
    }

    [HttpGet("title-history")]
    public async Task<IActionResult> GetTitleHistory(Guid saveId)
    {
        var result = await getDashboardTitleHistoryUseCase.ExecuteAsync(saveId);
        return result.IsSuccess ? Ok(result.Value) : BadRequest(new { error = result.Error });
    }
}
