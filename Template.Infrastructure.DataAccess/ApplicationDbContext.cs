using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using Template.Core.Data;

namespace Template.Infrastructure.DataAccess
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<StringResource>()
                .HasIndex(x => new { x.Key, x.LanguageCode })
                .IsUnique();
        }

        public DbSet<StringResource> StringResources { get; set; }
        public DbSet<LogEntry> LogEntries { get; set; }
    }
}
