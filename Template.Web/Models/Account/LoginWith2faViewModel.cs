using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Template.Web.Models.Account
{
    public class LoginWith2faViewModel
    {
        public string TwoFactorCode { get; set; }
        public bool RememberMe { get; set; }
    }
}
