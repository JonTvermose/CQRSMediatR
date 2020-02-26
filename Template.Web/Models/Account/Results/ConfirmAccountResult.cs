using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Template.Web.Models.Account.Results
{
    public class ConfirmAccountResult
    {
        public bool Success { get; set; }
        public bool InvalidPassword { get; set; }
        public bool BadRequest { get; set; }
    }
}
