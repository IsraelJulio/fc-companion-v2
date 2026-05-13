using FcCompanion.Application.UseCases.Clubs;
using Microsoft.AspNetCore.Mvc;

namespace FcCompanion.API.Controllers;

[ApiController]
[Route("api/v1/saves/{saveId}/clubs")]
public class ClubsController(GetClubsUseCase getClubs, GetClubDetailUseCase getDetail) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(Guid saveId, [FromQuery] string? league)
    {
        var result = await getClubs.ExecuteAsync(saveId, league);
        return result.IsSuccess ? Ok(result.Value) : StatusCode(500, new { error = result.Error });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid saveId, Guid id)
    {
        var result = await getDetail.ExecuteAsync(id);
        return result.IsSuccess ? Ok(result.Value) : NotFound(new { error = result.Error });
    }
}
