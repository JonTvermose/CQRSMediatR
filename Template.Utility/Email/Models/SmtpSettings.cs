using System;
using System.Collections.Generic;
using System.Security;
using System.Text;

namespace Template.Utility.Models
{
    public class SmtpSettings
    {
        public string FromEmail { get; set; }
        public string FromDisplayName { get; set; }
        public string Server { get; set; }
        public int Port { get; set; }
        public bool UseSsl { get; set; }
        public string Username { get; set; }
        public SecureString Password { get; set; }
    }
}
