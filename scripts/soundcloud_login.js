var casper = require('casper').create({
    pageSettings: {
        loadImages: false,
        loadPlugins: false,
    },
    verbose: true
});

casper.start('http://soundcloud.com', function(){
    console.log("Got to SoundCloud homepage");
    console.log("Title: "+ this.getTitle());
    
});
casper.then(function() {
    console.log("Clicking login button");
    this.click('.header__login');
});

casper.then(function(){
    console.log("Running timeout");
    console.log("Popups length");
    console.log(this.popups.length);
})
// casper.waitForPopup(/connect/, function() {
//     console.log('At popup, title is: ');
//     console.log(this.getTitle());
//     console.log(casper.popups);
// });
casper.run();


