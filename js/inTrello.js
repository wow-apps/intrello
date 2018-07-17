/**
 * inTrello - extension for Google Chrome
 *
 * @package https://github.com/wow-apps/intrello
 * @copyright wow-apps <https://wow-apps.pro/>
 * @author Alexey Samara <lion.samara@gmail.com>
 * @link https://wow-apps.github.io/intrello/
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
            $('head').append('<style type="text/css">div#intrello-preloader-curtain{position:fixed;z-index:9998;left:0;top:0;width:100%;height:100%;background:#fff}div#intrello-preloader-container{position:fixed;z-index:9999;left:50%;top:50%;width:128px;height:128px;margin:-64px 0 0 -64px;padding:0}div#intrello-preloader-box{position:relative;width:128px;height:128px;-webkit-border-radius:9px;-moz-border-radius:9px;border-radius:9px;box-shadow:rgba(0,0,0,0.5) 0 0 16px;background: linear-gradient(326deg, #2e79ba, #95c3eb, #2e79ba);background-size: 600% 600%;-webkit-animation: box 5000ms ease infinite;-moz-animation: box 5000ms ease infinite;-o-animation: box 5000ms ease infinite;animation: box 5000ms ease infinite}div#intrello-preloader-object-1{position:absolute;z-index:10;left:20px;top:14px;width:36px;height:36px;background:#fff;-webkit-border-radius:50%;-moz-border-radius:50%;border-radius:50%;animation:object-1 1000ms infinite}div#intrello-preloader-object-2{position:absolute;z-index:10;left:20px;bottom:14px;width:36px;height:55px;background:#fff;-webkit-border-radius:9px;-moz-border-radius:9px;border-radius:9px;animation:object-2 1000ms infinite}div#intrello-preloader-object-3{position:absolute;z-index:10;left:72px;top:14px;width:36px;height:100px;background:#fff;-webkit-border-radius:9px;-moz-border-radius:9px;border-radius:9px}@keyframes object-1{0%{-webkit-border-radius:50%;-moz-border-radius:50%;border-radius:50%;height:36px}50%{-webkit-border-radius:9px;-moz-border-radius:9px;border-radius:9px;height:55px}100%{-webkit-border-radius:50%;-moz-border-radius:50%;border-radius:50%;height:36px}}@keyframes object-2{0%{-webkit-border-radius:9px;-moz-border-radius:9px;border-radius:9px;height:55px}50%{-webkit-border-radius:50%;-moz-border-radius:50%;border-radius:50%;height:36px}100%{-webkit-border-radius:9px;-moz-border-radius:9px;border-radius:9px;height:55px}}@-webkit-keyframes box{0%{background-position:15% 0%}50%{background-position:86% 100%}100%{background-position:15% 0%}}@-moz-keyframes box{0%{background-position:15% 0%}50%{background-position:86% 100%}100%{background-position:15% 0%}}@-o-keyframes box{0%{background-position:15% 0%}50%{background-position:86% 100%}100%{background-position:15% 0%}}@keyframes box{0%{background-position:15% 0%}50%{background-position:86% 100%}100%{background-position:15% 0%}}div#intrello-preloader-text{position:fixed;z-index:9999;left:50%;top:50%;width: 256px;height: 40px;margin: 100px 0 0 -128px;background:#9dccf2;text-align: center;line-height: 40px;color: #fff;-webkit-border-radius:9px;-moz-border-radius:9px;border-radius:9px}</style>');
            $('body').append('<div id="intrello-preloader-curtain"></div><div id="intrello-preloader-container"><div id="intrello-preloader-box"><div id="intrello-preloader-object-1"></div><div id="intrello-preloader-object-2"></div><div id="intrello-preloader-object-3"></div></div></div><div id="intrello-preloader-text"></div>');
            $('#intrello-preloader-text').text(chrome.i18n.getMessage('extPreloaderMessage'));
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
        this.requestContactData('viktoriya-roik-39442b66');
        // this.createCard();
    },
    getUserIdFromUrl: function(url) {
        console.log('Url: ' + url);
        var matches = url.match(new RegExp("\/in\/(.*)\/"));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    },
    requestContactData: function() {
        //curl 'https://www.linkedin.com/voyager/api/identity/profiles/marina-pronina/profileContactInfo' -H 'accept-encoding: gzip, deflate, br' -H 'x-li-lang: en_US' -H 'accept-language: ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,uk;q=0.6' -H 'x-requested-with: XMLHttpRequest' -H 'cookie: bcookie="v=2&e5bdf2d8-d4b0-4aa4-834c-bf11e8adf345"; bscookie="v=1&2018070809080352c22238-da0e-482c-8eff-d1783cc5bdd0AQF_BLzfl3FC0Q8oeh-dZwU5PBtBuWvS"; _ga=GA1.2.1733992327.1531148634; sl="v=1&snCCi"; JSESSIONID="ajax:2998513099200544385"; liap=true; li_at=AQEDAQpTC2QFzQQ0AAABZH-SDqgAAAFko56SqFYACsC4RMdnSoAA0-3w-buZCNFdzSUIGcGj2JQmJgaPwp7_tp_jloXv3x2t0tdYpC8YqyaooZivPI18t1x8TWfI3kFlPNXg_GvybYzCk73V8V2K30O7; _guid=c0e53a28-8e73-469b-880a-cb32d4d08f1c; li_oatml=AQHqZVQMMsg9RgAAAWR_kiL2Fd-0FMQm_oSC_Djgci7Txw5RMjyGpjM0LlCQrLiP6ru8gqjqyBZPjAMBc7qcCSxrIXYExSnE; visit="v=1&M"; lang="v=2&lang=en-us"; SID=b37adfa1-f756-47c6-a5fe-b8b8de8c209a; VID=V_2018_07_14_16_471; _gat=1; _lipt=CwEAAAFknw-IzGH-1zbdTK1C-IkpepFfZyeqS_zp3qlsCMfI823zqoVcOFE7fBrGr3Vhc4Co7BWiUTu35RzUb0KKpgL0ChSmOq7cX9xzbYywdzXmRpo2s5HLvlrwdYWCho4rYD-c7dyzB3nJIWd1ujdgO9EPJ5nDRiEAK2wHLc4wqJQ3AaGcE97DxjNA713akrR89hNTKFjDo7J7qgoIgwIk2rzncR1kKa_JSNqHcC0v_GhlfWojF1CXbflsKfhVto60BTaHWntJ_35_GbtTB-QSi12coCFEOogqchZJhSm5l0FbXekZsaQOqywO2lmhqx9bNLSXfc5bmFQ8uYKPJ-SplSx1shxJklXoMC-8wviDTPGo0E5tNs2xrRe6HlJBaaQFMN772sI; lidc="b=OB64:g=887:u=222:i=1531676953:t=1531761803:s=AQEoysAZUdjGhH3vR1diO5IUhtQbTJD-"' -H 'x-restli-protocol-version: 2.0.0' -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36' -H 'x-li-page-instance: urn:li:page:d_flagship3_profile_view_base_contact_details;TBxF+bOYRA6uCH1PflgAkQ==' -H 'accept: application/vnd.linkedin.normalized+json' -H 'csrf-token: ajax:2998513099200544385' -H 'x-li-track: {"clientVersion":"1.1.8928","osName":"web","timezoneOffset":3,"deviceFormFactor":"DESKTOP","mpName":"voyager-web"}' -H 'authority: www.linkedin.com' -H 'referer: https://www.linkedin.com/in/marina-pronina/' --compressed
        var userId = this.getUserIdFromUrl(window.location.href),
            url = 'https://www.linkedin.com/voyager/api/identity/profiles/' + userId + '/profileContactInfo';
        result = fetch(
            url,
            {
                credentials: 'same-origin',
                headers: {},
                referrer: window.location.href,
                referrerPolicy: 'no-referrer-when-downgrade',
                body: null,
                method: 'GET',
                mode: 'no-cors',
                redirect: 'follow'
            }
        ).then(function(response) {
            console.log(response.status);
            console.log(response.ok);
            console.log(response);
        });
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