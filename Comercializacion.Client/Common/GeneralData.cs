namespace Comercializacion.Client.Common
{
    using System.Configuration;

    /// <summary>
    /// clase en donde se obtienen los datos generales de la aplicacion
    /// </summary>
    public class GeneralData
    {
        /// <summary>
        /// dias en los que expirará la session
        /// </summary>
        public static int DaysExpireSession
        {
            get
            {
                return 3;
            }
        }

        /// <summary>
        /// nombre de la coockie de la aplicacion
        /// </summary>
        public static string CookieName
        {
            get
            {
                return "CookieComClient";
            }
        }

        /// <summary>
        /// nombre de la aplicacion
        /// </summary>
        public static string AppName
        {
            get
            {
                return ConfigurationManager.AppSettings["AppName"];
            }
        }

        /// <summary>
        /// url del api  donde se encuentra la logica
        /// </summary>
        public static string UrlApiAcces
        {
            get
            {
                return ConfigurationManager.AppSettings["Url.ApiAcces"].ToString();
            }
        }
    }
}