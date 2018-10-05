// JavaScript Document

 $('.btnNext').click(function(){
     var methodoPago = $("#pagoUnSoloPago option:selected").val();
     if (($("#checkAceptoApaartar").prop("checked") && methodoPago == 1)) {
         ocultarAlerta("#panelAlertPago");
         $('.nav-tabs > .active').next('li').find('a').trigger('click');         

     } else if ($("#aceptoCkeckApartarTDC").prop("checked") && methodoPago == 2){
         ocultarAlerta("#panelAlertPago");
         $('.nav-tabs > .active').next('li').find('a').trigger('click');

     }else if ($("#aceptoTerminosRFC").prop("checked") && methodoPago == 3) {
         ocultarAlerta("#panelAlertPago");
         $('.nav-tabs > .active').next('li').find('a').trigger('click');

     }else if($("#aceptoTerminosOrden").prop("checked") && methodoPago == 4) {
          ocultarAlerta("#panelAlertPago");
          $('.nav-tabs > .active').next('li').find('a').trigger('click');
     }else if ($("#aceptoTerminosCarta").prop("checked") && methodoPago == 5) {
         ocultarAlerta("#panelAlertPago");
         $('.nav-tabs > .active').next('li').find('a').trigger('click');
     } else {
          mandarAlerta("#panelAlertPago", "alert-danger", terminosCondiciones);
          $('#pagoCirculo a').tab('show');
     }
 });

  $('.btnPrevious').click(function(){
      var methodoPago = $("#pagoUnSoloPago option:selected").val();
      if (($("#checkAceptoApaartar").prop("checked") && methodoPago == 1)) {
          ocultarAlerta("#panelAlertPago");
          $('.nav-tabs > .active').prev('li').find('a').trigger('click');

      } else if ($("#aceptoCkeckApartarTDC").prop("checked") && methodoPago == 2) {
          ocultarAlerta("#panelAlertPago");
          $('.nav-tabs > .active').prev('li').find('a').trigger('click');

      } else if ($("#aceptoTerminosRFC").prop("checked") && methodoPago == 3) {
          ocultarAlerta("#panelAlertPago");
          $('.nav-tabs > .active').prev('li').find('a').trigger('click');

      } else if ($("#aceptoTerminosOrden").prop("checked") && methodoPago == 4) {
          ocultarAlerta("#panelAlertPago");
          $('.nav-tabs > .active').prev('li').find('a').trigger('click');
      } else if ($("#aceptoTerminosCarta").prop("checked") && methodoPago == 5) {
          ocultarAlerta("#panelAlertPago");
          $('.nav-tabs > .active').next('li').find('a').trigger('click');
      } else {
          mandarAlerta("#panelAlertPago", "alert-danger", terminosCondiciones);
          $('#pagoCirculo a').tab('show');
      }
});