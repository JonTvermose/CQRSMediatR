using MediatR;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Template.Core.Data;
using Template.Infrastructure.DataAccess;

namespace Template.Core.Command
{
    public class InsertLogEntryCommandHandler : AsyncRequestHandler<InsertLogEntryCommand>
    {
        private readonly IMediator _mediator;
        private readonly ApplicationDbContext _dbContext;
        
        public InsertLogEntryCommandHandler(IMediator mediator, ApplicationDbContext dbContext)
        {
            _mediator = mediator;
            _dbContext = dbContext;
        }

        protected override async Task Handle(InsertLogEntryCommand command, CancellationToken cancellationToken)
        {
            var context = command.ExceptionContext;
            var log = new LogEntry
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
            };
            try
            {
                if(context.HttpContext.Request.Method == "GET")
                {
                    log.Data = context.HttpContext.Request.QueryString.Value;
                } 
                else if (context.HttpContext.Request.Method == "POST")
                {
                    if (context.HttpContext.Request.HasFormContentType)
                    {
                        var form = await context.HttpContext.Request.ReadFormAsync();
                        var options = new JsonSerializerOptions
                        {
                            WriteIndented = true,
                            MaxDepth = 2
                        };
                        log.Data = JsonSerializer.Serialize(form, options);
                    } 
                    else
                    {
                        using (var reader = new StreamReader(context.HttpContext.Request.Body))
                        {
                            var body = await reader.ReadToEndAsync();
                            log.Data = body;
                        }
                    }
                }
            }
            catch { }
            _dbContext.LogEntries.Add(log);
            await _dbContext.SaveChangesAsync();

            await _mediator.Publish(new LogEntryInsertedNotification(log));
        }
    }
}
