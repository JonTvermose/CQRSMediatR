using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Template.Core.Query.Queries.StringResource
{
    public class LanguageStringResourceQuery : IRequest<IDictionary<string, string>>
    {
        public string LanguageCode { get; }

        public LanguageStringResourceQuery(string languageCode)
        {
            LanguageCode = languageCode;
        }

    }
}
