var system = require('system');
var user = system.env['CHANGETIP_BOT_USER'];
var pass = system.env['CHANGETIP_BOT_PASS'];
if(user == undefined){
    throw new Error("Need to set 'CHANGETIP_BOT_USER' environment variable")
};
if(pass == undefined){
    throw new Error("Need to set CHANGETIP_BOT_PASS' environment variable");
};

//Make __utils__ accessible
javascript:(function(){void(function(){if(!document.getElementById('CasperUtils')){var CasperUtils=document.createElement('script');CasperUtils.id='CasperUtils';CasperUtils.src='https://rawgit.com/n1k0/casperjs/master/modules/clientutils.js';document.documentElement.appendChild(CasperUtils);var interval=setInterval(function(){if(typeof ClientUtils==='function'){window.__utils__=new window.ClientUtils();clearInterval(interval);}},50);}}());})();

var casper = require('casper').create({
    pageSettings: {
        loadImages: false,
        loadPlugins: false,
    },
    verbose: false,
    logLevel: "debug"
});

casper.start('http://soundcloud.com', function(){
    console.log("**Got to SoundCloud homepage.");
    console.log("Title: "+ this.getTitle());
    
});

casper.wait(3000, function() {});

casper.then(function() {
    console.log("**Clicked login button.");
    this.click('.header__login');
});

casper.waitForPopup(/connect\?/, function() {
    console.log('**Loaded login popup.');
    console.log("casper.popups length: " + casper.popups.length);
    console.log("casper.popups[0]: " + casper.popups[0]);
}, function() {
    console.log("Waiting for popup timed out at 30 seconds.");
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
    console.log("Printing username form value");
    console.log(this.evaluate(function() {
        return document.querySelector('#username').value;
    }));    
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

casper.wait(3000, function(){});

casper.then(function() {
    //this.capture('111mainpage.png');
    console.log("POPUPS.LENGTH: "+ casper.popups.length);
})
casper.wait(3000, function(){});

casper.withPopup(/.*/, function() {
    //this.capture('222popup.png');
    console.log(this.evaluate(function() {
        return document.title;
    }))
    console.log(this.evaluate(function() {
        return document.querySelector('#recaptcha_area');
    }))
    if(casper.exists('#recaptcha_area')){
        throw new Error("Ran into recaptcha, use a proxy.");
    }
    else{
        console.log("****Logged in successfully!");
        console.log("Popups length: " + this.popups.length)
    }  
})


casper.then(function() {
    this.capture('333final.png')
    console.log(this.evaluate(function() {
        return document.title;
    }))
})

casper.run();


