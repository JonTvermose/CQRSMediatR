using System;
using System.Collections.Generic;
using System.Text;

namespace Template.Core.Query.Queries.StringResource.Models
{
    public class LanguagesStringResourceQueryModel
    {
        public string Key { get; set; }
        public IDictionary<string, string> Values { get; set; }
    }
}
