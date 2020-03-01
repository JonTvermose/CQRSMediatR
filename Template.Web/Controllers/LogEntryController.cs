using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Template.Core.Data;
using Template.Core.Query.Queries.LogEntry;

namespace Template.Web.Controllers
{
    [Authorize]
    public class LogEntryController : BaseController
    {
        private readonly IMediator _mediator;
        private readonly UserManager<ApplicationUser> _userManager;

        public LogEntryController(IMediator mediator, UserManager<ApplicationUser> userManager)
        {
            _mediator = mediator;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetLogEntries()
        {
            var logEntries = await _mediator.Send(new ListLogEntriesQuery());
            return Ok(logEntries);
        }

        [HttpGet]
        public async Task<IActionResult> GetUserActivity()
        {
            var user = await _userManager.GetUserAsync(User);
            var userActivity = await _mediator.Send(new GetByUserIdLogEntryQuery(user.Id));
            return Ok(userActivity);
        }
    }
}
