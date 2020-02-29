using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Template.Core.Query.Queries.StringResource.GetLanguages
{
    public class GetLanguagesQuery: IRequest<IList<string>>
    {
    }
}
