/**
 * inTrello - extension for Google Chrome
 * @package https://github.com/wow-apps/intrello
 * @copyright wow-apps <https://wow-apps.pro/>
 * @author Alexey Samara <lion.samara@gmail.com>
 * @licence Apache License 2
 */

$(document).ready(function() {
    
    var css = [
        'div.recent-list input[type="button"].button.button-green{color:#fff!important;background:#A5B542!important;font-weight:400!important;border:none!important;box-shadow:none!important;border-radius:0!important;-webkit-border-radius:0!important;-moz-border-radius:0!important}',
        'div.recent-list input[type="button"].button.button-green:hover{background:#91a031!important;color:#fff!important;font-weight:400!important;border:none!important;box-shadow:none!important;border-radius:0!important;-webkit-border-radius:0!important;-moz-border-radius:0!important}',
        'a.button.button-green{color:#fff!important;background:#A5B542!important;font-weight:400!important;border:none!important;box-shadow:none!important;border-radius:0!important;-webkit-border-radius:0!important;-moz-border-radius:0!important}',
        'a.button.button-green:hover{background:#91a031!important;color:#fff!important;font-weight:400!important;border:none!important;box-shadow:none!important;border-radius:0!important;-webkit-border-radius:0!important;-moz-border-radius:0!important}',
        'div.card-preview{box-shadow:none!important;border:none!important;border-radius:0!important;-webkit-border-radius:0!important;-moz-border-radius:0!important}',
        'h2.title-heading{font-size:12px!important;font-weight:300!important}',
        'div.other-options{background:#333!important}',
        'div.other-options input[type=button]{background:#eee!important;font-weight:300!important;box-shadow:none!important;border:none!important;border-radius:0!important;-webkit-border-radius:0!important;-moz-border-radius:0!important}',
        'div.other-options input[type=button]:hover{background:#3787C7!important;color:#fff!important}',
        'div.other-options input[type=button].button-green{background:#91a031!important}',
        'label.card-desc-header{display:none!important}',
        'div.list-list input[type="button"]{width:100%!important;background:#689ABC!important;color:#fff!important;font-weight:300!important;box-shadow:none!important;border:none!important;border-radius:0!important;-webkit-border-radius:0!important;-moz-border-radius:0!important}',
        'div.list-list input[type="button"]:hover{background:#3787C7!important;color:#fff!important}',
        'div.group div.group-name{font-weight:400!important}',
        'div.group div.board{box-shadow:none!important;border:none!important;border-radius:0!important;-webkit-border-radius:0!important;-moz-border-radius:0!important}'
    ];

    var styleBlock = '<style type="text/css">';
    $.each(css, function(key, value) {
        styleBlock += value;
    });
    styleBlock += '</style>';

    $('head').append(styleBlock);

});