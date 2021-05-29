"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
//for error handling
var last_action_valid_action = 'started_automated_okcupid_bot';
var force_stop_okcupid_bot = false;
//for troubleshooting, if internet or computer is too slow
var PICKUP_BOT_DELAY = 1000;
var last_checked_user_id = 0;
var okc_bot_use_random_message = false;
var is_okcupid_intro = false;
var okcupid_intro_pos = 0;
var number_of_bot_messages_sent = 0;
var okc_bot_can_restart = true;
var number_of_vegans = 0;
var OKCUserObject = /** @class */ (function () {
    function OKCUserObject() {
        this.username = '';
        this.compatibility = 0;
    }
    return OKCUserObject;
}());
function okc_delay(_function, ms) {
    setTimeout(_function, ms + PICKUP_BOT_DELAY);
}
function okc_log() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    console.log(args);
}
function okc_click(selector) {
    if (!document.querySelector(selector)) {
        return false;
    }
    document.querySelector(selector).click();
    return true;
}
function okc_get_innerText(selector) {
    if (!document.querySelector(selector)) {
        return '';
    }
    return document.querySelector(selector).innerText;
}
function okc_getAttribute(selector, attribute) {
    if (!document.querySelector(selector)) {
        return '';
    }
    var attr = document.querySelector(selector).getAttribute(attribute);
    return (attr) ? attr : '';
}
function okc_start_message_engine() {
    okc_delay(function () {
        last_action_valid_action = 'send_message_to_user';
        if (!document.querySelector(".profile-userinfo .profile-basics-username")) {
            go_back_and_restart_okcupid_bot();
            return;
        }
        var the_user_name = okc_get_innerText(".profile-userinfo .profile-basics-username");
        var compatibility = okc_get_innerText(".profile-content-main .profile-questions-userinfo-match");
        compatibility = compatibility.replace('%', '');
        var is_vegetarian = okc_get_innerText(".matchprofile-details-section.matchprofile-details-section--lifestyle").indexOf('Vegeta') > -1;
        var is_vegan = okc_get_innerText(".matchprofile-details-section.matchprofile-details-section--lifestyle").indexOf('Vegan') > -1;
        var is_asexual = okc_get_innerText(".matchprofile-details-section.matchprofile-details-section--basics").indexOf('Asexual') > -1;
        if (is_vegan || is_asexual) {
            //pass user
            // if(document.querySelector("#main_content .pill-button.pass-pill-button")){	
            // 	document.querySelector("#main_content .pill-button.pass-pill-button").click();
            // }
            number_of_vegans++;
            okc_log(number_of_vegans + " Vegan User rejected : user - " + the_user_name + " #" + last_checked_user_id + " at ", (new Date()), 'https://www.okcupid.com/profile/' + last_checked_user_id + '?cf=quickmatch');
            //close message modal
            // setTimeout(function(){
            // 	// go_back_and_restart_okcupid_bot(true)
            // }, 5000 );
            // return;
        }
        //like user
        okc_click("#main_content .pill-button.likes-pill-button");
        okc_click("#main_content .pill-button.message-pill-button");
        var the_message = get_message_for_okcupid_bot({
            username: the_user_name,
            compatibility: +compatibility
        });
        okc_delay(function () {
            //write message
            //https://stackoverflow.com/questions/61107351/simulate-change-event-to-enter-text-into-react-textarea-with-vanilla-js-script
            var textarea = document.querySelector('.prematch-intro-edit textarea.messenger-composer');
            if (textarea) {
                var nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
                if (nativeTextAreaValueSetter != null) {
                    nativeTextAreaValueSetter.call(textarea, the_message);
                }
                //trigger change event
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                textarea.dispatchEvent(new Event('change'));
            }
            //document.querySelector(".prematch-intro-edit button.messenger-toolbar-send").removeAttribute('disabled');
            number_of_bot_messages_sent++;
            okc_log("last Message sent to " + number_of_bot_messages_sent + ". user - " + the_user_name + " #" + last_checked_user_id + " at ", (new Date()), 'https://www.okcupid.com/profile/' + last_checked_user_id + '?cf=quickmatch');
            okc_delay(function () {
                //send message
                okc_click(".prematch-intro-edit button.messenger-toolbar-send");
                //close message modal
                okc_delay(function () {
                    go_back_and_restart_okcupid_bot();
                }, 800);
            }, 1200);
        }, 800);
    }, 2000);
}
function close_okcupid_message_bot() {
    //close all message blocks if there is still one
    if (document.querySelector("button.connection-view-container-close-button")) {
        var x = document.querySelectorAll("button.connection-view-container-close-button");
        for (var i = 0; i < x.length; i++) {
            x[i].click();
        }
    }
}
function okc_is_base() {
    var curr_url = window.location.href;
    if (!curr_url) {
        return false;
    }
    var bases = [
        'okcupid.com/home',
        'okcupid.com/discover',
        'okcupid.com/who-you-like',
        'okcupid.com/who-likes-you',
    ];
    var is_base = false;
    bases.forEach(function (base) {
        if (curr_url.toLowerCase().indexOf(base.toLowerCase()) > -1) {
            is_base = true;
        }
    });
    return is_base;
}
function go_back_and_restart_okcupid_bot(force_go_back) {
    if (force_go_back === void 0) { force_go_back = true; }
    last_action_valid_action = 'go_back_and_restart_okcupid_bot';
    close_okcupid_message_bot();
    //go back
    okc_delay(function () {
        last_action_valid_action = 'go_to_discovery_page';
        if (!okc_is_base()) {
            window.history.back();
        }
        if (is_okcupid_intro) {
            start_automated_okcupid_intro_for_liked_users();
        }
        else {
            start_automated_okcupid_like();
        }
    }, 800);
}
function start_automated_okcupid_like() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            is_okcupid_intro = false;
            if (force_stop_okcupid_bot) {
                okc_log("Bot stopped! force_stop_okcupid_bot is true;");
                okc_log("Last valid action is " + last_action_valid_action + ". please restart bot with start_okcupid_bot(); ");
                return [2 /*return*/];
            }
            last_action_valid_action = 'started_automated_okcupid_automated_like';
            okc_delay(function () {
                close_okcupid_message_bot();
                //go to profile
                // let sel_item = document.querySelector();
                last_action_valid_action = 'visited_profile';
                var okc_user_id_ = okc_getAttribute(".cardsummary .cardsummary-profile-link a", 'href');
                okc_user_id_ = (okc_user_id_.split('?'))[0];
                okc_user_id_ = (okc_user_id_.split('profile/'))[1];
                var okc_user_id = +okc_user_id_;
                //check if we have messaged this user before and skip
                if (last_checked_user_id == okc_user_id) {
                    okc_click(".cardactions .likes-pill-button.doubletake-like-button");
                    setTimeout(function () {
                        start_automated_okcupid_like();
                    }, 1200);
                    return;
                }
                var user_name = okc_get_innerText('.cardsummary .cardsummary-item.cardsummary-realname');
                var is_vegan = okc_get_innerText(".matchprofile-details-section.matchprofile-details-section--lifestyle").indexOf('Vegan') > -1;
                var is_asexual = okc_get_innerText(".matchprofile-details-section.matchprofile-details-section--basics").indexOf('Asexual') > -1;
                if (is_vegan || is_asexual) {
                    number_of_vegans++;
                    okc_log(number_of_vegans + " Vegan User rejected : user -" + user_name + " #" + okc_user_id + " at ", (new Date()), 'https://www.okcupid.com/profile/' + last_checked_user_id + '?cf=quickmatch');
                    okc_click(".cardactions .pass-pill-button.doubletake-pass-button");
                    setTimeout(function () {
                        start_automated_okcupid_like();
                    }, 1200);
                    return;
                }
                okc_click(".cardsummary .cardsummary-profile-link a");
                okc_delay(function () {
                    last_checked_user_id = okc_user_id;
                    last_action_valid_action = 'started_automated_okcupid_message_engine';
                    okc_start_message_engine();
                }, 3000);
            }, 2000);
            return [2 /*return*/];
        });
    });
}
function start_automated_okcupid_intro_for_liked_users() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            is_okcupid_intro = true;
            window.scrollTo(0, document.body.scrollHeight);
            if (force_stop_okcupid_bot) {
                okc_log("Bot stopped! force_stop_okcupid_bot is true;");
                okc_log("Last valid action is " + last_action_valid_action + ". please restart bot with start_okcupid_bot(); ");
                return [2 /*return*/];
            }
            last_action_valid_action = 'started_automated_okcupid_automated_intro';
            okc_delay(function () {
                close_okcupid_message_bot();
                var sel_item = ((document.getElementsByClassName("userrow-bucket-card-link-container"))[okcupid_intro_pos]);
                sel_item = sel_item.querySelector('.usercard-thumb a');
                if (!sel_item && okc_bot_can_restart) {
                    //if no more item, reload and restart bot
                    sessionStorage.setItem("force-restart-okc-bot", "true");
                    location.reload();
                    return;
                }
                //go to profile
                last_action_valid_action = 'visited_profile';
                var okc_user_id_ = sel_item.getAttribute('href');
                okc_user_id_ = (okc_user_id_.split('?'))[0];
                okc_user_id_ = (okc_user_id_.split('profile/'))[1];
                var okc_user_id = +okc_user_id_;
                okcupid_intro_pos++;
                //check if we have messaged this user before and skip
                if (last_checked_user_id == okc_user_id) {
                    okc_delay(function () {
                        start_automated_okcupid_intro_for_liked_users();
                    }, 100);
                    return;
                }
                else {
                    sel_item.click();
                }
                okc_delay(function () {
                    last_checked_user_id = okc_user_id;
                    last_action_valid_action = 'started_automated_okcupid_message_engine';
                    okc_start_message_engine();
                }, 3000);
            }, 2000);
            return [2 /*return*/];
        });
    });
}
function toggle_okcupid_force_stop() {
    force_stop_okcupid_bot = !force_stop_okcupid_bot;
}
function start_okcupid_bot() {
    try {
        switch (last_action_valid_action) {
            case '':
            case 'go_to_discovery_page':
            case 'started_automated_okcupid_bot':
                start_automated_okcupid_like();
                break;
            case 'started_automated_okcupid_message_engine':
                okc_start_message_engine();
                break;
            case 'go_back_and_restart_okcupid_bot':
            case 'send_message_to_user':
                go_back_and_restart_okcupid_bot();
                break;
        }
    }
    catch (error) {
        //try again
        okc_log(error);
        okc_log(" An error occured: Last valid action is " + last_action_valid_action + ". please restart bot with start_okcupid_bot(); ");
    }
}
function get_message_for_okcupid_bot(data) {
    data.username = data.username ? data.username.trim() : 'Unknown User';
    //get an integer value
    data.compatibility = +data.compatibility;
    //randomly pick pickup line from list
    var the_message = get_random_okc_message(data);
    if (okc_bot_use_random_message) {
        switch (true) {
            case (data.username.toLowerCase() == 'alexa'):
                the_message = 'Hey Alexa, how do I take you on a date next weekend? 🙈🙈.';
                break;
            case (data.compatibility > 85):
                the_message = 'Wow ' + data.username + ', 😅😅🙈 how are we ' + data.compatibility + '% compatible and don\'t know each other yet?🙈🙈.';
                break;
        }
    }
    return the_message;
}
function get_random_okc_message(data) {
    if ((PICKUP_BOT_RANDOM_MESSAGES_LIST_INDEX + 1) < PICKUP_BOT_RANDOM_MESSAGES_LIST.length) {
        PICKUP_BOT_RANDOM_MESSAGES_LIST_INDEX++;
    }
    else {
        PICKUP_BOT_RANDOM_MESSAGES_LIST_INDEX = 0;
    }
    return PICKUP_BOT_RANDOM_MESSAGES_LIST[PICKUP_BOT_RANDOM_MESSAGES_LIST_INDEX];
}
window.onload = function () {
    var reloading = sessionStorage.getItem("force-restart-okc-bot");
    if (reloading) {
        okc_bot_can_restart = false;
        sessionStorage.removeItem("force-restart-okc-bot");
        setTimeout(function () {
            start_automated_okcupid_intro_for_liked_users();
        }, 1000);
    }
};
//https://www.narcity.com/en-ca/life/60-pickup-lines-that-actually-work-on-tinder
//https://manofmany.com/lifestyle/sex-dating/best-tinder-pick-up-lines-for-guys
var PICKUP_BOT_RANDOM_MESSAGES_LIST = ['Are you a good cuddler? I might let you join my gang.',
    'Are you a bank loan? Because you have my interest!',
    'You have a beautiful smile🙈🙈.',
    'Is your name Wi-Fi? Because I\'m feeling a connection.',
    // "I woke up thinking today was just another boring Monday, and then I saw your photo on my app.", 
    "I woke up thinking today was just another boring " + ((new Date()).toLocaleString("default", { weekday: "long" })) + ", and then I saw your photo on my app.",
    "Do you mind if I walk you home? My mother always told me to follow my dreams.",
    "What’s a perfect gentleman like myself doing without your phone number?",
    "On a lazy Sunday: Netflix all day, getting lost in a museum, or cuddling with me?",
    "Are you my appendix? Because this feeling in my stomach makes me want to take you out.",
    "Are you made of copper and tellurium? Because you’re CuTe",
    "If we were at home, cuddling on a rainy Sunday morning, what would we have for breakfast? a) Pancakes b) bacon and eggs c) crèpes d) acai bowl e) something else?",
    "Can I have your picture so I can show Santa what I want for Christmas?",
    "Damn, you have a dog! Does that mean I’ll never win the “best ever cuddler” title?",
    "Are you a carbon sample? Because I want to date you — drinks this week?",
    "I’d tell you you’re cute, but someone else probably did that already, so you describe yourself in three emojis instead!",
    "If you could be any comic book character, who would you be?",
    "If you were a triangle you’d be acute one.",
    "Dinner first, or can we go straight for dessert?",
    "I’d say you’re the bomb, but that could turn into lethal conversation…",
    "Are we, like, married now?",
    "On a scale from 1 to 10, you’re a 9 and I’m the 1 you need.",
    "Hey gorgeous, will you be my OkCupidella?",
    "Excuse me, do you have a band-aid? Cause I scraped my knee falling for you.",
    "Are you the square root of 1? Because you seriously can’t be real!",
    "Hello* pretends to be a waiter* – Here’s your icebreaker garnished with awkwardness.",
    "Favourite meal: Thai, Italian or French?",
    //	"We matched! Does that mean you’re coming over to my place tonight, or should we meet and establish we aren’t serial killers or living with our parents first?", 
    "You’re so gorgeous that you made me forget my good pickup line.",
    "What’s your definition of a good weekend?",
    "If you’re as good at cuddling as you’re good looking, I’m signing myself up on the waitlist for a date.",
    "If I could rearrange the alphabet, I’d put U and I together.",
    "Titanic. That’s my icebreaker. What’s up?",
    "If you could be anywhere in the world, doing anything you like right now, where would you be and what would you do?",
    "You’re sweeter than 3.14. Tell me I just won the cheesy pickup line competition?",
    "Send me your favorite GIF so I get to know you better?",
    "A three-day weekend is coming up. Are you a) heading for the mountains b) going to the beach c) sleeping till noon d) partying all night?",
    "Favorite drink?",
    "Are you a bank loan? Because you have my interest.",
    "This is how I’d describe you in three emojis Now you describe yourself in three emojis.",
    "Top three best things to do on a Saturday?",
    "Not much of a bio, you mind if I lightening round you a couple questions",
    "If beauty were time, you’d be eternity",
    "Do you have a personality as attractive as your eyes?So, are you the kind I’d find climbing mountains and acing the diamond slopes, or chilling on the beach with a glass of wine?",
    //"My mom told me not to talk to strangers online, but I’ll make an exception for you.", 
    "You sound busy…any chance of adding me to your to-do list?",
    "So I’ve been trying to come up with a good psychology pickup line for you, but I’m aFreud I couldn’t come up with any.",
    "Truth or dare?",
    "You look like you love a good adventure! What’s one of the best ones you’ve had so far?",
    "So, are you the kind I’d find climbing mountains and acing the diamond slopes, or chilling on the beach with a glass of wine?",
    "Favourite thing to do on a Friday night? a) cuddling and watching Netflix by the fireplace b) the hottest bar in town c) dinner party d) I’ll tell you over drinks?",
    "I would absolutely love to swap bodily fluids with you.",
    "Hey, I’m writing an article on the finer things in life and I was hoping I could interview you.",
    "If you could have any famous artist (dead or alive) paint your portrait, who would it be?",
    "Life without you would be like a broken pencil… pointless",
    "You’re on a beach vacation when it starts raining, what do you do? a) hide under the covers with Netflix b) go to a museum c) attend a cooking workshop to learn how to make the local cuisine",
    "I’m new in town. Could you give me directions to your apartment?",
    "Pick a historical era, and I’ll try to come up with a pick up line related to that era.",
    "Do you have a job? I need a woman who can support me while I play video games all day.",
    "I usually go for 8’s but I guess I’ll settle for a 10.",
    "Damn, you’re a knockout. Was your father a boxer, or did you just get lucky with the gene pool? I bet you a cocktail your personality is even better than your looks too!",
    "Tell me, what can I say to impress you?",
    "Do you have a personality as intriguing as your eyes?",
    "Cheesy chat-up line, gif war or blind date?",
    "Drinks or coffee this week?",
    "They say OkCupid is a numbers game… so can I get your number?",
    "Do you believe in love at first sight, or should we match again?",
    "If you were a dessert, what would you be?",
    "Rose’s are red. You’re cute as a duck. Let’s go on a date. And then we can cuddle.",
    "I don’t normally contact people on this, but I find you very intriguing.",
    "I’d say you’re as beautiful as a Greek goddess, but what I can remember from history class, they were all pretty crazy",
    "If you were a vegetable you’d be a cute-cumber.",
    "Your profile made me stop in my tracks.",
    "Sunday mornings are for: a) cuddles in bed b) champagne breakfast c) as many pancakes as you can eat",
    "Congratulations. You matched with the nerdiest (or any other self-depricating adjective) guy on OkCupid. To celebrate you’re awarded a drink at your bar of choice",
    "Forget hydrogen. You should be the number one element!",
    "Two truths and a lie! Go!",
    "You’re seriously cute, but here’s the dealbreaker: do you, or do you not eat marmite?",
    "Well, here I am. What are your other two wishes?"];
//randomly pick pickup line index from list
var PICKUP_BOT_RANDOM_MESSAGES_LIST_INDEX = Math.floor(Math.random() * PICKUP_BOT_RANDOM_MESSAGES_LIST.length);
