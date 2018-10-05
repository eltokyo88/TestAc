using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using BTC.ApiAcceso.Client;
using Comercializacion.Client.App_Start;
using BTC.Entities.Abstracts;
using BTC.Entities.Common;

namespace Comercializacion.Client.Controllers
{
    public class BaseController : Controller
    {
        /// <summary>
        /// Api access Mailing Client
        /// </summary>
        internal MailingClient MailingClient = new MailingClient(GeneralData.UrlApiAccess);

        /// <summary>
        /// Api access General Client
        /// </summary>
        internal GeneralClient GeneralClient = new GeneralClient(GeneralData.UrlApiAccess);

    }
}
