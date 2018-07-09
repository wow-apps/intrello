/**
 * inTrello - extension for Google Chrome
 * @package https://github.com/wow-apps/intrello
 * @copyright wow-apps <https://wow-apps.pro/>
 * @author Alexey Samara <lion.samara@gmail.com>
 * @licence Apache License 2
 */

$(document).ready(function() {
    
    var css = [
        'a.button.button-green{color:#fff;background:#A5B542;font-weight:400;border:none;box-shadow:none;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0}',
        'a.button.button-green:hover{background:#91a031;color:#fff;font-weight:400;border:none;box-shadow:none;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0}',
        'div.card-preview{box-shadow:none;border:none;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0}'
    ];

    var styleBlock = '<style type="text/css">';
    $.each(css, function(key, value) {
        styleBlock += value;
    });
    styleBlock += '</style>';

    $('head').append(styleBlock);

});