/* 
 * Script for logging out of soundcloud. Used for testing only.
 */

var casper = require('casper').create({
    pageSettings: {
        loadImages: true,
        loadPlugins: true,
        userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.71 Safari/537.36",
    },
    verbose: true,
    logLevel: "debug"
});

var captureEnabled = true; // Set to true for debugging script
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

casper.start('http://soundcloud.com/logout', function(){
    printIfEnabled("Logged out");
    captureIfEnabled('_ShouldBeLoggedOut.png');
});

casper.run();