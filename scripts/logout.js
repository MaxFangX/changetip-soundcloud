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

casper.start('http://soundcloud.com/logout', function(){
    printIf("Logged out");
    captureIf('_ShouldBeLoggedOut.png');
});

casper.run();