using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Template.Core.Query.Queries.StringResource
{
    public class LanguageStringResourceQueryHandler : IRequestHandler<LanguageStringResourceQuery, IDictionary<string, string>>
    {
        private readonly QueryDb _queryDb;

        public LanguageStringResourceQueryHandler(QueryDb queryDb)
        {
            _queryDb = queryDb;
        }

        public async Task<IDictionary<string, string>> Handle(LanguageStringResourceQuery request, CancellationToken cancellationToken)
        {
            return _queryDb.StringResources
                .Where(x => x.LanguageCode == request.LanguageCode)
                .ToDictionary(x => x.Key, x => x.Value);
        }
    }
}
