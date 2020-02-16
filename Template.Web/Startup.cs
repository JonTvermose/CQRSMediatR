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
using Template.Core.Query;
using Template.Web.Extensions;

namespace Template.Web
{
    public class Startup
    {
        private readonly string AllowedSpecificOrigins = "_allowedSpecificOrigins";

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
                        .AllowAnyMethod();
                });
            });

            // Database
            services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
            services.AddDbContext<LogDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            services.AddControllersWithViews();

            // Automapper
            services.AddAutoMapper(new Type[] { typeof(MappingProfile) });

            // MediatR
            services.AddMediatR(typeof(InsertLogEntryCommandHandler).Assembly, typeof(QueryDb).Assembly);

            // Dependency injection
            services.AddDependencyInjectionSetup();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
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

            app.UseAuthorization();

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
