var casper = require('casper').create({
    pageSettings: {
        loadImages: false,
        loadPlugins: false,
    },
    verbose: true
});

casper.start('http://soundcloud.com', function(){
    console.log("**Got to SoundCloud homepage.");
    console.log("Title: "+ this.getTitle());
    
});
casper.then(function() {
    console.log("**Clicked login button.");
    this.click('.header__login');
});

casper.waitForPopup(/connect\?/, function() {
    console.log('**Loaded login popup.');
    console.log("casper.popups length: " + casper.popups.length);
    console.log("casper.popups[0]: " + casper.popups[0]);
}, function() {
    console.log("Waiting for popup timed out at 15 seconds.");
}, 15000);
casper.run();


