using System;
using System.Collections.Generic;
using System.Text;
using Template.Core.Data;

namespace Template.Core.Query.Queries.LogEntry.Models
{
    public class UserActivity
    {
        public LogEntryType LogEntryType { get; set; }
        public string EventType { get
            {
                switch (LogEntryType)
                {
                    case LogEntryType.UserLogin:
                        return "Login";
                    case LogEntryType.UserPasswordChange:
                        return "Password changed";
                    case LogEntryType.UserForgotPassword:
                        return "Forgot password email sent";
                    case LogEntryType.UserPasswordReset:
                        return "Password reset";
                    case LogEntryType.UserAddTwoFactor:
                        return "Added two-factor authentication";
                    case LogEntryType.UserRemoveTwoFactor:
                        return "Removed two-factor authentication";
                    case LogEntryType.UserAddRole:
                        return "Added to role " + Data;
                    case LogEntryType.UserRemoveRole:
                        return "Removed from role " + Data;
                    case LogEntryType.UserConfirmEmail:
                        return "Confirmed email address";
                }
                return "Error";
            }
        }
        public string IpAddress { get; set; }
        public string TimeStamp { get; set; }
        public string Data { get; set; }
    }
}
