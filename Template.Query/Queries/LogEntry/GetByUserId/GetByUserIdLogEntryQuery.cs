using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using Template.Core.Query.Queries.LogEntry.Models;

namespace Template.Core.Query.Queries.LogEntry
{
    public class GetByUserIdLogEntryQuery : IRequest<IEnumerable<UserActivity>>
    {
        public int MaxLogEntries { get; }
        public string UserId { get; internal set; }

        public GetByUserIdLogEntryQuery(string userId)
        {
            MaxLogEntries = 50; // default
            UserId = userId;
        }

        public GetByUserIdLogEntryQuery(string userId, int maxLogEntries)
        {
            UserId = userId;
            MaxLogEntries = maxLogEntries;
        }
    }

}
