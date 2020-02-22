using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Template.Core.Query;
using Template.Infrastructure.DataAccess;
using Template.Utility.Email.Services;
using Template.Utility.Services;
using Template.Web.Middleware;

namespace Template.Web.Extensions
{
    public static class IServiceCollectionExtensions
    {
        public static void AddDependencyInjectionSetup(this IServiceCollection services)
        {
            // Utility
            services.AddTransient<IHttpContextAccessor, HttpContextAccessor>();
            services.AddTransient<SmtpMailSender>();
            services.AddTransient<ViewRenderService>();

            // Data
            services.AddTransient<QueryDb>();

            // Misc
            services.AddScoped<DblExceptionFilter>();

        }
    }
}
