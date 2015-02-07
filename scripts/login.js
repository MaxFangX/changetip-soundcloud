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
var captureIfEnabled = function(filename) {
    if(captureEnabled){
        casper.capture(filename);
    }
}

var printEnabled = true; //Set to true for debugging script
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

//=========Begin Script=========//

casper.start('http://soundcloud.com', function(){
    printIfEnabled("046 On home page, checking if logged in");
    captureIfEnabled('047_isitloggedin.png');
    printIfEnabled("048 Is .g-tabs-item detected: " + 
        casper.exists('.g-tabs-item'));
    //Skips trying to log in if already logged in
    // if(casper.exists('.g-tabs-item')){
    //     casper.thenBypass(10);
    // }
});

casper.waitForSelector('.header__login', function() {
    this.click('.header__login');
    printIfEnabled("058 Clicked login button on homepage");
}, function() { 
    printIfEnabled("060 Could not find login button on homepage");
    casper.echo("error");
    throw new Error("Could not find login button");
}, 30000); // 30 second timeout

casper.waitForPopup(/connect/, function() {
    printIfEnabled("066 Loaded login popup");
}, function() {
    printIfEnabled("068 Could not find popup");
    casper.echo("error");
    throw new Error("could not find popup");
}, 31000);

casper.then(function(){
    if(this.popups.length != 1){
        printIfEnabled("**** 075 Warning: there are " + this.popups.length + "popups");
    }
})

casper.withPopup(/connect\?/, function() {
    printIfEnabled("080 withPopup");
    if(!this.exists('#oauth2-login-form')){
        printIfEnabled("**** 082 Warning: Could not find login form on popup");
        casper.echo("error");
        throw new Error("could not find login form on popup");
    }
    printIfEnabled("086 Filling form");
    this.fillSelectors('#oauth2-login-form', {
        'input[id="username"]': user,
        'input[id="password"]': pass,
    }, false);
    printIfEnabled("091 Username form value: " + 
                    this.evaluate(function()  {
                        return document.querySelector('#username').value;
                    }));
    if(!this.exists('#authorize')){
        printIfEnabled("**** 096 Warning: Could not find submit button on popup");
        casper.echo("error");
        throw new Error("could not find submit button on popup");
    }
    printIfEnabled("100 Clicking login button on popup");
    captureIfEnabled("101BeforeClickingLoginButtonOnPopup");
    this.click('#authorize');
})
/*

casper.wait(3002, function() {
    captureIfEnabled('1mainpage.png');
    printIfEnabled("POPUPS.LENGTH: "+ casper.popups.length);
})
casper.wait(3001, function(){
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
            casper.echo("error");
            throw new Error("Ran into recaptcha, use a proxy.");
        }
        else{
            printIfEnabled('Somehow got a popup without captcha');
            captureIfEnabled('error2.png');
            casper.echo("error");
            throw new Error("Somehow got a popup without captcha");
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
            }, function() {
                captureIfEnable('notificationspage.png');
                printIfEnabled("Line ~154 can't find .ownActivity");
            }
    );
}, 5001); //5 Seconds for popup to still be there

//SCRAPING PAGE

casper.waitForSelector('.ownActivity', function() {
    printIfEnabled("Notifications page loaded, start SCRAPING");
    //Screenshot with unique timestamp for every time the page refreshes
    captureIfEnabled('5startscraping.png');
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
    printIfEnabled("Failed to find .ownActivity.");
    captureIfEnabled("findOwnActivity.png");
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
