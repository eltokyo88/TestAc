// Funcionalidad para upload de archivos en ya cuento con proveedor
//$("#DRO_JS").fileinput({
//    'showUpload': false,
//    'browseLabel': 'Buscar',
//    'msgPlaceholder': '  ',
//    'showCancel': false,
//    'dropZoneTitle': 'Arrastra tu documento en formato .jpg, .png o .pdf o da click en buscar.'
//});
//$("#render_JS").fileinput({
//    'showUpload': false,
//    'browseLabel': 'Buscar',
//    'msgPlaceholder': '  ',
//    'showCancel': false,
//    'dropZoneTitle': 'Arrastra tu documento en formato .jpg, .png o .pdf o da click en buscar.'
//});

//var inicializarFileInput = function () {
//    $('#DRO_JS').fileinput('refresh');
//    $("#DRO_JS").fileinput({
//        'showUpload': false,
//        'browseLabel': 'Buscar',
//        'msgPlaceholder': '  ',
//        'showCancel': false,
//        'dropZoneTitle': 'Arrastra tu documento en formato .jpg, .png o .pdf o da click en buscar.'
//    });
//    $("#render_JS").fileinput({
//        'showUpload': false,
//        'browseLabel': 'Buscar',
//        'msgPlaceholder': '  ',
//        'showCancel': false,
//        'dropZoneTitle': 'Arrastra tu documento en formato .jpg, .png o .pdf o da click en buscar.'
//    });    
//}

//// Fin de funcionalidad para upload de archivos en ya cuento con proveedor


// Agregar y quitar cantidad en lista de servicios
$('#informacionStands').on('click', '.demand__quantity-btn_JS', function (e) {
    e.preventDefault();

    fieldName = $(this).attr('data-field');
    type = $(this).attr('data-type');
    var input = $("input[name='" + fieldName + "']");
    var currentVal = parseInt(input.val());
    if (!isNaN(currentVal)) {
        if (type == 'minus') {

            if (currentVal > input.attr('min')) {
                input.val(currentVal - 1).change();
                
                
            }
            if (parseInt(input.val()) == input.attr('min')) {
                $(this).attr('disabled', true);
            }

        } else if (type == 'plus') {

            if (currentVal < input.attr('max')) {
                input.val(currentVal + 1).change();
                
            }
            if (parseInt(input.val()) == input.attr('max')) {
                $(this).attr('disabled', true);
            }

        } 
        
    } else {
        input.val(0);
    }
});

$('#informacionStands').on('focusin', '.demand__quantity_JS', function () {
    $(this).data('oldValue', $(this).val());
});

$('#informacionStands').on('change', '.demand__quantity_JS', function () {

    minValue = parseInt($(this).attr('min'));
    maxValue = parseInt($(this).attr('max'));
    valueCurrent = parseInt($(this).val());

    name = $(this).attr('name');
    if (valueCurrent >= minValue) {
        $(".demand__quantity-btn_JS[data-type='minus'][data-field='" + name + "']").removeAttr('disabled')
    } else {
        alert('La cantidad mínima a apartar, es de 1.');
        $(this).val($(this).data('oldValue'));
    }
    if (valueCurrent <= maxValue) {
        $(".demand__quantity-btn_JS[data-type='plus'][data-field='" + name + "']").removeAttr('disabled')
    } else {
        alert('Lo sentimos, pero ya no contamos con más de este producto en el inventario');
        $(this).val($(this).data('oldValue'));
    }    
});

$('#informacionStands').on('keydown', ".demand__quantity_JS", function (e) {
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode == 65 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
        // let it happen, don't do anything
        return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
});
// Fin de funcionalidad para gregar y quitar cantidad en lista de servicios