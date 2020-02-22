using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using Template.Core.Query.Queries.LogEntry.Models;

namespace Template.Core.Query.Queries.LogEntry
{
    public class ListLogEntriesQuery : IRequest<IEnumerable<LogEntryListview>>
    {
        public int MaxLogEntries { get; }

        public ListLogEntriesQuery()
        {
            MaxLogEntries = 50; // default
        }

        public ListLogEntriesQuery(int maxLogEntries)
        {
            MaxLogEntries = maxLogEntries;
        }
    }

}
