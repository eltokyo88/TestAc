namespace Comercializacion.Client.Controllers
{
    using BTC.Common.WebUtils;
    using BTC.Entities.Common;
    using Comercializacion.Client.Common;
    using Comercializacion.Client.Filters;
    using Comercializacion.Service.BLL;
    using Comercializacion.Service.DTO;
    using Comercializacion.Service.Model;
    using Forza.Core.Utils;
    using System;
    using System.Collections.Generic;
    using System.Configuration;
    using System.IO;
    using System.Web.Mvc;

    public class ExhibitorController : Controller
    {

        #region Principal

        /// <summary>
        /// pantalla principal de la página de expositores
        /// </summary>
        /// <returns></returns>
        [EventInformationFilter]
        public ActionResult Index(string eventName, string lang)
        {
            var evento = (Evento)this.Session["eventoInfo"];
            
            return View();
        }

        /// <summary>
        /// Obtiene los eventos del cliente
        /// </summary>
        /// <param name="eventName">nombre del evento</param>
        /// <param name="lang">ID del idiom</param>
        /// <returns>Json con el resultado</returns>
        [EventInformationFilter]
        public JsonResult GetEventClient(string eventName, string lang)
        {
            try
            {
                var evento = (Evento)this.Session["eventoInfo"];
                int idSistema = SystemService.GetSystemIdLang(ConfigurationManager.AppSettings["SystemName"]);

                Client c = Service.BLL.ClientService.GetClientInformation(SessionManager.UserSession.User_id, evento.IdEvento);
                int idCliente = c.ClientId;

                List<EventClient> lista = SystemService.GetEventsClient(idSistema, idCliente);

                return this.Json(lista.SerializeToJson());
            }
            catch (Exception ex)
            {
                PrecioyViajes.Common.Tools.LogMethods.LogError(ex);
                return this.Json("Expirado");
            }
            
        }

        /// <summary>
        /// Guarda información correspondiente a la facturación de un pago
        /// </summary>
        /// <param name="eventName">Nombre del evento</param>
        /// <param name="lang">Id del idioma</param>
        /// <param name="fiscalData">FiscalData</param>
        /// <param name="idFiscalData">Id del identifier FiscalData</param>
        /// <param name="purchaseId">Id de la compra</param>
        /// <returns>Cadena con estatus de la solicitud</returns>
        [EventInformationFilter]
        public string SaveInvoice(string eventName, string lang, FiscalData fiscalData, int idFiscalData, int purchaseId, decimal totalFactura, string conceptoFactura)
        {
            var evento = (Evento)this.Session["eventoInfo"];
            Client c = Service.BLL.ClientService.GetClientInformation(SessionManager.UserSession.User_id, evento.IdEvento);
            int idCliente = c.ClientId;

            fiscalData.ClientId = idCliente;
            fiscalData.Email = SessionManager.UserSession.User_email;

            if (idFiscalData == 0)
            {
                idFiscalData = FiscalDataService.SaveNewFiscalData(fiscalData);
            }else {
                fiscalData.FiscalDataId = idFiscalData;                
                FiscalDataService.UpdateFiscalData(fiscalData);
            }
            
            Invoice f = new Invoice()
            {
                EventId = evento.IdEvento,
                FiscalDataId = idFiscalData,
                ClientId = idCliente,
                InvoiceDate = DateTime.Now,
                PurchaseId = purchaseId,
                IsInvoiced = 0
            };
            InvoiceService.SaveInvoice(f);

            //Actualizar payments con invoiced = 1
            PaymentService.UpdateSetRequestedInvoice(purchaseId);

            //Se envía email al administrador que ha solicitado factura
            var mailingService = new MailingService(SessionManager.EventoData.IdEvento, lang, 11);
            mailingService.SendMailInvoiceRequested(fiscalData, c.Name, lang, totalFactura, conceptoFactura);

            return "ok";
        }
               
        #endregion

        #region MiCuenta

        /// <summary>
        /// pantalla de mi cuenta
        /// </summary>
        /// <returns></returns>
        [EventInformationFilter]
        public ActionResult MiCuenta(string eventName, string lang)
        {
            return View();
        }

        #endregion

        #region Eventos

        /// <summary>
        /// Pantalla de Mis eventos
        /// </summary>
        /// <returns></returns>
        [EventInformationFilter]
        public ActionResult MisEventos(string eventName, string lang)
        {
            return View();
        }

        #endregion

        #region MisFacturas

        /// <summary>
        /// Pantalla de Mis facturas
        /// </summary>
        /// <returns></returns>
        [EventInformationFilter]
        public ActionResult MisFacturas(string eventName, string lang)
        {
            var evento = (Evento)this.Session["eventoInfo"];
    
            if (SessionManager.UserSession != null)
            {
                string emailClient = SessionManager.UserSession.User_email;
                Client c = Service.BLL.ClientService.GetClientInformation(SessionManager.UserSession.User_id, evento.IdEvento);
                this.ViewData["datosFacturacionJson"] = Newtonsoft.Json.JsonConvert.SerializeObject(FiscalDataService.GetDatosFiscales(emailClient));
                this.ViewData["datosFacturacion"] = FiscalDataService.GetDatosFiscales(emailClient);

                this.ViewData["catalogoPais"] = CatalogoService.GetCatalogoPais(lang);
                this.ViewData["misSolicitudes"] = RequestsService.GetRequests(evento.IdEvento, c.ClientId, lang);

                this.ViewData["productsCart"] = SessionManager.ListItemsCarrito;

                return View();
            }
            else
            {
                return this.RedirectToAction("Index", "Home");
            }
        }

        #endregion

        #region DatosFacturacion

        /// <summary>
        /// datos de facturacion
        /// </summary>
        /// <returns>vista de la página</returns>
        [EventInformationFilter]
        public ActionResult DatosFacturacion(string eventName, string lang)
        {
            var evento = (Evento)this.Session["eventoInfo"];
            string emailClient = String.Empty;

            if (SessionManager.UserSession != null)
            {
                emailClient = SessionManager.UserSession.User_email;

                this.ViewData["datosFacturacionJson"] = Newtonsoft.Json.JsonConvert.SerializeObject(FiscalDataService.GetDatosFiscales(emailClient));
                this.ViewData["datosFacturacion"] = FiscalDataService.GetDatosFiscales(emailClient);

                this.ViewData["catalogoPais"] = CatalogoService.GetCatalogoPais(lang);
                return View();
            }
            else
            {
                return this.RedirectToAction("Index", "Home");
            }

           
        }

        /// <summary>
        /// Guarda una nueva dirección de facturación
        /// </summary>
        /// <param name="eventName">Nombre del evento</param>
        /// <param name="lang">Idioma</param>
        /// <param name="fiscalData">Información de la factura</param>
        /// <returns>Registros insertados</returns>
        [EventInformationFilter]
        public int SaveNewFiscalData(string eventName, string lang, FiscalData fiscalData)
        {
            var evento = (Evento)this.Session["eventoInfo"];

            if (SessionManager.UserSession != null)
            {
                Client c = Service.BLL.ClientService.GetClientInformation(SessionManager.UserSession.User_id, evento.IdEvento);

                fiscalData.Email = SessionManager.UserSession.User_email;
                fiscalData.ClientId = c.ClientId;
                return FiscalDataService.SaveNewFiscalData(fiscalData);
            }
            else
            {
                return 0;
            }
        }

        /// <summary>
        /// Actualiza una dirección de facturación
        /// </summary>
        /// <param name="eventName">Nombre de evento</param>
        /// <param name="lang">Id del idioma</param>
        /// <param name="fiscalData">Datos de faturación a actualizar</param>
        /// <returns>Estatus de la solicitud</returns>
        [EventInformationFilter]
        public int UpdateFiscalData(string eventName, string lang, FiscalData fiscalData)
        {
            var evento = (Evento)this.Session["eventoInfo"];

            if (SessionManager.UserSession != null)
            {
                Client c = Service.BLL.ClientService.GetClientInformation(SessionManager.UserSession.User_id, evento.IdEvento);

                fiscalData.Email = SessionManager.UserSession.User_email;
                fiscalData.ClientId = c.ClientId;
                FiscalDataService.UpdateFiscalData(fiscalData);

                return 1;
            }
            else
            {
                return 0;
            }
            
        }

        #endregion

        #region MisSolicitudes

        /// <summary>
        /// pantalla de mis solicitudes compradas
        /// </summary>
        /// <returns>vista de las solicitudes</returns>
        [EventInformationFilter]
        public ActionResult MisSolicitudes(string eventName, string lang)
        {
            int idCliente = 0;
            var evento = (Evento)this.Session["eventoInfo"];
            string emailClient = String.Empty;
            if (SessionManager.UserSession != null)
            {
                Client c = Service.BLL.ClientService.GetClientInformation(SessionManager.UserSession.User_id, evento.IdEvento);
                idCliente = c.ClientId;
                emailClient = SessionManager.UserSession.User_email;


                this.ViewData["misSolicitudes"] = RequestsService.GetRequests(evento.IdEvento, idCliente, lang);
                this.ViewData["maxPagos"] = EventoComercialService.GetMaximumPayments(evento.IdEvento);
                this.ViewData["eventDates"] = EventoComercialService.GetEventDates(evento.IdEvento);
                this.ViewData["catalogoPais"] = CatalogoService.GetCatalogoPais(lang);
                this.ViewData["datosFacturacion"] = FiscalDataService.GetDatosFiscales(emailClient);
                this.ViewData["languageId"] = lang;

                this.ViewData["misSolicitudesJson"] = Newtonsoft.Json.JsonConvert.SerializeObject(RequestsService.GetRequests(evento.IdEvento, idCliente, lang));
                this.ViewData["datosFacturacionJson"] = Newtonsoft.Json.JsonConvert.SerializeObject(FiscalDataService.GetDatosFiscales(emailClient));

                this.ViewData["elementosCarrito"] = (SessionManager.ListItemsCarrito == null) ? 0 : Convert.ToInt32(SessionManager.ListItemsCarrito.Count);

                this.ViewData["products"] = SessionManager.ListItemsCarrito;

                return this.View();
            }
            else
            {
                return this.RedirectToAction("Index", "Home");
            }
        }

        /// <summary>
        /// Guarda fehcas de pago agendadas
        /// </summary>
        /// <param name="fechasPagos">Lista de objetos tipo Payments</param>
        [EventInformationFilter]
        public string SavePaymentDates(string eventName, string lang, Payments fechasPagos)
        {
            int idCliente = 0;
            var evento = (Evento)this.Session["eventoInfo"];

            if (SessionManager.UserSession != null)
            {
                Client c = Service.BLL.ClientService.GetClientInformation(SessionManager.UserSession.User_id, evento.IdEvento);
                idCliente = c.ClientId;
            }

            //foreach (var f in fechasPagos)
            //{
            fechasPagos.ClientId = idCliente;
            fechasPagos.EventId = evento.IdEvento;
            if (fechasPagos.PaymentPromise >= DateTime.Now)
            {
                PaymentService.SavePayment(fechasPagos);
                return "ok";
            }else{
                return "no";
            }
          
        }

        /// <summary>
        /// Reagenda los pagos con retraso
        /// </summary>
        /// <param name="pagosReagendados">Lista de pagos a reagendar</param>
        [EventInformationFilter]
        public void ReschedulePayments(string eventName, string lang, List<Payments> pagosReagendados)
        {
            foreach (var p in pagosReagendados)
            {
                PaymentService.SaveRescheduledPayment(p.PaymentId, p.PurchaseId, p.PaymentPromise, p.Total);
            }
        }

        /// <summary>
        /// Guarda una solicitud de prórroga
        /// </summary>
        /// <param name="eventName">Nombre del evento</param>
        /// <param name="lang">Id del idioma</param>
        /// <param name="paymentPromise">Fecha de promesa de pago</param>
        /// <param name="datePromise">Fecha de pago</param>
        /// <param name="reason">Motivo de la prórroga</param>
        /// <param name="purchaseId">Id de la compra</param>
        /// <param name="idPayment">ID del pago</param>
        /// <returns>Número de registros insertados</returns>
        [EventInformationFilter]
        public int SaveExtensionPaymentRequest(string eventName, string lang, decimal paymentPromise, DateTime datePromise, string reason, int purchaseId, int idPayment)
        {           
            var evento = (Evento)this.Session["eventoInfo"];
            ExtensionPaymentDate epd = new ExtensionPaymentDate();

            if (SessionManager.UserSession != null)
            {
                Client c = Service.BLL.ClientService.GetClientInformation(SessionManager.UserSession.User_id, evento.IdEvento);
                epd.ClientId = c.ClientId;
            }

            epd.EventId = evento.IdEvento;
            epd.PurchaseId = purchaseId;
            epd.PaymentId = idPayment;
            epd.PaymentPromiseExt = paymentPromise;
            epd.DatePromiseExt = datePromise;
            epd.Reason = reason;

            //Se actualiza el estatus del pago
            PaymentService.UpdateExtensionRequestedPayment(evento.IdEvento, idPayment, purchaseId, 1); 

            return ExtensionPaymentDateService.SaveExtensionPaymentRequest(epd);
            
        }
        

        #endregion

        #region Requerimientos

        /// <summary>
        /// Pantalla de Requerimientos
        /// </summary>
        /// <returns></returns>
        [EventInformationFilter]
        public ActionResult Requerimientos(string eventName, string lang)
        {
            int idCliente = 0;
            var evento = (Evento)this.Session["eventoInfo"];
            string emailClient = String.Empty;

            if (SessionManager.UserSession != null)
            {
                Client c = Service.BLL.ClientService.GetClientInformation(SessionManager.UserSession.User_id, evento.IdEvento);
                idCliente = c.ClientId;
                emailClient = SessionManager.UserSession.User_email;

                this.ViewData["stands"] = StandService.GetClientStands(evento.IdEvento, idCliente);
                this.ViewData["deltaSpace"] = StandService.GetDeltaSpace(evento.IdEvento);
                this.ViewData["standSize"] = StandSizeService.GetStandsSize(evento.IdEvento);
                this.ViewData["standSizeJson"] = Newtonsoft.Json.JsonConvert.SerializeObject(StandSizeService.GetStandsSize(evento.IdEvento));

                return View();
            }
            else
            {
                return this.RedirectToAction("Index", "Home");
            }
        }

        /// <summary>
        /// Guarda un bloque de stands que ha seleccionado el usuario
        /// </summary>
        /// <param name="eventName">Nombre del evento</param>
        /// <param name="lang">Id del idioma</param>
        /// <param name="lista">Lista de stands formados</param>
        /// <returns></returns>
        [EventInformationFilter]
        public int SaveStandBlock(string eventName, string lang, List<StandBlock> lista)
        {
            int idCliente = 0;
            var evento = (Evento)this.Session["eventoInfo"];
            string emailClient = String.Empty;

            var exito = 0;

            if (SessionManager.UserSession != null)
            {
                Client c = Service.BLL.ClientService.GetClientInformation(SessionManager.UserSession.User_id, evento.IdEvento);
                idCliente = c.ClientId;

                int blockNumber = StandBlockService.GetLastBlockNumber(evento.IdEvento, idCliente);
                int auxBloque = 0;

                foreach (var l in lista)
                {
                    if (auxBloque != l.SubBlock){
                        blockNumber = blockNumber + 1;
                        auxBloque = l.SubBlock;
                    }
                    l.EventId = evento.IdEvento;
                    l.ClientId = idCliente;
                    l.BlockNumber = blockNumber;
                    l.StandBlockTotalSize = l.StandBlockTotalSize;

                    exito = StandBlockService.SaveStandBlock(l);
                }

                return exito;
            }
            else
            {
                return 0;
            }
        }

        /// <summary>
        /// Obtiene los bloques del cliente
        /// </summary>
        /// <param name="eventName">Id del evento</param>
        /// <param name="lang">Id del idioma</param>
        /// <returns>Json con la lista de bloques de stands</returns>
        [EventInformationFilter]
        public JsonResult GetStandBlock(string eventName, string lang)
        {
            try
            {
                var evento = (Evento)this.Session["eventoInfo"];

                Client c = Service.BLL.ClientService.GetClientInformation(SessionManager.UserSession.User_id, evento.IdEvento);
                int idCliente = c.ClientId;

                List<StandBlock> lista = StandBlockService.GetStandBlock(evento.IdEvento, idCliente);
                return this.Json(lista.SerializeToJson());
            }
            catch (Exception ex)
            {
                PrecioyViajes.Common.Tools.LogMethods.LogError(ex);
                return this.Json("Expirado");
            }
        }

        /// <summary>
        /// Obtiene el catálogo de servicios adicionales
        /// </summary>
        /// <param name="eventName">Id del evento</param>
        /// <param name="lang">Id del idioma</param>
        /// <returns>Json con el catalogo</returns>
        [EventInformationFilter]
        public JsonResult GetAditionalServices(string eventName, string lang)
        {
            try
            {
                var evento = (Evento)this.Session["eventoInfo"];
                
                List<StandAditionalService> lista = StandAditionalServiceService.GetAditionalServices(evento.IdEvento, lang );
                return this.Json(lista.SerializeToJson());
            }
            catch (Exception ex)
            {
                PrecioyViajes.Common.Tools.LogMethods.LogError(ex);
                return this.Json("Expirado");
            }
        }

        /// <summary>
        /// Obtiene el catálogo de servicios incluidos
        /// </summary>
        /// <param name="eventName">Id del evento</param>
        /// <param name="lang">Id del idioma</param>
        /// <returns>Json con el catálogo</returns>
        [EventInformationFilter]
        public JsonResult GetIncludedServices(string eventName, string lang)
        {
            try
            {
                var evento = (Evento)this.Session["eventoInfo"];

                List<StandIncludeService> lista = StandIncludeServiceService.GetIncludedServices(evento.IdEvento, lang);
                return this.Json(lista.SerializeToJson());
            }
            catch (Exception ex)
            {
                PrecioyViajes.Common.Tools.LogMethods.LogError(ex);
                return this.Json("Expirado");
            }
        }

        /// <summary>
        /// Guarda un stand institucional
        /// </summary>
        /// <param name="eventName">Nombre del evento</param>
        /// <param name="lang">Id del idioma</param>
        /// <param name="institucional">Stand institucional</param>
        /// <param name="servicios">Servicios adicionales comprados</param>
        /// <returns></returns>
        [EventInformationFilter]
        public int SaveStandInstitucional(string eventName, string lang, StandInstitutional institucional, List<StandAditionalServ> servicios)
        {            
            var exito = 0;

            if (SessionManager.UserSession != null)
            {
                exito = StandInstitutionalService.SaveStandInstitutional(institucional);

                if (exito > 0)
                {
                    foreach (var s in servicios)
                    {
                        s.StandInstitutionalId = exito;
                      
                        StandAditionalServService.SaveAditionalService(s);
                    }
                }

                return exito;
            }
            else
            {
                return -1;
            }
        }


        [EventInformationFilter]/*, List<StandDroDocument> droDocuments, List<StandRenderDocument> render*/
        public int SaveStandProveedor(string eventName, string lang, StandSupplier supplier, List<StandAditionalServ> servicios)
        {
            var exito = 0;

            if (SessionManager.UserSession != null)
            {
                exito = StandSupplierService.SaveStandSupplier(supplier);

                if (exito > 0)
                {
                    foreach (var s in servicios)
                    {
                        s.StandSupplierId = exito;

                        StandAditionalServService.SaveAditionalService(s);
                    }

                    //guardar renders
                    /*if (file != null)
                    {
                        var x = Request.Files.Count;
                        var ist = file.InputStream;

                        var bytes = BTC.Common.Files.FileUtils.ConvertToByteArray(file.InputStream);
                        var base64File = Convert.ToBase64String(bytes);

                        string nombreArchivo = file.FileName;
                    }
                    */
                        //guardar DROs
                    }

                return exito;
            }
            else
            {
                return -1;
            }
        }

        #endregion

        #region Plano

        /// <summary>
        /// pantalla de mi cuenta
        /// </summary>
        /// <returns></returns>
        [EventInformationFilter]
        public ActionResult Plano(string eventName, string lang)
        {
            var evento = (Evento)this.Session["eventoInfo"];
            this.ViewData["eventVenueCity"] = SessionManager.EventoData.Evento_sede;
            this.ViewData["eventDateRange"] = getFormattedEventDates(SessionManager.EventoData.EventoFechaInicia, SessionManager.EventoData.EventoFechaTermina);
            EventoComercial event_SiteDate = EventoComercialService.GetEventById(evento.IdEvento);
            this.ViewData["eventName"] = event_SiteDate.EventName;

            var datos = GetMapaData(eventName, lang);
            if (!datos)
            {
                return RedirectToAction("Index");
            }
            else
            {
                this.ViewData["sponsor"] = SponsorshipService.GetSponsorshipLang(evento.IdEvento, lang.ToUpper());
            }

            return View();
        }

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
        /// Obtiene la información de los cupones dle cliente
        /// </summary>
        /// <param name="eventName">Nombre del evento</param>
        /// <param name="lang">Id del idioma</param>
        /// <returns>Lista de cupones en un JSON</returns>
        [EventInformationFilter]
        public JsonResult GetDiscountClientInfo(string eventName, string lang)
        {
            try
            {
                var evento = (Evento)this.Session["eventoInfo"];

                Client c = Service.BLL.ClientService.GetClientInformation(SessionManager.UserSession.User_id, evento.IdEvento);
                int idCliente = c.ClientId;

                List<ClientCupon> lista = CuponService.GetDiscountClientInfo(idCliente, evento.IdEvento);
                return this.Json(lista.SerializeToJson());
            }
            catch (Exception ex)
            {
                PrecioyViajes.Common.Tools.LogMethods.LogError(ex);
                return this.Json("Expirado");
            }
        }


        /// <summary>
        /// metodo que se encarga de inicializar los datos del mapa
        /// </summary>
        /// <returns></returns>
        private bool GetMapaData(string eventName, string lang)
        {
            var evento = (Evento)this.Session["eventoInfo"];
            var eventoComData = EventoComercialService.GetEventByIdRegistro(evento.IdEvento);
            int idCliente = 0;
            if (eventoComData == null)
            {
                return false;
            }
            if (SessionManager.UserSession != null)
            {
                Client c = Service.BLL.ClientService.GetClientInformation(SessionManager.UserSession.User_id, evento.IdEvento);
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
        
        #region DatosEmpresa

        /// <summary>
        /// datos de la empresa
        /// </summary>
        /// <returns>vista de la página</returns>
        [EventInformationFilter]
        public ActionResult DatosEmpresa(string eventName, string lang)
        {
            return this.View();
        }

        #endregion

        #region CerrarSesion

        /// <summary>
        /// método que se encarga de cerrar la session
        /// </summary>                
        /// <returns>regresa a la vista principal del sistema</returns>
        [HttpGet]
        public ActionResult Logoff(string eventName, string lang)
        {
            try
            {

                var userClient = new UserService.UserClient();
                var cookieName = GeneralData.CookieName;
                var cookie = CookiesHelper.GetCookieValue(cookieName);
                CookiesHelper.DeleteAllSessionsAndCookies(new List<string> { cookieName }, "SessionName");
                userClient.LogOff(cookie);
                return this.RedirectToAction("Index", "Home", new { eventName = SessionManager.EventoData.Evento_siglas, lang = SessionManager.LangData });
            }
            catch (Exception ex)
            {
                PrecioyViajes.Common.Tools.LogMethods.LogError(ex);
                return this.RedirectToAction("Index", "Home");

            }
        }

        #endregion
        
    }
}