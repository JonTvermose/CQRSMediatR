using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Template.Core.Query.Queries.StringResource
{
    public class GetByLanguageStringResourceQuery : IRequest<IDictionary<string, string>>
    {
        public string LanguageCode { get; }

        public GetByLanguageStringResourceQuery(string languageCode)
        {
            LanguageCode = languageCode;
        }

    }
}
