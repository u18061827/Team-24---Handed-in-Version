using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using The_Food_Works_WebAPI.Models;
using The_Food_Works_WebAPI.services;

namespace The_Food_Works_WebAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // public string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers().AddNewtonsoftJson(options =>
             options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);
            services.AddDbContext<TheFoodWorksContext>(options =>
             options.UseSqlServer(Configuration.GetConnectionString("TheFoodWorksDB")));
            services.AddCors(options => options.AddDefaultPolicy(
                builder =>
                {
                    builder.AllowAnyOrigin();
                    builder.AllowAnyHeader();
                    builder.AllowAnyMethod();
                }));
            services.AddControllers();
            services.AddDbContext<TheFoodWorksContext>(options =>
             options.UseSqlServer(Configuration.GetConnectionString("TheFoodWorksDB")));
            // Make sure you call this previous to AddMvc
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_3_0);
            services.AddScoped<AuditFilterAttribute>();

            //ADD CORS
            string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
            services.AddCors(options =>
            {
                options.AddPolicy(name: MyAllowSpecificOrigins,
                                  builder =>
                                  {
                                      builder.WithOrigins("http://localhost:4200",
                                                            "https://localhost:4200",
                                                          "https://localhost:44325");
                                      builder.AllowAnyHeader();
                                      builder.AllowAnyMethod();
                                      builder.AllowCredentials();
                                  });
            });

            //END ADD CORS

            //services.AddAuthentication(options =>
            //{
            //    options.DefaultAuthenticateScheme = "JwtBearer";
            //    options.DefaultChallengeScheme = "JwtBearer";
            //}).AddJwtBearer("JwtBearer", jwtOptions =>
            //   {
            //       jwtOptions.TokenValidationParameters = new TokenValidationParameters()
            //       {
            //           ValidateIssuer = false,
            //           ValidateAudience = false,
            //       };
            //   }
            //);
            //END ADD CORS
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        //public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        //{
        //    services.AddCors(options => options.AddDefaultPolicy(
        //        builder =>
        //        {
        //            builder.AllowAnyOrigin();
        //            builder.AllowAnyHeader();
        //            builder.AllowAnyMethod();
        //        })); // Make sure you call this previous to AddMvc
        //    services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_3_0);
        //}

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseCors();

            app.UseCors("_myAllowSpecificOrigins");

            app.UseCors(x => x
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());

            app.UseHttpsRedirection();

            //ADD CORS
            app.UseCors("_myAllowSpecificOrigins");

            app.UseRouting();

            app.UseCors();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}