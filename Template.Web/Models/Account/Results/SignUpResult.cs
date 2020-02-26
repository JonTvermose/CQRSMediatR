using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Template.Web.Models.Account
{
    public class SignUpResult
    {
        public bool Success { get; set; }
        public bool DuplicateEmail { get; set; }
    }
}
