using Microsoft.EntityFrameworkCore.Migrations;

namespace Template.Infrastructure.DataAccess.Migrations
{
    public partial class AddedLogEntryTypeEnum : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LogEntryType",
                table: "LogEntries",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_LogEntries_LogEntryType",
                table: "LogEntries",
                column: "LogEntryType");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_LogEntries_LogEntryType",
                table: "LogEntries");

            migrationBuilder.DropColumn(
                name: "LogEntryType",
                table: "LogEntries");
        }
    }
}
