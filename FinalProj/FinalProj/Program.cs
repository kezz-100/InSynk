using FinalProj;
using FinalProj.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;


namespace FinalProj
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
            //mail dumbness forget this
            //builder.Services.AddTransient<IEmailSender, EmailSender>();
            //builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
            //builder.Services.AddScoped<EmailService>();

            //builder.Services.AddIdentity<IdentityUser, IdentityRole>()
            //.AddEntityFrameworkStores<SchoolContext>().AddDefaultTokenProviders();

        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
