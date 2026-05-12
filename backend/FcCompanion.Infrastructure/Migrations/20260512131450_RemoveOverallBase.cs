using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FcCompanion.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveOverallBase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OverallBase",
                table: "players");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OverallBase",
                table: "players",
                type: "integer",
                nullable: true);
        }
    }
}
