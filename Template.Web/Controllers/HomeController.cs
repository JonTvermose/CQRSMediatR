using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Template.Core.Query.Queries.StringResource;
using Template.Web.Models;
using Template.Web.Models.StringResourceModels;

namespace Template.Web.Controllers
{
    public class HomeController : BaseController
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IMediator _mediator;

        public HomeController(ILogger<HomeController> logger, IMediator mediator)
        {
            _logger = logger;
            _mediator = mediator;
        }

        public IActionResult Index()
        {
            ViewBag.SuccessMessage = ViewData["SuccessMessage"];
            ViewBag.ErrorMessage = ViewData["ErrorMessage"];
            ViewBag.InfoMessage = ViewData["InfoMessage"];
            return View();
        }

        public IActionResult CookieTest()
        {
            Response.Cookies.Append("authentication-cookie", "you_are_authenticated");
            return Ok(new { IsAuthenticated = true });
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
