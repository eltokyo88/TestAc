using Hangfire;
using Hangfire.Dashboard;
using Microsoft.Owin;
using Owin;
using System.Web;

[assembly: OwinStartup(typeof(Startup.Startup))]

namespace Startup
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            GlobalConfiguration.Configuration.UseSqlServerStorage("<hangfireAreaComercial>");

            // Make `Back to site` link working for subfolder applications
            var options = new DashboardOptions { AppPath = VirtualPathUtility.ToAbsolute("~") };

            app.UseHangfireDashboard("/hangfire", options);
            app.UseHangfireServer();
            // Map Dashboard to the `http://<your-app>/hangfire` URL.
            //app.UseHangfireDashboard();

            /*GlobalConfiguration.Configuration.UseSqlServerStorage("hangfireAreaComercial");

            app.UseHangfireServer();

            */

            // Map Dashboard to the `http://<your-app>/hangfire` URL.
            /*app.UseHangfireDashboard("/hangfire", new DashboardOptions
            {
                Authorization = new[] { new MyAuthorizationFilter() }
            });*/
        }
    }

    public class MyAuthorizationFilter : IDashboardAuthorizationFilter
    {
        public bool Authorize(DashboardContext context)
        {
            // In case you need an OWIN context, use the next line, `OwinContext` class
            // is the part of the `Microsoft.Owin` package.
            var owinContext = new OwinContext(context.GetOwinEnvironment());

            // Allow all authenticated users to see the Dashboard (potentially dangerous).
            return owinContext.Authentication.User.Identity.IsAuthenticated;
        }
    }
}