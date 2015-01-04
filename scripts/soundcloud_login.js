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
var outputAsString = true;

var casper = require('casper').create({
    pageSettings: {
        loadImages: true,
        loadPlugins: true,
    },
    verbose: true,
    logLevel: "debug"
});

casper.on('remote.message', function(msg) {
    this.echo('REMOTE: ' + msg);
});

casper.on('page.error', function(msg, trace) {
    this.echo('Error: ' + msg, 'ERROR');
});

casper.start('http://soundcloud.com', function(){
    // TODO investigate why getting to soundcloud.com sometimes
    // takes so long
    console.log("**Got to SoundCloud homepage.");
    console.log("Title: "+ this.getTitle());
    console.log("Next - clicking login button");
    this.capture('isitloggedin.png');
    console.log("Is .g-tabs-item detected: " + 
        casper.exists('.g-tabs-item'));
    console.log("Is .userNav__username detected: " +
        casper.exists('.userNav__username'));
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

    casper.thenOpen("http://soundcloud.com/notifications").waitForSelector('.ownActivity', function() {
                this.capture('444final.png')
                console.log("Notification title: " + this.getTitle());
            }
    );
}, 5000); //5 Seconds for popup to still be there

//SCRAPING PAGE
//TODO implement scraping page
casper.reload(function() {
    console.log("Reloaded notifications page");
});

casper.waitForSelector('.ownActivity', function() {
    console.log("Notifications page loaded, start SCRAPING");
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
            var commentId = comment.children[1].children[1].children[0].children[1].children[0].href.substr(23)
            console.log("commentId: " + commentId);
            var tipper = comment.children[1].children[0].children[0].children[0].children[1].children[0].children[0].children[0].text
            console.log("tipper: " + tipper);
            var tippee = comment.children[1].children[1].children[0].children[1].children[0].href.substr(23, comment.children[1].children[1].children[0].children[1].children[0].href.substr(23).indexOf('/'));
            console.log("tippee: " + tippee)
            var text = comment.children[1].children[1].children[0].children[0].children[1].innerHTML;
            console.log("text: " + text);

            if(outputAsString){ //Output as strings
                //Add escape characters so that it is Python readable
                text = text.replace(/"/g, "\\\"")
                result += i + ": {";
                result += "'comment_id': " + "'" + commentId + "', ";
                result += "'tipper': " + "'" + tipper + "', ";
                result += "'tippee': " + "'" + tipper + "', ";
                result += "'text': " + "\"" + text + "\"}, ";
            }else{ //Add info to result to output as JSON object
                result[i] = {};
                result[i]['id'] = commentId;
                result[i]['tipper'] = tipper;
                result[i]['tippee'] = tippee;
                result[i]['text'] = text;
            }
            
        }
        if(outputAsString){
            result += "}"
        }

        return result;
    }, outputAsString);
    casper.echo("Output: " + output);

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

//Get tipper username
//document.querySelector('.ownActivity.comment .userBadge__usernameLink').innerHTML
//document.querySelector('.ownActivity.comment').children[1].children[0].children[0].children[0].children[1].children[0].children[0].children[0].text
//"maxtipper"

//Get link to comment including comment id + example output
//Get tippee username
//Can maybe use this as unique identifier
// document.querySelector('.ownActivity.comment .sc-link-light').href
// document.querySelector('.ownActivity.comment').children[1].children[1].children[0].children[1].children[0].href
// "https://soundcloud.com/maxtippee/pure-imagination-for-marimba-evan-jose/comment-215516189"
//User <link>.substr(23) to get "maxtippee/pure-imagination-for-marimba-evan-jose/comment-215516189"
//Use <link>.substr(23, <link>.substr(23).indexOf('/')) to get "maxtippee"

//Get text + example output
// document.querySelector('.ownActivity.comment .commentTitle__quotedBody').innerHTML
//document.querySelector('.ownActivity.comment').children[1].children[1].children[0].children[0].children[1].innerHTML
// "
      
//         @<a href="/maxtippee">maxtippee</a>: 103 bits
      
//     "
