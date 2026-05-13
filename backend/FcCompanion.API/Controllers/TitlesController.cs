using FcCompanion.Application.DTOs;
using FcCompanion.Application.UseCases.Titles;
using Microsoft.AspNetCore.Mvc;

namespace FcCompanion.API.Controllers;

[ApiController]
[Route("api/v1/saves/{saveId}/clubs/{clubId}/titles")]
public class TitlesController(
    GetClubTitlesUseCase getClubTitlesUseCase,
    CreateTitleUseCase createTitleUseCase,
    DeleteTitleUseCase deleteTitleUseCase) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(Guid saveId, Guid clubId)
    {
        var result = await getClubTitlesUseCase.ExecuteAsync(saveId, clubId);
        return result.IsSuccess ? Ok(result.Value) : NotFound(new { error = result.Error });
    }

    [HttpPost]
    public async Task<IActionResult> Create(Guid saveId, Guid clubId, [FromBody] CreateTitleRequest request)
    {
        var result = await createTitleUseCase.ExecuteAsync(saveId, clubId, request);
        return result.IsSuccess ? Ok(result.Value) : BadRequest(new { error = result.Error });
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid saveId, Guid clubId, Guid id)
    {
        var result = await deleteTitleUseCase.ExecuteAsync(saveId, clubId, id);
        return result.IsSuccess ? NoContent() : NotFound(new { error = result.Error });
    }
}
