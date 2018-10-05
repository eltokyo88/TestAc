namespace Comercializacion.Client.Controllers
{
    using System;
    using System.Web.Mvc;
    using BTC.Common.WebUtils;
    using Comercializacion.Client.Common;
    using Comercializacion.Client.Filters;
    using Comercializacion.Service.BLL;
    using System.IO;
    using System.Collections.Generic;
    using Comercializacion.Service.Model;
    using Comercializacion.Service.DTO;
    using BTC.Entities.Common;
    using System.Web;
    using System.Web.Security;
    using Forza.Core.Utils;
    using System.Configuration;
    using System.Text;
    using System.Net;

    public class HomeController : Controller
    {
        #region Iniciar sesión 

        /// <summary>
        /// pagina inicial del congreso
        /// </summary>
        /// <param name="eventName">nombre del evento o siglas</param>
        /// <returns>vista correspondiente</returns>
        [EventInformationFilter]
        public ActionResult Index(string eventName, string lang)
        {
            ViewBag.BodyClass = "bgHome";

            int idEvento = SessionManager.EventoData.IdEvento;
            this.ViewData["languageId"] = SystemService.GetDefaultLanguage(idEvento);
            this.ViewData["eventVenueCity"] = SessionManager.EventoData.Evento_sede;
            EventoComercial event_SiteDate = EventoComercialService.GetEventById(idEvento);
            this.ViewData["eventName"] = event_SiteDate.EventName;
            DateTime siteDate = event_SiteDate.SiteDate;
            SessionManager.CompraCounterTime = event_SiteDate.CompraTiempo;
            this.ViewData["eventDateRange"] = getFormattedEventDates(SessionManager.EventoData.EventoFechaInicia, SessionManager.EventoData.EventoFechaTermina);
            int rst = DateTime.Compare(DateTime.Now, siteDate);
            if(rst == -1)
            {
                this.ViewData["siteDate"] = siteDate.ToString("yyyy-MM-dd HH:mm:ss");
                return View("contadorDeSitio");
            }
            else
            return View();
        }

        /// <summary>
        /// login de usuario
        /// </summary>
        /// <param name="eventName">nombre del evento o siglas</param>
        /// <returns>vista correspondiente</returns>
        [EventInformationFilter]
        public ActionResult Login(string eventName, string lang)
        {
            ViewBag.ShowMenu = false;
            ViewBag.ShowPartner = false;
            return View();
        }

        /// <summary>
        /// Inicia sesión en automático desde URL
        /// </summary>
        /// <param name="eventName">Nombre del evento</param>
        /// <param name="lang">Id del idioma</param>
        /// <param name="user">usuario de ingreso al sistema </param>
        /// <param name="pass">contraseña de ingreso al sistema</param>
        /// <returns>Vista para ingresar</returns>
        [EventInformationFilter]
        public ActionResult LoginMail(string eventName, string lang, string user, string pass)
        {
           UserService.UserAdmin u = new UserService.UserAdmin
            {
                User_email = user,
                User_Password = pass
            };
      
            string redirectAction = string.Empty;
           
            var userClient = new UserService.UserClient();
            var userRequestData = CookiesHelper.GetUserRequestData();
            var tokenSession = new UserService.UserSessionToken()
            {
                User_host_address = userRequestData.UserHostAddress,
                User_agent = userRequestData.UserAgent,
                User_browser_name = userRequestData.UserBrowserName,
                User_raw_url = userRequestData.UserRawUrl,
                Evento_id = SessionManager.EventoData.IdEvento
            };

            var expireDate = DateTime.Now.AddDays(GeneralData.DaysExpireSession);


            //Vaciando el carrito de la sesión
            SessionManager.ListItemsCarrito = null;
            var modelretun = new CarritoPartialDto
            {
                Items = SessionManager.ListItemsCarrito
            };
           

            var response = userClient.LoginUsingSystemName(u, tokenSession, GeneralData.AppName, expireDate);

            if (response.IsSuccess)
            {
                SessionManager.UserSession = response.User;
                CookiesHelper.AddCookie(GeneralData.CookieName, response.SessionToken, expireDate);
                int eventId = SessionManager.EventoData.IdEvento;

                int loginUser = Service.BLL.ClientService.GetLoginUserId(user, eventId);
                if (loginUser == 0)
                {
                    Service.BLL.ClientService.UpdateLoginUserId(response.User.User_id, user, eventId);
                    loginUser = Service.BLL.ClientService.GetLoginUserId(user, eventId);
                }

                Client c = Service.BLL.ClientService.GetClientInformation(loginUser, eventId);
                SessionManager.UserSession.User_name = c.Name;

                return this.RedirectToAction("Plano", "Exhibitor");
               
            }

            return this.RedirectToAction("Index", "Home");
        }
        
        /// <summary>
        /// metodo que se encarga de relizar el login al sitio
        /// </summary>
        /// <param name="user">usuarioa a validar</param>
        /// <param name="rememberPassword">bandera que indica si recordara el pass o no</param>
        /// <returns>accion resultante</returns>
        [HttpPost]
        public ActionResult LogInSite(string eventName, string lang, UserService.UserAdmin user, bool rememberPassword = false)
        {
            string redirectAction = string.Empty;

            if (user == null || string.IsNullOrEmpty(user.User_email) || string.IsNullOrEmpty(user.User_Password))
            {
                //return RedirectToAction("Index", "Home");
            }

            var userClient = new UserService.UserClient();
            var userRequestData = CookiesHelper.GetUserRequestData();
            var tokenSession = new UserService.UserSessionToken()
            {
                User_host_address = userRequestData.UserHostAddress,
                User_agent = userRequestData.UserAgent,
                User_browser_name = userRequestData.UserBrowserName,
                User_raw_url = userRequestData.UserRawUrl,
                Evento_id = SessionManager.EventoData.IdEvento
            };

            var expireDate = DateTime.Now.AddDays(GeneralData.DaysExpireSession);

            var response = userClient.LoginUsingSystemName(user, tokenSession, GeneralData.AppName, expireDate);

            if (response.IsSuccess)
            {
                SessionManager.UserSession = response.User;
                CookiesHelper.AddCookie(GeneralData.CookieName, response.SessionToken, expireDate);
                int eventId = SessionManager.EventoData.IdEvento;

                int loginUser = Service.BLL.ClientService.GetLoginUserId(user.User_email, eventId);
                if (loginUser == 0)
                {
                    Service.BLL.ClientService.UpdateLoginUserId(response.User.User_id, user.User_email, eventId);
                    loginUser = Service.BLL.ClientService.GetLoginUserId(user.User_email, eventId);
                }
                try
                {
                    Client c = Service.BLL.ClientService.GetClientInformation(loginUser, eventId);
                    SessionManager.UserSession.User_name = c.Name;

                    redirectAction = Url.Action("Plano", "Exhibitor");
                }
                catch (Exception exception)
                {
                    BTC.Common.Loging.LogMethodHelper.LogError(exception);
                    return this.RedirectToAction("Index", "Home");
                }
            }

            //Vaciando el carrito de la sesión
            SessionManager.ListItemsCarrito = null;
            var modelretun = new CarritoPartialDto
            {
                Items = SessionManager.ListItemsCarrito
            };
            return Json(new { info = response.Message, redirectAction }, JsonRequestBehavior.AllowGet);
            
            //return this.RedirectToAction("Plano", "Exhibitor");
        }

        /// <summary>
        /// Manda correo electrónico con link y token para reestablecer la contraseña
        /// </summary>
        /// <param name="eventName">Nombre del evento</param>
        /// <param name="lang">Id de idioma de la aplicación</param>
        /// <param name="email">Correo que solicita la recuperación de contraseña</param>
        /// <returns>Respuesta del envio correo o no del correo para recuperación de contraseña</returns>
        [HttpPost]
        public string ForgotPasswordSite(string eventName, string lang, string email)
        {
            Evento evento = (Evento)this.Session["eventoInfo"];
            UserService.UserClient userClient = new UserService.UserClient();
            UserService.UserResponse respuesta = userClient.GenerateResetPasswordToken(email);
            string result = "";
            if (respuesta.IsSuccess)
            {
                string url = WebUtility.HtmlEncode(Request.Url.Scheme + "://" + Request.Url.Authority + Url.Action("ValidateToken", "Home", new { token = respuesta.ResetPasswordToken.ToString(), email }));
                var mailingService = new MailingService(evento.IdEvento, lang, 1);
                result = mailingService.SendMailForgotPassword(url, email, evento, lang);
            }
            else
            {
                result = respuesta.Message;
            }

            return result;
        }

        /// <summary>
        /// Valida token enviado por email
        /// </summary>
        /// <param name="eventName">Indo del evento</param>
        /// <param name="lang">Id del idioma</param>
        /// <param name="token">Token</param>
        /// <param name="email">Email</param>
        /// <returns>Respuesta del WS</returns>
        [EventInformationFilter]
        public ActionResult ValidateToken(string eventName, string lang, string token, string email)
        {
            Evento evento = (Evento)this.Session["eventoInfo"];
            UserService.UserClient userClient = new UserService.UserClient();
            UserService.UserResponse res = userClient.IsValidUserTokenUsingSystemName(token, eventName);
            if (!res.IsSuccess)
            {
                this.Session["email"] = email;
                this.Session["token"] = token;
                return RedirectToAction("RecoverPassword");
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
        }

        /// <summary>
        /// Cambia contraseña del usuario
        /// </summary>
        /// <param name="eventName">Info del evento</param>
        /// <param name="lang">Id del idioma</param>
        /// <param name="contrasena">Contraseña</param>
        /// <returns>Respuesta del ws</returns>
        [HttpPost]
        public string ChangePassword(string eventName, string lang, string contrasena)
        {
            string email = (string)this.Session["email"];
            string token = (string)this.Session["token"];

            var userClient = new UserService.UserClient();
            var res = userClient.ChangePasswordByToken(token, email, contrasena);

            return res.Message;
        }

        /// <summary>
        /// Manda a la vista de restaurar contraseña
        /// </summary>
        /// <param name="eventName">Info del evento</param>
        /// <param name="lang">Id del idioma</param>
        /// <param name="token">Token</param>
        /// <param name="email">Correo electrónico</param>
        /// <returns>Vista</returns>
        [EventInformationFilter]
        public ActionResult RecoverPassword(string eventName, string lang, string token, string email)
        {
            int idEvento = SessionManager.EventoData.IdEvento;
            this.ViewData["languageId"] = SystemService.GetDefaultLanguage(idEvento);

            return View("~/Views/Home/RestaurarContrasena.cshtml");
        }

        #endregion
        
        #region Registro

        [HttpPost]
        public ActionResult RegisterSite(string eventName, string lang, UserService.UserAdmin user, bool rememberPassword = false)
        {
            var userClient = new UserService.UserClient();
            var permisos = new List<UserService.UserSystemAdmin>();

            // userClient.CreateUser(user, permisos);
            return this.RedirectToAction("Index", "Login");
        }

        /// <summary>
        /// Guarda una nueva solicitud
        /// </summary>
        /// <param name="eventName">Nombre del evento</param>
        /// <param name="lang">Idioma</param>
        /// <param name="solicitud">Datos de la solicitud</param>
        /// <returns>Estatus de la solicitud</returns>
        [EventInformationFilter]
        public string RegisterNewAccount(string eventName, string lang, Solicitud solicitud)
        {
            string mainRoute = WebUtility.HtmlEncode(Request.Url.Scheme + "://" + Request.Url.Authority + Url.Action("Index", "Home"));
            string aprobarUrl = WebUtility.HtmlEncode(Request.Url.Scheme + "://" + Request.Url.Authority + Url.Action("AprobarSolicitud", "Home", new { email = solicitud.Email }));
            string rechazarUrl = WebUtility.HtmlEncode(Request.Url.Scheme + "://" + Request.Url.Authority + Url.Action("RechazarSolicitud", "Home", new { email = solicitud.Email }));
            int idEvento = SessionManager.EventoData.IdEvento;
            solicitud.EventId = idEvento;

            var registrado = RequestsService.IsMailRegistered(solicitud.Email, idEvento);

            if (registrado < 1)
            {
                UserService.UserSystemAdmin[] permisos = new UserService.UserSystemAdmin[1];
                UserService.UserSystemAdmin per = new UserService.UserSystemAdmin
                {
                    System_admin_id = 10,
                    User_role_id = 6,
                    Allows_multiple_sessions = true,
                    Evento_id = idEvento
                };

                permisos[0] = per;
                int idSistema = SystemService.GetSystemIdLang(ConfigurationManager.AppSettings["SystemName"]);


                UserService.UserSessionToken tokensUsuario = new UserService.UserSessionToken
                {
                    Evento_id = idEvento,
                    Token_created_date = DateTime.Now,
                    System_id = idSistema
                };

                UserService.UserAdmin usuario = new UserService.UserAdmin
                {
                    User_email = solicitud.Email,
                    User_name = solicitud.Representante,
                    User_status = solicitud.IsApproved,
                    User_given_name = solicitud.Representante,
                    User_date_created = DateTime.Now
                };

                var userClient = new UserService.UserClient();

                var answer = userClient.ExistUser(usuario, tokensUsuario, ConfigurationManager.AppSettings["AppName"]);
                if (answer.Message.Equals("Usuario no existe") || answer.Message.Equals("Usuario no tiene permiso para acceder a este sistema o evento"))
                {
                    if (answer.Message.Equals("Usuario no tiene permiso para acceder a este sistema o evento"))
                    {
                        var response = userClient.CreateUser(usuario, permisos);

                        if (response.IsSuccess)
                        {
                            solicitud.Contrasena = Membership.GeneratePassword(12, 1);

                            RequestsService.SaveRequest(solicitud);
                            string eventoPrevio = EventoComercialService.GetLastEventName(solicitud.Email);
                            var mailingService = new MailingService(SessionManager.EventoData.IdEvento, lang, 7);
                            mailingService.SendMailAccessAllowedNewEvent(solicitud.Representante, usuario.User_email, lang, "Ingresar", mainRoute, SessionManager.EventoData.EventoNombre, eventoPrevio);

                            //Se guarda nueva información del cliente
                            Service.BLL.ClientService.SaveNewClient(solicitud);
                        }

                        return response.Message;
                    }
                    else
                    {
                        usuario.User_Password = Membership.GeneratePassword(12, 1);
                        var response = userClient.CreateUser(usuario, permisos);

                        if (response.IsSuccess)
                        {
                            solicitud.Contrasena = usuario.User_Password;
                            RequestsService.SaveRequest(solicitud);

                            var mailingService = new MailingService(SessionManager.EventoData.IdEvento, lang, 3);
                            mailingService.SendMailRegisterRequest(solicitud, lang, aprobarUrl, rechazarUrl);

                            return "Ok";
                        }
                        else
                        {
                            return response.Message;
                        }
                    }
                }
                else
                {
                    return answer.Message;
                }

            }
            else
            {                
                return "Registrado";
            }
        }
    

        /// <summary>
        /// Muestra vista para aprobar solicitud
        /// </summary>
        /// <param name="eventName">Nombre del evento</param>
        /// <param name="lang">Id del idioma</param>
        /// <param name="email">Email del solicitante</param>
        /// <returns>Vista correspondiente</returns>
        [EventInformationFilter]
        public ActionResult AprobarSolicitud(string eventName, string lang, string email)
        {
            int idEvento = SessionManager.EventoData.IdEvento;
            this.ViewData["languageId"] = SystemService.GetDefaultLanguage(idEvento);

            this.ViewData["solicitud"] = RequestsService.GetSolicitud(email, SessionManager.EventoData.IdEvento);
            return this.View();
        }

        /// <summary>
        /// Muestra vista para rechazar solicitud
        /// </summary>
        /// <param name="eventName">Nombre del evento</param>
        /// <param name="lang">Id del idioma</param>
        /// <param name="email">Email del solicitante</param>
        /// <returns>Vista correspondiente</returns>
        [EventInformationFilter]
        public ActionResult RechazarSolicitud(string eventName, string lang, string email)
        {
            int idEvento = SessionManager.EventoData.IdEvento;
            this.ViewData["languageId"] = SystemService.GetDefaultLanguage(idEvento);

            this.ViewData["solicitud"] = RequestsService.GetSolicitud(email, SessionManager.EventoData.IdEvento);
            return this.View();
        }

        /// <summary>
        /// Manda mail de aprobacion con datos de acceso
        /// </summary>
        /// <param name="eventName">Datos del evento</param>
        /// <param name="lang">Id del idioma</param>
        /// <param name="email">Email del solicitante</param>
        /// <returns>Respuesta del envio correo o no del correo para recuperación de contraseña</returns>
        [EventInformationFilter]
        public string MandarMailAprobacion(string eventName, string lang, string email)
        {
            int idEvento = SessionManager.EventoData.IdEvento;
            Solicitud solicitud = RequestsService.GetSolicitud(email, idEvento);
            solicitud.EventId = idEvento;
            string respuestaMail = string.Empty;
            string ingresarLink = WebUtility.HtmlEncode(Request.Url.Scheme + "://" + Request.Url.Authority + Url.Action("LoginMail", "Home", new { user = email, pass = solicitud.Contrasena }));

            //Guardar nuevo usuario en el service 
            UserService.UserAdmin usuario = new UserService.UserAdmin
            {
                User_email = solicitud.Email,
                User_name = solicitud.Representante,
                User_status = solicitud.IsApproved,
                User_given_name = solicitud.Representante,
                User_date_created = DateTime.Now,
                User_Password = solicitud.Contrasena
            };

            UserService.UserSystemAdmin[] permisos = new UserService.UserSystemAdmin[1];
            UserService.UserSystemAdmin per = new UserService.UserSystemAdmin
            {
                System_admin_id = 10,
                User_role_id = 6,
                Allows_multiple_sessions = true,
                Evento_id = idEvento
            };
            permisos[0] = per;

            UserService.UserClient userClient = new UserService.UserClient();
            UserService.UserResponse response = userClient.CreateUser(usuario, permisos);

            // Marcar como aprobado en bd
            RequestsService.UpdateStatusRequest(solicitud.IdSolicitud, 1, idEvento);

            // Actualizar los campos del cliente
            Service.BLL.ClientService.SaveNewClient(solicitud);

            MailingService mailingService = new MailingService(SessionManager.EventoData.IdEvento, lang, 4);
            respuestaMail = mailingService.SendMailApproveRequest(solicitud, ingresarLink, lang);
            return respuestaMail;
        }

        /// <summary>
        /// Envía email de rechazo
        /// </summary>
        /// <param name="eventName">Datos del evento</param>
        /// <param name="lang">Id del idioma</param>
        /// <param name="email">Email</param>
        /// <param name="motivos">Motivos de rechazo</param>
        /// <returns>Estatus del email enviado</returns>
        [EventInformationFilter]
        public string MandarMailRechazo(string eventName, string lang, string email, string motivos)
        {
            int idEvento = SessionManager.EventoData.IdEvento;
            Solicitud solicitud = RequestsService.GetSolicitud(email, idEvento);
            solicitud.EventId = idEvento;

            //marcar como rechazado en bd
            RequestsService.UpdateStatusRequest(solicitud.IdSolicitud, 2, idEvento, motivos);

            var mailingService = new MailingService(SessionManager.EventoData.IdEvento, lang, 4);
            return mailingService.SendMailRejectRequest(solicitud, motivos, lang);
        }

        #endregion

        #region Mapa

        /// <summary>
        /// mapa informativo de las secciones
        /// </summary>
        /// <param name="eventName">nombre del evento o siglas</param>
        /// <returns>vista correspondiente</returns>
        [EventInformationFilter]
        public ActionResult Mapa(string eventName, string lang)
        {
            var datos = GetMapaData(eventName, lang);
            if (!datos)
            {
                return RedirectToAction("Index");
            }

            return View();
        }

        /// <summary>
        /// mapa con la  funcionalidad de compra
        /// </summary>
        /// <param name="eventName">nombre del evento o siglas</param>
        /// <returns>vista correspondiente</returns>
        [EventInformationFilter]
        public ActionResult MapaCompra(string eventName, string lang)
        {
            var datos = GetMapaData(eventName, lang);
            if (!datos)
            {
                return RedirectToAction("Index");
            }

            return View();
        }

        /// <summary>
        /// metodo que se encarga de inicializar los datos del mapa
        /// </summary>
        /// <returns></returns>
        private bool GetMapaData(string eventName, string lang)
        {
            var eventoComData = EventoComercialService.GetEventByIdRegistro(SessionManager.EventoData.IdEvento);
            int idCliente = 0;

            if (eventoComData == null)
            {
                return false;
            }

            if (SessionManager.UserSession != null)
            {
                Client c = Service.BLL.ClientService.GetClientInformation(SessionManager.UserSession.User_id, SessionManager.EventoData.IdEvento);
                idCliente = c.ClientId;
            }

            var place = PlaceService.GetPlaceById(eventoComData.PlaceId);
            var imgPlaceString = string.Empty;
            if (place.FileImageId > 0)
            {
                var imgPlace = FileResourceService.GetFileById(place.FileImageId);
                var byteArray = Convert.FromBase64String(imgPlace.FileData);
                var memStream = new MemoryStream(byteArray);
                var image = new System.Drawing.Bitmap(memStream);
                var imageHeight = image.Height;
                var imageWidth = image.Width;
                image.Dispose();

                ViewBag.ImageHeight = imageHeight;
                ViewBag.ImageWidth = imageWidth;
                imgPlaceString = "data:image/png;base64," + imgPlace.FileData;
            }

            ViewBag.ImgPlace = imgPlaceString;

            var imgEventString = string.Empty;
            var listClass = new List<StandConfiguration>();
            var standConf = new StandService();
            standConf.InicializaStands(eventoComData, 0, idCliente);
            ViewBag.ListaStands = standConf.ListStands;
            ViewBag.ImgEvent = imgEventString;
            ViewBag.ClassStyleData = standConf.ListaClases;
            ViewBag.ListClass = standConf.ListConfigurations;
            ViewBag.EsPrimeraVez = standConf.EsPrimeraVez;
            ViewBag.EventoComercialData = eventoComData;

            return true;
        }

        #endregion

        #region Descargables

        /// <summary>
        /// pantalla informativa del por que quiero ser expositor
        /// </summary>
        /// <param name="eventName">nombre del evento o siglas</param>
        /// <returns>vista correspondiente</returns>
        [EventInformationFilter]
        public ActionResult PorqueExpositor(string eventName, string lang)
        {
            return View();
        }

        /// <summary>
        /// pantalla informativa del por que quiero ser patrocinador
        /// </summary>
        /// <param name="eventName">nombre del evento o siglas</param>
        /// <returns>vista correspondiente</returns>
        [EventInformationFilter]
        public ActionResult PorquePatrocinador(string eventName, string lang)
        {
            return View();
        }

        #endregion

        #region Compra

        /// <summary>
        /// pantalla de pago de los stands
        /// </summary>
        /// <param name="eventName">nombre del evento o siglas</param>
        /// <param name="lang">Id del idioma</param>
        /// <param name="pago">Recibe 1 es INSERT nuevo pago y 2 si es UPDATE pago</param>
        /// <returns>vista correspondiente</returns>
        [EventInformationFilter]
        public ActionResult Pago(string eventName, string lang, int pago = 1)
        {
            ViewBag.BodyClass = "bgGray";
            ViewBag.ShowMenu = false;
            ViewBag.ShowPartner = false;
            
            try
            {
                if (SessionManager.UserSession.User_email == null)
                {
                    return this.RedirectToAction("Index", "Home");
                }
                
                //Se limpian variables de archivos de pago
                this.Session["nombreArchivo"] = "";
                this.Session["bytesArchivo"] = "";

                string emailClient = SessionManager.UserSession.User_email;
                int idEvento = SessionManager.EventoData.IdEvento;

                this.ViewData["products"] = SessionManager.ListItemsCarrito;
                this.ViewData["client"] = Service.BLL.ClientService.GetDatosPersonale(emailClient, idEvento);
                this.ViewData["catalogoPagos"] = PaymentMethodsService.GetCatalogoPayment(SessionManager.EventoData.IdEvento, lang);
                this.ViewData["catalogoPais"] = CatalogoService.GetCatalogoPais(lang);
                this.ViewData["catalogoPlazo"] = TermPaymentService.GetTermPayments(idEvento);
                this.ViewData["porcentajePago"] = SystemService.GetPaymentPercentage(idEvento);
                this.ViewData["languageId"] = SystemService.GetDefaultLanguage(idEvento);
                this.ViewData["datosFacturacion"] = FiscalDataService.GetDatosFiscales(emailClient);
                this.ViewData["tipoPago"] = pago;

                this.ViewData["datosFacturacionJson"] = Newtonsoft.Json.JsonConvert.SerializeObject(FiscalDataService.GetDatosFiscales(emailClient));
                SessionManager.articulosQuitados = string.Empty;
                if (SessionManager.ListItemsCarrito != null && SessionManager.ListItemsCarrito.Count > 0)
                {
                    SessionManager.tipoDePago = Convert.ToString(pago);
                    if (pago == 1)
                    {
                         
                        SessionManager.articulosQuitados = ProcessSessionManagerItemCarrito(SessionManager.ListItemsCarrito);
                        this.ViewData["products"] = SessionManager.ListItemsCarrito;
                    }
                    else if (pago == 2)
                    {
                        SessionManager.articulosQuitados = string.Empty;
                    }

                    return View();
                }
                else
                    return this.RedirectToAction("Plano", "Exhibitor");
            }
            catch (Exception exception)
            {
                BTC.Common.Loging.LogMethodHelper.LogError(exception);
                return this.RedirectToAction("Index", "Home");
            }
        }


        /// <summary>
        /// Guarda en sesión los nuevos elementos a pagar
        /// </summary>
        /// <param name="eventName">Nombre del evento</param>
        /// <param name="lang">Id del idioma</param>
        /// <param name="products">Lista de artículos a pagar</param>
        /// <returns>Redirige a la sección de pagos</returns>
        [EventInformationFilter]
        public ActionResult RegistrarPago(string eventName, string lang, List<ItemCarrito> products, string lastPaymentPromise, decimal paymentHasNotPayed, int paymentId, int paymentMethodId, int tipoPago)
        {
            this.Session["lastPaymentPromise"] = lastPaymentPromise;
            this.Session["paymentHasNotPayed"] = paymentHasNotPayed;
            this.Session["paymentId"] = paymentId;
            this.Session["paymentMethodId"] = paymentMethodId;
            this.Session["tipoPagoPayment"] = tipoPago;

            SessionManager.ListItemsCarrito = null;
            var modelretun = new CarritoPartialDto
            {
                Items = SessionManager.ListItemsCarrito
            };

            SessionManager.ListItemsCarrito = products;

            return RedirectToAction("Pago", new { pago = "2" });
        }

        [HttpPost]
        public void AgregarCarritoEnSession(List<ItemCarrito> products)
        {
            SessionManager.ListItemsCarrito = products;
        }

        /// <summary>
        /// metodo que se encarga de dibujar el carrito de compras
        /// </summary>
        /// <param name="idDelete">id a eliminar del carrito en caso de que sea necesario</param>
        /// <param name="idDelete">bandera que indica si el elemento a buscar es un stando o no</param>
        /// <returns>vista parcial</returns>
        public ActionResult ShowCarrito(int? idDelete, bool? isStand)
        {
            if (idDelete.HasValue && idDelete.Value > 0 && isStand.HasValue)
            {
                var indexDelete = SessionManager.ListItemsCarrito.FindIndex(ele => ele.IdElement == idDelete && ele.IsStand == isStand.Value);
                if (indexDelete >= 0)
                {
                    if (isStand.Value)
                    {
                        int clientId = Service.BLL.ClientService.GetClientInformation(SessionManager.UserSession.User_id, SessionManager.EventoData.IdEvento).ClientId;
                        TemporaryReservedArticleService.DeleteArticle(SessionManager.EventoData.IdEvento, clientId, SessionManager.ListItemsCarrito[indexDelete].IdElement);
                        StandService.SetStandStatus(SessionManager.EventoData.IdEvento, SessionManager.ListItemsCarrito[indexDelete].IdElement, 0, clientId);
                    }
                    SessionManager.ListItemsCarrito.RemoveAt(indexDelete);

                }
            }
            this.ViewData["products"] = SessionManager.ListItemsCarrito;

            var modelretun = new CarritoPartialDto
            {
                Items = SessionManager.ListItemsCarrito
            };
            
             return this.PartialView("_CarritoPagos", modelretun);

        }
        
        public PartialViewResult PurchaseResume(int? idDelete, bool? isStand)
        {
            this.ViewData["products"] = SessionManager.ListItemsCarrito;
            var modelretun = new CarritoPartialDto
            {
                Items = SessionManager.ListItemsCarrito
            };
            return this.PartialView("_ResumenCompra", modelretun);
        }

        /// <summary>
        /// Guarda la información de la compra
        /// </summary>
        /// <param name="eventName">Info del evento</param>
        /// <param name="lang">Id del idioma</param>
        /// <param name="info">Información de la compra</param>
        /// <param name="url">Url</param>
        /// <param name="factura">Factura</param>
        /// <returns>Estatus de la solicitud</returns>
        [EventInformationFilter]
        public string SavePurchaseInformation(string eventName, string lang, PurchaseInformation info, string url = "", InvoicePaymentRequest factura = null)
        {
            try
            {
                bool isPayed = false;
                string urlAmazon = "";

                int idEvento = SessionManager.EventoData.IdEvento;

                Client c = Service.BLL.ClientService.GetClientInformation(SessionManager.UserSession.User_id, idEvento);
                int idCliente = c.ClientId;

                //Guardar en la tabla de pagos 
                int idPurchase = PurchaseService.SavePurchase(idEvento, idCliente, info);

                //Obtener el codigo de compra
                string puchaseCode = PurchaseService.GetPurchaseCode(idEvento, idPurchase);

                //Establecer como usado el cupon
                CuponService.SetRedemtionInfo(info.CuponId);

                //Guardar en clientService lo que ha comprado
                List<ItemCarrito> productosCarrito = SessionManager.ListItemsCarrito;
                foreach (var pc in productosCarrito)
                {
                    ClientServiceService.SaveClientService(idCliente, idPurchase, pc.IdElement, idEvento, pc.IsStand);

                    //Actualizar campo para apartar stand o sponsor (disponibilidad--)
                    if (pc.IsStand == true)
                    {
                        StandService.SetStandPaymentPending(idEvento, pc.IdElement, info.DatosFiscales.BusinessName, 2, idCliente, idPurchase);
                    }
                    else
                    {
                        SponsorshipService.UpdateAvailabilitySponsor(pc.IdElement, idEvento);
                    }
                }

                //Guardar en payments como método de pago
                int dias = PaymentMethodsService.GetPlazo(idEvento, lang, info.MetodoId, info.TipoPago);
                DateTime paymentPromise = DateTime.Now;
                if (dias > 0 && info.MetodoId != 2)
                {
                    paymentPromise = DateTime.Now.AddDays(dias);
                }


                Payments pagoInfo = new Payments
                {
                    ClientId = idCliente,
                    EventId = idEvento,
                    PurchaseId = idPurchase,
                    Total = info.TotalPayment,
                    PaymentMethodId = info.MetodoId,
                    PaymentPromise = paymentPromise,
                    IsPayed = isPayed,
                    PurchaseType = info.TipoPago,
                    TermPaymentId = info.PlazoOrden
                };


                //Subir el comprobante a amazon   
                if (url != "")
                {
                    isPayed = true;
                    pagoInfo.PayedDate = DateTime.Now;

                    string nombreArchivo = (string)this.Session["nombreArchivo"];
                    string bytesArchivo = (string)this.Session["bytesArchivo"];

                    if (nombreArchivo != null && nombreArchivo != "" && bytesArchivo != null && bytesArchivo != "")
                    {
                        try
                        {
                            var extension = url.Substring((url.LastIndexOf('.') + 1)).ToLower();

                            urlAmazon = PaymentService.UrlSubmitFile(nombreArchivo, bytesArchivo, SessionManager.UserSession.User_email);
                        }
                        catch (Exception excep)
                        {
                            BTC.Common.Loging.LogMethodHelper.LogError(excep);
                            throw;
                        }
                    }
                }

                PaymentService.SavePayment(pagoInfo, url: urlAmazon);

                //Guardar los datos de la empresa
                info.DatosFiscales.ClientId = idCliente;
                info.DatosFiscales.EventId = idEvento;
                Service.BLL.ClientService.UpdateClientData(info.DatosFiscales);

                //Si requiere factura antes de pagar, cuardar invoicePaymentRequest.
                if (factura != null && factura.Rfc != null && factura.Rfc != "")
                {
                    factura.ClientId = idCliente;//1:  Cambiar al cliente Id
                    factura.PurchaseId = idPurchase;
                    factura.EventId = SessionManager.EventoData.IdEvento;

                    InvoicePaymentRequestService.SaveInvoiceRequest(factura);
                }

                //Se manda mail con la información de la compra
                MailConfirmPurchase infoMail = new MailConfirmPurchase
                {
                    Info = info,
                    Dias = dias,
                    Carrito = productosCarrito,
                    PurchaseCode = puchaseCode
                };

                //Se obtienen las cadenas que van en el mail
                InfoMailConfirmPurchase etiquetas = new InfoMailConfirmPurchase
                {
                    Metodo = SessionManager.GetText("ACC_MailConfirmPurchase_PaymentMethod"),
                    MetodoEtiqueta = SessionManager.GetText("ACC_MailConfirmPurchase_EndPaymentMethod"),
                    Codigo= SessionManager.GetText("ACC_MailConfirmPurchase_PurchaseCode"),
                    CodigoEtiqueta= SessionManager.GetText("ACC_MailConfirmPurchase_EndStrong"),
                    Recordatoio= SessionManager.GetText("ACC_MailConfirmPurchase_Remember"),
                    RecordatorioPay= SessionManager.GetText("ACC_MailConfirmPurchase_EndRemember"),
                    RecordatorioEtiqueta= SessionManager.GetText("ACC_MailConfirmPurchase_EndParag")
                };


                var mailingService = new MailingService(idEvento, lang, 2);
                mailingService.SendMailConfirmPurchase(c.Name, SessionManager.UserSession.User_email, lang, infoMail, urlAmazon, etiquetas);

                ProcessReservedArticles(SessionManager.ListItemsCarrito, true);

                //Se limpian variables de archivos
                this.Session["nombreArchivo"] = "";
                this.Session["bytesArchivo"] = "";

                //Vaciando el carrito de la sesión
                SessionManager.ListItemsCarrito = null;
                var modelretun = new CarritoPartialDto
                {
                    Items = SessionManager.ListItemsCarrito
                };

                return "Ok";

            }
            catch (Exception exception)
            {
                BTC.Common.Loging.LogMethodHelper.LogError(exception);
                throw;
            }

        }

        /// <summary>
        /// Convierte el archivo seleccionado a un arreglo de bytes
        /// </summary>
        /// <param name="file">Archivo seleccionado</param>
        [EventInformationFilter]
        [HttpPost]
        public void Archivo(string eventName, string lang, HttpPostedFileBase file)
        {
            if (file != null)
            {
                var x = Request.Files.Count;
                var ist = file.InputStream;

                var bytes = BTC.Common.Files.FileUtils.ConvertToByteArray(file.InputStream);
                var base64File = Convert.ToBase64String(bytes);

                string nombreArchivo = file.FileName;

                this.Session["nombreArchivo"] = nombreArchivo;
                this.Session["bytesArchivo"] = base64File;
            }
        }

        /// <summary>
        /// Valida el cupon
        /// </summary>
        /// <param name="eventName"></param>
        /// <param name="lang"></param>
        /// <param name="cupon"></param>
        /// <returns>Devuelve lista de elementos de descuento del cupon</returns>
        [EventInformationFilter]
        public JsonResult ValidarCupon(string eventName, string lang, string cupon)
        {
            int idEvento = SessionManager.EventoData.IdEvento;

            Client c = Service.BLL.ClientService.GetClientInformation(SessionManager.UserSession.User_id, idEvento);
            int idCliente = c.ClientId;

            int idCupon = CuponService.CuponIsValid(idEvento, idCliente, cupon);

            if (idCupon > 0)
            {
                List<Cupon> cup = CuponService.GetCuponInfo(idCupon, idCliente, SessionManager.EventoData.IdEvento);
                return this.Json(cup.SerializeToJson());
            }
            else
            {
                return this.Json(0);
            }


        }

        /// <summary>
        /// Actualiza la información de pago
        /// </summary>
        /// <param name="eventName">NOmbre del evento</param>
        /// <param name="lang">ID del idioma</param>
        /// <param name="info">Información de la compra</param>
        /// <param name="ingresarLink">Link de ingreso</param>
        /// <param name="ingresarLabel">Label de ingreso</param>
        /// <param name="url">Url del archivo</param>
        /// <param name="factura">Información de facturación</param>
        /// <returns>estatus de la operación</returns>
        [EventInformationFilter]
        public string UpdatePurchaseInformation(string eventName, string lang, PurchaseInformation info, string ingresarLink, string ingresarLabel, string url = "", InvoicePaymentRequest factura = null)
        {
            try
            {
                bool isPayed = false;
                string urlAmazon = "";
                bool mailAdmin = false; //Bandera para saber si se le manda mail al admin que han subido su comprobante de pago

                int idEvento = SessionManager.EventoData.IdEvento;

                Client c = Service.BLL.ClientService.GetClientInformation(SessionManager.UserSession.User_id, idEvento);
                int idCliente = c.ClientId;

                int paymentId = (int)this.Session["paymentId"];
                int lastPaymentMethodId = (int)this.Session["paymentMethodId"];
                string lastPaymentPromise = (string)this.Session["lastPaymentPromise"];
                decimal paymentHasNotPayed = (decimal)this.Session["paymentHasNotPayed"];
                int pagoTipo = (int)this.Session["tipoPagoPayment"];

                //Guardar en la tabla de pagos 
                int idPurchase = PaymentService.GetPurchasePaymentId(paymentId);

                //Obtener el codigo de compra
                string puchaseCode = PurchaseService.GetPurchaseCode(idEvento, idPurchase);

                //Establecer como usado el cupon
                CuponService.SetRedemtionInfo(info.CuponId);

                //Guardar en payments como método de pago
                int dias = PaymentMethodsService.GetPlazo(idEvento, lang, info.MetodoId, info.TipoPago);
                DateTime paymentPromise = DateTime.Now;
                if (dias > 0 && info.MetodoId != 2)
                {
                    paymentPromise = DateTime.Now.AddDays(dias);
                }

                //Saber si no tiene N+1 cambios de método de pago permitidos                
                int maxPayMeths = PaymentService.GetPaymentMethodsId(idEvento, idPurchase, paymentId);

                //Consulta el máximo de cambios de métodos de pago
                int max = EventoComercialService.GetMaxPaymentMethods(idEvento);

                //Evalúa si ha excedido lso cambios permitidos
                int paymentChangeNumber = maxPayMeths;

                if (lastPaymentMethodId != info.MetodoId)
                {
                    //Incrementa el número de pagos
                    paymentChangeNumber = maxPayMeths + 1;
                }

                if (maxPayMeths >= max || paymentChangeNumber >= max)
                {
                    //Mandar correo de alerta
                    var mailingService1 = new MailingService(idEvento, lang, 9);
                    mailingService1.SendMailPaymentMethodExceed(c.Name, puchaseCode, lastPaymentPromise, paymentPromise, info.TotalPayment, hasNotPayed: paymentHasNotPayed, ingresarLink: ingresarLink, IngresarLabel: ingresarLabel, idioma: lang);
                }

                Payments pagoInfo = new Payments
                {
                    PaymentId = paymentId,
                    ClientId = idCliente,
                    EventId = idEvento,
                    PurchaseId = idPurchase,
                    Total = info.TotalPayment,
                    PaymentMethodId = info.MetodoId,
                    PaymentPromise = paymentPromise,
                    IsPayed = isPayed,
                    PurchaseType = info.TipoPago,
                    TermPaymentId = info.PlazoOrden                   
                };


                //Subir el comprobante a amazon   
                if (url != "")
                {
                    isPayed = true;
                    pagoInfo.PayedDate = DateTime.Now;

                    string nombreArchivo = (string)this.Session["nombreArchivo"];
                    string bytesArchivo = (string)this.Session["bytesArchivo"];

                    if (nombreArchivo != null && nombreArchivo != "" && bytesArchivo != null && bytesArchivo != "")
                    {
                        try
                        {
                            var extension = url.Substring((url.LastIndexOf('.') + 1)).ToLower();

                            urlAmazon = PaymentService.UrlSubmitFile(nombreArchivo, bytesArchivo, SessionManager.UserSession.User_email);

                            mailAdmin = true;
                        }
                        catch (Exception excep)
                        {
                            BTC.Common.Loging.LogMethodHelper.LogError(excep);
                            throw;
                        }
                    }
                }

                if (info.MetodoId == 2)
                {                  
                    pagoInfo.IsApproved = true;
                    pagoInfo.ApprovedDate = DateTime.Now;
                }
                else
                {                   
                    pagoInfo.IsApproved = false;                    
                }

                int approvedPayed = PaymentService.PaymentIsPayedNIsApproved(paymentId, idPurchase);
                if (approvedPayed == 1)
                {
                    PaymentService.SavePayment(pagoInfo);                    
                }
                else
                {                    
                    PaymentService.UpdatePayment(pagoInfo, paymentChangeNumber, urlAmazon);
                }

                //Si es pago único, se cancelan los pagos agendados
                if (pagoTipo == 1)
                {
                    PaymentService.UpdatePayedPayment(idPurchase);
                }

                //Si requiere factura antes de pagar, guardar invoicePaymentRequest.
                if (factura != null && factura.Rfc != null && factura.Rfc != "")
                {
                    factura.ClientId = 1;//Cambiar al cliente Id
                    factura.PurchaseId = idPurchase;
                    factura.EventId = SessionManager.EventoData.IdEvento;

                    InvoicePaymentRequestService.SaveInvoiceRequest(factura);
                }

                List<ItemCarrito> productosCarrito = SessionManager.ListItemsCarrito;

                //Se manda mail con la información de la compra
                MailConfirmPurchase infoMail = new MailConfirmPurchase
                {
                    Info = info,
                    Dias = dias,
                    Carrito = productosCarrito,
                    PurchaseCode = puchaseCode
                };

                var mailingService = new MailingService(idEvento, lang, 8);
                mailingService.SendMailPaymentReceived(c.Name, SessionManager.UserSession.User_email, lang, infoMail);

                if (mailAdmin)
                {
                    //Se manda email al administrador que se ha subido un pago
                    mailingService = new MailingService(idEvento, lang, 12);
                    mailingService.SendMailPaymentReceivedAdmin(c.Name, SessionManager.UserSession.User_email, lang, infoMail);
                }

                //Se limpian variables de archivos
                this.Session["nombreArchivo"] = "";
                this.Session["bytesArchivo"] = "";

                //Vaciando el carrito de la sesión
                SessionManager.ListItemsCarrito = null;
                var modelretun = new CarritoPartialDto
                {
                    Items = SessionManager.ListItemsCarrito
                };

                return "Ok";

            }
            catch (Exception exception)
            {
                BTC.Common.Loging.LogMethodHelper.LogError(exception);
                throw;
            }

        }

        /// <summary>
        /// Limpia los registros, carrito y redirecciona a pantalla de exhibitor
        /// </summary>
        /// <returns>estatus de la operación</returns>
        [EventInformationFilter]
        public ActionResult CounterExpired(string eventName, string lang)
        {
            try
            {
                ProcessReservedArticles(SessionManager.ListItemsCarrito, false);
                SessionManager.ListItemsCarrito.Clear();
                return this.RedirectToAction("Plano", "Exhibitor");
            }
            catch (Exception exception)
            {
                BTC.Common.Loging.LogMethodHelper.LogError(exception);
                return this.RedirectToAction("Index", "Home");
            }
        }
        #endregion

        #region userDefineFunctions

        /// <summary>
        /// metodo privado para regresar el rango de las fechas formateadas
        /// </summary>
        /// <param name="sDate">fecha de inicio del evento</param>
        /// <param name="fDate">fecha de terminacion del evento</param>
        /// <returns>rango de las fechas</returns>
        [NonAction]
        private string getFormattedEventDates(DateTime sDate, DateTime fDate)
        {
            string sDay = sDate.ToString("dd");
            string fDay = fDate.ToString("dd");
            string sMonth = sDate.ToString("MMM");
            string fMonth = fDate.ToString("MMM");
            string sYear = sDate.ToString("yyyy");
            string fYear = fDate.ToString("yyyy");

            if (sMonth == fMonth && sYear == fYear && sDay != fDay)
            {
                return sDay + SessionManager.GetText("ACC_Contador_texto_A") + fDay + SessionManager.GetText("ACC_Contador_texto_DE") + sMonth + " " + sYear;
            }
            else if (sMonth != fMonth && sYear == fYear && (sDay != fDay || sDay == fDay))
            {
                return sDay + SessionManager.GetText("ACC_Contador_texto_DE") + sMonth + SessionManager.GetText("ACC_Contador_texto_A") + fDay + SessionManager.GetText("ACC_Contador_texto_DE") + fMonth + " " + sYear;
            }
            else if (sMonth == fMonth && sYear == fYear && sDay == fDay)
            {
                return sDay + SessionManager.GetText("ACC_Contador_texto_DE") + sMonth + " " + sYear;
            }
            else
                return sDate.ToString("dd MMM yyyy") + SessionManager.GetText("ACC_Contador_texto_A") + fDate.ToString("dd MMM yyyy");
        }

        /// <summary>
        /// metodo privado para regresar el conteo de los articulos por pagar y modificar carrito si articulos estan en proceso de compra
        /// </summary>
        /// <param name="listItemsCarrito">lista de los articulos</param>
        /// <returns>Cadena de los articulos que fueron eliminados</returns>
        [NonAction]
        private string ProcessSessionManagerItemCarrito(List<ItemCarrito> listItemsCarrito)
        {
            StringBuilder sbString = new StringBuilder();
            List<int> itemsToBeRemoved = new List<int>();
            int clientId = Service.BLL.ClientService.GetClientInformation(SessionManager.UserSession.User_id, SessionManager.EventoData.IdEvento).ClientId;

            foreach (var tmpElement in listItemsCarrito)
            {
                var tmpRst = TemporaryReservedArticleService.GetArticlePresenceById(SessionManager.EventoData.IdEvento, clientId, tmpElement.IdElement, tmpElement.IsStand, SessionManager.CompraCounterTime);

                if (tmpElement.IsStand)
                {
                    switch(tmpRst)
                    {
                        case 0:
                            TemporaryReservedArticle articleObject = new TemporaryReservedArticle();
                            articleObject.ArticleId = tmpElement.IdElement;
                            articleObject.ClientId = clientId;
                            articleObject.EventId = SessionManager.EventoData.IdEvento;
                            articleObject.IsStand = tmpElement.IsStand;
                            articleObject.DateStamp = DateTime.Now;
                            TemporaryReservedArticleService.InsertArticle(articleObject);
                            StandService.SetStandStatus(SessionManager.EventoData.IdEvento, tmpElement.IdElement, 5, clientId);
                            break;
                        case 1:
                            sbString.Append(tmpElement.NameElement.Trim()).Append(",");
                            itemsToBeRemoved.Add(tmpElement.IdElement);
                            break;
                        default:
                            break;
                    }
                }
            }
            foreach (var tmpIndexItemId in itemsToBeRemoved)
            {
                listItemsCarrito.RemoveAt(listItemsCarrito.FindIndex(r => r.IdElement == tmpIndexItemId));
            }

            if(sbString.Length > 0)
            {
                return sbString.ToString(0, sbString.Length - 1);
            }
            else
            return string.Empty;
        }

        /// <summary>
        /// metodo privado para borrar registros de apartados, actualizar estatus dependiendo que si termino el contador o el proceso de compra de los articulos
        /// </summary>
        /// <param name="listItemsCarrito">lista de los articulos</param>
        /// <param name="compraTermino">para identifcar si termino el contador o el proceso de compra </param>
        [NonAction]
        private void ProcessReservedArticles(List<ItemCarrito> listItemsCarrito, bool compraTermino)
        {
            int clientId = Service.BLL.ClientService.GetClientInformation(SessionManager.UserSession.User_id, SessionManager.EventoData.IdEvento).ClientId;

            foreach (var tmpElement in listItemsCarrito)
            {
                if (compraTermino)
                {
                    if (tmpElement.IsStand)
                    {
                        TemporaryReservedArticleService.DeleteArticle(SessionManager.EventoData.IdEvento, clientId, tmpElement.IdElement);
                    }
                }
                else
                {
                    if (tmpElement.IsStand)
                    {
                        TemporaryReservedArticleService.DeleteArticle(SessionManager.EventoData.IdEvento, clientId, tmpElement.IdElement);
                        StandService.SetStandStatus(SessionManager.EventoData.IdEvento, tmpElement.IdElement, 0, clientId);
                    }
                }
            }
        }

        #endregion
    }
}