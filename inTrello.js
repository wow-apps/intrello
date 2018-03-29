
var inTrello = {
    data: {
        trelloApiRequest: {
            mode: '',
            name: '',
            desc: '',
            url: '',
            source: '',
            appendDesc: function (text) {
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
        clearText: function (text) {
            return text.trim().replace(/[\r\n]+/g, '').replace(/\s\s+/g, ' ');
        },
        h1: function (text) {
            return '#' + text;
        },
        h2: function (text) {
            return '##' + text;
        },
        h3: function (text) {
            return '###' + text;
        },
        br: function () {
            return '\n';
        },
        hr: function () {
            return '---';
        },
        img: function (title, href) {
            return '![' + title + '](' + href + ')';
        },
        a: function (alt, href) {
            return '[' + alt + '](' + href + ')';
        },
        italic: function (text) {
            return '_' + text + '_';
        },
        strong: function (text) {
            return '**' + text + '**';
        },
        blockquote: function (text) {
            return '> ' + text;
        }
    },
    configure: function (appKey, appMode, tabUrl) {
        window.Trello.setKey(appKey);
        this.data.trelloApiRequest.desc = '';
        this.data.trelloApiRequest.mode = appMode;
        this.data.trelloApiRequest.url = tabUrl;
        this.data.trelloApiRequest.source = tabUrl;
        return this;
    },
    execute: function () {
        this
            .loadPage()
            .parseData()
            .setupTrelloApiRequest()
            .createCard();
    },
    preLoader: function (isShow) {
        if (isShow) {
            var load = isShow;
        } else {
            var load = isShow;
        }

        return this;
    },
    loadPage: function () {
        //this.preLoader(true);
        $('button.contact-see-more-less').click();
        $("html, body").animate({scrollTop: $(document).height()}, 1000, 'swing', function () {
            setTimeout(function () {
                $(window).scrollTop(0);
            }, 3000);
        });

        return this;
    },
    parseData: function () {
        this.data.inProfile.name = this.trait.clearText($('h1.pv-top-card-section__name').text());
        this.data.inProfile.topic = this.trait.clearText($('h2.pv-top-card-section__headline').text());
        this.data.inProfile.currentWork = this.trait.clearText($('h3.pv-top-card-section__company').text());
        this.data.inProfile.location = this.trait.clearText($('h3.pv-top-card-section__location').text());
        this.data.inProfile.avatar = $(".pv-top-card-section__photo")
            .css("backgroundImage")
            .replace('url("', '')
            .replace('")', '');

        $('li.pv-position-entity').each(function (item) {
            inTrello.data.inProfile.experience.push(
                {
                    company: inTrello.trait.clearText($('.pv-entity__secondary-title', this).text()),
                    position: inTrello.trait.clearText($('h3', this).text()),
                    dateRange: inTrello.trait.clearText($('h4.pv-entity__date-range span:last-child', this).text()),
                    location: inTrello.trait.clearText($('h4.pv-entity__location span:last-child', this).text())
                }
            );
        });

        $('div.pv-education-entity').each(function (item) {
            inTrello.data.inProfile.education.push(
                {
                    schoolName: inTrello.trait.clearText($('h3.pv-entity__school-name', this).text()),
                    degreeName: inTrello.trait.clearText($('p.pv-entity__degree-name', this).text()),
                    dateRange: inTrello.trait.clearText($('p.pv-entity__dates span:last-child', this).text())
                }
            );
        });

        $('section.pv-contact-info__contact-type').each(function (item) {
            inTrello.data.inProfile.contacts.push(
                {
                    contactHeader: inTrello.trait.clearText($('header', this).text()),
                    contactValue: inTrello.trait.clearText($('div.pv-contact-info__ci-container', this).text())
                }
            );
        });

        return this;
    },
    setupTrelloApiRequest: function () {
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
            $.each(this.data.inProfile.contacts, function (key, item) {
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
            $.each(this.data.inProfile.experience, function (key, item) {
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
            $.each(this.data.inProfile.education, function (key, item) {
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
                    'https://wow-apps.pro/'
                )
            );

        return this;
    },
    createCard: function () {
        if (this.data.trelloApiRequest.mode === 'popup') {
            window.Trello.addCard(
                {
                    mode: this.data.trelloApiRequest.mode,
                    name: this.data.trelloApiRequest.name,
                    desc: this.data.trelloApiRequest.desc,
                    source: this.data.trelloApiRequest.source,
                    url: this.data.trelloApiRequest.url
                }
            );
        }
    }
};

chrome.runtime.onMessage.addListener(function (arguments, sender, sendResponse) {
    inTrello
        .configure(arguments.appKey, arguments.appMode, arguments.tab.url)
        .execute();
});