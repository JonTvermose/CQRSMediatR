using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;
using System.Collections.Generic;
using System.Text;
using Template.Core.Data;

namespace Template.Infrastructure.DataAccess
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // When reading date, set the datetime kind to UTC (all datetimes are stored as UTC)
            var dateTimeConverter = new ValueConverter<DateTime, DateTime>(v => v, v => DateTime.SpecifyKind(v, DateTimeKind.Utc));
            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    if (property.ClrType == typeof(DateTime) || property.ClrType == typeof(DateTime?))
                        property.SetValueConverter(dateTimeConverter);
                }
            }

            builder.Entity<StringResource>()
                .HasKey(x => new { x.Key, x.LanguageCode });

            builder.Entity<LogEntry>()
                .HasIndex(x => x.LogEntryType);
        }

        public DbSet<StringResource> StringResources { get; set; }
        public DbSet<LogEntry> LogEntries { get; set; }
    }
}
