using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using Template.Core.Query.Queries.StringResource.Models;

namespace Template.Core.Query.Queries.StringResource
{
    public class GetByLanguagesStringResourceQuery : IRequest<IList<LanguagesStringResourceQueryModel>>
    {
        public string[] Languages { get; }

        public GetByLanguagesStringResourceQuery(string[] languages)
        {
            Languages = languages;
        }

    }
}
