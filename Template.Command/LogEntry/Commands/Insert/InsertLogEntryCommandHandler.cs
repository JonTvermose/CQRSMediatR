using MediatR;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Template.Core.Data;
using Template.Infrastructure.DataAccess;

namespace Template.Core.Command
{
    public class InsertLogEntryCommandHandler : AsyncRequestHandler<InsertLogEntryCommand>
    {
        private readonly IMediator _mediator;
        private readonly LogDbContext _dbContext;
        
        public InsertLogEntryCommandHandler(IMediator mediator, LogDbContext dbContext)
        {
            _mediator = mediator;
            _dbContext = dbContext;
        }

        protected override Task Handle(InsertLogEntryCommand command, CancellationToken cancellationToken)
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
                // TODO doesnt read actual contents of request
                using (var reader = new StreamReader(context.HttpContext.Request.Body))
                {
                    var body = reader.ReadToEndAsync().GetAwaiter().GetResult();
                    log.Data = body;
                }
            }
            catch { }
            _dbContext.LogEntries.Add(log);
            _dbContext.SaveChanges();

            _mediator.Publish(new LogEntryInsertedNotification(log));

            return Task.CompletedTask;
        }
    }
}
