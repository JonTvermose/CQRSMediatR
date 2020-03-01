using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Template.Core.Query.Queries.LogEntry.Models;
using Template.Core.Data;

namespace Template.Core.Query.Queries.LogEntry
{
    public class ListLogEntriesQueryHandler : IRequestHandler<ListLogEntriesQuery, IEnumerable<LogEntryListview>>
    {
        private readonly QueryDb _queryDb;
        private readonly IMapper _mapper;

        public ListLogEntriesQueryHandler(QueryDb queryDb, IMapper mapper)
        {
            _queryDb = queryDb;
            _mapper = mapper;
        }

        public async Task<IEnumerable<LogEntryListview>> Handle(ListLogEntriesQuery request, CancellationToken cancellationToken)
        {
            return _queryDb.LogEntries
                .Where(x => x.LogEntryType == LogEntryType.Exception)
                .OrderByDescending(x => x.TimeStamp)
                .Take(request.MaxLogEntries)
                .ProjectTo<LogEntryListview>(_mapper.ConfigurationProvider)
                .AsEnumerable();
        }
    }
}
