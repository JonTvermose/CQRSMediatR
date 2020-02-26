using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Template.Web.Models.Account
{
    public class EnableAuthenticatorViewModel
    {
        public string SharedKey { get; set; }
        public string AuthenticatorUri { get; set; }
    }
}
