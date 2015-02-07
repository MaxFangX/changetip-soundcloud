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

//=========Begin Script=========//

casper.start('http://soundcloud.com', function(){
    printIf("046 On home page, checking if logged in");
    captureIf('047_isitloggedin.png');
    printIf("048 Is .g-tabs-item detected: " + 
        casper.exists('.g-tabs-item'));
    // Skips trying to log in if already logged in
    // if(casper.exists('.g-tabs-item')){
    //     casper.thenBypass(10);
    // }
});

casper.waitForSelector('.header__login', function() {
    this.click('.header__login');
    printIf("058 Clicked login button on homepage");
}, function() { 
    printIf("******** 060 Error: Could not find login button on homepage");
    casper.echo("error");
    throw new Error("Could not find login button");
}, 30000); // 30 second timeout

casper.waitForPopup(/connect/, function() {
    printIf("066 Loaded login popup");
}, function() {
    printIf("******** 068 Error: Could not find popup");
    casper.echo("error");
    throw new Error("could not find popup");
}, 31000);

casper.then(function(){
    if(this.popups.length != 1){
        printIf("**** 075 Warning: there are " + this.popups.length + "popups");
    }
})

casper.withPopup(/connect\?/, function() {
    printIf("080 withPopup");
    captureIf("081_PopupBeforeClickingLoginButton.png");
    if(!this.exists('#oauth2-login-form')){
        printIf("******** 082 Error: Could not find login form on popup");
        casper.echo("error");
        throw new Error("could not find login form on popup");
    }
    printIf("086 Filling form");
    this.fillSelectors('#oauth2-login-form', {
        'input[id="username"]': user,
        'input[id="password"]': pass,
    }, false);
    printIf("091 Username form value: " + 
        this.evaluate(function()  {
            return document.querySelector('#username').value;
        })
    );
    if(casper.exists('#recaptcha_area')){
        printIf("******** 098 Error: Ran into captcha");
        captureIf('097_CaptchaAreaFound.png');
        casper.echo("error");
        throw new Error("ran into captcha");
    }
    if(!this.exists('#authorize')){
        printIf("******** 102 Error: Could not find submit button on popup");
        casper.echo("error");
        throw new Error("could not find submit button on popup");
    }
    printIf("106 Clicking login button on popup");
    this.click('#authorize');
})


casper.wait(5000).then(function() {
    printIf("113 Back to main screen");
    captureIf("117ShouldBeLoggedIn.png");
    if(this.popups.length != 0){
        printIf("**** 115 Warning: There are still " + this.popups.length + " popups on the page");
    }
    if(!this.exists('.g-tabs-item')) {
        printIf('**** 119 Warning: .g-tabs-item not detected, should exist');
    }
})

casper.thenOpen("https://soundcloud.com/notifications");

casper.then(function() {
    printIf("124 On notifications page");
    captureIf("125ShouldBeOnNotificationsPage.png");
});

casper.waitForSelector('.ownActivity', function() {
    printIf("129 Notifications loaded");
}, function() {
    printIf("******** Error: Could not find .ownActivity")
})

casper.wait(3000).then(function() {
    printIf("136 Starting scraping!");
    captureIf("137JustBeforeScraping.png");

    // evaluate() runs javascript on page
    var output = this.evaluate(function() {
        // links is an array of notifications
        var links = document.querySelectorAll('.ownActivity.comment .sc-link-light');
        var result = {} // Output is a JSON object
        for(var i = 0; i < links.length; i++){
            var context_url = links[i].href;
            console.log("context_url scraped: " + context_url);
            // Add context_url to meta of tip_result
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

casper.run();