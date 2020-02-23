using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Template.Core.Query.Queries.LogEntry;

namespace Template.Web.Controllers
{
    [Authorize]
    public class LogEntryController : BaseController
    {
        private readonly IMediator _mediator;

        public LogEntryController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetLogEntries()
        {
            var logEntries = await _mediator.Send(new ListLogEntriesQuery());
            return Ok(logEntries);
        }
    }
}
