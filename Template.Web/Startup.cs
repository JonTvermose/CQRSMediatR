using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Template.Infrastructure.DataAccess;
using Template.Web.Mappings;
using MediatR;
using Template.Core.Command;
using Template.Web.Extensions;
using System.Text.Json;
using Template.Core.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Template.Utility.Models;
using Template.Core.Query.Queries.LogEntry;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Http;
using System.Threading;

namespace Template.Web
{
    public class Startup
    {
        private readonly string AllowedSpecificOrigins = "_allowedSpecificOrigins";
        private readonly bool DEBUG_LOADING_TIMES = false;

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy(AllowedSpecificOrigins,
                builder =>
                {
                    builder.WithOrigins(Configuration.GetSection("AllowedOrigins").GetChildren().Select(x => x.Value).ToArray())
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });

            // Database
            services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            // Identity
            services
                .AddIdentity<ApplicationUser, IdentityRole>(options => {
                    // Make sure these match the criteria in confirm-account.tsx
                    options.Password.RequireDigit = true;
                    options.Password.RequiredLength = 10;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequireUppercase = false;
                    options.Password.RequireLowercase = false;
                })
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();
            services
                .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme);

            // ValidateAntiForgeryToken
            services.AddAntiforgery(options =>
            {
                options.HeaderName = "x-xsrf-token"; // MUST be lowercase
                options.SuppressXFrameOptionsHeader = false;
            });

            // Session (ViewData)
            services.AddSession();
            services.AddSingleton<ITempDataProvider, CookieTempDataProvider>();

            // IOptions monitor
            services.AddOptions();
            services.Configure<SmtpSettings>(Configuration.GetSection("SmtpSettings"));

            // MVC
            services.AddControllersWithViews()
                .AddRazorRuntimeCompilation()
                .AddJsonOptions(options => options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase);

            // Setup for load balancers/proxys and docker
            services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
            });

            // Automapper
            services.AddAutoMapper(new Type[] { typeof(MappingProfile) });

            // MediatR
            services.AddMediatR(typeof(InsertLogEntryCommandHandler).Assembly, typeof(ListLogEntriesQuery).Assembly);

            // Dependency injection
            services.AddDependencyInjectionSetup();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IAntiforgery antiforgery)
        {
            app.UseForwardedHeaders();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();

                // Used for debugging loading spinners etc
                app.Use(async (context, next) =>
                {
                    if (DEBUG_LOADING_TIMES)
                    {
                        Thread.Sleep(1000);
                    }
                    await next();
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseCors(AllowedSpecificOrigins);

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseSession();

            // Antiforgery for JavaScript manual cookie handling (see code in client/services/HttpService.ts)
            app.Use(next => context =>
            {
                var path = context.Request.Path.Value;
                if (path == "/" || path.Contains("home/refreshtoken", StringComparison.OrdinalIgnoreCase))
                {
                    // The request token can be sent as a JavaScript-readable cookie, 
                    var tokens = antiforgery.GetAndStoreTokens(context);
                    context.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken, new CookieOptions() { HttpOnly = false });
                }
                return next(context);
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");

                endpoints.MapFallbackToController("Index", "Home");
            });
        }
    }
}
