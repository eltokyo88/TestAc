using Comercializacion.Client.Common;
using Hangfire;
using Hangfire.Dashboard;
using Microsoft.Owin;
using Owin;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace Comercializacion.Client
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            // Storage is the only thing required for basic configuration.
            // Just discover what configuration options do you have.
            GlobalConfiguration.Configuration.UseSqlServerStorage("hangfireAreaComercial");

            //.UseActivator(...)
            //.UseLogProvider(...)
        
        }

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

        protected void Application_Error(object sender, EventArgs e)
        {
            HttpContext context = System.Web.HttpContext.Current;
            string action = "error500";
            if (context != null && context.Request != null)
            {
                Exception exception = Server.GetLastError();
                Server.ClearError();
                if (exception != null)
                {
                    var evenWriter = new BTC.Common.Loging.EventViewerHelper(GeneralData.AppName);
                    evenWriter.WriteError(exception.ToString());
                }

                var httpError = exception as HttpException;
                if (httpError != null)
                {
                    switch (httpError.GetHttpCode())
                    {
                        case 404:
                            action = "error404";
                            break;
                        case 500:
                            action = "error500";
                            break;
                        default:
                            action = "error500";
                            break;
                    }
                }

                context.Response.Clear();
                RequestContext rc = ((MvcHandler)context.CurrentHandler).RequestContext;
                rc.RouteData.Values["action"] = action;
                rc.RouteData.Values["controller"] = "Error";
                IControllerFactory factory = ControllerBuilder.Current.GetControllerFactory();
                IController controller = factory.CreateController(rc, "Error");
                controller.Execute(rc);
            }
        }
    }
}
