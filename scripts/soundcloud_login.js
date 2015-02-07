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
        userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.71 Safari/537.36",
    },
    verbose: true,
    logLevel: "debug"
});

var captureEnabled = true;
var captureIf = function(filename) {
    if(captureEnabled){
        casper.capture(filename);
    }
}

var printEnabled = true; //Set to true for debugging script
var printIf = function(message) {
    if(printEnabled){
        console.log(message);
    }
}

casper.on('remote.message', function(msg) {
    printIf('REMOTE: ' + msg);
});

casper.on('page.error', function(msg, trace) {
    printIf('Error: ' + msg, 'ERROR');
});

casper.start('http://soundcloud.com', function(){
    // TODO investigate why getting to soundcloud.com sometimes
    // takes so long
    printIf("**Got to SoundCloud homepage.");
    printIf("Title: "+ this.getTitle());
    printIf("Next - clicking login button");
    captureIf('_isitloggedin.png');
    printIf("Is .g-tabs-item detected: " + 
        casper.exists('.g-tabs-item'));
    printIf("Is .userNav__username detected: " +
        casper.exists('.userNav__username'));
    //Skips trying to log in if already logged in
    if(casper.exists('.g-tabs-item')){
        casper.thenBypass(10);
    }
});

casper.waitForSelector('.header__login', function() {
    printIf("**Clicked login button.");
    this.click('.header__login');
    printIf("Next - loading popup");
}, function(){
    casper.echo("error");
    throw new Error("Could not find login button");
}, 30000);

//STEP 6
casper.waitForPopup(/connect/, function() {
    printIf('**Loaded login popup.');
    printIf("casper.popups length: " + casper.popups.length);
    printIf("casper.popups[0]: " + casper.popups[0]);
    printIf("Next - filling out form");
}, function() {
    printIf("Waiting for popup timed out at 30 seconds.");
    printIf("Popups.length: " + this.popups.length);
    casper.echo("error");
    throw new Error("Login popup didn't load");
}, 30001);

casper.withPopup(/connect\?/, function() {
    printIf("**Filling out and submitting login form");
    printIf("Does oauth2 form exist?")
    if(this.exists('#oauth2-login-form')){
        printIf("oauth2 form exists");
    };
    this.fillSelectors('#oauth2-login-form', {
        'input[id="username"]': user,
        'input[id="password"]': pass,
    }, false);
    printIf("Printing username form value: ");
    printIf(this.evaluate(function() {
        return document.querySelector('#username').value;
    }));
    printIf("Next - clicking login button on popup");
});

casper.wait(3003, function() {});

casper.withPopup(/connect\?/, function() {
    printIf("Does login button exist?");
    if(this.exists('#authorize')){
        printIf("Login button exists");
    };
    captureIf('0beforesubmit.png')
    this.click('#authorize');
});

casper.wait(3002, function() {
    captureIf('1mainpage.png');
    printIf("POPUPS.LENGTH: "+ casper.popups.length);
})
casper.wait(3001, function(){
    printIf("Checking if login popup still exists");
    printIf("popups.length: " + this.popups.length);
});

casper.waitForPopup(/connect\?/, function() {
    casper.withPopup(/connect\?/, function() {
        captureIf('2popup.png');
        printIf(this.evaluate(function() {
            return document.title;
        }))
        printIf(this.evaluate(function() {
            return document.querySelector('#recaptcha_area');
        })) 
        if(casper.exists('#recaptcha_area')){
            captureIf('error1.png');
            casper.echo("error");
            throw new Error("Ran into recaptcha, use a proxy.");
        }
        else{
            printIf('Somehow got a popup without captcha');
            captureIf('error2.png');
            casper.echo("error");
            throw new Error("Somehow got a popup without captcha");
        } 
    });
}, function() {
    casper.then(function() {
        printIf("****Logged in successfully!");
        printIf("Popups length: " + this.popups.length)
        captureIf('3loggedin.png')
        printIf("Logged in title: " + this.evaluate(function() {
            return document.title;
        }));
    });

    casper.thenOpen("http://soundcloud.com/notifications").waitForSelector('.ownActivity', function() {
                captureIf('4final.png')
                printIf("Notification title: " + this.getTitle());
            }, function() {
                captureIfEnable('notificationspage.png');
                printIf("Line ~154 can't find .ownActivity");
            }
    );
}, 5001); //5 Seconds for popup to still be there

//SCRAPING PAGE

casper.waitForSelector('.ownActivity', function() {
    printIf("Notifications page loaded, start SCRAPING");
    //Screenshot with unique timestamp for every time the page refreshes
    captureIf('5startscraping.png');
    //Scrape info
    var output = this.evaluate(function() {
        //Scrape links to comments
        var links = document.querySelectorAll('.ownActivity.comment .sc-link-light');
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

}, function() {
    printIf("Failed to find .ownActivity.");
    captureIf("findOwnActivity.png");
}, 5002);

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
