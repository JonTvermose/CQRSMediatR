using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Template.Web.Models.Account
{
    public class EnableTwoFactorResult
    {
        public bool Success { get; set; }
        public IList<string> RecoveryCodes { get; set; }
    }
}
