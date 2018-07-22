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
            contacts: [],
            skills: []
        }
    },
    contactMap: {
        'emailAddress': {
            getValue: function(email) {
                var result = inTrello.trait.img(
                    'E-mail',
                    'https://cdn.wow-apps.pro/intrello/card_icon_mail.png'
                ) + inTrello.trait.strong(' E-mail') + ' : ';
                result += email;
                
                return inTrello.trait.blockquote(result);
            }
        },
        'com.linkedin.common.Date': {
            getValue: function(elementObject) {
                var title = chrome.i18n.getMessage('appContactsDateOfBirth');
                var icon = inTrello.trait.img(title, 'https://cdn.wow-apps.pro/intrello/card_icon_birth.png');
                var result = icon + ' ';
                result += inTrello.trait.strong(title);
                result += ': ' + inTrello.trait.getFormattedDate(elementObject.day, elementObject.month);
                if (inTrello.data.inProfile.name != undefined) {
                    result += inTrello.trait.br();
                    result += inTrello.trait.a(
                        chrome.i18n.getMessage('appContactsDateOfBirthAddCalendarLink'),
                        inTrello.trait.createGoogleCalendarEventLink(
                            chrome.i18n.getMessage('appContactsDateOfBirthCalendarTitle')
                                + ' ' + inTrello.data.inProfile.name
                                + ' (' + inTrello.data.inProfile.topic + ')',
                            inTrello.trait.getGoogleDateRange(elementObject.day, elementObject.month),
                            window.location.href
                        )
                    );
                }

                return inTrello.trait.blockquote(result);
            }
        },
        'com.linkedin.voyager.identity.profile.IM': {
            getValue: function(elementObject) {
                var result = '';
                switch(elementObject.provider) {
                    case 'SKYPE':
                        result = inTrello.trait.img('Skype', 'https://cdn.wow-apps.pro/intrello/card_icon_skype.png');
                        result += inTrello.trait.strong(' Skype') + ': ';
                        result += elementObject.id;
                        result += inTrello.trait.br();
                        result += inTrello.trait.a(chrome.i18n.getMessage('appContactsSkypeChatButton'), 'skype:' + elementObject.id + '?chat');
                        result += '   |   ';
                        result += inTrello.trait.a(chrome.i18n.getMessage('appContactsSkypeCallButton'), 'skype:' + elementObject.id + '?call');
                        break;
                    case 'GTALK':
                        result = inTrello.trait.img('Hangout', 'https://cdn.wow-apps.pro/intrello/card_icon_hangout.png');
                        result += inTrello.trait.strong(' Google+ Hangout') + ': ';
                        result += elementObject.id;
                        result += inTrello.trait.br();
                        result += inTrello.trait.a(chrome.i18n.getMessage('appContactsHangoutChatButton'), 'gtalk:chat?jid=' + elementObject.id);
                        break;
                    case 'ICQ':
                        result = inTrello.trait.img('ICQ', 'https://cdn.wow-apps.pro/intrello/card_icon_icq.png');
                        result += inTrello.trait.strong(' ICQ') + ': ';
                        result += elementObject.id;
                        result += inTrello.trait.br();
                        result += inTrello.trait.a(chrome.i18n.getMessage('appContactsICQChatButton'), 'http://www.icq.com/whitepages/cmd.php?action=message&uin=' + elementObject.id);
                        break;
                }

                return inTrello.trait.blockquote(result);
            }
        },
        'com.linkedin.voyager.identity.profile.PhoneNumber': {
            getValue: function(elementObject) {
                var result = inTrello.trait.img(
                    'Phone number',
                    'https://cdn.wow-apps.pro/intrello/card_icon_phone.png'
                ) + ' ' + inTrello.trait.strong(chrome.i18n.getMessage('appContactsPhoneTitle')) + ': ';
                result += elementObject.number;
                result += inTrello.trait.br();
                result += inTrello.trait.a(chrome.i18n.getMessage('appContactsPhoneCall'), 'tel:' + elementObject.number);
                
                return inTrello.trait.blockquote(result);
            }
        },
        'com.linkedin.voyager.identity.profile.ProfileWebsite': {
            getValue: function(elementObject) {
                var result = inTrello.trait.img(
                    'Web site',
                    'https://cdn.wow-apps.pro/intrello/card_icon_site.png'
                ) + ' ' + inTrello.trait.strong(chrome.i18n.getMessage('appContactsSiteTitle')) + ': ';
                result += elementObject.url;
                
                return inTrello.trait.blockquote(result);
            }
        },
        'com.linkedin.voyager.identity.profile.TwitterHandle': {
            getValue: function(elementObject) {
                var result = inTrello.trait.img(
                    'Twitter',
                    'https://cdn.wow-apps.pro/intrello/card_icon_twitter.png'
                ) + inTrello.trait.strong(' Twitter') + ': ';
                result += elementObject.name;
                result += inTrello.trait.br();
                result += inTrello.trait.a(chrome.i18n.getMessage('appContactsTwitterButton'), 'https://twitter.com/' + elementObject.name);
                
                return inTrello.trait.blockquote(result);
            }
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
        },
        getFormattedDate: function(day, month) {
            return new Intl.DateTimeFormat(
                (navigator.language || navigator.userLanguage),
                {day: 'numeric', month: 'long'}
            ).format(new Date('2018-' + month + '-' + day));
        },
        getGoogleDateRange: function(day, month) {
            var today = new Date(),
                dateString = today.getFullYear() + '-' + month + '-' + day + ' 11:00:00',
                eventDate = new Date(dateString);

            if (eventDate <= today) {
                dateString = (parseInt(today.getFullYear()) + 1) + '-' + month + '-' + day + ' 11:00:00';
                eventDate = new Date(dateString);
            }

            var googleDate = eventDate.toISOString();
            
            return googleDate.replace(/-/g, '').replace(/.000Z/g, 'Z').replace(/:/g, '') + '/' + googleDate.replace(/-/g, '').replace(/.000Z/g, 'Z').replace(/:/g, '');
        },
        createGoogleCalendarEventLink: function(text, dates, details, location) {
            var linkParams = {
                text: text === undefined ? '' : text,
                dates: dates === undefined ? '' : dates,
                details: details === undefined ? '' : details,
                location: location === undefined ? '' : location,
                action: 'TEMPLATE',
                sf: true,
                output: 'xml'
            };

            var linkParamsString = '';
            var counter = 0;

            $.each(linkParams, function(key, value) {
                if (value != '') {
                    counter++;
                    if (counter !== 1) {
                        linkParamsString += '&';
                    }
                    
                    linkParamsString += key + '=' + encodeURIComponent(value);
                }
            });

            return 'https://calendar.google.com/calendar/r/eventedit?' + linkParamsString;
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
        $("html, body").animate({ scrollTop: $(document).height() }, 3000).promise().then(function() {
            if ($('button[data-control-name="skill_details"]').length > 0) {
                $('button[data-control-name="skill_details"]').click();
            }
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

        $('div.pv-skill-category-list > ol.pv-skill-category-list__skills_list > li', 'div#skill-categories-expanded').each(function() {
            var skill = $('div > p > a > span', this).text().trim();
            if (skill.length > 0) {
                inTrello.data.inProfile.skills.push(skill);
            }
        });

        this.requestContactData();
    },
    getUserIdFromUrl: function(url) {
        var matches = url.match(new RegExp("\/in\/(.*)\/"));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    },
    requestContactData: function() {
        cookie.getAll();
        var userId = this.getUserIdFromUrl(window.location.href);
        var url = 'https://www.linkedin.com/voyager/api/identity/profiles/' + userId + '/profileContactInfo';


        var xhttp = new XMLHttpRequest();
        
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var json = JSON.parse(xhttp.responseText);
                inTrello.getContacts(json);
                inTrello.setupTrelloApiRequest();
            }
        };

        requestHeaders = {
            'accept': 'application/vnd.linkedin.normalized+json; charset=UTF-8',
            'accept-language': (navigator.language || navigator.userLanguage),
            'cache': 'no-cache',
            'pragma': 'no-cache',
            'x-requested-with': 'XMLHttpRequest',
            'x-restli-protocol-version': '2.0.0',
            'referrer': window.location.href,
            'referrerPolicy': 'no-referrer-when-downgrade',
            'csrf-token': cookie.get('JSESSIONID')
        };

        xhttp.open('GET', url, true);
        
        $.each(requestHeaders, function(key, value) {
            xhttp.setRequestHeader(key, value);
        });

        xhttp.send();
    },
    getContacts: function(jsonResponse) {
        if (jsonResponse.data.emailAddress != undefined) {
            inTrello.data.inProfile.contacts.push(inTrello.contactMap['emailAddress'].getValue(jsonResponse.data.emailAddress));
        }

        $.each(jsonResponse.included, function(key, value){
            if (inTrello.contactMap[value.$type] !== undefined) {
                inTrello.data.inProfile.contacts.push(inTrello.contactMap[value.$type].getValue(value));
            }
        });
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
        this.data.trelloApiRequest.appendDesc(this.trait.br());

        if (this.data.inProfile.contacts.length > 0) {
            $.each(this.data.inProfile.contacts, function(key, item) {
                inTrello.data.trelloApiRequest
                    .appendDesc(item)
                    .appendDesc(inTrello.trait.br())
                    .appendDesc(inTrello.trait.br());
            });
            this.data.trelloApiRequest
                .appendDesc(inTrello.trait.br())
                .appendDesc(inTrello.trait.hr())
                .appendDesc(inTrello.trait.br())
                .appendDesc(inTrello.trait.br());
        }

        if (this.data.inProfile.skills.length > 0) {
            var skills = this.data.inProfile.skills.join(', ');
            this.data.trelloApiRequest.appendDesc(this.trait.h2(chrome.i18n.getMessage('appSkillsTitle') + ':'));
            this.data.trelloApiRequest.appendDesc(inTrello.trait.br())
                .appendDesc(inTrello.trait.br())
                .appendDesc(inTrello.trait.blockquote(skills))
                .appendDesc(inTrello.trait.br())
                .appendDesc(inTrello.trait.br())
                .appendDesc(inTrello.trait.hr())
                .appendDesc(inTrello.trait.br());
        }

        if (this.data.inProfile.experience.length > 0) {
            this.data.trelloApiRequest
                .appendDesc(inTrello.trait.h2(chrome.i18n.getMessage('appExperienceHeader') + ':'))
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
                .appendDesc(inTrello.trait.h2(chrome.i18n.getMessage('appEducationHeader') + ':'))
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