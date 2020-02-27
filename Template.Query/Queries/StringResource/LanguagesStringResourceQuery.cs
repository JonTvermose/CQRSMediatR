using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using Template.Core.Query.Queries.StringResource.Models;

namespace Template.Core.Query.Queries.StringResource
{
    public class LanguagesStringResourceQuery : IRequest<IList<LanguagesStringResourceQueryModel>>
    {
        public string[] Languages { get; }

        public LanguagesStringResourceQuery(string[] languages)
        {
            Languages = languages;
        }

    }
}
