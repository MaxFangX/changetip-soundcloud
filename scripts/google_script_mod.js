// setup casper, and listeners
var base = "https://soundcloud.com/";
var x = require("casper").selectXPath;
var utils = require("utils");
var c = require("casper").Casper({
    verbose: false,
    logLevel: "debug",
    pageSettings: {
        userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.71 Safari/537.36",
        loadImages: true,
        loadPlugins: true
    },
    viewportSize: {width: 1280, height: 720},
    onWaitTimeout: onFailure,
    onError: onFailure
});
 
c.on("resource.received", function(request) {
    if (request.status >= 400) {
        c.test.fail(request.url + " is " + request.status);
    }
});
c.on("http.status.500", function(resource) {
    console.log("500 error from: " + resource.url, "warning");
});
c.on("http.status.503", function(resource) {
    console.log("503 error from: " + resource.url, "warning");
});
c.on("page.error", function(msg, trace) {
    console.log("Error: " + msg, "ERROR");
    console.log("Trace:", trace);
});
c.on("remote.message", function(message) {
    console.log("browser console.log", message);
});
 
// init command line arguments
var data = JSON.parse(c.cli.get("data"));
 
// Request the url of the original post and log in through it.
// It's nice to not have the crawler hit the same initial page everytime, as it would if we just
// hard coded in the google plus login screen.
c.start(data.meta.context_url, function() {
    this.test.assertHttpStatus(200);
    log("loaded url: " + this.getCurrentUrl());
});
 
 // find service login link on page
c.then(function() {
    log("opening sevice login link on page");
 
    var url = this.evaluate(function(utils) {
        var _utils = utils || window.__utils__;
        // get log in link
        return _utils.getElementByXPath("//a[contains(@href,'Login')]").href;
    });
 
    // Oddly, no click trigger on this HTMLElement.
    this.open(url);
});
 
// On login page.  Fill out info and login
c.waitForUrl(/Login/, function() {
    this.test.assertHttpStatus(200);
    log("loaded url: " + this.getCurrentUrl());
 
}, function() { onFailure("service login page timeout"); });
 
c.waitForSelector("form#loginform", function() { // find login form
 
    var credentials = getRandomCredential();
 
    log("attempting to log in as: " + credentials.user);
 
    this.fillSelectors("form#loginform", {
        "input[id='Email']": credentials.user,
        "input[id='Passwd']": credentials.pass
    }, true);
 
}, function() { onFailure("login form not found"); });
 
var notification_page = base + "notifications/";
 
c.thenOpen(notification_page, function() {
// ... do some stuff
}
 
function onFailure(msg) {
    c.test.info(msg);
    c.exit(1);
}