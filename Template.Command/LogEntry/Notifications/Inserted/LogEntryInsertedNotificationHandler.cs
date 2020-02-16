using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Template.Core.Command
{
    public class LogEntryInsertedNotificationHandler : INotificationHandler<LogEntryInsertedNotification>
    {
        public Task Handle(LogEntryInsertedNotification notification, CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }
}
