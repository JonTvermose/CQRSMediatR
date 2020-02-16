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
        private readonly LogDbContext _logDbContext;

        public QueryDb(ApplicationDbContext dbContext, LogDbContext logDbContext)
        {
            _dbContext = dbContext;
            _dbContext.ChangeTracker.QueryTrackingBehavior = Microsoft.EntityFrameworkCore.QueryTrackingBehavior.NoTracking;

            _logDbContext = logDbContext;
            _logDbContext.ChangeTracker.QueryTrackingBehavior = Microsoft.EntityFrameworkCore.QueryTrackingBehavior.NoTracking;
        }

        public IQueryable<LogEntry> LogEntries => _logDbContext.LogEntries.AsQueryable();
    }
}
