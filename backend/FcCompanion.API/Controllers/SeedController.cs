using FcCompanion.Application.DTOs;
using FcCompanion.Application.UseCases.Seed;
using Microsoft.AspNetCore.Mvc;

namespace FcCompanion.API.Controllers;

[ApiController]
[Route("api/v1/saves/{saveId}/seed")]
public class SeedController(SeedSaveUseCase seedUseCase) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Seed(Guid saveId, [FromBody] SeedRequest request)
    {
        var result = await seedUseCase.ExecuteAsync(saveId, request);
        return result.IsSuccess
            ? Ok(result.Value)
            : BadRequest(new { error = result.Error });
    }

    [HttpGet("{jobId}")]
    public IActionResult GetStatus(Guid saveId, string jobId)
        => Ok(new { jobId, status = "completed", progress = 100, currentStep = "done" });
}
