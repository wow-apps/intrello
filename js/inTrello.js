/**
 * inTrello - extension for Google Chrome
 *
 * @package https://github.com/wow-apps/intrello
 * @copyright wow-apps <https://wow-apps.pro/>
 * @author Alexey Samara <lion.samara@gmail.com>
 * @link https://wow-apps.github.io/intrello/
 * @licence Apache License 2
 */
'use strict';

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
            $('head').append('<style type="text/css">div#intrello-preloader-curtain{position:fixed;z-index:9998;left:0;top:0;width:100%;height:100%;background:#fff}div#intrello-preloader-container{position:fixed;z-index:9999;left:50%;top:50%;width:128px;height:128px;margin:-64px 0 0 -64px;padding:0}div#intrello-preloader-box{position:relative;width:128px;height:128px;-webkit-border-radius:9px;-moz-border-radius:9px;border-radius:9px;box-shadow:rgba(0,0,0,0.5) 0 0 16px;background: linear-gradient(326deg, #2e79ba, #95c3eb, #2e79ba);background-size: 600% 600%;-webkit-animation: box 5000ms ease infinite;-moz-animation: box 5000ms ease infinite;-o-animation: box 5000ms ease infinite;animation: box 5000ms ease infinite}div#intrello-preloader-object-1{position:absolute;z-index:10;left:20px;top:14px;width:36px;height:36px;background:#fff;-webkit-border-radius:50%;-moz-border-radius:50%;border-radius:50%;animation:object-1 1000ms infinite}div#intrello-preloader-object-2{position:absolute;z-index:10;left:20px;bottom:14px;width:36px;height:55px;background:#fff;-webkit-border-radius:9px;-moz-border-radius:9px;border-radius:9px;animation:object-2 1000ms infinite}div#intrello-preloader-object-3{position:absolute;z-index:10;left:72px;top:14px;width:36px;height:100px;background:#fff;-webkit-border-radius:9px;-moz-border-radius:9px;border-radius:9px}@keyframes object-1{0%{-webkit-border-radius:50%;-moz-border-radius:50%;border-radius:50%;height:36px}50%{-webkit-border-radius:9px;-moz-border-radius:9px;border-radius:9px;height:55px}100%{-webkit-border-radius:50%;-moz-border-radius:50%;border-radius:50%;height:36px}}@keyframes object-2{0%{-webkit-border-radius:9px;-moz-border-radius:9px;border-radius:9px;height:55px}50%{-webkit-border-radius:50%;-moz-border-radius:50%;border-radius:50%;height:36px}100%{-webkit-border-radius:9px;-moz-border-radius:9px;border-radius:9px;height:55px}}@-webkit-keyframes box{0%{background-position:15% 0%}50%{background-position:86% 100%}100%{background-position:15% 0%}}@-moz-keyframes box{0%{background-position:15% 0%}50%{background-position:86% 100%}100%{background-position:15% 0%}}@-o-keyframes box{0%{background-position:15% 0%}50%{background-position:86% 100%}100%{background-position:15% 0%}}@keyframes box{0%{background-position:15% 0%}50%{background-position:86% 100%}100%{background-position:15% 0%}}div#intrello-preloader-text{position:fixed;z-index:9999;left:50%;top:50%;width: 256px;height: 40px;margin: 100px 0 0 -128px;background:#9dccf2;text-align: center;line-height: 40px;color: #fff;-webkit-border-radius:9px;-moz-border-radius:9px;border-radius:9px}</style>');
            $('body').append('<div id="intrello-preloader-curtain"></div><div id="intrello-preloader-container"><div id="intrello-preloader-box"><div id="intrello-preloader-object-1"></div><div id="intrello-preloader-object-2"></div><div id="intrello-preloader-object-3"></div></div></div><div id="intrello-preloader-text">begin the hiring process...</div>');
        } else {
            $('#intrello-preloader-curtain, #intrello-preloader-container, #intrello-preloader-text').remove();
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
        if ($(".pv-top-card-section__photo").length < 1) {
            if ($('img.profile-photo-edit__preview').length < 1) {
                this.data.inProfile.avatar = '';
            } else {
                this.data.inProfile.avatar = $('img.profile-photo-edit__preview').attr('src');
            }
        } else {
            this.data.inProfile.avatar = $(".pv-top-card-section__photo")
                .css("backgroundImage")
                .replace('url("', '')
                .replace('")', '');
        }

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

        setTimeout(function() {
            $('section.pv-contact-info__contact-type').each(function(item) {
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
                    'https://wow-apps.github.io/intrello/'
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