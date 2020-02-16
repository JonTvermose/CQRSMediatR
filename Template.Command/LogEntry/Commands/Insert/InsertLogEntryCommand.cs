using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Text;
using MediatR;

namespace Template.Core.Command
{
    public class InsertLogEntryCommand : IRequest
    {
        public ExceptionContext ExceptionContext { get; set; }
    }
}
