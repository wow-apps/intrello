/**
 * inTrello - extension for Google Chrome
 *
 * @package https://github.com/wow-apps/intrello
 * @copyright wow-apps <https://wow-apps.pro/>
 * @author Alexey Samara <lion.samara@gmail.com>
 * @link https://wow-apps.github.io/intrello/
 * @licence Apache License 2
 */

/**
 * @class
 * @public
 * @type {{getAll: (function()), get: (function(string): *), set: cookie.set, delete: cookie.delete, isCookiesEnabled: (function(): boolean), trim: (function(string, string): string)}}
 */
var cookie = {
    /**
     * @function
     * @public
     * @return {object}
     */
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

        return result;
    },
    /**
     * @function
     * @public
     * @param {string} name
     * @return {string}
     */
    get: function(name) {
        var cookies = this.getAll();
        return (cookies[name] === undefined) ? undefined : this.trim(cookies[name], '"');
    },
    /**
     * @function
     * @public
     * @param {string} name
     * @param {string} value
     * @param {object} options
     */
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
    /**
     * @function
     * @public
     * @param {string} name
     */
      delete: function(name) {
        this.set(name, "", {
          expires: -1
        });
      },
     /**
      * @function
      * @public
      * @return {boolean}
      */
      isCookiesEnabled: function() {
        return navigator.cookieEnabled;
      },
      /**
       * @function
       * @public
       * @param {string} string
       * @param {string} escapeCharacter
       * @return {string}
       */
      trim: function(string, escapeCharacter) {
            if (string.substring(string.length-1) == escapeCharacter) {
                string = string.substring(0, string.length-1);
            }

            return string;
      }
};