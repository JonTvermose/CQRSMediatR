using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Template.Web.Middleware;

namespace Template.Web.Controllers
{
    [ServiceFilter(typeof(DblExceptionFilter))]
    public abstract class BaseController : Controller
    {
    }
}
