using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Template.Web.Models.Account
{
    public class ForgotPasswordViewModel
    {
        public string Email { get; set; }
        public string CallbackUrl { get; set; }
    }
}
