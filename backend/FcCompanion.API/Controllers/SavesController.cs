using FcCompanion.Application.DTOs;
using FcCompanion.Application.UseCases.Saves;
using Microsoft.AspNetCore.Mvc;

namespace FcCompanion.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class SavesController(
    GetAllSavesUseCase getAll,
    CreateSaveUseCase create,
    DeleteSaveUseCase delete) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await getAll.ExecuteAsync();
        return result.IsSuccess ? Ok(result.Value) : StatusCode(500, new { error = result.Error });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSaveRequest request)
    {
        var result = await create.ExecuteAsync(request);
        return result.IsSuccess
            ? CreatedAtAction(nameof(GetAll), result.Value)
            : BadRequest(new { error = result.Error });
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await delete.ExecuteAsync(id);
        return result.IsSuccess ? NoContent() : NotFound(new { error = result.Error });
    }
}
