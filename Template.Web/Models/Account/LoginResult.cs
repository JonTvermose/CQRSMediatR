using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Template.Web.Models.Account
{
    public class LoginResult
    {
        public bool IsAuthenticated { get; set; }
        public bool IsLockedOut { get; set; }
        public bool RequiresTwoFactor { get; set; }
        public bool IsInvalidAttempt { get; set; }
        public bool IsInvalid2Fa { get; set; }
    }
}
