/**
 * inTrello - extension for Google Chrome
 * @package https://github.com/wow-apps/intrello
 * @copyright wow-apps <https://wow-apps.pro/>
 * @author Alexey Samara <lion.samara@gmail.com>
 * @licence Apache License 2
 */

var inTrello = {
    data: {
        trelloApiRequest: {
            mode: '',
            name: '',
            desc: '',
            url: '',
            source: '',
            appendDesc: function(text) {
                this.desc += text;
                return this;
            }
        },
        inProfile: {
            name: '',
            topic: '',
            currentWork: '',
            location: '',
            avatar: '',
            experience: [],
            education: [],
            contacts: []
        }
    },
    trait: {
        clearText: function(text) {
            return text.trim().replace(/[\r\n]+/g, '').replace(/\s\s+/g, ' ');
        },
        h1: function(text) {
            return '#' + text;
        },
        h2: function(text) {
            return '##' + text;
        },
        h3: function(text) {
            return '###' + text;
        },
        br: function() {
            return '\n';
        },
        hr: function() {
            return '---';
        },
        img: function(title, href) {
            return '![' + title + '](' + href + ')';
        },
        a: function(alt, href) {
            return '[' + alt + '](' + href + ')';
        },
        italic: function(text) {
            return '_' + text + '_';
        },
        strong: function(text) {
            return '**' + text + '**';
        },
        blockquote: function(text) {
            return '> ' + text;
        }
    },
    configure: function(appKey, appMode, tabUrl) {
        window.Trello.setKey(appKey);
        this.data.trelloApiRequest.desc = '';
        this.data.trelloApiRequest.mode = appMode;
        this.data.trelloApiRequest.url = tabUrl;
        this.data.trelloApiRequest.source = tabUrl;

        return this;
    },
    preLoader: function(isShow) {
        if (isShow) {
            $('head').append('<style type="text/css">#intrello-preloader-curtain,#intrello-preloader-loader-container{position:fixed;left:0;top:0;width:100%;height:100%;display:block}#intrello-preloader-curtain{z-index:9998;background:#ccc}#intrello-preloader-loader-container{z-index:9999}h1.intrello-preloader-h{text-align:center;color:#333;font-family:sans-serif;font-size:14px;font-weight:300}.intrello-preloader-cssload-container{display:block;margin:125px auto;width:250px}.intrello-preloader-cssload-loading i{width:50px;height:50px;display:inline-block;border-radius:50%;background:#00b3d5}.intrello-preloader-cssload-loading i:first-child{opacity:0;animation:intrello-preloader-cssload-loading-ani2 .58s linear infinite;-o-animation:intrello-preloader-cssload-loading-ani2 .58s linear infinite;-ms-animation:intrello-preloader-cssload-loading-ani2 .58s linear infinite;-webkit-animation:intrello-preloader-cssload-loading-ani2 .58s linear infinite;-moz-animation:intrello-preloader-cssload-loading-ani2 .58s linear infinite;transform:translate(-50px);-o-transform:translate(-50px);-ms-transform:translate(-50px);-webkit-transform:translate(-50px);-moz-transform:translate(-50px)}.intrello-preloader-cssload-loading i:nth-child(2),.intrello-preloader-cssload-loading i:nth-child(3){animation:intrello-preloader-cssload-loading-ani3 .58s linear infinite;-o-animation:intrello-preloader-cssload-loading-ani3 .58s linear infinite;-ms-animation:intrello-preloader-cssload-loading-ani3 .58s linear infinite;-webkit-animation:intrello-preloader-cssload-loading-ani3 .58s linear infinite;-moz-animation:intrello-preloader-cssload-loading-ani3 .58s linear infinite}.intrello-preloader-cssload-loading i:last-child{animation:intrello-preloader-cssload-loading-ani1 .58s linear infinite;-o-animation:intrello-preloader-cssload-loading-ani1 .58s linear infinite;-ms-animation:intrello-preloader-cssload-loading-ani1 .58s linear infinite;-webkit-animation:intrello-preloader-cssload-loading-ani1 .58s linear infinite;-moz-animation:intrello-preloader-cssload-loading-ani1 .58s linear infinite}@keyframes intrello-preloader-cssload-loading-ani1{100%{transform:translate(100px);opacity:0}}@-o-keyframes intrello-preloader-cssload-loading-ani1{100%{-o-transform:translate(100px);opacity:0}}@-ms-keyframes intrello-preloader-cssload-loading-ani1{100%{-ms-transform:translate(100px);opacity:0}}@-webkit-keyframes intrello-preloader-cssload-loading-ani1{100%{-webkit-transform:translate(100px);opacity:0}}@-moz-keyframes intrello-preloader-cssload-loading-ani1{100%{-moz-transform:translate(100px);opacity:0}}@keyframes intrello-preloader-cssload-loading-ani2{100%{transform:translate(50px);opacity:1}}@-o-keyframes intrello-preloader-cssload-loading-ani2{100%{-o-transform:translate(50px);opacity:1}}@-ms-keyframes intrello-preloader-cssload-loading-ani2{100%{-ms-transform:translate(50px);opacity:1}}@-webkit-keyframes intrello-preloader-cssload-loading-ani2{100%{-webkit-transform:translate(50px);opacity:1}}@-moz-keyframes intrello-preloader-cssload-loading-ani2{100%{-moz-transform:translate(50px);opacity:1}}@keyframes intrello-preloader-cssload-loading-ani3{100%{transform:translate(50px)}}@-o-keyframes intrello-preloader-cssload-loading-ani3{100%{-o-transform:translate(50px)}}@-ms-keyframes intrello-preloader-cssload-loading-ani3{100%{-ms-transform:translate(50px)}}@-webkit-keyframes intrello-preloader-cssload-loading-ani3{100%{-webkit-transform:translate(50px)}}@-moz-keyframes intrello-preloader-cssload-loading-ani3{100%{-moz-transform:translate(50px)}}</style>');
            $('body').append('<div id="intrello-preloader-curtain"></div><div id="intrello-preloader-loader-container"><div class="intrello-preloader-cssload-container"><div class="intrello-preloader-cssload-loading"><i></i><i></i><i></i><i></i></div></div><h1 class="intrello-preloader-h">inTrello fetching data from profile...</h1></div>');
        } else {
            $('#intrello-preloader-curtain, #intrello-preloader-loader-container').remove();
        }

        return this;
    },
    execute: function() {
        this.preLoader(true);
        $('button.contact-see-more-less').click();
        $("html, body").animate({ scrollTop: $(document).height() }, 3000).promise().then(function() {
            $(window).scrollTop(0);
            inTrello.parseData();
        });
    },
    parseData: function() {
        this.data.inProfile.name = this.trait.clearText($('h1.pv-top-card-section__name').text());
        this.data.inProfile.topic = this.trait.clearText($('h2.pv-top-card-section__headline').text());
        this.data.inProfile.currentWork = this.trait.clearText($('h3.pv-top-card-section__company').text());
        this.data.inProfile.location = this.trait.clearText($('h3.pv-top-card-section__location').text());
        this.data.inProfile.avatar = $(".pv-top-card-section__photo")
            .css("backgroundImage")
            .replace('url("', '')
            .replace('")', '');

        $('li.pv-position-entity').each(function(item) {
            inTrello.data.inProfile.experience.push({
                company: inTrello.trait.clearText($('.pv-entity__secondary-title', this).text()),
                position: inTrello.trait.clearText($('h3', this).text()),
                dateRange: inTrello.trait.clearText($('h4.pv-entity__date-range span:last-child', this).text()),
                location: inTrello.trait.clearText($('h4.pv-entity__location span:last-child', this).text())
            });
        });

        $('div.pv-education-entity').each(function(item) {
            inTrello.data.inProfile.education.push({
                schoolName: inTrello.trait.clearText($('h3.pv-entity__school-name', this).text()),
                degreeName: inTrello.trait.clearText($('p.pv-entity__degree-name', this).text()),
                dateRange: inTrello.trait.clearText($('p.pv-entity__dates span:last-child', this).text())
            });
        });

        $('a[data-control-name="contact_see_more"]').click();
        console.log('Button clicked');

        setTimeout(function() {
            console.log('Timeout is over');
            console.log('Founded ' + $('section.pv-contact-info__contact-type').length + ' items');
            $('section.pv-contact-info__contact-type').each(function(item) {
                console.log(inTrello.trait.clearText($('header', this).text()) + ' ==> ' + inTrello.trait.clearText($('div.pv-contact-info__ci-container', this).text()));
                inTrello.data.inProfile.contacts.push({
                    contactHeader: inTrello.trait.clearText($('header', this).text()),
                    contactValue: inTrello.trait.clearText($('div.pv-contact-info__ci-container', this).text())
                });
            });

            inTrello.setupTrelloApiRequest();
        }, 2000);
    },
    setupTrelloApiRequest: function() {
        this.data.trelloApiRequest.name = this.data.inProfile.name;
        if (this.data.inProfile.currentWork != '') {
            this.data.trelloApiRequest.name += ' [' + this.data.inProfile.currentWork + ']';
        }

        this.data.trelloApiRequest.appendDesc(this.trait.h2(this.data.inProfile.topic));
        if (this.data.inProfile.location != '') {
            this.data.trelloApiRequest.appendDesc(' (' + this.data.inProfile.location + ')');
        }
        this.data.trelloApiRequest
            .appendDesc(this.trait.br())
            .appendDesc(this.trait.hr())
            .appendDesc(this.trait.br());

        if (this.data.inProfile.contacts.length > 0) {
            this.data.trelloApiRequest
                .appendDesc(this.trait.h3('Contact information:'))
                .appendDesc(this.trait.br());
            $.each(this.data.inProfile.contacts, function(key, item) {
                inTrello.data.trelloApiRequest
                    .appendDesc(
                        inTrello.trait.blockquote(inTrello.trait.strong(item.contactHeader) + ': ' + item.contactValue)
                    )
                    .appendDesc(inTrello.trait.br());
            });
            this.data.trelloApiRequest
                .appendDesc(inTrello.trait.br())
                .appendDesc(inTrello.trait.hr())
                .appendDesc(inTrello.trait.br());
        }

        if (this.data.inProfile.experience.length > 0) {
            this.data.trelloApiRequest
                .appendDesc(inTrello.trait.h3('Experience:'))
                .appendDesc(inTrello.trait.br());
            $.each(this.data.inProfile.experience, function(key, item) {
                inTrello.data.trelloApiRequest
                    .appendDesc(
                        inTrello.trait.blockquote(
                            inTrello.trait.strong(item.position) + ' @ ' + item.company + ' [' + item.location + ']'
                        )
                    )
                    .appendDesc(inTrello.trait.br())
                    .appendDesc(
                        inTrello.trait.blockquote(
                            inTrello.trait.italic(item.dateRange)
                        )
                    )
                    .appendDesc(inTrello.trait.br())
                    .appendDesc(inTrello.trait.br());
            });
            this.data.trelloApiRequest
                .appendDesc(inTrello.trait.br())
                .appendDesc(inTrello.trait.hr())
                .appendDesc(inTrello.trait.br());
        }

        if (this.data.inProfile.education.length > 0) {
            this.data.trelloApiRequest
                .appendDesc(inTrello.trait.h3('Education:'))
                .appendDesc(inTrello.trait.br());
            $.each(this.data.inProfile.education, function(key, item) {
                inTrello.data.trelloApiRequest
                    .appendDesc(
                        inTrello.trait.blockquote(
                            inTrello.trait.strong(item.schoolName)
                        )
                    )
                    .appendDesc(inTrello.trait.br())
                    .appendDesc(inTrello.trait.blockquote(item.degreeName))
                    .appendDesc(inTrello.trait.br())
                    .appendDesc(
                        inTrello.trait.blockquote(
                            inTrello.trait.italic(item.dateRange)
                        )
                    )
                    .appendDesc(inTrello.trait.br())
                    .appendDesc(inTrello.trait.br());
            });
            this.data.trelloApiRequest
                .appendDesc(inTrello.trait.br())
                .appendDesc(inTrello.trait.hr())
                .appendDesc(inTrello.trait.br());
        }

        this.data.trelloApiRequest.appendDesc(
            this.trait.img(
                this.data.inProfile.name,
                this.data.inProfile.avatar
            )
        );

        this.data.trelloApiRequest
            .appendDesc(this.trait.br())
            .appendDesc(this.trait.hr())
            .appendDesc(this.trait.br())
            .appendDesc(
                this.trait.a(
                    'Added with inTrello extention for Google Chrome',
                    'https://github.com/wow-apps/intrello'
                )
            );

        this.preLoader(false);
        this.createCard();
    },
    createCard: function() {
        if (this.data.trelloApiRequest.mode === 'popup') {
            window.Trello.addCard({
                mode: this.data.trelloApiRequest.mode,
                name: this.data.trelloApiRequest.name,
                desc: this.data.trelloApiRequest.desc,
                source: this.data.trelloApiRequest.source,
                url: this.data.trelloApiRequest.url
            });
        }

        return this;
    }
};

chrome.runtime.onMessage.addListener(function(arguments, sender, sendResponse) {
    inTrello
        .configure(arguments.appKey, arguments.appMode, arguments.tab.url)
        .execute();
});