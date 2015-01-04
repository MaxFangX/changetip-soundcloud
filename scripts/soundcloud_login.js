var system = require('system');
var user = system.env['CHANGETIP_BOT_USER'];
var pass = system.env['CHANGETIP_BOT_PASS'];
if(user == undefined){
    throw new Error("Need to set 'CHANGETIP_BOT_USER' environment variable")
};
if(pass == undefined){
    throw new Error("Need to set CHANGETIP_BOT_PASS' environment variable");
};

var casper = require('casper').create({
    pageSettings: {
        loadImages: true,
        loadPlugins: false,
    },
    verbose: true,
    logLevel: "debug"
});

casper.start('http://soundcloud.com', function(){
    console.log("**Got to SoundCloud homepage.");
    console.log("Title: "+ this.getTitle());
    console.log("Next - clicking login button");
    this.capture('isitloggedin.png');
    console.log("Is .g-tabs-item detected: " + 
        casper.exists('.g-tabs-item'));
    //Skips trying to log in if already logged in
    if(casper.exists('.g-tabs-item')){
        casper.thenBypass(12);
    }
});

//div.header__userNav

casper.waitForSelector('.header__login', function() {
    console.log("**Clicked login button.");
    this.click('.header__login');
    console.log("Next - loading popup");
}, function(){
    throw new Error("Could not find login button");
}, 30000);

//STEP 6
casper.waitForPopup(/connect/, function() {
    console.log('**Loaded login popup.');
    console.log("casper.popups length: " + casper.popups.length);
    console.log("casper.popups[0]: " + casper.popups[0]);
    console.log("Next - filling out form");
}, function() {
    console.log("Waiting for popup timed out at 30 seconds.");
    console.log("Popups.length: " + this.popups.length);
    throw new Error("Login popup didn't load");
}, 30000);

casper.withPopup(/connect\?/, function() {
    console.log("**Filling out and submitting login form");
    console.log("Does oauth2 form exist?")
    if(this.exists('#oauth2-login-form')){
        console.log("oauth2 form exists");
    };
    this.fillSelectors('#oauth2-login-form', {
        'input[id="username"]': user,
        'input[id="password"]': pass,
    }, false);
    console.log("Printing username form value: ");
    console.log(this.evaluate(function() {
        return document.querySelector('#username').value;
    }));
    console.log("Next - clicking login button on popup");
});

casper.wait(3000, function() {});

casper.withPopup(/connect\?/, function() {
    console.log("Does login button exist?");
    if(this.exists('#authorize')){
        console.log("Login button exists");
    };
    //this.capture('000beforesubmit.png')
    this.click('#authorize');
});

casper.wait(3000, function() {
    //this.capture('111mainpage.png');
    console.log("POPUPS.LENGTH: "+ casper.popups.length);
})
casper.wait(3000, function(){});

casper.then(function(){
    console.log("Checking if login popup still exists");
    console.log("popups.length: " + this.popups.length);
});

casper.waitForPopup(/connect\?/, function() {
    casper.withPopup(/connect\?/, function() {
        //this.capture('222popup.png');
        console.log(this.evaluate(function() {
            return document.title;
        }))
        console.log(this.evaluate(function() {
            return document.querySelector('#recaptcha_area');
        })) 
        if(casper.exists('#recaptcha_area')){
            this.capture('error1.png');
            throw new Error("Ran into recaptcha, use a proxy.");
        }
        else{
            console.log('Somehow got a popup without captcha');
            this.capture('error2.png');
        } 
    });
}, function() {
    casper.then(function() {
        console.log("****Logged in successfully!");
        console.log("Popups length: " + this.popups.length)
        this.capture('333loggedin.png')
        console.log("Logged in title: " + this.evaluate(function() {
            return document.title;
        }));
    });

    casper.thenOpen("http://soundcloud.com/notifications").then(
        function() {
            this.capture('444final.png')
            console.log("Notification title: " + this.getTitle());
        }
    );
}, 5000); //5 Seconds for popup to still be there

var scrape = function() {

}

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

//Get username
//document.querySelector('.ownActivity.comment .userBadge__usernameLink').innerHTML
//"maxtipper"

//Get text + example output
// document.querySelector('.ownActivity.comment .commentTitle__quotedBody').innerHTML
// "
      
//         @<a href="/maxtippee">maxtippee</a>: 103 bits
      
//     "

//Get link to comment including comment id + example output
//Can maybe use this as unique identifier
// document.querySelector('.ownActivity.comment .sc-link-light').href
// "https://soundcloud.com/maxtippee/pure-imagination-for-marimba-evan-jose/comment-215516189"
