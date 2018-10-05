// Funcionalidad de tabla de solicitudes
$("input:checkbox").on('change', function () {
    if ($(this).is(':checked')) {
        $(this).parents('tr').addClass('demand__active-row');
    } else {
        $(this).parents('tr').removeClass('demand__active-row');
    }
    console.log($(this).is(':checked'));

    if ($(this).is(':checked') >= 1) {
        $('#demand-btn_JS').show('slow');
        $('.demand-btns_JS').hide('slow');
    } else {
        $('#demand-btn_JS').hide('slow');
        $('.demand-btns_JS').show('slow');
    }
});

$('#demand-btn_JS').hide();
$(".file-caption-name").hide();
$(".kv-fileinput-caption").hide();
$(".fileinput-remove").addClass("pull-right");
$(".btn-file").addClass("pull-right");
// Fin de funcionalidad de tabla de solicitudes