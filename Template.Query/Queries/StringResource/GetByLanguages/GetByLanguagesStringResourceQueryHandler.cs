using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Template.Core.Query.Queries.StringResource.Models;

namespace Template.Core.Query.Queries.StringResource
{
    public class GetByLanguagesStringResourceQueryHandler : IRequestHandler<GetByLanguagesStringResourceQuery, IList<LanguagesStringResourceQueryModel>>
    {
        private readonly QueryDb _queryDb;

        public GetByLanguagesStringResourceQueryHandler(QueryDb queryDb)
        {
            _queryDb = queryDb;
        }

        public async Task<IList<LanguagesStringResourceQueryModel>> Handle(GetByLanguagesStringResourceQuery request, CancellationToken cancellationToken)
        {
            var result = _queryDb.StringResources
                .Where(x => request.Languages.Contains(x.LanguageCode))
                .ToList()
                .GroupBy(x => x.Key, x => new { x.LanguageCode, x.Value }, (key, g) =>
                    new LanguagesStringResourceQueryModel
                    {
                        Key = key,
                        Values = g.ToDictionary(d => d.LanguageCode, v => v.Value)
                    })
                .ToList();
            return result;
        }
    }
}
