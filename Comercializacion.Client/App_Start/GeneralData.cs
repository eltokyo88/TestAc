using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace Comercializacion.Client.App_Start
{
    public class GeneralData
    {
        /// <summary>
        /// Gets the api-access url from web.config
        /// </summary>
        public static string UrlApiAccess
        {
            get
            {
                return ConfigurationManager.AppSettings["Url.ApiAccess"].ToString();
            }
        }

        /// <summary>
        /// Gets the system name from web.config
        /// </summary>
        public static string SystemName
        {
            get
            {
                return ConfigurationManager.AppSettings["SystemName"].ToString();
            }
        }
    }
}