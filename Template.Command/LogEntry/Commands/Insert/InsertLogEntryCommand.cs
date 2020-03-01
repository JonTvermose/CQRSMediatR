using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Text;
using MediatR;
using Template.Core.Data;
using System.Text.Json;
using System.IO;
using Microsoft.AspNetCore.Http;

namespace Template.Core.Command
{
    public class InsertLogEntryCommand : IRequest
    {

        public LogEntry LogEntry { get; }

        public InsertLogEntryCommand(ExceptionContext context)
        {
            LogEntry = new LogEntry
            {
                TimeStamp = DateTime.UtcNow,
                ActionDescriptor = context.ActionDescriptor.DisplayName,
                IpAddress = context.HttpContext.Connection.RemoteIpAddress.ToString(),
                Message = context.Exception.Message,
                RequestId = context.HttpContext.TraceIdentifier,
                RequestPath = context.HttpContext.Request.Path,
                Source = context.Exception.Source,
                StackTrace = context.Exception.StackTrace,
                Type = context.Exception.GetType().ToString(),
                User = context.HttpContext.User?.Identity?.Name ?? "Anonymous",
                LogEntryType = LogEntryType.Exception
            };
            try
            {
                if (context.HttpContext.Request.Method == "GET")
                {
                    LogEntry.Data = context.HttpContext.Request.QueryString.Value;
                }
                else if (context.HttpContext.Request.Method == "POST")
                {
                    if (context.HttpContext.Request.HasFormContentType)
                    {
                        var form = context.HttpContext.Request.ReadFormAsync().GetAwaiter().GetResult();
                        var options = new JsonSerializerOptions
                        {
                            WriteIndented = true,
                            MaxDepth = 2
                        };
                        LogEntry.Data = JsonSerializer.Serialize(form, options);
                    }
                    else
                    {
                        using (var reader = new StreamReader(context.HttpContext.Request.Body))
                        {
                            var body = reader.ReadToEndAsync().GetAwaiter().GetResult();
                            LogEntry.Data = body;
                        }
                    }
                }
            }
            catch { }
        }

        public InsertLogEntryCommand(HttpContext context, LogEntryType logEntryType, string userId)
        {
            LogEntry = new LogEntry
            {
                TimeStamp = DateTime.UtcNow,
                IpAddress = context.Connection.RemoteIpAddress.ToString(),
                RequestId = context.TraceIdentifier,
                RequestPath = context.Request.Path,
                User = userId ?? "Anonymous",
                LogEntryType = logEntryType
            };
        }

        public InsertLogEntryCommand(HttpContext context, LogEntryType logEntryType, string userId, string data)
        {
            LogEntry = new LogEntry
            {
                TimeStamp = DateTime.UtcNow,
                IpAddress = context.Connection.RemoteIpAddress.ToString(),
                RequestId = context.TraceIdentifier,
                RequestPath = context.Request.Path,
                User = userId ?? "Anonymous",
                LogEntryType = logEntryType,
                Data = data
            };
        }
    }
}
