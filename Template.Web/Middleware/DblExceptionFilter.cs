using MediatR;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Diagnostics;
using System.IO;
using Template.Core.Command;
using Template.Core.Data;
using Template.Infrastructure.DataAccess;

namespace Template.Web.Middleware
{
    public class DblExceptionFilter : ExceptionFilterAttribute
    {
        private readonly IMediator _mediator;

        public DblExceptionFilter(IMediator mediator)
        {
            _mediator = mediator;
        }

        public override void OnException(ExceptionContext context)
        {
            // No uncaught exceptions here, or we would crash the server
            try
            {
                _mediator.Send(new InsertLogEntryCommand(context)).GetAwaiter().GetResult();
            }
            catch { }
        }
    }

}
