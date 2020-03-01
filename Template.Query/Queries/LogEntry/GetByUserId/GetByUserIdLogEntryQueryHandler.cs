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
    public class GetByUserIdLogEntryQueryHandler : IRequestHandler<GetByUserIdLogEntryQuery, IEnumerable<UserActivity>>
    {
        private readonly QueryDb _queryDb;
        private readonly IMapper _mapper;

        public GetByUserIdLogEntryQueryHandler(QueryDb queryDb, IMapper mapper)
        {
            _queryDb = queryDb;
            _mapper = mapper;
        }

        public async Task<IEnumerable<UserActivity>> Handle(GetByUserIdLogEntryQuery request, CancellationToken cancellationToken)
        {
            return _queryDb.LogEntries
                .Where(x => x.User == request.UserId)
                .Where(x => (int) x.LogEntryType >= 200 && (int) x.LogEntryType < 300)
                .OrderByDescending(x => x.TimeStamp)
                .Take(request.MaxLogEntries)
                .ProjectTo<UserActivity>(_mapper.ConfigurationProvider)
                .AsEnumerable();
        }
    }
}
