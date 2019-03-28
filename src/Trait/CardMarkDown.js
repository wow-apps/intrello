/**
 * TODO: add annotation
 */
class CardMarkDown {
    
    /**
     * @public
     * @param {string} text
     */
    clearText( text ) {
        return text.trim().replace(/[\r\n]+/g, '').replace(/\s\s+/g, ' ');
    };

    /**
     * @public
     * @param {string} text
     */
    h1( text ) {
        return '#' + text;
    };

    /**
     * @public
     * @param {string} text
     */
    h2( text ) {
        return '##' + text;
    };

    /**
     * @public
     * @param {string} text
     */
    h3( text ) {
        return '###' + text;
    };

    /**
     * @public
     */
    br() {
        return '\n';
    };
    
    /**
     * @public
     */
    hr() {
        return '---';
    };

    /**
     * @public
     * @param {string} title
     * @param {string} href
     */
    img( title, href ) {
        return '![' + title + '](' + href + ')';
    };

    /**
     * @public
     * @param {string} alt
     * @param {string} href
     */
    a( alt, href ) {
        return '[' + alt + '](' + href + ')';
    };

    /**
     * @public
     * @param {string} text
     */
    italic( text ) {
        return '_' + text + '_';
    };

    /**
     * @public
     * @param {string} text
     */
    strong( text ) {
        return '**' + text + '**';
    };

    /**
     * @public
     * @param {string} text
     */
    blockquote( text ) {
        return '> ' + text;
    }
}

export default CardMarkDown;
