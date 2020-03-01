using System;
using System.Collections.Generic;
using System.Text;

namespace Template.Core.Data
{
    public class LogEntry
    {
        public int Id { get; set; }
        public DateTime TimeStamp { get; set; }
        public string RequestId { get; set; }
        public string Message { get; set; }
        public string Type { get; set; }
        public string Source { get; set; }
        public string StackTrace { get; set; }
        public string RequestPath { get; set; }
        public string User { get; set; }
        public string ActionDescriptor { get; set; }
        public string IpAddress { get; set; }
        public string Data { get; set; }
        public LogEntryType LogEntryType { get; set; }
    }

    public enum LogEntryType
    {
        // 100-199 | System information (exceptions, info about performance)
        Exception = 100,

        // 200 - 299 | User security
        UserLogin = 200,
        UserPasswordChange = 210,
        UserForgotPassword = 211,
        UserPasswordReset = 212,
        UserAddTwoFactor = 220,
        UserRemoveTwoFactor = 221,
        UserAddRole = 230,
        UserRemoveRole = 231,
        UserConfirmEmail = 240,

        // 300-399
    }

}
