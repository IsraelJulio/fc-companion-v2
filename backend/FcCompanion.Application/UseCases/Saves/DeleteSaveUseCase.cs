using FcCompanion.Application.Interfaces;
using FcCompanion.Domain.Common;

namespace FcCompanion.Application.UseCases.Saves;

public class DeleteSaveUseCase(ISaveRepository saveRepository)
{
    public async Task<Result> ExecuteAsync(Guid id)
    {
        var save = await saveRepository.GetByIdAsync(id);
        if (save is null)
            return Result.Fail("Save not found.");

        await saveRepository.DeleteAsync(save);
        await saveRepository.SaveChangesAsync();
        return Result.Ok();
    }
}
