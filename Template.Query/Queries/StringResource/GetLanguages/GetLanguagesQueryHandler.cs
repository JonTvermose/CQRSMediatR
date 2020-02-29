using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;

namespace Template.Core.Query.Queries.StringResource.GetLanguages
{
    public class GetLanguagesQueryHandler : IRequestHandler<GetLanguagesQuery, IList<string>>
    {
        private readonly QueryDb _queryDb;

        public GetLanguagesQueryHandler(QueryDb queryDb)
        {
            _queryDb = queryDb;
        }

        public async Task<IList<string>> Handle(GetLanguagesQuery request, CancellationToken cancellationToken)
        {
            return _queryDb.StringResources
                .GroupBy(x => x.LanguageCode, (key, grp) => key)
                .Distinct()
                .OrderBy(x => x)
                .ToList();
        }
    }
}
