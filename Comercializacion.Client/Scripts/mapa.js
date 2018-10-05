
/*INFOPOP */
(function ($) {
    $.fn.infoPop = function (e, options) {
        var config = $.extend({}, {
            // Valores por default.
            contentPop: 'Sin contenido',
            background: '#cb0a4e',
            color: '#fff',
            width: 'auto',
            height: 'auto',
            padding: '5px 10px',
            targetPop: 'cursor',
            borderRadius: '4px'
        }, options);

        $(this).mouseenter(function () {
            $('body').append('<div class="infoPop"><span class="block wrapContentPadding text-center">' + config.contentPop + '</span><span class="arrowPop"></span></div>');
            var infoPop = $('.infoPop');
            infoPop.css({ color: config.color, background: config.background, width: config.width, height: config.height, 'border-radius': config.borderRadius })
            infoPop.find('.wrapContentPadding').css({ padding: config.padding })
            infoPop.children('span.arrowPop').css({ "border-top-color": config.background })

            window.onmousemove = function (event) {
                var x = event.clientX - (infoPop.width() / 2) - 25,
                    y = (event.clientY + window.scrollY) - infoPop.height() - 45;
                infoPop.offset({ top: y + 20, left: x + 20 });
            };
        }).mouseleave(function () {
            var infoPop = $('.infoPop');
            infoPop.remove();
        });
    }
}(jQuery));


var stands = [];
var cargarMapa = function () {

    var map = $('#extDivMapa').mapplic({
        height: $(window).height() - 350,
        minimap: false,
        sidebar: false,
        hovertip: false,
        developer: false,
        maxscale: 5,
        search: false,
        source: "svgOne"
    });
    map.on('mapready', function (e, self) {
        console.log('Map is ready!')
        // self grants direct access to the map object
        // The map will be focused on the washing machine by default
        self.moveTo(0, 0, 1, 0);
    });

    // funcion para el tooltip
    $('#svgOne').find('.stand').each(function () {
        var content = $(this).attr('data-nombre');
        var discountP = $(this).attr('data-discountpercentage');
        var discountM = $(this).attr('data-discountmoney');
        var expiration = $(this).attr('data-expirationdate');
        var redemption = $(this).attr('data-redemption');
        var currency = $(this).attr('data-currency');
        var medidas = $(this).attr('data-medidas');

        var hoy = new Date();
        
        var discount = "";
  
        var match = /(\d+)\/(\d+)\/(\d+)/.exec(expiration)
        var exp = new Date(match[3], match[2], match[1]);
        
        if (exp >= hoy) { //Valida si el cupón no ha vencido
          
            if (redemption == 0) { // Si el cupon no ha sido utilizado
              
                if (discountP > 0) {
                    discount = "Descuento: " + discountP + " % " + currency;
                } else if (discountM > 0) {
                    discount = "Descuento: $" + (parseFloat(discountM).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")) + " " + currency;
                } else {
                    discount = "";
                }
            }
        }
        
        var currency = $(this).attr('data-currency');
        var color = $(this).attr('fill');
        var idstand = $(this).attr('data-idstand');
        $(this).infoPop(this, {
            contentPop: '<span class="block alnCentrado bold fontSize_md">' + content + '</span>' + (discount != undefined ? '<br><span class="block alnCentrado bold fontSize_md" id="standInfo_' + idstand +'">' + discount + '</span>' : ''),
            background: color
        });
    });

    //Se detiene el loader 
    //$("#loaderStandsPatrocinios").html("");
    hideLoader();
}; cargarMapa();

function ReloadPartialConfiguration(e, idStand) {
    var uriAction = $("#urlPartialConfig").val();
    var idT = $(e).parent().attr("data-eventoId");
    $("#configureStands").load(uriAction + '?idEvent=' + idT + '&idStand=' + idStand, function (response, status, xhr) {
        if (status != "error") {
            $(e).windowPop(e, { contentWindowPop: $(e).attr('data-call-wPop') });
        }
    });
}

function CompraStand(e) {
    var idStand = $(e).attr('data-idStand');

    var costo = $("#stand_" + idStand).attr('data-costo');
    if ($(e).attr('class').includes("standDisponible")) {
        $(e).attr('class', $(e).attr('class').replace("standDisponible", 'standSeleccionado'))
        var nombreFront = $("#stand_" + idStand).attr('data-nombre');
        var medidas = $("#stand_" + idStand).attr('data-medidas');
        var iva = $("#stand_" + idStand).attr('data-iva');
        var isStand = $("#stand_" + idStand).attr('data-isStand');
        var moneda = $("#stand_" + idStand).attr('data-currency').replace(" ","");
      
        AddToCarrito(idStand, costo, nombreFront, medidas, iva, isStand, moneda)

        MandarToastExito("Éxito", "Se ha agregado el stand a tu carrito");
    }
    else if ($(e).attr('class').includes("standSeleccionado")) {  
        var moneda = $("#stand_" + idStand).attr('data-currency');
       
        RemoveFromCarrito(idStand, costo, moneda, true);
    }

}
function ComprarPatrocinio(e)
{
    var idStand = $(e).attr('data-id');
    
    var costo = $("#patrocinio_s" + idStand).attr('data-costo');
    //if ($(e).attr('class').includes("PatDisponible")) {
        $(e).attr('class', $(e).attr('class').replace("PatDisponible", 'PatSeleccionado'))
        var nombreFront = $("#patrocinio_s" + idStand).attr('data-nombre');
        var medidas = $("#patrocinio_s" + idStand).attr('data-medidas');
        var iva = $("#patrocinio_s" + idStand).attr('data-iva');
        var moneda = $("#patrocinio_s" + idStand).attr('data-currency');
       
        AddToCarrito(idStand, costo, nombreFront, '', 1, false, moneda)
        //$("#patrocinio_s" + idStand).text('X').css("background-color", "#B20000");
        $("#patrocinio_sRemove" + idStand).show();
        $("#patrocinio_s" + idStand).hide();
        MandarToastExito("Éxito", "Se ha agregado el patrocinio a tu carrito");
        
    //}
    //else if ($(e).attr('class').includes("PatSeleccionado")) {
    //    RemoveFromCarrito(idStand, costo,false);
    //}
}



function AddToCarrito(idStand, costo, nombreFront, medidas, iva, isStand, moneda) {
    var cartItems = $("#itemsTotalCarritoNumber").text();
    catItems = parseInt(cartItems);
      
    if ($("#cd-cart").length > 0) {
        var ulData = $("#cd-cart").find(".cd-cart-items");
        if ($(ulData).find("#listand_" + idStand).length > 0) {
            return;
        }

        var numCoche = parseInt($("#numEnCoche").attr('data-numEnCoche'));
        if ($("#numEnCoche").attr('data-numEnCoche') == undefined) {
            $("#numEnCoche").attr('data-numEnCoche', 0);
            numCoche = 0
        }
        numCoche = numCoche + 1;
        $("#numEnCoche").attr('data-numEnCoche', numCoche);
        $("#numEnCoche").text(numCoche);
        
        var costoStandText = '$' + parseFloat(costo).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        var idStandText = 'listand_' + idStand;
        var textAppend = '<li id="' + idStandText + '" data-id="' + idStand + '" class="elementosCarrito">';
        textAppend += '<input type="hidden" name="products.Index" value="'+numCoche+'" />';
        textAppend += '<input type="hidden" name="products[' + numCoche + '].IdElement" value="' + idStand + '" idStand=' + idStand+'/>';
        textAppend += '<input type="hidden" name="products[' + numCoche + '].IsStand" value="' + isStand + '" isStand=' + isStand +' />';
        textAppend += '<input type="hidden" name="products[' + numCoche + '].Cost" value="' + costo + '" cost = "' + costo + '"/>';
        textAppend += '<input type="hidden" name="products[' + numCoche + '].NameElement" value="' + nombreFront + '" nameElement="' + nombreFront + '"/>';
        textAppend += '<input type="hidden" name="products[' + numCoche + '].Descripcion" value="' + medidas + '" descripcion="' + medidas + '"/>';
        textAppend += '<input type="hidden" name="products[' + numCoche + '].Iva" value="' + iva + '" iva="' + iva + '"/>';
        textAppend += '<input type="hidden" name="products[' + numCoche + '].Currency" value="' + moneda + '" currency="' + moneda + '"/>';
        textAppend += '<input type="hidden" name="products[' + numCoche + '].Size" value="' + medidas + '" size="' + medidas + '"/>';
        comilla = "'";
        textAppend += '<span class="cd-qty" >' + medidas + '</span> ' + nombreFront + '<div class="cd-price">' + costoStandText + ' ' + moneda + '</div> <href="#" class="cd-item-remove cd-img-replace" onclick="return RemoveFromCarrito(' + idStand + ',' + costo + ',' + comilla + '' + moneda + '' + comilla +',' + isStand + ' )"></a></li > ';
        $(ulData).append(textAppend);
        
        var total = $(".totalCarrito").text();
        total = parseFloat(total);


        //Se agregan los productos al carrito de la sesión
        var ulData = $("#cd-cart").find(".elementosCarrito");
      
        var itemShopping = new Array();

        /*itemShopping.push({
            item: numCoche,
            IdElement: idStand,
            IsStand: isStand,
            Cost: costo,
            NameElement: nombreFront,
            Iva: iva,
            Currency: moneda,
            Size: medidas
        });*/

        $.each(ulData, function (i, data) {
            if (ulData.length > 0) {
                itemShopping.push({
                    item: document.getElementsByName("products.Index")[i].value,
                    IdElement: document.getElementsByName("products[1].IdElement")[i].value,
                    IsStand: document.getElementsByName("products[1].IsStand")[i].value,
                    Cost: document.getElementsByName("products[1].Cost")[i].value,
                    NameElement: document.getElementsByName("products[1].NameElement")[i].value,
                    Iva: document.getElementsByName("products[1].Cost")[i].value - (document.getElementsByName("products[1].Cost")[i].value / 1.16),
                    Currency: document.getElementsByName("products[1].Currency")[i].value,
                    Size: document.getElementsByName("products[1].Size")[i].value
                });
            }
        });

        /*
        var costoAct = 0;
        
        $(".carTotalNumber").each(function () {
            $(this).text(num);
            costoAct = parseFloat($(this).text().replace('$', '').replace(',', ''));
        });
        
        //parseFloat($(".carTotalNumber").text().replace('$', '').replace(',', ''));
        costoAct = parseFloat(costoAct) + parseFloat(costo);
        console.log(parseFloat(costoAct) + parseFloat(costo));
        var num = costoAct.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

        $(".carTotalNumber").each(function ()
        {
            $(this).text(num);
            
            
        });*/


        cartItems++;
        $("#itemsTotalCarritoNumber").text(cartItems);

        var tc = $(".totalCarrito").text().replace('$', '').replace(',', '');      
        $(".totalCarrito").text((parseFloat(tc) + parseFloat(costo)).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + " " + moneda);

        if (isStand) {
            $("#stand_" + idStand).removeClass('standDisponible')
            $("#stand_" + idStand).addClass("standSeleccionado");
        }

        agregarAlCarritoSession(itemShopping);
    }
}

function RemoveFromCarrito(idStand, costo, moneda, isStand) {
    costo = parseFloat(costo.toString().replace('+', '').replace(' ', ''));
    
    $('#listand_' + idStand).remove();
    var numCoche = parseInt($("#numEnCoche").attr('data-numEnCoche'));
    $("#numEnCoche").attr('data-numEnCoche', numCoche - 1);
    $("#numEnCoche").text(numCoche - 1);

    var costoAct = parseFloat($("#carTotalNumber").text().replace('$', '').replace(',', '').replace(',', '').replace(' ', ''));
    costoAct = parseFloat(costoAct) - costo;

    var num = '$' + costoAct.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

    //$("#carTotalNumber").text(num);  
    var cartItems = $("#itemsTotalCarritoNumber").text();
    catItems = parseInt(cartItems);
    cartItems--;
    $("#itemsTotalCarritoNumber").text(cartItems);

    var tc = $(".totalCarrito").text().replace('$', '').replace(',', '').replace(',', '').replace(' ', '').replace('+', '');
    $(".totalCarrito").text((parseFloat(tc) - parseFloat(costo)).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + " " + moneda);
    
    if (isStand) {
        eliminarCarritoSession(idStand, isStand);
       
        MandarToastAdvertencia("Éxito", "Se ha eliminado el stand de tu carrito");
        $("#stand_" + idStand).attr('class', $("#stand_" + idStand).attr('class').replace("standSeleccionado", 'standDisponible'))
    }
    else
    {
        eliminarCarritoSession(idStand, isStand);
       
        MandarToastAdvertencia("Éxito", "Se ha eliminado el patrocinio de tu carrito");
        $("#patrocinio_s" + idStand).attr('class', $("#patrocinio_s" + idStand).attr('class').replace("PatSeleccionado", 'PatDisponible'))
        $("#patrocinio_sRemove" + idStand).hide();
        $("#patrocinio_s" + idStand).show();
    }        

    

}

function PagarFooter(e)
{
    $("#btnPagar").click();
    return false;
}
