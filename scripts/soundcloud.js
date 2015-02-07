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

var captureEnabled = false;
var captureIf = function(filename) {
    if(captureEnabled){
        casper.capture(filename);
    }
}

var printEnabled = false; //Set to true for debugging script
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

casper.start('http://soundcloud.com/notifications', function(){
    printIf("044 Attempting to open notifications page")
    captureIf("_IsItOnNotifications.png");
});

casper.waitForSelector('.ownActivity', function() {
    printIf("068 Starting scraping!");
    captureIf("69JustBeforeScraping.png");

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

}, function(){
    casper.printIf("**** 072 Warning, not logged in, should be caught");
    casper.echo("not logged in");
}, 10000);

casper.run();