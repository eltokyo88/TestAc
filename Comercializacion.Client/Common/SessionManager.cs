namespace Comercializacion.Client.Common
{    
    using System.Collections.Generic;    
    using System.Linq;
    using System.Web;
    using BTC.Entities.Common;
    using Comercializacion.Service.Model;

    /// <summary>
    /// clase que se encarga de las variables de session
    /// </summary>
    public class SessionManager
    {
        /// <summary>
        /// Usuario de la Sesión actual
        /// </summary>
        public static UserService.UserAdmin UserSession
        {
            get
            {
                return (UserService.UserAdmin)HttpContext.Current.Session["UserAdmin"];
            }

            set
            {
                HttpContext.Current.Session["UserAdmin"] = value;
            }
        }

        /// <summary>
        /// Datos del usuario como cliente
        /// </summary>
        public static UserService.UserClient UserClient
        {
            get
            {
                return (UserService.UserClient)HttpContext.Current.Session["UserClient"];
            }

            set
            {
                HttpContext.Current.Session["UserAdmin"] = value;
            }
        }

        /// <summary>
        /// Datos generales del evento
        /// </summary>
        public static Evento EventoData
        {
            get
            {
                return (Evento)HttpContext.Current.Session["eventoInfo"];
            }

            set
            {
                HttpContext.Current.Session["eventoInfo"] = value;
            }
        }

        /// <summary>
        /// URL asociada al logo configurado para el evento
        /// </summary>
        public static string UrlLogoEvento
        {
            get
            {
                return (string)HttpContext.Current.Session["UrlLogoEvento"];
            }

            set
            {
                HttpContext.Current.Session["UrlLogoEvento"] = value;
            }
        }

        /// <summary>
        /// Lista de etiquetas de acuerdo al idioma actual de la página
        /// </summary>
        public static List<EtiquetaIdioma> ListTags
        {
            get
            {
                return (List<EtiquetaIdioma>)HttpContext.Current.Session["TagsEvent"];
            }
            set
            {
                HttpContext.Current.Session["TagsEvent"] = value;
            }
        }

        /// <summary>
        /// Listado de los elementos que se han agregado al carrito de compras
        /// </summary>
        public static List<ItemCarrito> ListItemsCarrito
        {
            get
            {
                return (List<ItemCarrito>)HttpContext.Current.Session["ItemsCarrito"];
            }
            set
            {
                HttpContext.Current.Session["ItemsCarrito"] = value;
            }
        }

        /// <summary>
        /// Identificador del lenguaje
        /// </summary>
        public static string LangData
        {
            get
            {
                return (string)HttpContext.Current.Session["LangData"];
            }
            set
            {
                HttpContext.Current.Session["LangData"] = value;
            }
        }        

        /// <summary>
        /// Metodo que se encarga de eliminar todas las variables de session
        /// </summary>
        public static void DeleteAllSessions()
        {
            HttpContext.Current.Session.RemoveAll();
            HttpContext.Current.Session.Clear();
        }

        /// <summary>
        /// Método que se encarga de obtener el texto que se requiere dentro de las etiquetas de idioma
        /// </summary>
        /// <param name="keyText">Llave de la etiqueta que se buscará</param>
        /// <returns>Texto a colocar de acuerdo a la etiqueta solicitada</returns>
        public static string GetText(string keyText)
        {
            if (ListTags == null || ListTags.Count == 0)
            {
                return string.Empty;
            }

            var texto = ListTags.Where(ele => ele.Etiqueta_id == keyText).SingleOrDefault();
            return texto == null ? string.Empty : texto.Etiqueta_descripcion;
        }

        /// <summary>
        /// URL del logo que se va mostrar en la pantalla del contador
        /// </summary>
        public static string logoContadorURL
        {
            get
            {
                return (string)HttpContext.Current.Session["logoContadorURL"];
            }

            set
            {
                HttpContext.Current.Session["logoContadorURL"] = value;
            }
        }

        /// <summary>
        /// URL asociado al logo del evento, en un tamaño más grande
        /// </summary>
        public static string logoEventoGrandeURL
        {
            get
            {
                return (string)HttpContext.Current.Session["logoEventoGrandeURL"];
            }

            set
            {
                HttpContext.Current.Session["logoEventoGrandeURL"] = value;
            }
        }

        /// <summary>
        /// URL asociado al logo del evento, en un tamaño más pequeño
        /// </summary>
        public static string logoEventoChiquitoURL
        {
            get
            {
                return (string)HttpContext.Current.Session["logoEventoChiquitoURL"];
            }

            set
            {
                HttpContext.Current.Session["logoEventoChiquitoURL"] = value;
            }
        }

        /// <summary>
        /// Términos y condiciones mostrados en la plataforma de área comercial
        /// </summary>
        public static string TermsConditionsResource
        {
            get
            {
                return (string)HttpContext.Current.Session["TermsConditionsResource"];
            }
            set
            {
                HttpContext.Current.Session["TermsConditionsResource"] = value;
            }
        }

        /// <summary>
        /// Políticas de privacidad mostradas en la plataforma de área comercial
        /// </summary>
        public static string PrivacyPoliciesResource
        {
            get
            {
                return (string)HttpContext.Current.Session["PrivacyPoliciesResource"];
            }
            set
            {
                HttpContext.Current.Session["PrivacyPoliciesResource"] = value;
            }
        }

        /// <summary>
        /// Imagen que describe algunos detalles relacionados a los stands disponibles
        /// </summary>
        public static string StandsDetails
        {
            get
            {
                return (string)HttpContext.Current.Session["StandsDetails"];
            }
            set
            {
                HttpContext.Current.Session["StandsDetails"] = value;
            }
        }
    }
}