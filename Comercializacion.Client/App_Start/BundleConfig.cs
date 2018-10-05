using System.Web;
using System.Web.Optimization;

namespace Comercializacion.Client
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            /* ESTILOS */

            bundles.Add(new StyleBundle("~/Content/Shared").Include(
                "~/Content/bootstrap/bootstrap.css",
                "~/Content/edit.css",
                "~/Content/sidebar-nav.css",
                "~/Content/animate.css",
                "~/Content/style.css",
                //"~/Content/scrolldown.css",
                "~/Content/datepicker.min.css",
                 "~/Content/loader.css"
                //"~/Content/fuentes.css",
            ));

            bundles.Add(new StyleBundle("~/Content/Index").Include(
                "~/Content/bootstrap/bootstrap.css",
                "~/Content/edit.css",
                "~/Content/fuentes.css",
                "~/Content/menucart.css",
                "~/Content/owl.carousel.css",
                "~/Content/owl.theme.css",
                "~/Content/form-login.css",
                "~/Content/animate.css"
            ));

            bundles.Add(new StyleBundle("~/Content/Pago").Include(
                "~/Content/dropify/dropify.min.css",
                "~/Content/pago.css"      
            ));

            bundles.Add(new StyleBundle("~/Content/Plano").Include(
                //"~/Content/menucart.css",
                "~/Content/sidebar.css"
            ));

            bundles.Add(new StyleBundle("~/Content/Toast").Include(
                "~/Content/jquery.toast.css",
                "~/Content/jquerytoast.css",
                "~/Content/not.css",
                "~/Content/toastr.min.css"
           ));

            bundles.Add(new StyleBundle("~/Content/Fuentes").Include(
             //"~/Content/fuentes.css"       
             ));

            bundles.Add(new StyleBundle("~/Content/Mapplic").Include(
               "~/mapplic/mapplic.css",
               "~/Content/mapa.css"
            ));

            bundles.Add(new StyleBundle("~/Content/Requerimientos").Include(
               "~/Content/dropify/dropify.min.css",
               "~/Content/fileinput.css"
            ));


            /* SCRIPTS */

            bundles.Add(new ScriptBundle("~/bundles/Shared").Include(
                "~/Scripts/jquery-1.9.1.min.js",
                "~/Scripts/bootstrap/bootstrap.js",
                "~/Scripts/sidebar-nav.js",
                "~/Scripts/waves.js",
                "~/Scripts/custom.js",
                // "~/Scripts/scrolldown.js",
                "~/Scripts/jquery.toast.js",
                "~/Scripts/general.js",
                "~/Scripts/sweetalert.min.js",
                "~/Scripts/datepicker.min.js",
                "~/Scripts/datepicker.es.js",
                "~/Scripts/datepicker.en.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/Login").Include(
                 "~/Scripts/jquery-1.9.1.min.js",
                 "~/Scripts/owl.carousel.js",
                 "~/Scripts/carouselPatrocinadores.js",
                 "~/Scripts/form-login.js",
                 "~/Scripts/main.js",
                 "~/Scripts/general.js"
             ));

            bundles.Add(new ScriptBundle("~/bundles/Pago").Include(
                 "~/Scripts/jquery-1.9.1.min.js",
                 "~/Scripts/bootstrap/bootstrap.js",
                 "~/Scripts/navtab.js",
                 //"~/Scripts/dropify/dropify.min.js",
                 "~/Scripts/dropify/dropify.js",
                 //"~/Scripts/jquery-vertical-tabs.js",
                 "~/Scripts/dropify/select_Tabs.js",
                 "~/Scripts/dropify/drop.js",
                 "~/Scripts/jquery.ForceBankingCard.js",
                 "~/Scripts/jquery-1.11.1.min.js",
                 "~/Scripts/general.js"
            //     "~/Scripts/jquery.creditCardValidator.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/Plano").Include(
                 //"~/Scripts/jquery.min.js",
                 "~/Scripts/sidebar.js",
                 "~/Scripts/main.js",
                 "~/Scripts/modernizr.custom.79639.js",
                 "~/Scripts/general.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/Requerimientos").Include(
                "~/Scripts/jquery-1.9.1.min.js",
                "~/Scripts/dropify/dropify.js",
                "~/Scripts/fileinput.min.js",
                "~/Scripts/es.js",
                //"~/Scripts/fileinput/fileinput.min.js",
                "~/Scripts/requerimientos-tabs.js",
                "~/Scripts/tabsNav.js",
                "~/Scripts/anadirNumber.js",
                "~/Scripts/jquery.toast.js",
                "~/Scripts/toastr.js",
                "~/Scripts/positions-notify.js",
                "~/Scripts/requerimientos.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/Toast").Include(
                "~/Scripts/jquery.toast.js",
                "~/Scripts/toastr.min.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/Mapa").Include(
                 "~/Scripts/jsMapa/jquery-3.2.1.min.js",
                 "~/Scripts/jquery-1.9.1.min.js",
                 "~/Scripts/jsMapa/jquery.min.js",
                 "~/Scripts/jsMapa/jquery.mousewheel.js",
                 "~/Scripts/jsMapa/hammer.min.js",
                 "~/Scripts/jsMapa/html5shiv.js",
                 "~/Scripts/jsMapa/magnific-popup.js",
                 "~/Scripts/jsMapa/script.js"/*,
                "~/Scripts/customScrollbar.js"*/
             ));

            bundles.Add(new ScriptBundle("~/bundles/Mapplic").Include(
                "~/mapplic/mapplic.js",
                "~/Scripts/mapa.js"
            ));


        }
    }
}
