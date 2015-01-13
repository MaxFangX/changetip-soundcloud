var system = require('system');
var user = system.env['CHANGETIP_BOT_USER'];
var pass = system.env['CHANGETIP_BOT_PASS'];
if(user == undefined){
    throw new Error("Need to set 'CHANGETIP_BOT_USER' environment variable")
};
if(pass == undefined){
    throw new Error("Need to set CHANGETIP_BOT_PASS' environment variable");
};

//True to output as Python readable string.
//False to output as JSON Object
var outputAsString = false;

var printEnabled = false;
var printIfEnabled = function(whateverstringidgaf) {
    if(printEnabled){
        console.log(whateverstringidgaf)
    }
}

var casper = require('casper').create({
    pageSettings: {
        loadImages: true,
        loadPlugins: true,
    },
    verbose: false,
    logLevel: "debug"
});

casper.on('remote.message', function(msg) {
    printIfEnabled('REMOTE: ' + msg);
});

casper.on('page.error', function(msg, trace) {
    printIfEnabled('Error: ' + msg, 'ERROR');
});

casper.start('http://soundcloud.com', function(){
    // TODO investigate why getting to soundcloud.com sometimes
    // takes so long
    printIfEnabled("**Got to SoundCloud homepage.");
    printIfEnabled("Title: "+ this.getTitle());
    printIfEnabled("Next - clicking login button");
    this.capture('isitloggedin.png');
    printIfEnabled("Is .g-tabs-item detected: " + 
        casper.exists('.g-tabs-item'));
    printIfEnabled("Is .userNav__username detected: " +
        casper.exists('.userNav__username'));
    //Skips trying to log in if already logged in
    if(casper.exists('.g-tabs-item')){
        casper.thenBypass(12);
    }
});

//div.header__userNav

casper.waitForSelector('.header__login', function() {
    printIfEnabled("**Clicked login button.");
    this.click('.header__login');
    printIfEnabled("Next - loading popup");
}, function(){
    throw new Error("Could not find login button");
}, 30000);

//STEP 6
casper.waitForPopup(/connect/, function() {
    printIfEnabled('**Loaded login popup.');
    printIfEnabled("casper.popups length: " + casper.popups.length);
    printIfEnabled("casper.popups[0]: " + casper.popups[0]);
    printIfEnabled("Next - filling out form");
}, function() {
    printIfEnabled("Waiting for popup timed out at 30 seconds.");
    printIfEnabled("Popups.length: " + this.popups.length);
    throw new Error("Login popup didn't load");
}, 30000);

casper.withPopup(/connect\?/, function() {
    printIfEnabled("**Filling out and submitting login form");
    printIfEnabled("Does oauth2 form exist?")
    if(this.exists('#oauth2-login-form')){
        printIfEnabled("oauth2 form exists");
    };
    this.fillSelectors('#oauth2-login-form', {
        'input[id="username"]': user,
        'input[id="password"]': pass,
    }, false);
    printIfEnabled("Printing username form value: ");
    printIfEnabled(this.evaluate(function() {
        return document.querySelector('#username').value;
    }));
    printIfEnabled("Next - clicking login button on popup");
});

casper.wait(3000, function() {});

casper.withPopup(/connect\?/, function() {
    printIfEnabled("Does login button exist?");
    if(this.exists('#authorize')){
        printIfEnabled("Login button exists");
    };
    //this.capture('000beforesubmit.png')
    this.click('#authorize');
});

casper.wait(3000, function() {
    //this.capture('111mainpage.png');
    printIfEnabled("POPUPS.LENGTH: "+ casper.popups.length);
})
casper.wait(3000, function(){});

casper.then(function(){
    printIfEnabled("Checking if login popup still exists");
    printIfEnabled("popups.length: " + this.popups.length);
});

casper.waitForPopup(/connect\?/, function() {
    casper.withPopup(/connect\?/, function() {
        //this.capture('222popup.png');
        printIfEnabled(this.evaluate(function() {
            return document.title;
        }))
        printIfEnabled(this.evaluate(function() {
            return document.querySelector('#recaptcha_area');
        })) 
        if(casper.exists('#recaptcha_area')){
            this.capture('error1.png');
            throw new Error("Ran into recaptcha, use a proxy.");
        }
        else{
            printIfEnabled('Somehow got a popup without captcha');
            this.capture('error2.png');
        } 
    });
}, function() {
    casper.then(function() {
        printIfEnabled("****Logged in successfully!");
        printIfEnabled("Popups length: " + this.popups.length)
        this.capture('333loggedin.png')
        printIfEnabled("Logged in title: " + this.evaluate(function() {
            return document.title;
        }));
    });

    casper.thenOpen("http://soundcloud.com/notifications").waitForSelector('.ownActivity', function() {
                this.capture('444final.png')
                printIfEnabled("Notification title: " + this.getTitle());
            }
    );
}, 5000); //5 Seconds for popup to still be there

//SCRAPING PAGE
//TODO implement scraping page
casper.reload(function() {
    printIfEnabled("Reloaded notifications page");
});

casper.waitForSelector('.ownActivity', function() {
    printIfEnabled("Notifications page loaded, start SCRAPING");
    //Screenshot with unique timestamp for every time the page refreshes
    this.capture(Math.round(new Date().getTime()/100)%100000+".png");

    //Scrape info
    var output = this.evaluate(function(outputAsString) {
        var data = document.querySelectorAll('.ownActivity.comment');

        var result = {}
        if(outputAsString){
            result = '{'
        }
        for(var i = 0; i < data.length; i++){
            //Get info
            //TODO Clean up this disaster
            var comment = data[i];
            var context_uid = comment.children[1].children[1].children[0].children[1].children[0].href.substr(23)
            console.log("context_uid: " + context_uid);
            var sender = comment.children[1].children[0].children[0].children[0].children[1].children[0].children[0].children[0].text
            console.log("sender: " + sender);
            var receiver = comment.children[1].children[1].children[0].children[1].children[0].href.substr(23, comment.children[1].children[1].children[0].children[1].children[0].href.substr(23).indexOf('/'));
            console.log("receiver: " + receiver)
            var message = comment.children[1].children[1].children[0].children[0].children[1].innerHTML;
            console.log("message: " + message);

            if(outputAsString){ //Output as strings
                result += i + ": {";
                result += "'context_id': " + "'" + context_uid + "', ";
                result += "'sender': " + "'" + sender + "', ";
                result += "'receiver': " + "'" + sender + "', ";
                result += "'message': " + "\"" + message + "\"}, ";
            }else{ //Add info to result to output as JSON object
                result[i] = {};
                result[i]['context_uid'] = context_uid;
                result[i]['sender'] = sender;
                result[i]['receiver'] = receiver;
                result[i]['message'] = message;
                result[i]['meta'] = {} //TODO add time stamp
            }
            
        }
        if(outputAsString){
            result += "}"
        }else{
            result = JSON.stringify(result);
        }

        return result;
    }, outputAsString);
    //casper.echo("Output: ");
    casper.echo(output);

});

casper.wait(30000); //Wait 30 seconds before next refresh

casper.run();

//Get all notifications
//('.ownActivity')
//An array

//Get all mention notifications
//document.querySelectorAll('.ownActivity.comment')
//An array

//Get link to commenter profile
//document.querySelector('.ownActivity.comment .userAvatarBadge__avatarLink').href
//"http://soundcloud.com/maxtipper"

//Get sender username
//document.querySelector('.ownActivity.comment .userBadge__usernameLink').innerHTML
//document.querySelector('.ownActivity.comment').children[1].children[0].children[0].children[0].children[1].children[0].children[0].children[0].text
//"maxtipper"

//Get link to comment including comment id + example output
//Get receiver username
//Can maybe use this as unique identifier
// document.querySelector('.ownActivity.comment .sc-link-light').href
// document.querySelector('.ownActivity.comment').children[1].children[1].children[0].children[1].children[0].href
// "https://soundcloud.com/maxtippee/pure-imagination-for-marimba-evan-jose/comment-215516189"
//User <link>.substr(23) to get "maxtippee/pure-imagination-for-marimba-evan-jose/comment-215516189"
//Use <link>.substr(23, <link>.substr(23).indexOf('/')) to get "maxtippee"

//Get message + example output
// document.querySelector('.ownActivity.comment .commentTitle__quotedBody').innerHTML
//document.querySelector('.ownActivity.comment').children[1].children[1].children[0].children[0].children[1].innerHTML
// "
      
//         @<a href="/maxtippee">maxtippee</a>: 103 bits
      
//     "
