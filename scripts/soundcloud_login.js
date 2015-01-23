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
        loadPlugins: true,
    },
    verbose: false,
    logLevel: "debug"
});

var captureEnabled = true;
var captureIfEnabled = function(filename) {
    if(captureEnabled){
        casper.capture(filename);
    }
}

var printEnabled = false; //Set to true for debugging script
var printIfEnabled = function(message) {
    if(printEnabled){
        console.log(message);
    }
}

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
    captureIfEnabled('_isitloggedin.png');
    printIfEnabled("Is .g-tabs-item detected: " + 
        casper.exists('.g-tabs-item'));
    printIfEnabled("Is .userNav__username detected: " +
        casper.exists('.userNav__username'));
    //Skips trying to log in if already logged in
    if(casper.exists('.g-tabs-item')){
        casper.thenBypass(12);
    }
});

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
    captureIfEnabled('0beforesubmit.png')
    this.click('#authorize');
});

casper.wait(3000, function() {
    captureIfEnabled('1mainpage.png');
    printIfEnabled("POPUPS.LENGTH: "+ casper.popups.length);
})
casper.wait(3000, function(){});

casper.then(function(){
    printIfEnabled("Checking if login popup still exists");
    printIfEnabled("popups.length: " + this.popups.length);
});

casper.waitForPopup(/connect\?/, function() {
    casper.withPopup(/connect\?/, function() {
        captureIfEnabled('2popup.png');
        printIfEnabled(this.evaluate(function() {
            return document.title;
        }))
        printIfEnabled(this.evaluate(function() {
            return document.querySelector('#recaptcha_area');
        })) 
        if(casper.exists('#recaptcha_area')){
            captureIfEnabled('error1.png');
            throw new Error("Ran into recaptcha, use a proxy.");
        }
        else{
            printIfEnabled('Somehow got a popup without captcha');
            captureIfEnabled('error2.png');
        } 
    });
}, function() {
    casper.then(function() {
        printIfEnabled("****Logged in successfully!");
        printIfEnabled("Popups length: " + this.popups.length)
        captureIfEnabled('3loggedin.png')
        printIfEnabled("Logged in title: " + this.evaluate(function() {
            return document.title;
        }));
    });

    casper.thenOpen("http://soundcloud.com/notifications").waitForSelector('.ownActivity', function() {
                captureIfEnabled('4final.png')
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
    captureIfEnabled('5startscraping.png');
    //Scrape info
    var output = this.evaluate(function() {
        //Scrape links to comments
        var links = document.querySelectorAll('.ownActivity__bottom .sc-link-light');
        var result = {}
        for(var i = 0; i < links.length; i++){
            var context_url = links[i].href;
            // TODO determine if tip is maxtipbot's own comment

            console.log("context_url: " + context_url);
            
            //Add info to result to output as JSON object
            result[i] = {};
            result[i]['meta'] = {
                'context_url': context_url,
            }
        }
        result = JSON.stringify(result);
        return result;
    });
    casper.echo(output);

});

casper.wait(30000); //Wait 30 seconds before next refresh

casper.run();

//GET all notifications
//  ('.ownActivity')
//returns an array

//GET all mention notifications
//  document.querySelectorAll('.ownActivity.comment')
//returns an array

//GET link to commenter profile
//  document.querySelector('.ownActivity.comment .userAvatarBadge__avatarLink').href
//returns "http://soundcloud.com/maxtipper"

//GET sender username
//  document.querySelector('.ownActivity.comment .userBadge__usernameLink').innerHTML
//or
//  document.querySelector('.ownActivity.comment').children[1].children[0].children[0].children[0].children[1].children[0].children[0].children[0].text
//returns "maxtipper"

//GET link to comment including comment id
//  document.querySelector('.ownActivity.comment .sc-link-light').href
//or 
//  document.querySelector('.ownActivity.comment').children[1].children[1].children[0].children[1].children[0].href
//returns:
//  "https://soundcloud.com/maxtippee/pure-imagination-for-marimba-evan-jose/comment-215516189"

//GET link without 'http://soundcloud.com/'
//  context_url.substr(23)
//returns:
//  "maxtippee/pure-imagination-for-marimba-evan-jose/comment-215516189"

//GET context_uid
//  context_url.substr(context_url.lastIndexOf("/")+9)
//returns "215516189"

//GET receiver
//  context_url.substr(23, context_url.substr(23).indexOf('/'))
//returns "maxtippee"

//GET track_url
//  context_url.substring(0, context_url.lastIndexOf('/')).substring(context_url.substring(0, context_url.lastIndexOf('/')).lastIndexOf('/')+1)
//returns 'pure-imagination-for-marimba-evan-jose'

//Get message + example output
//  document.querySelector('.ownActivity.comment .commentTitle__quotedBody').innerHTML
//or
//  document.querySelector('.ownActivity.comment').children[1].children[1].children[0].children[0].children[1].innerHTML
//returns: 
// "
      
//         @<a href="/maxtippee">maxtippee</a>: 103 bits
      
//     "
