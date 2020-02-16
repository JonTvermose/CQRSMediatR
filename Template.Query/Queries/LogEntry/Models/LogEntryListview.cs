using System;
using System.Collections.Generic;
using System.Text;

namespace Template.Core.Query.Queries.LogEntry.Models
{
    public class LogEntryListview
    {
        public int Id { get; set; }
        public string Message { get; set; }
        public string TimeStamp { get; set; }
        public string Type { get; set; }
        public string RequestPath { get; set; }
    }
}
