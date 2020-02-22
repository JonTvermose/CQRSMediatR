using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Template.Core.Data;
using Template.Infrastructure.DataAccess;

namespace Template.Core.Query
{
    public class QueryDb
    {
        private readonly ApplicationDbContext _dbContext;

        public QueryDb(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
            _dbContext.ChangeTracker.QueryTrackingBehavior = Microsoft.EntityFrameworkCore.QueryTrackingBehavior.NoTracking;

        }

        public IQueryable<LogEntry> LogEntries => _dbContext.LogEntries.AsQueryable();
        public IQueryable<StringResource> StringResources => _dbContext.StringResources.AsQueryable();

    }
}
