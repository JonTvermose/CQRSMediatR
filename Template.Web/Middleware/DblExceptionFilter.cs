using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Diagnostics;
using System.IO;
using Template.Core.Data;
using Template.Infrastructure.DataAccess;

namespace Template.Web.Middleware
{
    public class DblExceptionFilter : ExceptionFilterAttribute
    {
        private readonly LogDbContext _context;

        public DblExceptionFilter(LogDbContext context)
        {
            _context = context;
        }

        public override void OnException(ExceptionContext context)
        {
            LogEntry log = new LogEntry
            {
                TimeStamp = DateTime.UtcNow,
                ActionDescriptor = context.ActionDescriptor.DisplayName,
                IpAddress = context.HttpContext.Connection.RemoteIpAddress.ToString(),
                Message = context.Exception.Message,
                RequestId = Activity.Current?.Id ?? context.HttpContext.TraceIdentifier,
                RequestPath = context.HttpContext.Request.Path,
                Source = context.Exception.Source,
                StackTrace = context.Exception.StackTrace,
                Type = context.Exception.GetType().ToString(),
                User = context.HttpContext.User.Identity.Name,
            };
            try
            {
                // TODO this doesnt actually read the request contents
                using (var reader = new StreamReader(context.HttpContext.Request.Body))
                {
                    var body = reader.ReadToEndAsync().GetAwaiter().GetResult();
                    log.Data = body;
                }
            }
            catch { }
            _context.LogEntries.Add(log);
            _context.SaveChanges();
        }
    }

}
