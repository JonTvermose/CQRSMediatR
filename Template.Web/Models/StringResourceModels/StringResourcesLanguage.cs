using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Template.Web.Models.StringResourceModels
{
    public class StringResourcesLanguage
    {
        public string languageCode { get; set; }
        public IDictionary<string, string> values { get; set; }
    }
}
