using FcCompanion.Application.DTOs;
using FcCompanion.Application.UseCases.Players;
using Microsoft.AspNetCore.Mvc;

namespace FcCompanion.API.Controllers;

[ApiController]
[Route("api/v1/saves/{saveId}/players")]
public class PlayersController(
    GetPlayersUseCase getPlayers,
    GetPlayerByIdUseCase getById,
    CreatePlayerUseCase create,
    UpdatePlayerUseCase update,
    GetPlayerSeasonStatsUseCase getStats,
    UpdatePlayerSeasonStatsUseCase updateStats) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(
        Guid saveId,
        [FromQuery] string? search,
        [FromQuery] string? position,
        [FromQuery] Guid? clubId,
        [FromQuery] string? league,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var result = await getPlayers.ExecuteAsync(saveId, search, position, clubId, league, page, pageSize);
        return result.IsSuccess ? Ok(result.Value) : StatusCode(500, new { error = result.Error });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid saveId, Guid id)
    {
        var result = await getById.ExecuteAsync(id);
        return result.IsSuccess ? Ok(result.Value) : NotFound(new { error = result.Error });
    }

    [HttpPost]
    public async Task<IActionResult> Create(Guid saveId, [FromBody] CreatePlayerRequest request)
    {
        var result = await create.ExecuteAsync(saveId, request);
        return result.IsSuccess
            ? CreatedAtAction(nameof(GetById), new { saveId, id = result.Value!.Id }, result.Value)
            : BadRequest(new { error = result.Error });
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid saveId, Guid id, [FromBody] UpdatePlayerRequest request)
    {
        var result = await update.ExecuteAsync(id, request);
        return result.IsSuccess ? Ok(result.Value) : NotFound(new { error = result.Error });
    }

    [HttpGet("{id:guid}/season-stats")]
    public async Task<IActionResult> GetSeasonStats(Guid saveId, Guid id)
    {
        var result = await getStats.ExecuteAsync(id);
        return result.IsSuccess ? Ok(result.Value) : StatusCode(500, new { error = result.Error });
    }

    [HttpPut("{id:guid}/season-stats/{seasonId:guid}")]
    public async Task<IActionResult> UpdateSeasonStats(
        Guid saveId, Guid id, Guid seasonId, [FromBody] UpdatePlayerSeasonStatsRequest request)
    {
        var result = await updateStats.ExecuteAsync(id, seasonId, request);
        return result.IsSuccess ? Ok(result.Value) : NotFound(new { error = result.Error });
    }
}
