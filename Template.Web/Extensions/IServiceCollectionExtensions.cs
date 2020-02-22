using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Template.Core.Query;
using Template.Infrastructure.DataAccess;
using Template.Web.Middleware;

namespace Template.Web.Extensions
{
    public static class IServiceCollectionExtensions
    {
        public static void AddDependencyInjectionSetup(this IServiceCollection services)
        {
            // Utility
            services.AddTransient<IHttpContextAccessor, HttpContextAccessor>();

            // Data
            services.AddTransient<QueryDb>();

            // Misc
            services.AddScoped<DblExceptionFilter>();

        }
    }
}
