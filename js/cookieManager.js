/**
 * inTrello - extension for Google Chrome
 *
 * @package https://github.com/wow-apps/intrello
 * @copyright wow-apps <https://wow-apps.pro/>
 * @author Alexey Samara <lion.samara@gmail.com>
 * @link https://wow-apps.github.io/intrello/
 * @licence Apache License 2
 */

 var cookie = {
    getAll: function() {
        var result = {},
            cookiesArray = document.cookie.split(';');
        $.each(cookiesArray, function(key, value) {
            var valueArray = value.split('=');
            if (valueArray.length < 2) {
                return;
            }

            if (valueArray.length > 2) {
                result[valueArray[0].trim()] = '';
                $.each(valueArray, function(vaKey, vaValue) {
                    if (vaKey != 0) {
                        if (vaKey != 1) {
                            result[valueArray[0].trim()] += '=';
                        }
                        result[valueArray[0].trim()] += vaValue.replace('"', '');
                    }
                });

                return;
            }

            result[valueArray[0].trim()] = valueArray[1].replace('"', '');
        });

        console.log(result);

        return result;
    },
    get: function(name) {
        var cookies = this.getAll();
        return (cookies[name] === undefined) ? null : cookies[name];
    },
    set: function(name, value, options) {
        options = options || {};
      
        var expires = options.expires;
      
        if (typeof expires == "number" && expires) {
          var d = new Date();
          d.setTime(d.getTime() + expires * 1000);
          expires = options.expires = d;
        }
        if (expires && expires.toUTCString) {
          options.expires = expires.toUTCString();
        }
      
        value = encodeURIComponent(value);
      
        var updatedCookie = name + "=" + value;
      
        for (var propName in options) {
          updatedCookie += "; " + propName;
          var propValue = options[propName];
          if (propValue !== true) {
            updatedCookie += "=" + propValue;
          }
        }
      
        document.cookie = updatedCookie;
      },
      delete: function(name) {
        this.set(name, "", {
          expires: -1
        });
      },
      check: function() {
        if (!navigator.cookieEnabled) {
            throw new Error('You should enable cookies in your browser');
        }
      }
 };