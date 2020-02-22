using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Template.Web.Models.Account
{
    public class ResetPasswordViewModel
    {
        public string Email { get; internal set; }
        public string Code { get; internal set; }
        public string Password { get; internal set; }
    }
}
