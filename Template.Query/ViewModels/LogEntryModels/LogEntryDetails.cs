using System;
using System.Collections.Generic;
using System.Text;

namespace Template.Core.Query.ViewModels.LogEntryModels
{
    public class LogEntryDetails
    {
        public int Id { get; set; }
        public string Message { get; set; }
        public string TimeStamp { get; set; }
    }
}
