//for error handling
let last_action_valid_action: string = 'started_automated_okcupid_bot';
let force_stop_okcupid_bot: boolean = false;
//for troubleshooting, if internet or computer is too slow
const PICKUP_BOT_DELAY: number = 1000;
let last_checked_user_id: number = 0;
const okc_bot_use_random_message: boolean = false;
let is_okcupid_intro: boolean = false;
let okcupid_intro_pos: number = 0;
let number_of_bot_messages_sent: number = 0;
let okc_bot_can_restart: boolean = true;
let number_of_vegans: number = 0;


function okc_delay(_function: Function, ms: number) {
    setTimeout(_function, ms + PICKUP_BOT_DELAY);
}

function okc_log(...args: any[]) {
    console.log(args);
}

function okc_click(selector: string): boolean {
    if (!document.querySelector(selector)) {
        return false;
    }
    (<HTMLElement>document.querySelector(selector)).click();
    return true;
}

function okc_get_innerText(selector: string): string {
    if (!document.querySelector(selector)) {
        return '';
    }
    return (<HTMLElement>document.querySelector(selector))!.innerText;
}

function okc_getAttribute(selector: string, attribute: string): string {
    if (!document.querySelector(selector)) {
        return '';
    }
    const attr = (<HTMLElement>document.querySelector(selector))!.getAttribute(attribute);
    return (attr) ? attr : '';
}

function okc_start_message_engine() {
    okc_delay(() => {

        last_action_valid_action = 'send_message_to_user';
        if (!document.querySelector(".profile-userinfo .profile-basics-username")) {
            go_back_and_restart_okcupid_bot();
            return;
        }

        const the_user_name: string = okc_get_innerText(".profile-userinfo .profile-basics-username");
        let compatibility: string = okc_get_innerText(".profile-content-main .profile-questions-userinfo-match");
        compatibility = compatibility.replace('%', '');
        const is_vegetarian: boolean = okc_get_innerText(".matchprofile-details-section.matchprofile-details-section--lifestyle").indexOf('Vegeta') > -1;
        const is_vegan: boolean = okc_get_innerText(".matchprofile-details-section.matchprofile-details-section--lifestyle").indexOf('Vegan') > -1;
        const is_asexual: boolean = okc_get_innerText(".matchprofile-details-section.matchprofile-details-section--basics").indexOf('Asexual') > -1;

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

        let the_message = get_message_for_okcupid_bot({
            username: the_user_name,
            compatibility: +compatibility
        });

        okc_delay(() => {

            //write message
            //https://stackoverflow.com/questions/61107351/simulate-change-event-to-enter-text-into-react-textarea-with-vanilla-js-script
            const textarea = document.querySelector('.prematch-intro-edit textarea.messenger-composer');

            if (textarea) {
                let nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")!.set!;
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

            okc_delay(() => {
                //send message
                okc_click(".prematch-intro-edit button.messenger-toolbar-send");

                //close message modal
                okc_delay(() => {
                    go_back_and_restart_okcupid_bot();
                }, 800);
            }, 1200);
        }, 800);
    }, 2000);
}

function close_okcupid_message_bot() {
    //close all message blocks if there is still one
    if (document.querySelector(".prematch-intro-confirmation button.connection-view-container-close-button")) {
        let x = document.querySelectorAll(".prematch-intro-confirmation button.connection-view-container-close-button");
        for (let i = 0; i < x.length; i++) {
            (<HTMLElement>x[i]).click();
        }
    }
}

function go_back_and_restart_okcupid_bot(force_go_back = true) {
    last_action_valid_action = 'go_back_and_restart_okcupid_bot';

    close_okcupid_message_bot();
    //go back
    okc_delay(() => {
        last_action_valid_action = 'go_to_discovery_page';
        window.history.back();
        if (is_okcupid_intro) {
            start_automated_okcupid_intro_for_liked_users();
        } else {
            start_automated_okcupid_like();
        }
    }, 800);
}

async function start_automated_okcupid_like() {
    is_okcupid_intro = false;
    close_okcupid_message_bot();

    if (force_stop_okcupid_bot) {
        okc_log("Bot stopped! force_stop_okcupid_bot is true;");
        okc_log("Last valid action is " + last_action_valid_action + ". please restart bot with start_okcupid_bot(); ");
        return;
    }
    last_action_valid_action = 'started_automated_okcupid_automated_like';
    okc_delay(() => {
        //go to profile
        // let sel_item = document.querySelector();
        last_action_valid_action = 'visited_profile';
        let okc_user_id_ = okc_getAttribute(".cardsummary .cardsummary-profile-link a", 'href');
        okc_user_id_ = (okc_user_id_.split('?'))[0];
        okc_user_id_ = (okc_user_id_.split('profile/'))[1];
        const okc_user_id: number = +okc_user_id_;

        //check if we have messaged this user before and skip
        if (last_checked_user_id == okc_user_id) {
            okc_click(".cardactions .likes-pill-button.doubletake-like-button");
            setTimeout(function () {
                start_automated_okcupid_like();
            }, 1200);
            return;
        }

        const is_vegan: boolean = okc_get_innerText(".matchprofile-details-section.matchprofile-details-section--lifestyle").indexOf('Vegan') > -1;
        if(is_vegan){
            okc_click(".cardactions .pass-pill-button.doubletake-pass-button");
            setTimeout(function () {
                start_automated_okcupid_like();
            }, 1200);
            return;        	
        }        

        okc_click(".cardsummary .cardsummary-profile-link a");

        okc_delay(() => {
            last_checked_user_id = okc_user_id;
            last_action_valid_action = 'started_automated_okcupid_message_engine';
            okc_start_message_engine();
        }, 3000);
    }, 2000);
}

async function start_automated_okcupid_intro_for_liked_users() {
    is_okcupid_intro = true;

    close_okcupid_message_bot();
    window.scrollTo(0, document.body.scrollHeight);

    if (force_stop_okcupid_bot) {
        okc_log("Bot stopped! force_stop_okcupid_bot is true;");
        okc_log("Last valid action is " + last_action_valid_action + ". please restart bot with start_okcupid_bot(); ");
        return;
    }
    last_action_valid_action = 'started_automated_okcupid_automated_intro';
    okc_delay(() => {
        let sel_item = <HTMLElement>((document.getElementsByClassName("userrow-bucket-card-link-container"))[okcupid_intro_pos]);
        sel_item = <HTMLElement>sel_item.querySelector('.usercard-thumb a');
        if (!sel_item && okc_bot_can_restart) {
            //if no more item, reload and restart bot
            sessionStorage.setItem("force-restart-okc-bot", "true");
            location.reload();
            return;
        }
        //go to profile
        last_action_valid_action = 'visited_profile';
        let okc_user_id_ = sel_item.getAttribute('href')!;
        okc_user_id_ = (okc_user_id_.split('?'))[0];
        okc_user_id_ = (okc_user_id_.split('profile/'))[1];
        const okc_user_id: number = +okc_user_id_;

        okcupid_intro_pos++;
        //check if we have messaged this user before and skip
        if (last_checked_user_id == okc_user_id) {
            okc_delay(() => {
                start_automated_okcupid_intro_for_liked_users();
            }, 100);
            return;
        } else {
            sel_item.click();
        }

        okc_delay(() => {
            last_checked_user_id = okc_user_id;
            last_action_valid_action = 'started_automated_okcupid_message_engine';
            okc_start_message_engine();
        }, 3000);
    }, 2000);
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
    } catch (error) {
        //try again
        okc_log(error);
        okc_log(" An error occured: Last valid action is " + last_action_valid_action + ". please restart bot with start_okcupid_bot(); ");
    }
}


function get_message_for_okcupid_bot(data = {
    username: '',
    compatibility: 0
}) {
    data.username = data.username ? data.username.trim() : 'Unknown User';
    //get an integer value
    data.compatibility = +data.compatibility;

    //randomly pick pickup line from list
    if ((PICKUP_BOT_RANDOM_MESSAGES_LIST_INDEX + 1) < PICKUP_BOT_RANDOM_MESSAGES_LIST.length) {
        PICKUP_BOT_RANDOM_MESSAGES_LIST_INDEX++;
    } else {
        PICKUP_BOT_RANDOM_MESSAGES_LIST_INDEX = 0;
    }

    let random_message = PICKUP_BOT_RANDOM_MESSAGES_LIST[PICKUP_BOT_RANDOM_MESSAGES_LIST_INDEX];

    let the_message = 'Hi ' + data.username + '. deine Bilder sind mir positiv aufgefallen, deine Naturschönheit kommt extrem zur Geltung und dein Lächeln sieht voll süß aus😊😊. Ich würde mich freuen, wenn man sich kennenlernen könnte.';
    the_message = 'Hi ' + data.username + '. alles gut? Kann man sich kennenlernen?';

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


window.onload = function () {
    const reloading = sessionStorage.getItem("force-restart-okc-bot");
    if (reloading) {
        okc_bot_can_restart = false;
        sessionStorage.removeItem("force-restart-okc-bot");
        setTimeout(() => {
            start_automated_okcupid_intro_for_liked_users();
        }, 1000);
    }
}

//https://www.narcity.com/en-ca/life/60-pickup-lines-that-actually-work-on-tinder
//https://manofmany.com/lifestyle/sex-dating/best-tinder-pick-up-lines-for-guys
let PICKUP_BOT_RANDOM_MESSAGES_LIST = ['Are you a good cuddler? I might let you join my gang.',
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
let PICKUP_BOT_RANDOM_MESSAGES_LIST_INDEX = Math.floor(Math.random() * PICKUP_BOT_RANDOM_MESSAGES_LIST.length);