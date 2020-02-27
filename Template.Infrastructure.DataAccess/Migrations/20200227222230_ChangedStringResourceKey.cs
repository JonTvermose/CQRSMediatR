using Microsoft.EntityFrameworkCore.Migrations;

namespace Template.Infrastructure.DataAccess.Migrations
{
    public partial class ChangedStringResourceKey : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_StringResources",
                table: "StringResources");

            migrationBuilder.DropIndex(
                name: "IX_StringResources_Key_LanguageCode",
                table: "StringResources");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "StringResources");

            migrationBuilder.AlterColumn<string>(
                name: "LanguageCode",
                table: "StringResources",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Key",
                table: "StringResources",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_StringResources",
                table: "StringResources",
                columns: new[] { "Key", "LanguageCode" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_StringResources",
                table: "StringResources");

            migrationBuilder.AlterColumn<string>(
                name: "LanguageCode",
                table: "StringResources",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "Key",
                table: "StringResources",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "StringResources",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StringResources",
                table: "StringResources",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_StringResources_Key_LanguageCode",
                table: "StringResources",
                columns: new[] { "Key", "LanguageCode" },
                unique: true,
                filter: "[Key] IS NOT NULL AND [LanguageCode] IS NOT NULL");
        }
    }
}
