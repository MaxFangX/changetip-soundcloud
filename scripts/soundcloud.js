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

casper.start('http://soundcloud.com/notifications', function(){
    captureIfEnabled("isitonnotifications.png");
});

casper.waitForSelector('.ownActivity', function() {
    captureIfEnabled('4final.png')
    printIfEnabled("Notification title: " + this.getTitle());
    printIfEnabled("Notifications page loaded, start SCRAPING");
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

}, function(){
    casper.echo("not logged in");
}, 10000);

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
