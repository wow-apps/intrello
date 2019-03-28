/**
 * @private
 */
let Request = {
    mode: '',
    name: '',
    desc: '',
    url: '',
    source: ''
}

class TrelloApiRequest {
    /**
     * @public
     * @param {string} mode
     * @param {string} name
     * @param {string} description
     * @param {string} url
     * @param {string} source
     */
    constructor( mode, name, description, url, source ) {
        this.Request.mode = mode;
        this.Request.name = name;
        this.Request.desc = description;
        this.Request.url = url;
        this.Request.source = source;
    };
    
    /**
     * @public
     * @returns {string}
     */
    getMode() {
        return this.Request.mode;
    };

    /**
     * @public
     * @returns {string}
     */
    getName() {
        return this.Request.name;
    };
}

export default TrelloApiRequest;
