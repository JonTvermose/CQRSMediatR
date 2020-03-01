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
            var log = command.LogEntry;
            _dbContext.LogEntries.Add(log);
            await _dbContext.SaveChangesAsync();

            await _mediator.Publish(new LogEntryInsertedNotification(log));
        }
    }
}
