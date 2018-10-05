using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Comercializacion.Client.Controllers
{
    public class ErrorController : Controller
    {
        // GET: Error
        public ActionResult Index()
        {
            return View();
        }
        
        public ActionResult Error404()
        {
            ViewBag.GoogleAnalyticsId = string.Empty;
            Response.ContentType = "text/html";
            Response.TrySkipIisCustomErrors = true;
            return View("Error404");
        }
        
        public ActionResult Error500()
        {
            ViewBag.GoogleAnalyticsId = string.Empty;
            Response.ContentType = "text/html";
            Response.TrySkipIisCustomErrors = true;
            return View("Error");
        }
    }
}