using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using Template.Core.Data;

namespace Template.Core.Command
{
    public class LogEntryInsertedNotification : INotification
    {

        public LogEntryInsertedNotification(LogEntry logEntry)
        {
            LogEntry = logEntry;
        }

        public LogEntry LogEntry { get; }
    }
}
