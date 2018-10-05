namespace Comercializacion.Client.Filters
{
    using System.Web.Mvc;
    using System.Web.Routing;
    using Comercializacion.Client.Common;
    using BTC.Entities.Common;
    using BTC.ApiAcceso.Client;
    using Comercializacion.Service.BLL;
    using Forza.Core.Utils;
    using System.Configuration;

    public class EventInformationFilter : FilterAttribute, IActionFilter
    {

        void IActionFilter.OnActionExecuted(ActionExecutedContext filterContext)
        {
        }

        void IActionFilter.OnActionExecuting(ActionExecutingContext filterContext)
        {
            string nombreEvento = (string)filterContext.ActionParameters["eventName"];
            string lang = filterContext.ActionParameters.Count > 1 ? (string)filterContext.ActionParameters["lang"] : "ESP";
            GeneralClient generalClient = new GeneralClient(GeneralData.UrlApiAcces);
  
            if (string.IsNullOrEmpty(nombreEvento) || nombreEvento == "checkmein")
            {
                filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary { { "Controller", "Error" }, { "Action", "Error404" } });
            }

            Evento eveInfo = generalClient.GetEventInformation(nombreEvento);
            if (eveInfo == null)
            {
                filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary { { "Controller", "Error" }, { "Action", "Error404" } });
            }

            var lastEvent = (Evento)filterContext.HttpContext.Session["eventoInfo"];
            var lastLang = (string)filterContext.HttpContext.Session["LangData"];

            // Validamos que sigamos en el mismo evento, en caso contrario eliminamos la información de las sesiones
            if (lastEvent != null && eveInfo != null && lastEvent.IdEvento != eveInfo.IdEvento)
            {
                SessionManager.DeleteAllSessions();
                InitializeData(eveInfo, lang);
                filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary { { "Controller", "Home" }, { "Action", "Index" } });
            }

            if (!string.IsNullOrEmpty(lastLang) && lastLang != lang)
            {
                SessionManager.DeleteAllSessions();
                InitializeData(eveInfo, lang);
                filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary { { "Controller", "Home" }, { "Action", "Index" } });
            }

            if (eveInfo != null && lastEvent == null)
            {
                InitializeData(eveInfo, lang);
            }
        }

        /// <summary>
        /// metodo que se encarga de inicializar las variables necesarias
        /// </summary>
        /// <param name="eveInfo">datos del evento</param>
        /// <param name="language">lenguaje</param>
        private static void InitializeData(Evento eveInfo, string language)
        {
            HelpersClient helpersClient = new HelpersClient(GeneralData.UrlApiAcces);
            SessionManager.EventoData = eveInfo;
            SessionManager.UrlLogoEvento = helpersClient.GetUrlLong("logoEvento", eveInfo.IdEvento);
            SessionManager.logoContadorURL = helpersClient.GetUrlLong("logoContador", eveInfo.IdEvento);
            SessionManager.logoEventoGrandeURL = helpersClient.GetUrlLong("logoEventoGrande", eveInfo.IdEvento);
            SessionManager.logoEventoChiquitoURL = helpersClient.GetUrlLong("logoEventoChiquito", eveInfo.IdEvento);
            SessionManager.TermsConditionsResource = helpersClient.GetUrlLong("terminosCondicionesAreaComercial", eveInfo.IdEvento);
            SessionManager.PrivacyPoliciesResource = helpersClient.GetUrlLong("politicasPrivacidadAreaComercial", eveInfo.IdEvento);
            SessionManager.StandsDetails = helpersClient.GetUrlLong("detallesStandsAreaComercial", eveInfo.IdEvento);
            InitializeLang(eveInfo, language);
        }

        /// <summary>
        /// inicializa las etiquetas dependiendo el lenguaje
        /// </summary>
        /// <param name="eveInfo">datos del evento</param>
        /// <param name="language">lenguaje</param>
        private static void InitializeLang(Evento eveInfo, string language)
        {
            int systemInformation = SystemService.GetSystemIdLang(ConfigurationManager.AppSettings["SystemName"]);
            GeneralClient generalClient = new GeneralClient(GeneralData.UrlApiAcces);
            SessionManager.LangData = language;
            var tags = systemInformation.IsNotEmptyOrNull() ? generalClient.GetTags(eveInfo.IdEvento, language, null, systemInformation) : generalClient.GetTags(eveInfo.IdEvento, language);
            SessionManager.ListTags = tags;            
        }
    }
}