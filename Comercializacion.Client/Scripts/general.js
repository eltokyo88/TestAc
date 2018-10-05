// funciones del encode.
function encode(str) {
    var buf = [];

    for (var i = str.length - 1; i >= 0; i--) {
        buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
    }

    return buf.join('');
}

function decode(str) {
    return str.replace(/&#(\d+);/g, function (match, dec) {
        return String.fromCharCode(dec);
    });
}

// Metodos que estaban en toastr

$(document).ready(function () {
    $(".tst1").click(function () {
        $.toast({
            heading: 'Welcome to my Pixel admin',
            text: 'Use the predefined ones, or specify a custom position object.',
            position: 'top-right',
            loaderBg: '#c6c6c6',
            icon: 'info',
            hideAfter: 3000,
            stack: 6,
            preventDuplicates: true
        });

    });

    $(".tst2").click(function () {
        $.toast({
            heading: 'Welcome to my Pixel admin',
            text: 'Use the predefined ones, or specify a custom position object.',
            position: 'top-right',
            loaderBg: '#c6c6c6',
            icon: 'warning',
            hideAfter: 3500,
            preventDuplicates: true,
            stack: 6
        });

    });
    $(".tst3").click(function () {
        $.toast({
            heading: 'Welcome to my Pixel admin',
            text: 'Use the predefined ones, or specify a custom position object.',
            position: 'top-right',
            loaderBg: '#c6c6c6',
            icon: 'success',
            hideAfter: 3500,
            stack: 6,
            preventDuplicates: true
        });

    });

    $(".tst4").click(function () {
        $.toast({
            heading: 'Welcome to my Pixel admin',
            text: 'Use the predefined ones, or specify a custom position object.',
            position: 'top-right',
            loaderBg: '#c6c6c6',
            icon: 'error',
            hideAfter: 3500,
            stack: 6,
            preventDuplicates: true

        });

    });


});

function MandarToastExito(titulo, text) {
    $.toast({
        heading: titulo,
        text: text,
        position: 'top-right',
        loaderBg: '#c6c6c6',
        bgColor: '#0ea807',
        icon: 'success',
        hideAfter: 4000,
        stack: 6,
        preventDuplicates: true
    });
}

function MandarToastInfo(titulo, text) {
    $.toast({
        heading: titulo,
        text: text,
        position: 'top-right',
        loaderBg: '#c6c6c6',
        bgColor: '#2c6acf',
        icon: 'info',
        hideAfter: 4000,
        stack: 6,
        preventDuplicates: true
    });
}

function MandarToastAdvertencia(titulo, text) {
    $.toast({
        color: 'white',
        heading: titulo,
        text: text,
        position: 'top-right',
        loaderBg: '#c6c6c6',
        bgColor: '#EF9100',
        icon: 'warning',
        hideAfter: 4000,
        stack: 6,
        preventDuplicates: true,
    });
}

function MandarToastError(titulo, text) {
    $.toast({
        heading: titulo,
        text: text,
        position: 'top-right',
        loaderBg: '#c6c6c6',
        bgColor: '#e4002b',
        icon: 'error',
        hideAfter: 4000,
        preventDuplicates: true
    });
}

var mandarAlerta = function (panel, clase, texto) {
    $(panel).text(texto).addClass(clase).show();
};

var ocultarAlerta = function (panel) {
    $(panel).hide();
    $(panel).removeClass("alert-danger");
    $(panel).removeClass("alert-info");
    $(panel).removeClass("alert-warning");
    $(panel).removeClass("alert-success");
};


var validateEmail = function (isEmail) {
    var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

    if (filter.test(isEmail)) {
        return true;
    }
    else {
        return false;
    }
};

function showLoader() {
    $('.loader__container_JS').fadeIn();
}

function hideLoader() {
    $('.loader__container_JS').fadeOut();
}