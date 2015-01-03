<!DOCTYPE html>
<html lang="en">

<head>
	<noscript><meta http-equiv="refresh" content="0; URL=/files/jimlyndon/F039LN0LE/gistfile1.txt?nojsmode=1" /></noscript>
<script type="text/javascript">
window.load_start_ms = new Date().getTime();
window.load_log = [];
window.logLoad = function(k) {
	var ms = new Date().getTime();
	window.load_log.push({
		k: k,
		t: (ms-window.load_start_ms)/1000
	})
}
if(self!==top)window.document.write("\u003Cstyle>body * {display:none !important;}\u003C\/style>\u003Ca href=\"#\" onclick="+
"\"top.location.href=window.location.href\" style=\"display:block !important;padding:10px\">Go to Slack.com\u003C\/a>");
</script>


<script type="text/javascript">
window.callSlackAPIUnauthed = function(method, args, callback) {
	var url = '/api/'+method+'?t='+new Date().getTime();
	var req = new XMLHttpRequest();
	
	req.onreadystatechange = function() {
		if (req.readyState == 4) {
			req.onreadystatechange = null;
			var obj;
			
			if (req.status == 200) {
				if (req.responseText.indexOf('{') == 0) {
					try {
						eval('obj = '+req.responseText);
					} catch (err) {
						console.warn('unable to do anything with api rsp');
					}
				}
			}
			
			obj = obj || {
				ok: false	
			}
			
			callback(obj.ok, obj, args);
		}
	}
	
	req.open('POST', url, 1);
	req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

	var args2 = [];
	for (i in args) {
		args2[args2.length] = encodeURIComponent(i)+'='+encodeURIComponent(args[i]);
	}

	req.send(args2.join('&'));
}
</script>
			<meta name="referrer" content="no-referrer">
		<script type="text/javascript">



var TS_last_log_date = null;
var TSMakeLogDate = function() {
	var date = new Date();
	
	var y = date.getFullYear();
	var mo = date.getMonth()+1;
	var d = date.getDate();

	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	var ms = date.getMilliseconds();
	var str = y+'/'+mo+'/'+d+' '+h+':'+mi+':'+s+'.'+ms;
	if (TS_last_log_date) {
		var diff = date-TS_last_log_date;
		//str+= ' ('+diff+'ms)';
	}
	TS_last_log_date = date;
	return str+' ';
}

var TSSSB = {
	warn: function(txt) {
		if (window.TS) return TS.warn(txt);
		console.warn(txt);
	},
	
	info: function(txt) {
		if (window.TS) return TS.info(txt);
		console.info(txt);
	},
	
	// called by the ssb when user is active
	maybeTickleMS: function() {
		if (window.TS && TS.ui) {
			TS.ui.maybeTickleMS()
		}
	},
	
	// called by the ssb with files
	filesSelected: function(files) {
		if (window.TS && TS.view) {
			TS.view.filesSelected(files);
		}
	},
	
	// called by the ssb when the user clicks outside the web view
	ssbChromeClicked: function(on_button) {
		if (window.TS) {
			TS.ssbChromeClicked(on_button);
		}
	},
	
	// to be called from SSB apps
	openDialog: function(which) {
		if (which == 'prefs') {
			if (window.TS && TS.ui && TS.ui.prefs_dialog) TS.ui.prefs_dialog.start();
			return;
		}
		
		if (which == 'shortcuts') {
			if (window.TS && TS.ui && TS.ui.shortcuts_dialog) TS.ui.shortcuts_dialog.start();
			return;
		}
		
		TSSSB.warn('TSSSB.openDialog failed, unrecognized dialog:'+which);
	},
	
	// to be called from SSB apps
	getThemeValues: function() {
		if (window.TS && TS.model && TS.model.prefs && TS.model.prefs.sidebar_theme_custom_values) {
			try {
				return JSON.parse(TS.model.prefs.sidebar_theme_custom_values);
			} catch(err) {}
		}
		
		return {};
	},
	
	// to be called from SSB apps
	getAllTeams: function() {
		if (window.TS) {
			return TS.getAllTeams();
		}
		
		return '';
	},

	// to be called from SSB apps
	getAPIToken: function() {
		if (window.TS && TS.model && TS.model.api_token) {
			return TS.model.api_token;
		}
		
		return '';
	},

	// to be called from SSB apps
	getTeamId: function() {
		if (window.TS && TS.model && TS.model.team && TS.model.team.id) {
			return TS.model.team.id;
		}
		
		return '';
	},

	// to be called from SSB apps
	getUserId: function() {
		if (window.TS && TS.model && TS.model.user && TS.model.user.id) {
			return TS.model.user.id;
		}
		
		return '';
	},

	// to be called from SSB apps
	focusTabAndSwitchToChannel: function(c_id) {
		if (!window.TS) return;
		if (!TS.channels) return;
		
		if (c_id.charAt(0) === 'C') {
			TS.channels.displayChannel(c_id);
			
		} else if (c_id.charAt(0) === 'D') {
			TS.ims.startImById(c_id);
			
		} else if (c_id.charAt(0) === 'G') {
			TS.groups.displayGroup(c_id);
			
		} else {
			return false;
		}
		
		window.focus();
		return true;
	},

	// to be called from SSB apps
	sendMsgFromUser: function(c_id, text) {
		if (!window.TS) return TSSSB.warn('TSSSB.sendMsgFromUser failed, no window.TS present') && false;
		if (!TS.client) return TSSSB.warn('TSSSB.sendMsgFromUser failed, no TS.client present') && false;
		if (!c_id) return TSSSB.warn('TSSSB.sendMsgFromUser failed, no c_id provided') && false;
		if (!text) return TSSSB.warn('TSSSB.sendMsgFromUser failed, no text provided') && false;
		
		var sent = false;
		if (c_id.indexOf('C') == 0 && TS.channels.getChannelById(c_id)) { // a channel
			sent = TS.channels.sendMsg(c_id, text);

		} else if (c_id.indexOf('G') == 0 && TS.groups.getGroupById(c_id)) { // a group
			sent = TS.groups.sendMsg(c_id, text);
		
		} else if (TS.ims.getImById(c_id)) {
			sent = TS.ims.sendMsg(c_id, text);
		
		}
		
		if (!sent) return TSSSB.warn('TSSSB.sendMsgFromUser failed, invalid c_id or possible permission failure') && false;
		return true;
	},
	timeout_tim: 0,
	
	callWinSSB: function(method, args) {
		var args_str = '';
		if (args != undefined && args != null) {
			try {
				args_str = JSON.stringify(args)
			} catch(e) {
				args_str = 'bad/no args';
			}
		}
		
		if (window.winssb && winssb[method]) {
			
			if (args) { 
				TSSSB.info(TSMakeLogDate()+'TSSSB: calling winssb.'+method+' with args: '+args_str);
				winssb[method](args);
			} else {
				TSSSB.info(TSMakeLogDate()+'TSSSB: calling winssb.'+method+' with no args');
				winssb[method]();
			}
			return true;
		}
		
		TSSSB.warn(TSMakeLogDate()+'TSSSB: failed calling winssb.'+method+' with args: '+args_str);
		
		return false;
		
	},
	
	callMacGap: function(method, args) {
		var args_str = '';
		if (args != undefined && args != null) {
			try {
				args_str = JSON.stringify(args)
			} catch(e) {
				args_str = 'bad/no args';
			}
		}
		
		//TSSSB.info(TSMakeLogDate()+'TSSSB '+method+' '+args_str);
		
		if (method == 'reload' && macgap.app && macgap.app.reload) {
			macgap.app.reload();
			return true;
		}
		
		if (method == 'didStartLoading' && macgap.app && macgap.app.didStartLoading) {
			macgap.app.didStartLoading(args);
			return true;
		}
		
		if (method == 'didFinishLoading' && macgap.app && macgap.app.didFinishLoading) {
			macgap.app.didFinishLoading();
			return true;
		}
		
		if (method == 'setCurrentTeam' && macgap.state && macgap.state.setCurrentTeam) {
			macgap.state.setCurrentTeam(args);
			return true;
		}
		
		if (method == 'disableSecureInput' && macgap.app && macgap.app.disableSecureInput) {
			macgap.app.disableSecureInput();
			return true;
		}
		
		if (method == 'didSignIn' && macgap.teams && macgap.teams.didSignIn) {
			macgap.teams.didSignIn();
			return true;
		}
		
		if (method == 'didSignOut' && macgap.teams && macgap.teams.didSignOut) {
			macgap.teams.didSignOut();
			return true;
		}
		
		if (method == 'refreshTileColors' && macgap.teams && macgap.teams.refreshTileColors) {
			macgap.teams.refreshTileColors();
			return true;
		}
		
		if (method == 'updateTitleBarColor' && macgap.teams && macgap.teams.updateTitleBarColor) {
			macgap.teams.updateTitleBarColor(args);
			return true;
		}
		
		if (method == 'displayTeam' && macgap.teams && macgap.teams.displayTeam) {
			macgap.teams.displayTeam(args);
			return true;
		}
		
		if (method == 'speakString' && macgap.app && macgap.app.speakString) {
			macgap.app.speakString(args);
			return true;
		}
		
		if (method == 'notify' && macgap.app && macgap.notice && macgap.notice.notify) {
			macgap.notice.notify(args);
			return true;
		}
		
		if (method == 'setBadgeCount' && macgap.dock) {
			if (macgap.dock.setBadgeCount) { // tabbed ssb
				macgap.dock.setBadgeCount(args.all_unread_highlights_cnt, args.all_unread_cnt, args.bullet);
			} else { // non tabbed ssb
				if (args.all_unread_highlights_cnt + args.all_unread_cnt) {
					var cnt = args.all_unread_highlights_cnt; // if any unread mentions, use that number
					if (cnt > 9) cnt = '9+'; 
					if (!cnt) cnt = (args.bullet) ? '•' : ''; // if no all_unread_highlights_cnt then just show • (as long as they have not turned off the pref)
					macgap.dock.badge = cnt.toString();
				} else {
					macgap.dock.badge = '';
				}
			}
			return true;
		}
		
		if (method == 'signInTeam' && macgap.teams && macgap.teams.signInTeam) {
			macgap.teams.signInTeam()
			return true;
		}
		
		if (method == 'teamsUpdate' && macgap.teams && macgap.teams.update) {
			macgap.teams.update(args);
			return true;
		}
		
		if (method == 'preloadSounds' && macgap.sound && macgap.sound.preloadSounds) {
			macgap.sound.preloadSounds(args);
			return true;
		}
		
		if (method == 'playRemoteSound' && macgap.sound && macgap.sound.playRemote) {
			macgap.sound.playRemote(args);
			return true;
		}
		
		if (method == 'setImage' && macgap.teams && macgap.teams.setImage && window.TS && TS.model && TS.model.mac_ssb_version >= .68) {
			macgap.teams.setImage(args);
			return true;
		}
		
		return false;
	},
	
	call: function(method, args) {
		if (!window.macgap && !window.winssb) return false;
		
		if (method == 'didFinishLoading') {
			clearTimeout(TSSSB.timeout_tim);
		}
		
		if (method == 'didStartLoading') {
			clearTimeout(TSSSB.timeout_tim);
			
			var ms = args;
			TSSSB.info(TSMakeLogDate()+'TSSSB.timeout_tim set for ms:'+ms);
			TSSSB.timeout_tim = setTimeout(function() {
				TSSSB.info(TSMakeLogDate()+'TSSSB.timeout_tim fired, we\'re about to be reloaded for taking too long');
				TSSSB.warn(TSMakeLogDate()+' '+JSON.stringify(window.load_log, null, '\t'));
			}, ms)
		}
	
	
		if (window.macgap) {
			return TSSSB.callMacGap(method, args);
		}
	
		if (window.winssb) {
			return TSSSB.callWinSSB(method, args);
		}
		
		return false;
	}
}

</script>	<script type="text/javascript">TSSSB.call('didFinishLoading');</script>
	    <meta charset="utf-8">
    <title>gistfile1.txt | ChangeTip Slack</title>
    <meta name="author" content="Slack">

							
															
		
		<!-- output_css "core" -->
    <link href="https://slack.global.ssl.fastly.net/31954/style/rollup-plastic_1420053042.css" rel="stylesheet" type="text/css">

	<!-- output_css "regular" -->
    <link href="https://slack.global.ssl.fastly.net/28071/style/comments_1418235739.css" rel="stylesheet" type="text/css">
    <link href="https://slack.global.ssl.fastly.net/30473/style/stars_1418235754.css" rel="stylesheet" type="text/css">
    <link href="https://slack.global.ssl.fastly.net/25082/style/print_1418235682.css" rel="stylesheet" type="text/css">
    <link href="https://slack.global.ssl.fastly.net/31898/style/files_1419974064.css" rel="stylesheet" type="text/css">
    <link href="https://slack.global.ssl.fastly.net/31650/style/libs_codemirror_1419288190.css" rel="stylesheet" type="text/css">

	

	
	
	

    <!--[if lt IE 9]>
    <script src="https://slack.global.ssl.fastly.net/1261/js/libs_html5shiv_1361923886.js"></script>
    <![endif]-->

    <link href='https://fonts.googleapis.com/css?family=Lato:300,300italic,400,700,900,400italic,700italic,900italic' rel='stylesheet' type='text/css'>

	
<link id="favicon" rel="shortcut icon" href="https://slack.global.ssl.fastly.net/20655/img/icons/favicon-32.png" sizes="16x16 32x32 48x48" type="image/png" />

<link rel="icon" href="https://slack.global.ssl.fastly.net/9427/img/icons/app-256.png" sizes="256x256" type="image/png" />

<link rel="apple-touch-icon-precomposed" sizes="152x152" href="https://slack.global.ssl.fastly.net/21506/img/icons/ios-152.png" />
<link rel="apple-touch-icon-precomposed" sizes="144x144" href="https://slack.global.ssl.fastly.net/21506/img/icons/ios-144.png" />
<link rel="apple-touch-icon-precomposed" sizes="120x120" href="https://slack.global.ssl.fastly.net/21506/img/icons/ios-120.png" />
<link rel="apple-touch-icon-precomposed" sizes="114x114" href="https://slack.global.ssl.fastly.net/21506/img/icons/ios-114.png" />
<link rel="apple-touch-icon-precomposed" sizes="72x72" href="https://slack.global.ssl.fastly.net/21506/img/icons/ios-72.png" />
<link rel="apple-touch-icon-precomposed" href="https://slack.global.ssl.fastly.net/21506/img/icons/ios-57.png" />

<meta name="msapplication-TileColor" content="#FFFFFF" />
<meta name="msapplication-TileImage" content="https://slack.global.ssl.fastly.net/20655/img/icons/app-144.png" />			<script type="text/javascript">

	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	ga('create', 'UA-106458-17', 'slack.com');
	ga('send', 'pageview');

	(function(e,c,b,f,d,g,a){e.SlackBeaconObject=d;
	e[d]=e[d]||function(){(e[d].q=e[d].q||[]).push([1*new Date(),arguments])};
	e[d].l=1*new Date();g=c.createElement(b);a=c.getElementsByTagName(b)[0];
	g.async=1;g.src=f;a.parentNode.insertBefore(g,a)
	})(window,document,"script","https://slack.global.ssl.fastly.net/15899/js/libs_beacon_1392444912.js","sb");
	sb('set', 'token', '3307f436963e02d4f9eb85ce5159744c');
	sb('set', 'user_id', 'U03982HUJ');
	sb('set', 'user_batch', "referred-launch");
	sb('set', 'user_created', "2014-12-30");
	sb('set', 'name_tag', 'changecoin/maxfangx');
	sb('track', 'pageview');


	function track(a){ga('send','event','web',a);sb('track',a);}

</script>	
</head>

  <body>

  		<script>
	
		var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		if (w > 1440) document.querySelector('body').classList.add('widescreen');
	
	</script>

  	
	

			<nav id="site_nav" class="no_transition">

	<div id="site_nav_contents">

		<div id="user_menu">
			<div id="user_menu_contents">
				<div id="user_menu_avatar">
										<span class="member_image thumb_48" style="background-image: url('https://s3-us-west-2.amazonaws.com/slack-files2/avatars/2014-12-30/3313107177_253b04dc1761d85267e0_192.jpg')"></span>
					<span class="member_image thumb_36" style="background-image: url('https://s3-us-west-2.amazonaws.com/slack-files2/avatars/2014-12-30/3313107177_253b04dc1761d85267e0_72.jpg')"></span>
				</div>
				<h3>Signed in as</h3>
				<span id="user_menu_name">maxfangx</span>
			</div>
		</div>

		<div class="nav_contents">

			<ul class="primary_nav">
				<li><a href="/home"><i class="fa fa-home"></i>Home</a></li>
				<li><a href="/account"><i class="fa fa-user"></i>Account & Profile</a></li>
				<li><a href="/services/new"><i class="fa fa-wrench"></i>Integrations</a></li>
				<li><a href="/archives"><i class="fa fa-inbox"></i>Message Archives</a></li>
				<li><a href="/files"><i class="fa fa-file"></i>Files</a></li>
				<li><a href="/team"><i class="fa fa-book"></i>Team Directory</a></li>
									<li><a href="/stats"><i class="fa fa-tachometer"></i>Statistics</a></li>
													<li><a href="/customize"><i class="fa fa-magic"></i>Customize</a></li>
													<li><a href="/account/team"><i class="fa fa-cog"></i>Team Settings</a></li>
							</ul>

			
		</div>

		<div id="footer">

			<ul id="footer_nav">
				<li><a href="/is">Tour</a></li>
				<li><a href="/apps">Apps</a></li>
				<li><a href="/brand-guidelines">Brand Guidelines</a></li>
				<li><a href="/help">Help</a></li>
				<li><a href="https://api.slack.com" target="_blank">API<i class="fa fa-external-link small_left_margin"></i></a></li>
								<li><a href="/pricing">Pricing</a></li>
				<li><a href="/help/requests/new">Contact</a></li>
				<li><a href="/terms-of-service">Policies</a></li>
				<li><a href="http://slackhq.com/" target="_blank">Our Blog</a></li>
				<li><a href="https://slack.com/signout/2661501386?crumb=s-1420262939-67023e8313-%E2%98%83">Sign Out<i class="fa fa-sign-out small_left_margin"></i></a></li>
			</ul>

			<p id="footer_signature">Made with <i class="fa fa-heart"></i> by Slack</p>

		</div>

	</div>
</nav>	
	<header>
					<a id="menu_toggle" class="no_transition">
				<span class="menu_icon"></span>
				<span class="menu_label">Menu</span>
				<span class="vert_divider"></span>
			</a>
			<h1 id="header_team_name" class="inline_block no_transition">
				<a href="/home">
					<i class="fa fa-home" /></i>
					ChangeTip
				</a>
			</h1>
			<div class="header_nav">
				<div class="header_btns float_right">
					<a id="team_switcher">
						<i class="fa fa-th-large"></i><span class="label"><br />Teams</span>
					</a>
					<a href="/help" id="help_link">
						<i class="fa fa-life-ring"></i><span class="label"><br />Help</span>
					</a>
					<a href="/messages">
						<img src="https://slack.global.ssl.fastly.net/21506/img/icons/ios-64.png" srcset="https://slack.global.ssl.fastly.net/21506/img/icons/ios-32.png 1x, https://slack.global.ssl.fastly.net/21506/img/icons/ios-64.png 2x" />
						<span class="label"><br />Launch</span>
					</a>
				</div>
						                    <ul id="header_team_nav">
		                        		                            <li class="active">
		                            	<a href="https://changecoin.slack.com/home" target="https://changecoin.slack.com/">
		                            					                            		<i class="team_icon" style="background-image: url('https://s3-us-west-2.amazonaws.com/slack-files2/avatars/2014-12-26/3294607671_946df51c894f4fdf5ab4_68.jpg');"></i>
			                            			                            		<span class="switcher_label team_name">ChangeTip</span>
		                            				                            			<i class="fa fa-check active_icon"></i>
		                            				                            	</a>
		                            </li>
		                        		                        <li id="add_team_option"><a href="https://slack.com/signin" target="_blank"><i class="fa fa-plus team_icon"></i> <span class="switcher_label">Sign in to another team...</span></a></li>
		                    </ul>
		                			</div>
		
		
	</header>

	<div id="page">

		<div id="page_contents" >

<p class="print_only">
	<strong>Created by jimlyndon on January 2, 2015 at 9:17 PM</strong><br />
	<span class="subtle_silver break_word">https://changecoin.slack.com/files/jimlyndon/F039LN0LE/gistfile1.txt</span>
</p>

<div class="file_header_container no_print"></div>

<div class="alert_container">
		<div class="file_public_link_shared alert" style="display: none;">
		
	<i class="fa fa-link"></i> Public Link: <a class="file_public_link" href="" target="new"></a>
</div></div>

<div id="file_page" class="card top_padding">

	<p class="small subtle_silver no_print meta">
		3KB Plain Text snippet created on <span class="date">January 2nd 2015</span>.
		This file is private.		<span class="file_share_list"></span>
	</p>

	<a id="file_action_cog" class="action_cog action_cog_snippet float_right no_print">
		<span>Actions </span><i class="fa fa-cog"></i>
	</a>
	<a id="snippet_expand_toggle" class="float_right no_print">
		<i class="fa fa-expand "></i>
		<i class="fa fa-compress hidden"></i>
	</a>

	<div class="large_bottom_margin clearfix">
		<pre id="file_contents">// setup casper, and listeners
var base = &quot;https://soundcloud.com/&quot;;
var x = require(&quot;casper&quot;).selectXPath;
var utils = require(&quot;utils&quot;);
var c = require(&quot;casper&quot;).Casper({
    verbose: false,
    logLevel: &quot;debug&quot;,
    pageSettings: {
        userAgent: &quot;Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.71 Safari/537.36&quot;,
        loadImages: true,
        loadPlugins: true
    },
    viewportSize: {width: 1280, height: 720},
    onWaitTimeout: onFailure,
    onError: onFailure
});
 
c.on(&quot;resource.received&quot;, function(request) {
    if (request.status &gt;= 400) {
        c.test.fail(request.url + &quot; is &quot; + request.status);
    }
});
c.on(&quot;http.status.500&quot;, function(resource) {
    console.log(&quot;500 error from: &quot; + resource.url, &quot;warning&quot;);
});
c.on(&quot;http.status.503&quot;, function(resource) {
    console.log(&quot;503 error from: &quot; + resource.url, &quot;warning&quot;);
});
c.on(&quot;page.error&quot;, function(msg, trace) {
    console.log(&quot;Error: &quot; + msg, &quot;ERROR&quot;);
    console.log(&quot;Trace:&quot;, trace);
});
c.on(&quot;remote.message&quot;, function(message) {
    console.log(&quot;browser console.log&quot;, message);
});
 
// init command line arguments
var data = JSON.parse(c.cli.get(&quot;data&quot;));
 
// Request the url of the original post and log in through it.
// It&#039;s nice to not have the crawler hit the same initial page everytime, as it would if we just
// hard coded in the google plus login screen.
c.start(data.meta.context_url, function() {
    this.test.assertHttpStatus(200);
    log(&quot;loaded url: &quot; + this.getCurrentUrl());
});
 
 // find service login link on page
c.then(function() {
    log(&quot;opening sevice login link on page&quot;);
 
    var url = this.evaluate(function(utils) {
        var _utils = utils || window.__utils__;
        // get log in link
        return _utils.getElementByXPath(&quot;//a[contains(@href,&#039;Login&#039;)]&quot;).href;
    });
 
    // Oddly, no click trigger on this HTMLElement.
    this.open(url);
});
 
// On login page.  Fill out info and login
c.waitForUrl(/Login/, function() {
    this.test.assertHttpStatus(200);
    log(&quot;loaded url: &quot; + this.getCurrentUrl());
 
}, function() { onFailure(&quot;service login page timeout&quot;); });
 
c.waitForSelector(&quot;form#loginform&quot;, function() { // find login form
 
    var credentials = getRandomCredential();
 
    log(&quot;attempting to log in as: &quot; + credentials.user);
 
    this.fillSelectors(&quot;form#loginform&quot;, {
        &quot;input[id=&#039;Email&#039;]&quot;: credentials.user,
        &quot;input[id=&#039;Passwd&#039;]&quot;: credentials.pass
    }, true);
 
}, function() { onFailure(&quot;login form not found&quot;); });
 
var notification_page = base + &quot;notifications/&quot;;
 
c.thenOpen(notification_page, function() {
// ... do some stuff
}
 
function onFailure(msg) {
    c.test.info(msg);
    c.exit(1);
}</pre>

		<p class="file_page_meta no_print" style="line-height: 1.5rem;">
			<label class="checkbox normal mini float-right no_top_padding no_min_width">
				<input type="checkbox" id="file_preview_wrap_cb"> wrap long lines
			</label>
		</p>

	</div>

	<div id="comments_holder" class="clearfix clear_both">
	<div class="col span_1_of_6"></div>
	<div class="col span_4_of_6 no_right_padding">
		<div id="file_page_comments">
					</div>	
		<form action="https://changecoin.slack.com/files/jimlyndon/F039LN0LE/gistfile1.txt" 
		id="file_comment_form" 
					class="comment_form"
				method="post">
			<a href="/team/maxfangx" class="member_preview_link" data-member-id="U03982HUJ" >
			<span class="member_image thumb_36" style="background-image: url('https://s3-us-west-2.amazonaws.com/slack-files2/avatars/2014-12-30/3313107177_253b04dc1761d85267e0_72.jpg')"></span>
		</a>		
		<input type="hidden" name="addcomment" value="1" />
	<input type="hidden" name="crumb" value="s-1420262939-a74491f064-☃" />

	<textarea id="file_comment" data-el-id-to-keep-in-view="file_comment_submit_btn" class="comment_input small_bottom_margin" name="comment" wrap="virtual" ></textarea>
	<span class="input_note float_left cloud_silver file_comment_tip">cmd+enter to submit</span>	<button id="file_comment_submit_btn" type="submit" class="btn float_right  ladda-button" data-style="expand-right"><span class="ladda-label">Add Comment</span></button>
</form>

<form action="https://changecoin.slack.com/files/jimlyndon/F039LN0LE/gistfile1.txt" 
		id="file_edit_comment_form" 
					class="edit_comment_form hidden"
				method="post">
	<textarea id="file_edit_comment" class="comment_input small_bottom_margin" name="comment" wrap="virtual"></textarea><br>
	<span class="input_note float_left cloud_silver file_comment_tip">cmd+enter to submit</span>	<input type="submit" class="save btn float_right " value="Save Changes" />
	<button class="cancel btn btn_outline float_right small_right_margin ">Cancel</button>
</form>	
	</div>
	<div class="col span_1_of_6"></div>
</div>
</div>

<div id="file_share_modal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="Share" aria-hidden="true">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		<h3>
			Share 
			Snippet											</h3>
	</div>

	<div class="modal-body share_dialog">
				
		<div id="share_channels">

			<p id="select_share_channels_note" class="select_share_note">Sharing a file into a channel makes it public. All members of your team will have access to it.</p>
			<p id="select_share_ims_note" class="hidden select_share_note">Sharing a file with a person means that only they will have access to it (unless it is also shared into a channel or with a group).</p>
			<p id="select_share_groups_note" class="hidden select_share_note">Sharing a file into a group means that only members of that group will have access to it (unless it is also shared into a channel).</p>

			<p>
				<label id="select_share_label" for="select_share_channels">Share in</label>
				<select id="select_share_channels" name="select_share_channels" >
					<optgroup label="Channels">
																																																												<option value="C038YGB3J">#botdev</option>
																																									<option value="C02KH2BHX">#community</option>
																																																																																<option value="C02KFERBL">#general</option>
																																																						<option value="C02S6C7F4">#mentions</option>
																																									<option value="C02KFERBN">#random</option>
																																																																																																										<option value="C039L1DS0">#slack_tipping</option>
																																																																																																</optgroup>
					<optgroup label="People" id="select_share_ims">
																														<option value="D03982HUL">slackbot (remains private)</option>
																																													<option value="D03982HUN" data-user-id="U02KFERBE"></option>
																																													<option value="D03982HUY" data-user-id="U02KFFY7G"></option>
																																													<option value="D03982HUU" data-user-id="U02KH10ET"></option>
																																													<option value="D03982HV6" data-user-id="U02L9SLMV"></option>
																																													<option value="D03982HV2" data-user-id="U02RQ2P0K"></option>
																																													<option value="D03982HUW" data-user-id="U02SMJTKL"></option>
																																													<option value="D03982HUQ" data-user-id="U02SS4CDN"></option>
																																													<option value="D03982HV4" data-user-id="U02TNDLBN"></option>
																																													<option value="D03982HUS" data-user-id="U033N951H"></option>
																																													<option value="D03982HV0" data-user-id="U033TGB9A"></option>
																										</optgroup>
					
				</select>			
			</p>

		</div>

		<p class="no_bottom_margin">
			<label class="inline-block align_top">Add Comment <span class="normal">(optional)</span></label>
			<textarea id="file_comment_textarea" class="comment_input" name="comment" wrap="virtual"></textarea>
		</p>

	</div>

	<div class="modal-footer">
	  <button id="file_share_cancel" class="btn btn_outline" data-dismiss="modal" aria-hidden="true">Cancel</button>
	  <button id="file_share_submit" class="btn ladda-button" data-style="expand-right">
	  	<span class="ladda-label">
	  		Share
	  		Snippet										  	</span>
	  </button>
	</div>
	
</div>
	

		
	</div>
	<div id="overlay"></div>
</div>




<script type="text/javascript">
var cdn_url = 'https://slack.global.ssl.fastly.net';
</script>
	<script type="text/javascript">
<!--
	// common boot_data
	var boot_data = {
		start_ms: new Date().getTime(),
		app: 'web',
		user_id: 'U03982HUJ',
		svn_rev: '32015',
		redir_domain: 'slack-redir.com',
		api_url: '/api/',
		team_url: 'https://changecoin.slack.com/',
		image_proxy_url: 'https://slack-imgs.com/',
		api_token: 'xoxs-2661501386-3314085970-3314085996-c2f753fbac',
		feature_status: false,
		feature_attachments_inline: false,
		feature_search_attachments: false,
		feature_chat_sounds: false,
		feature_darken_scroll_handle: false,
		feature_cmd_autocomplete: true,
		feature_require_at: true,
		feature_image_proxy: true,
		feature_channel_eventlog_client: true,
		feature_simple_smile: true,
		feature_bot_users: true,
		feature_post_previews: false,
		feature_user_hidden_msgs: false,
		feature_muting: false,
		feature_new_ls: true,
		feature_macssb1_banner: true,
		feature_latest_event_ts: true,
		feature_new_team_directory: false,
		feature_no_redirects_in_ssb: true,
		feature_referer_policy: true,
		feature_client_exif_orientation_on_uploads: true,
		feature_spaces: false,
		feature_comment_mentions_autocomplete: false,
		feature_ra_channel_archive: false,
		feature_compliance_exports: false,
		feature_lato_fonts: false,

		img: {
			app_icon: 'https://slack.global.ssl.fastly.net/20655/img/slack_growl_icon.png'
		},
		page_needs_custom_emoji: false
	};

	// web/mobile boot_data
			boot_data.login_data = JSON.parse('{\"ok\":true,\"self\":{\"id\":\"U03982HUJ\",\"name\":\"maxfangx\",\"prefs\":{\"highlight_words\":\"Max Fang,Maxwell,Maxfangx\",\"user_colors\":\"\",\"color_names_in_list\":true,\"growls_enabled\":true,\"tz\":\"America\\/Chicago\",\"push_dm_alert\":true,\"push_mention_alert\":true,\"push_everything\":false,\"push_idle_wait\":2,\"push_sound\":\"b2.mp3\",\"push_loud_channels\":\"\",\"push_mention_channels\":\"\",\"push_loud_channels_set\":\"\",\"email_alerts\":\"instant\",\"email_alerts_sleep_until\":0,\"email_misc\":true,\"email_weekly\":true,\"welcome_message_hidden\":false,\"all_channels_loud\":false,\"loud_channels\":\"\",\"never_channels\":\"\",\"loud_channels_set\":\"\",\"show_member_presence\":true,\"search_sort\":\"timestamp\",\"expand_inline_imgs\":true,\"expand_internal_inline_imgs\":true,\"expand_snippets\":false,\"posts_formatting_guide\":true,\"seen_welcome_2\":true,\"seen_ssb_prompt\":false,\"search_only_my_channels\":false,\"emoji_mode\":\"default\",\"has_invited\":false,\"has_uploaded\":true,\"has_created_channel\":false,\"search_exclude_channels\":\"\",\"messages_theme\":\"default\",\"webapp_spellcheck\":true,\"no_joined_overlays\":false,\"no_created_overlays\":false,\"dropbox_enabled\":false,\"seen_user_menu_tip_card\":true,\"seen_team_menu_tip_card\":true,\"seen_channel_menu_tip_card\":true,\"seen_message_input_tip_card\":true,\"seen_channels_tip_card\":true,\"seen_domain_invite_reminder\":false,\"seen_member_invite_reminder\":false,\"seen_flexpane_tip_card\":false,\"seen_search_input_tip_card\":false,\"mute_sounds\":false,\"arrow_history\":false,\"tab_ui_return_selects\":true,\"obey_inline_img_limit\":true,\"new_msg_snd\":\"complete_quest_requirement.mp3\",\"collapsible\":false,\"collapsible_by_click\":true,\"require_at\":true,\"mac_ssb_bounce\":\"\",\"mac_ssb_bullet\":true,\"win_ssb_bullet\":true,\"expand_non_media_attachments\":true,\"show_typing\":true,\"pagekeys_handled\":true,\"last_snippet_type\":\"\",\"display_real_names_override\":0,\"time24\":false,\"enter_is_special_in_tbt\":false,\"graphic_emoticons\":false,\"convert_emoticons\":true,\"autoplay_chat_sounds\":true,\"ss_emojis\":true,\"sidebar_behavior\":\"\",\"mark_msgs_read_immediately\":true,\"start_scroll_at_oldest\":true,\"snippet_editor_wrap_long_lines\":false,\"ls_disabled\":false,\"sidebar_theme\":\"default\",\"sidebar_theme_custom_values\":\"\",\"f_key_search\":false,\"k_key_omnibox\":true,\"speak_growls\":false,\"mac_speak_voice\":\"com.apple.speech.synthesis.voice.Alex\",\"mac_speak_speed\":250,\"comma_key_prefs\":false,\"at_channel_suppressed_channels\":\"\",\"push_at_channel_suppressed_channels\":\"\",\"prompted_for_email_disabling\":false,\"full_text_extracts\":false,\"no_text_in_notifications\":false,\"muted_channels\":\"\",\"no_macssb1_banner\":false,\"privacy_policy_seen\":true,\"search_exclude_bots\":false,\"fuzzy_matching\":false,\"load_lato\":false,\"load_lato_2\":false},\"created\":1419991591},\"team\":{\"id\":\"T02KFERBC\",\"name\":\"ChangeTip\",\"email_domain\":\"changetip.com\",\"domain\":\"changecoin\",\"msg_edit_window_mins\":-1,\"prefs\":{\"default_channels\":[\"C02KH2BHX\",\"C02KFERBL\",\"C02S6C7F4\",\"C02KFERBN\"],\"msg_edit_window_mins\":-1,\"allow_message_deletion\":true,\"hide_referers\":false,\"display_real_names\":false,\"who_can_at_everyone\":\"regular\",\"who_can_at_channel\":\"ra\",\"who_can_create_channels\":\"regular\",\"who_can_archive_channels\":\"regular\",\"who_can_create_groups\":\"ra\",\"who_can_post_general\":\"ra\",\"who_can_kick_channels\":\"admin\",\"who_can_kick_groups\":\"regular\",\"retention_type\":0,\"retention_duration\":0,\"group_retention_type\":0,\"group_retention_duration\":0,\"dm_retention_type\":0,\"dm_retention_duration\":0,\"require_at_for_mention\":0},\"icon\":{\"image_34\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-26\\/3294607671_946df51c894f4fdf5ab4_34.jpg\",\"image_44\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-26\\/3294607671_946df51c894f4fdf5ab4_44.jpg\",\"image_68\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-26\\/3294607671_946df51c894f4fdf5ab4_68.jpg\",\"image_88\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-26\\/3294607671_946df51c894f4fdf5ab4_68.jpg\",\"image_102\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-26\\/3294607671_946df51c894f4fdf5ab4_68.jpg\",\"image_132\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-26\\/3294607671_946df51c894f4fdf5ab4_68.jpg\",\"image_original\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-26\\/3294607671_946df51c894f4fdf5ab4_original.jpg\"},\"over_storage_limit\":false},\"latest_event_ts\":\"1420262338.000000\",\"channels\":[{\"id\":\"C02UE04C8\",\"name\":\"appreciation\",\"is_channel\":true,\"created\":1415402517,\"creator\":\"U02RQ2P0K\",\"is_archived\":false,\"is_general\":false,\"is_member\":false},{\"id\":\"C0325P4QL\",\"name\":\"asana\",\"is_channel\":true,\"created\":1416818545,\"creator\":\"U02KFERBE\",\"is_archived\":false,\"is_general\":false,\"is_member\":false},{\"id\":\"C038N4W37\",\"name\":\"bitcoinbowl\",\"is_channel\":true,\"created\":1419612081,\"creator\":\"U02KFERBE\",\"is_archived\":true,\"is_general\":false,\"is_member\":false},{\"id\":\"C038YGB3J\",\"name\":\"botdev\",\"is_channel\":true,\"created\":1419867281,\"creator\":\"U02KFERBE\",\"is_archived\":false,\"is_general\":false,\"is_member\":true,\"members\":[\"U02KFERBE\",\"U02KFFY7G\",\"U02KH10ET\",\"U02KHBPB1\",\"U02KP3CAM\",\"U02RQ2P0K\",\"U02TNDLBN\",\"U03982HUJ\"],\"topic\":{\"value\":\"\",\"creator\":\"\",\"last_set\":0},\"purpose\":{\"value\":\"\",\"creator\":\"\",\"last_set\":0}},{\"id\":\"C02U2DDHW\",\"name\":\"campaigns\",\"is_channel\":true,\"created\":1415296719,\"creator\":\"U02KP3CAM\",\"is_archived\":false,\"is_general\":false,\"is_member\":false},{\"id\":\"C02KH2BHX\",\"name\":\"community\",\"is_channel\":true,\"created\":1410795655,\"creator\":\"U02KFERBE\",\"is_archived\":false,\"is_general\":false,\"is_member\":true,\"members\":[\"U02KFERBE\",\"U02KFFY7G\",\"U02KH10ET\",\"U02KHBPB1\",\"U02KP3CAM\",\"U02KP45JK\",\"U02KQFBKR\",\"U02L4T7HA\",\"U02L9SLMV\",\"U02RQ2P0K\",\"U02TNDLBN\",\"U033N951H\",\"U033TGB9A\",\"U036V3LJT\",\"U03982HUJ\"],\"topic\":{\"value\":\"Positively charging forward - ChangeTip Must Thrive\",\"creator\":\"U02KFERBE\",\"last_set\":1419043302},\"purpose\":{\"value\":\"\",\"creator\":\"\",\"last_set\":0}},{\"id\":\"C02M8195Q\",\"name\":\"facebook\",\"is_channel\":true,\"created\":1411762735,\"creator\":\"U02KFFY7G\",\"is_archived\":false,\"is_general\":false,\"is_member\":false},{\"id\":\"C032P3D74\",\"name\":\"faq\",\"is_channel\":true,\"created\":1416986344,\"creator\":\"U02RQ2P0K\",\"is_archived\":false,\"is_general\":false,\"is_member\":false},{\"id\":\"C02U0UER9\",\"name\":\"feedback\",\"is_channel\":true,\"created\":1415296964,\"creator\":\"U02RQ2P0K\",\"is_archived\":false,\"is_general\":false,\"is_member\":false},{\"id\":\"C02URM0BS\",\"name\":\"feedbackprivate\",\"is_channel\":true,\"created\":1415646151,\"creator\":\"U02RQ2P0K\",\"is_archived\":false,\"is_general\":false,\"is_member\":false},{\"id\":\"C02KFERBL\",\"name\":\"general\",\"is_channel\":true,\"created\":1410716088,\"creator\":\"U02KFERBE\",\"is_archived\":false,\"is_general\":true,\"is_member\":true,\"members\":[\"U02KFERBE\",\"U02KFFY7G\",\"U02KH10ET\",\"U02KHBPB1\",\"U02KL14DJ\",\"U02KP3CAM\",\"U02KP45JK\",\"U02KQFBKR\",\"U02L4T7HA\",\"U02L9SLMV\",\"U02PEMZ0X\",\"U02RQ2P0K\",\"U02SMJTKL\",\"U02SS4CDN\",\"U02TNDLBN\",\"U032ZQHV3\",\"U033N951H\",\"U033TGB9A\",\"U036V3LJT\",\"U037FNWQN\",\"U03982HUJ\"],\"topic\":{\"value\":\"1.7MM users\",\"creator\":\"U02KFERBE\",\"last_set\":1416003803},\"purpose\":{\"value\":\"This channel is for team-wide communication and announcements. All team members are in this channel.\",\"creator\":\"\",\"last_set\":0}},{\"id\":\"C02KW7X49\",\"name\":\"github\",\"is_channel\":true,\"created\":1410983959,\"creator\":\"U02KFERBE\",\"is_archived\":false,\"is_general\":false,\"is_member\":false},{\"id\":\"C02UC226R\",\"name\":\"memes\",\"is_channel\":true,\"created\":1415398211,\"creator\":\"U02KP3CAM\",\"is_archived\":false,\"is_general\":false,\"is_member\":false},{\"id\":\"C02S6C7F4\",\"name\":\"mentions\",\"is_channel\":true,\"created\":1414526940,\"creator\":\"U02KP3CAM\",\"is_archived\":false,\"is_general\":false,\"is_member\":true,\"members\":[\"U02KFERBE\",\"U02KFFY7G\",\"U02KH10ET\",\"U02KHBPB1\",\"U02KP3CAM\",\"U02KP45JK\",\"U02KQFBKR\",\"U02L4T7HA\",\"U02L9SLMV\",\"U02RQ2P0K\",\"U02TNDLBN\",\"U033N951H\",\"U033TGB9A\",\"U036V3LJT\",\"U03982HUJ\"],\"topic\":{\"value\":\"\",\"creator\":\"\",\"last_set\":0},\"purpose\":{\"value\":\"\",\"creator\":\"\",\"last_set\":0}},{\"id\":\"C02U37GRA\",\"name\":\"press\",\"is_channel\":true,\"created\":1415301868,\"creator\":\"U02RQ2P0K\",\"is_archived\":false,\"is_general\":false,\"is_member\":false},{\"id\":\"C02KFERBN\",\"name\":\"random\",\"is_channel\":true,\"created\":1410716088,\"creator\":\"U02KFERBE\",\"is_archived\":false,\"is_general\":false,\"is_member\":true,\"members\":[\"U02KFERBE\",\"U02KFFY7G\",\"U02KH10ET\",\"U02KHBPB1\",\"U02KP3CAM\",\"U02KP45JK\",\"U02KQFBKR\",\"U02L4T7HA\",\"U02L9SLMV\",\"U02RQ2P0K\",\"U02SMJTKL\",\"U02SS4CDN\",\"U02TNDLBN\",\"U032ZQHV3\",\"U033N951H\",\"U033TGB9A\",\"U036V3LJT\",\"U037FNWQN\",\"U03982HUJ\"],\"topic\":{\"value\":\"\",\"creator\":\"\",\"last_set\":0},\"purpose\":{\"value\":\"A place for non-work banter, links, articles of interest, humor or anything else which you\'d like concentrated in some place other than work-related channels.\",\"creator\":\"\",\"last_set\":0}},{\"id\":\"C02KQK1JK\",\"name\":\"reddit\",\"is_channel\":true,\"created\":1410901305,\"creator\":\"U02KQFBKR\",\"is_archived\":false,\"is_general\":false,\"is_member\":false},{\"id\":\"C02U3L5T8\",\"name\":\"redditfeed\",\"is_channel\":true,\"created\":1415304669,\"creator\":\"U02KP3CAM\",\"is_archived\":false,\"is_general\":false,\"is_member\":false},{\"id\":\"C02KW6SLZ\",\"name\":\"scrum\",\"is_channel\":true,\"created\":1410983558,\"creator\":\"U02KHBPB1\",\"is_archived\":false,\"is_general\":false,\"is_member\":false},{\"id\":\"C02KQBQFD\",\"name\":\"secretbitcoins\",\"is_channel\":true,\"created\":1410898636,\"creator\":\"U02KP3CAM\",\"is_archived\":false,\"is_general\":false,\"is_member\":false},{\"id\":\"C0325V7NE\",\"name\":\"sentry\",\"is_channel\":true,\"created\":1416821215,\"creator\":\"U02KFERBE\",\"is_archived\":false,\"is_general\":false,\"is_member\":false},{\"id\":\"C02PFUBEV\",\"name\":\"sf\",\"is_channel\":true,\"created\":1413217892,\"creator\":\"U02KFERBE\",\"is_archived\":false,\"is_general\":false,\"is_member\":false},{\"id\":\"C039L1DS0\",\"name\":\"slack_tipping\",\"is_channel\":true,\"created\":1420240273,\"creator\":\"U02KFERBE\",\"is_archived\":false,\"is_general\":false,\"is_member\":true,\"members\":[\"U02KFERBE\",\"U02RQ2P0K\",\"U033TGB9A\",\"U03982HUJ\"],\"topic\":{\"value\":\"\",\"creator\":\"\",\"last_set\":0},\"purpose\":{\"value\":\"\",\"creator\":\"\",\"last_set\":0}},{\"id\":\"C02RRG32Q\",\"name\":\"support\",\"is_channel\":true,\"created\":1414357597,\"creator\":\"U02KP3CAM\",\"is_archived\":false,\"is_general\":false,\"is_member\":false},{\"id\":\"C02UTCTTV\",\"name\":\"testimonials\",\"is_channel\":true,\"created\":1415672741,\"creator\":\"U02RQ2P0K\",\"is_archived\":false,\"is_general\":false,\"is_member\":false},{\"id\":\"C031ZUV1P\",\"name\":\"tip_me\",\"is_channel\":true,\"created\":1416701734,\"creator\":\"U02KFERBE\",\"is_archived\":false,\"is_general\":false,\"is_member\":false},{\"id\":\"C02KRPXSW\",\"name\":\"twitter\",\"is_channel\":true,\"created\":1410897144,\"creator\":\"U02KP45JK\",\"is_archived\":false,\"is_general\":false,\"is_member\":false},{\"id\":\"C02KV1SS6\",\"name\":\"wikipedia\",\"is_channel\":true,\"created\":1410955046,\"creator\":\"U02KP3CAM\",\"is_archived\":false,\"is_general\":false,\"is_member\":false},{\"id\":\"C02KSSSSC\",\"name\":\"youtube\",\"is_channel\":true,\"created\":1410911108,\"creator\":\"U02KP3CAM\",\"is_archived\":false,\"is_general\":false,\"is_member\":false}],\"groups\":[],\"ims\":[{\"id\":\"D03982HUL\",\"is_im\":true,\"user\":\"USLACKBOT\",\"created\":1419991591,\"is_user_deleted\":false},{\"id\":\"D03982HUN\",\"is_im\":true,\"user\":\"U02KFERBE\",\"created\":1419991591,\"is_user_deleted\":false},{\"id\":\"D03982HUY\",\"is_im\":true,\"user\":\"U02KFFY7G\",\"created\":1419991591,\"is_user_deleted\":false},{\"id\":\"D03982HUU\",\"is_im\":true,\"user\":\"U02KH10ET\",\"created\":1419991591,\"is_user_deleted\":false},{\"id\":\"D03982HV6\",\"is_im\":true,\"user\":\"U02L9SLMV\",\"created\":1419991591,\"is_user_deleted\":false},{\"id\":\"D03982HV2\",\"is_im\":true,\"user\":\"U02RQ2P0K\",\"created\":1419991591,\"is_user_deleted\":false},{\"id\":\"D03982HUW\",\"is_im\":true,\"user\":\"U02SMJTKL\",\"created\":1419991591,\"is_user_deleted\":false},{\"id\":\"D03982HUQ\",\"is_im\":true,\"user\":\"U02SS4CDN\",\"created\":1419991591,\"is_user_deleted\":false},{\"id\":\"D03982HV4\",\"is_im\":true,\"user\":\"U02TNDLBN\",\"created\":1419991591,\"is_user_deleted\":false},{\"id\":\"D03982HUS\",\"is_im\":true,\"user\":\"U033N951H\",\"created\":1419991591,\"is_user_deleted\":false},{\"id\":\"D03982HV0\",\"is_im\":true,\"user\":\"U033TGB9A\",\"created\":1419991591,\"is_user_deleted\":false}],\"users\":[{\"id\":\"U02KQFBKR\",\"name\":\"bashco\",\"deleted\":false,\"status\":null,\"color\":\"684b6c\",\"real_name\":\"BashCo\",\"skype\":\"\",\"phone\":\"\",\"tz\":\"Europe\\/Amsterdam\",\"tz_label\":\"Central European Time\",\"tz_offset\":3600,\"profile\":{\"image_24\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-16\\/2670545783_24.jpg\",\"image_32\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-16\\/2670545783_32.jpg\",\"image_48\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-16\\/2670545783_48.jpg\",\"image_72\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-16\\/2670545783_72.jpg\",\"image_192\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-16\\/2670545783_72.jpg\",\"image_original\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-16\\/2670545783_original.jpg\",\"first_name\":\"BashCo\",\"last_name\":\"\",\"skype\":\"\",\"title\":\"\",\"phone\":\"\",\"real_name\":\"BashCo\",\"real_name_normalized\":\"BashCo\",\"email\":\"bashco.bitcoin@gmail.com\"},\"is_admin\":false,\"is_owner\":false,\"is_primary_owner\":false,\"is_restricted\":false,\"is_ultra_restricted\":false,\"is_bot\":false},{\"id\":\"U02TNDLBN\",\"name\":\"binaryresult\",\"deleted\":false,\"status\":null,\"color\":\"d58247\",\"real_name\":\"Chris FitzGerald\",\"skype\":\"\",\"phone\":\"\",\"tz\":\"America\\/Indiana\\/Indianapolis\",\"tz_label\":\"Eastern Standard Time\",\"tz_offset\":-18000,\"profile\":{\"first_name\":\"Chris\",\"last_name\":\"FitzGerald\",\"image_24\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-11-05\\/2939101495_e3cc036042cd03f9287a_24.jpg\",\"image_32\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-11-05\\/2939101495_e3cc036042cd03f9287a_32.jpg\",\"image_48\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-11-05\\/2939101495_e3cc036042cd03f9287a_48.jpg\",\"image_72\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-11-05\\/2939101495_e3cc036042cd03f9287a_72.jpg\",\"image_192\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-11-05\\/2939101495_e3cc036042cd03f9287a_192.jpg\",\"image_original\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-11-05\\/2939101495_e3cc036042cd03f9287a_original.jpg\",\"title\":\"\",\"skype\":\"\",\"phone\":\"\",\"real_name\":\"Chris FitzGerald\",\"real_name_normalized\":\"Chris FitzGerald\",\"email\":\"chrisfitzg@gmail.com\"},\"is_admin\":false,\"is_owner\":false,\"is_primary_owner\":false,\"is_restricted\":false,\"is_ultra_restricted\":false,\"is_bot\":false},{\"id\":\"U02KP3CAM\",\"name\":\"charlesnorton\",\"deleted\":false,\"status\":null,\"color\":\"e96699\",\"real_name\":\"Charles Norton\",\"skype\":\"nayest\",\"phone\":\"\",\"tz\":\"America\\/New_York\",\"tz_label\":\"Eastern Standard Time\",\"tz_offset\":-18000,\"profile\":{\"first_name\":\"Charles\",\"last_name\":\"Norton\",\"image_24\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-07\\/3164222337_270600c2eacd8c345527_24.jpg\",\"image_32\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-07\\/3164222337_270600c2eacd8c345527_32.jpg\",\"image_48\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-07\\/3164222337_270600c2eacd8c345527_48.jpg\",\"image_72\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-07\\/3164222337_270600c2eacd8c345527_72.jpg\",\"image_192\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-07\\/3164222337_270600c2eacd8c345527_192.jpg\",\"image_original\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-07\\/3164222337_270600c2eacd8c345527_original.jpg\",\"skype\":\"nayest\",\"title\":\"Memetic engineer\",\"phone\":\"\",\"real_name\":\"Charles Norton\",\"real_name_normalized\":\"Charles Norton\",\"email\":\"cnorton2@binghamton.edu\"},\"is_admin\":false,\"is_owner\":false,\"is_primary_owner\":false,\"is_restricted\":false,\"is_ultra_restricted\":false,\"is_bot\":false},{\"id\":\"U02L9SLMV\",\"name\":\"csh\",\"deleted\":false,\"status\":null,\"color\":\"2b6836\",\"real_name\":\"Christian Selchau Hansen\",\"skype\":null,\"phone\":null,\"tz\":\"America\\/Los_Angeles\",\"tz_label\":\"Pacific Standard Time\",\"tz_offset\":-28800,\"profile\":{\"image_24\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-20\\/2690037503_24.jpg\",\"image_32\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-20\\/2690037503_32.jpg\",\"image_48\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-20\\/2690037503_48.jpg\",\"image_72\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-20\\/2690037503_72.jpg\",\"image_192\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-20\\/2690037503_192.jpg\",\"image_original\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-20\\/2690037503_original.jpg\",\"first_name\":\"Christian\",\"last_name\":\"Selchau Hansen\",\"real_name\":\"Christian Selchau Hansen\",\"real_name_normalized\":\"Christian Selchau Hansen\",\"email\":\"selchau.c@gmail.com\"},\"is_admin\":false,\"is_owner\":false,\"is_primary_owner\":false,\"is_restricted\":false,\"is_ultra_restricted\":false,\"is_bot\":false},{\"id\":\"U033TGB9A\",\"name\":\"dan\",\"deleted\":false,\"status\":null,\"color\":\"db3150\",\"real_name\":\"Dan Held\",\"skype\":null,\"phone\":null,\"tz\":\"America\\/Los_Angeles\",\"tz_label\":\"Pacific Standard Time\",\"tz_offset\":-28800,\"profile\":{\"first_name\":\"Dan\",\"last_name\":\"Held\",\"image_24\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-30\\/3313728617_7968458e6e9b9a0ec98e_24.jpg\",\"image_32\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-30\\/3313728617_7968458e6e9b9a0ec98e_32.jpg\",\"image_48\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-30\\/3313728617_7968458e6e9b9a0ec98e_48.jpg\",\"image_72\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-30\\/3313728617_7968458e6e9b9a0ec98e_72.jpg\",\"image_192\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-30\\/3313728617_7968458e6e9b9a0ec98e_192.jpg\",\"image_original\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-30\\/3313728617_7968458e6e9b9a0ec98e_original.jpg\",\"real_name\":\"Dan Held\",\"real_name_normalized\":\"Dan Held\",\"email\":\"dan@changetip.com\"},\"is_admin\":false,\"is_owner\":false,\"is_primary_owner\":false,\"is_restricted\":false,\"is_ultra_restricted\":false,\"is_bot\":false},{\"id\":\"U02SMJTKL\",\"name\":\"jason\",\"deleted\":false,\"status\":null,\"color\":\"4cc091\",\"real_name\":\"Jason Weaver\",\"skype\":null,\"phone\":null,\"tz\":\"America\\/Chicago\",\"tz_label\":\"Central Standard Time\",\"tz_offset\":-21600,\"profile\":{\"first_name\":\"Jason\",\"last_name\":\"Weaver\",\"real_name\":\"Jason Weaver\",\"real_name_normalized\":\"Jason Weaver\",\"email\":\"indyplanets@gmail.com\",\"image_24\":\"https:\\/\\/secure.gravatar.com\\/avatar\\/87a488ffbf1a882a6de0fa3415a96bea.jpg?s=24&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F8390%2Fimg%2Favatars%2Fava_0009-24.png\",\"image_32\":\"https:\\/\\/secure.gravatar.com\\/avatar\\/87a488ffbf1a882a6de0fa3415a96bea.jpg?s=32&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F8390%2Fimg%2Favatars%2Fava_0009-32.png\",\"image_48\":\"https:\\/\\/secure.gravatar.com\\/avatar\\/87a488ffbf1a882a6de0fa3415a96bea.jpg?s=48&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F8390%2Fimg%2Favatars%2Fava_0009-48.png\",\"image_72\":\"https:\\/\\/secure.gravatar.com\\/avatar\\/87a488ffbf1a882a6de0fa3415a96bea.jpg?s=72&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F8390%2Fimg%2Favatars%2Fava_0009-72.png\",\"image_192\":\"https:\\/\\/secure.gravatar.com\\/avatar\\/87a488ffbf1a882a6de0fa3415a96bea.jpg?s=192&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F8390%2Fimg%2Favatars%2Fava_0009.png\"},\"is_admin\":false,\"is_owner\":false,\"is_primary_owner\":false,\"is_restricted\":false,\"is_ultra_restricted\":false,\"is_bot\":false},{\"id\":\"U02KL14DJ\",\"name\":\"jessedhillon\",\"deleted\":true,\"profile\":{\"first_name\":\"Jesse\",\"last_name\":\"Dhillon\",\"title\":\"\",\"skype\":\"jessedhillonCA\",\"phone\":\"9165018642\",\"image_24\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-15\\/2666058428_24.jpg\",\"image_32\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-15\\/2666058428_32.jpg\",\"image_48\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-15\\/2666058428_48.jpg\",\"image_72\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-15\\/2666058428_72.jpg\",\"image_192\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-15\\/2666058428_192.jpg\",\"image_original\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-15\\/2666058428_original.jpg\",\"real_name\":\"Jesse Dhillon\",\"real_name_normalized\":\"Jesse Dhillon\",\"email\":\"jesse@changetip.com\"}},{\"id\":\"U02KFFY7G\",\"name\":\"jimlyndon\",\"deleted\":false,\"status\":null,\"color\":\"4bbe2e\",\"real_name\":\"jim lyndon\",\"skype\":\"jllyndon\",\"phone\":null,\"tz\":\"America\\/Los_Angeles\",\"tz_label\":\"Pacific Standard Time\",\"tz_offset\":-28800,\"profile\":{\"first_name\":\"jim\",\"last_name\":\"lyndon\",\"image_24\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-14\\/2661071637_24.jpg\",\"image_32\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-14\\/2661071637_32.jpg\",\"image_48\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-14\\/2661071637_48.jpg\",\"image_72\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-14\\/2661071637_72.jpg\",\"image_192\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-14\\/2661071637_72.jpg\",\"image_original\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-14\\/2661071637_original.jpg\",\"skype\":\"jllyndon\",\"title\":\"Software engineer\",\"real_name\":\"jim lyndon\",\"real_name_normalized\":\"jim lyndon\",\"email\":\"jim@changetip.com\"},\"is_admin\":false,\"is_owner\":false,\"is_primary_owner\":false,\"is_restricted\":false,\"is_ultra_restricted\":false,\"is_bot\":false},{\"id\":\"U02KHBPB1\",\"name\":\"johnq\",\"deleted\":false,\"status\":null,\"color\":\"3c989f\",\"real_name\":\"John Q\",\"skype\":\"\",\"phone\":\"\",\"tz\":\"America\\/Los_Angeles\",\"tz_label\":\"Pacific Standard Time\",\"tz_offset\":-28800,\"profile\":{\"first_name\":\"John\",\"last_name\":\"Q\",\"title\":\"\",\"skype\":\"\",\"phone\":\"\",\"real_name\":\"John Q\",\"real_name_normalized\":\"John Q\",\"email\":\"john.q@changetip.com\",\"image_24\":\"https:\\/\\/secure.gravatar.com\\/avatar\\/32b057923653f2d833322feb4a533a98.jpg?s=24&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F8390%2Fimg%2Favatars%2Fava_0016-24.png\",\"image_32\":\"https:\\/\\/secure.gravatar.com\\/avatar\\/32b057923653f2d833322feb4a533a98.jpg?s=32&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F8390%2Fimg%2Favatars%2Fava_0016-32.png\",\"image_48\":\"https:\\/\\/secure.gravatar.com\\/avatar\\/32b057923653f2d833322feb4a533a98.jpg?s=48&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F8390%2Fimg%2Favatars%2Fava_0016-48.png\",\"image_72\":\"https:\\/\\/secure.gravatar.com\\/avatar\\/32b057923653f2d833322feb4a533a98.jpg?s=72&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F8390%2Fimg%2Favatars%2Fava_0016-72.png\",\"image_192\":\"https:\\/\\/secure.gravatar.com\\/avatar\\/32b057923653f2d833322feb4a533a98.jpg?s=192&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F8390%2Fimg%2Favatars%2Fava_0016.png\"},\"is_admin\":true,\"is_owner\":true,\"is_primary_owner\":false,\"is_restricted\":false,\"is_ultra_restricted\":false,\"is_bot\":false},{\"id\":\"U02KP45JK\",\"name\":\"kambash\",\"deleted\":true,\"profile\":{\"first_name\":\"Kate\",\"last_name\":\"Ambash\",\"skype\":\"kambash\",\"title\":\"\",\"phone\":\"617-872-1461\",\"real_name\":\"Kate Ambash\",\"real_name_normalized\":\"Kate Ambash\",\"email\":\"kate.ambash@gmail.com\",\"image_24\":\"https:\\/\\/secure.gravatar.com\\/avatar\\/8690c066f7ab1bb4b091ae3b9eb0135c.jpg?s=24&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F8390%2Fimg%2Favatars%2Fava_0016-24.png\",\"image_32\":\"https:\\/\\/secure.gravatar.com\\/avatar\\/8690c066f7ab1bb4b091ae3b9eb0135c.jpg?s=32&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F8390%2Fimg%2Favatars%2Fava_0016-32.png\",\"image_48\":\"https:\\/\\/secure.gravatar.com\\/avatar\\/8690c066f7ab1bb4b091ae3b9eb0135c.jpg?s=48&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F8390%2Fimg%2Favatars%2Fava_0016-48.png\",\"image_72\":\"https:\\/\\/secure.gravatar.com\\/avatar\\/8690c066f7ab1bb4b091ae3b9eb0135c.jpg?s=72&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F8390%2Fimg%2Favatars%2Fava_0016-72.png\",\"image_192\":\"https:\\/\\/secure.gravatar.com\\/avatar\\/8690c066f7ab1bb4b091ae3b9eb0135c.jpg?s=192&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F8390%2Fimg%2Favatars%2Fava_0016.png\"}},{\"id\":\"U02SS4CDN\",\"name\":\"karla\",\"deleted\":false,\"status\":null,\"color\":\"9b3b45\",\"real_name\":\"Karla Salvatore Caveness\",\"skype\":\"\",\"phone\":\"\",\"tz\":\"America\\/Phoenix\",\"tz_label\":\"Mountain Standard Time\",\"tz_offset\":-25200,\"profile\":{\"first_name\":\"Karla\",\"last_name\":\"Salvatore Caveness\",\"title\":\"\",\"skype\":\"\",\"phone\":\"\",\"real_name\":\"Karla Salvatore Caveness\",\"real_name_normalized\":\"Karla Salvatore Caveness\",\"email\":\"karla@changetip.com\",\"image_24\":\"https:\\/\\/secure.gravatar.com\\/avatar\\/e415d0652d5d8d6db530623164adeb8c.jpg?s=24&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F8390%2Fimg%2Favatars%2Fava_0018-24.png\",\"image_32\":\"https:\\/\\/secure.gravatar.com\\/avatar\\/e415d0652d5d8d6db530623164adeb8c.jpg?s=32&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F8390%2Fimg%2Favatars%2Fava_0018-32.png\",\"image_48\":\"https:\\/\\/secure.gravatar.com\\/avatar\\/e415d0652d5d8d6db530623164adeb8c.jpg?s=48&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F20655%2Fimg%2Favatars%2Fava_0018-48.png\",\"image_72\":\"https:\\/\\/secure.gravatar.com\\/avatar\\/e415d0652d5d8d6db530623164adeb8c.jpg?s=72&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F8390%2Fimg%2Favatars%2Fava_0018-72.png\",\"image_192\":\"https:\\/\\/secure.gravatar.com\\/avatar\\/e415d0652d5d8d6db530623164adeb8c.jpg?s=192&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F8390%2Fimg%2Favatars%2Fava_0018.png\"},\"is_admin\":true,\"is_owner\":false,\"is_primary_owner\":false,\"is_restricted\":false,\"is_ultra_restricted\":false,\"is_bot\":false},{\"id\":\"U02PEMZ0X\",\"name\":\"kristinay\",\"deleted\":true,\"profile\":{\"first_name\":\"Kristina\",\"last_name\":\"Yee\",\"title\":\"Marketing, etc. \",\"skype\":\"\",\"phone\":\"\",\"image_24\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-11-18\\/3032864087_5695f76b68df97356604_24.jpg\",\"image_32\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-11-18\\/3032864087_5695f76b68df97356604_32.jpg\",\"image_48\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-11-18\\/3032864087_5695f76b68df97356604_48.jpg\",\"image_72\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-11-18\\/3032864087_5695f76b68df97356604_72.jpg\",\"image_192\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-11-18\\/3032864087_5695f76b68df97356604_192.jpg\",\"image_original\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-11-18\\/3032864087_5695f76b68df97356604_original.jpg\",\"real_name\":\"Kristina Yee\",\"real_name_normalized\":\"Kristina Yee\",\"email\":\"kristina@changetip.com\"}},{\"id\":\"U037FNWQN\",\"name\":\"kyle\",\"deleted\":false,\"status\":null,\"color\":\"9e3997\",\"real_name\":\"Kyle Kemper\",\"skype\":null,\"phone\":null,\"tz\":\"America\\/Indiana\\/Indianapolis\",\"tz_label\":\"Eastern Standard Time\",\"tz_offset\":-18000,\"profile\":{\"first_name\":\"Kyle\",\"last_name\":\"Kemper\",\"image_24\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-18\\/3252618693_cc7284da147e70a26588_24.jpg\",\"image_32\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-18\\/3252618693_cc7284da147e70a26588_32.jpg\",\"image_48\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-18\\/3252618693_cc7284da147e70a26588_48.jpg\",\"image_72\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-18\\/3252618693_cc7284da147e70a26588_72.jpg\",\"image_192\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-18\\/3252618693_cc7284da147e70a26588_192.jpg\",\"image_original\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-18\\/3252618693_cc7284da147e70a26588_original.jpg\",\"real_name\":\"Kyle Kemper\",\"real_name_normalized\":\"Kyle Kemper\",\"email\":\"kylejjkemper@gmail.com\"},\"is_admin\":false,\"is_owner\":false,\"is_primary_owner\":false,\"is_restricted\":false,\"is_ultra_restricted\":false,\"is_bot\":false},{\"id\":\"U03982HUJ\",\"name\":\"maxfangx\",\"deleted\":false,\"status\":null,\"color\":\"53b759\",\"real_name\":\"Max Fang\",\"skype\":\"MaxFangX\",\"phone\":\"5106293264\",\"tz\":\"America\\/Chicago\",\"tz_label\":\"Central Standard Time\",\"tz_offset\":-21600,\"profile\":{\"first_name\":\"Max\",\"last_name\":\"Fang\",\"image_24\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-30\\/3313107177_253b04dc1761d85267e0_24.jpg\",\"image_32\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-30\\/3313107177_253b04dc1761d85267e0_32.jpg\",\"image_48\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-30\\/3313107177_253b04dc1761d85267e0_48.jpg\",\"image_72\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-30\\/3313107177_253b04dc1761d85267e0_72.jpg\",\"image_192\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-30\\/3313107177_253b04dc1761d85267e0_192.jpg\",\"image_original\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-30\\/3313107177_253b04dc1761d85267e0_original.jpg\",\"skype\":\"MaxFangX\",\"phone\":\"5106293264\",\"real_name\":\"Max Fang\",\"real_name_normalized\":\"Max Fang\",\"email\":\"maxfangx@gmail.com\"},\"is_admin\":false,\"is_owner\":false,\"is_primary_owner\":false,\"is_restricted\":false,\"is_ultra_restricted\":false,\"is_bot\":false},{\"id\":\"U02KFERBE\",\"name\":\"nick\",\"deleted\":false,\"status\":null,\"color\":\"9f69e7\",\"real_name\":\"Nick Sullivan\",\"skype\":null,\"phone\":null,\"tz\":\"America\\/Los_Angeles\",\"tz_label\":\"Pacific Standard Time\",\"tz_offset\":-28800,\"profile\":{\"first_name\":\"Nick\",\"last_name\":\"Sullivan\",\"real_name\":\"Nick Sullivan\",\"real_name_normalized\":\"Nick Sullivan\",\"email\":\"nick@changetip.com\",\"image_24\":\"https:\\/\\/secure.gravatar.com\\/avatar\\/9520bf972d96107434c714a8eb13cd55.jpg?s=24&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F8390%2Fimg%2Favatars%2Fava_0025-24.png\",\"image_32\":\"https:\\/\\/secure.gravatar.com\\/avatar\\/9520bf972d96107434c714a8eb13cd55.jpg?s=32&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F8390%2Fimg%2Favatars%2Fava_0025-32.png\",\"image_48\":\"https:\\/\\/secure.gravatar.com\\/avatar\\/9520bf972d96107434c714a8eb13cd55.jpg?s=48&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F8390%2Fimg%2Favatars%2Fava_0025-48.png\",\"image_72\":\"https:\\/\\/secure.gravatar.com\\/avatar\\/9520bf972d96107434c714a8eb13cd55.jpg?s=72&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F8390%2Fimg%2Favatars%2Fava_0025-72.png\",\"image_192\":\"https:\\/\\/secure.gravatar.com\\/avatar\\/9520bf972d96107434c714a8eb13cd55.jpg?s=192&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F8390%2Fimg%2Favatars%2Fava_0025.png\"},\"is_admin\":true,\"is_owner\":true,\"is_primary_owner\":true,\"is_restricted\":false,\"is_ultra_restricted\":false,\"is_bot\":false},{\"id\":\"U02L4T7HA\",\"name\":\"pilgrim1991\",\"deleted\":true,\"profile\":{\"first_name\":\"Andrea\",\"image_24\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-19\\/2683458591_24.jpg\",\"image_32\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-19\\/2683458591_32.jpg\",\"image_48\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-19\\/2683458591_48.jpg\",\"image_72\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-19\\/2683458591_72.jpg\",\"image_192\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-19\\/2683458591_192.jpg\",\"image_original\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-19\\/2683458591_original.jpg\",\"real_name\":\"Andrea\",\"real_name_normalized\":\"Andrea\",\"email\":\"andreamaxinerecto@gmail.com\"}},{\"id\":\"U032ZQHV3\",\"name\":\"richard.kiss\",\"deleted\":false,\"status\":null,\"color\":\"bb86b7\",\"real_name\":\"Richard Kiss\",\"skype\":null,\"phone\":null,\"tz\":\"America\\/Los_Angeles\",\"tz_label\":\"Pacific Standard Time\",\"tz_offset\":-28800,\"profile\":{\"first_name\":\"Richard\",\"last_name\":\"Kiss\",\"real_name\":\"Richard Kiss\",\"real_name_normalized\":\"Richard Kiss\",\"email\":\"richard@changetip.com\",\"image_24\":\"https:\\/\\/secure.gravatar.com\\/avatar\\/d49be8b194b5c7a0502807476b5fd8be.jpg?s=24&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F8390%2Fimg%2Favatars%2Fava_0013-24.png\",\"image_32\":\"https:\\/\\/secure.gravatar.com\\/avatar\\/d49be8b194b5c7a0502807476b5fd8be.jpg?s=32&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F8390%2Fimg%2Favatars%2Fava_0013-32.png\",\"image_48\":\"https:\\/\\/secure.gravatar.com\\/avatar\\/d49be8b194b5c7a0502807476b5fd8be.jpg?s=48&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F8390%2Fimg%2Favatars%2Fava_0013-48.png\",\"image_72\":\"https:\\/\\/secure.gravatar.com\\/avatar\\/d49be8b194b5c7a0502807476b5fd8be.jpg?s=72&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F8390%2Fimg%2Favatars%2Fava_0013-72.png\",\"image_192\":\"https:\\/\\/secure.gravatar.com\\/avatar\\/d49be8b194b5c7a0502807476b5fd8be.jpg?s=192&d=https%3A%2F%2Fslack.global.ssl.fastly.net%2F8390%2Fimg%2Favatars%2Fava_0013.png\"},\"is_admin\":false,\"is_owner\":false,\"is_primary_owner\":false,\"is_restricted\":false,\"is_ultra_restricted\":false,\"is_bot\":false},{\"id\":\"U02KH10ET\",\"name\":\"sarahhagstrom\",\"deleted\":false,\"status\":null,\"color\":\"e7392d\",\"real_name\":\"Sarah Hagstrom\",\"skype\":\"sarah.hagstrom\",\"phone\":null,\"tz\":\"America\\/Chicago\",\"tz_label\":\"Central Standard Time\",\"tz_offset\":-21600,\"profile\":{\"first_name\":\"Sarah\",\"last_name\":\"Hagstrom\",\"skype\":\"sarah.hagstrom\",\"title\":\"Robot whisperer\",\"image_24\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-15\\/2663823499_24.jpg\",\"image_32\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-15\\/2663823499_32.jpg\",\"image_48\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-15\\/2663823499_48.jpg\",\"image_72\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-15\\/2663823499_72.jpg\",\"image_192\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-15\\/2663823499_192.jpg\",\"image_original\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-09-15\\/2663823499_original.jpg\",\"real_name\":\"Sarah Hagstrom\",\"real_name_normalized\":\"Sarah Hagstrom\",\"email\":\"sarah@changetip.com\"},\"is_admin\":false,\"is_owner\":false,\"is_primary_owner\":false,\"is_restricted\":false,\"is_ultra_restricted\":false,\"is_bot\":false},{\"id\":\"U036V3LJT\",\"name\":\"steve\",\"deleted\":false,\"status\":null,\"color\":\"235e5b\",\"real_name\":\"Steve Sobel\",\"skype\":\"honestbleeps\",\"phone\":\"\",\"tz\":\"America\\/Chicago\",\"tz_label\":\"Central Standard Time\",\"tz_offset\":-21600,\"profile\":{\"first_name\":\"Steve\",\"last_name\":\"Sobel\",\"title\":\"\",\"skype\":\"honestbleeps\",\"phone\":\"\",\"image_24\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-16\\/3233699835_0e80a23ee986090598ee_24.jpg\",\"image_32\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-16\\/3233699835_0e80a23ee986090598ee_32.jpg\",\"image_48\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-16\\/3233699835_0e80a23ee986090598ee_48.jpg\",\"image_72\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-16\\/3233699835_0e80a23ee986090598ee_72.jpg\",\"image_192\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-16\\/3233699835_0e80a23ee986090598ee_72.jpg\",\"image_original\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-16\\/3233699835_0e80a23ee986090598ee_original.jpg\",\"real_name\":\"Steve Sobel\",\"real_name_normalized\":\"Steve Sobel\",\"email\":\"steve@changetip.com\"},\"is_admin\":false,\"is_owner\":false,\"is_primary_owner\":false,\"is_restricted\":false,\"is_ultra_restricted\":false,\"is_bot\":false},{\"id\":\"U02RQ2P0K\",\"name\":\"victoria\",\"deleted\":false,\"status\":null,\"color\":\"df3dc0\",\"real_name\":\"Victoria van Eyk\",\"skype\":\"toriborealis\",\"phone\":\"6138988674\",\"tz\":\"America\\/Indiana\\/Indianapolis\",\"tz_label\":\"Eastern Standard Time\",\"tz_offset\":-18000,\"profile\":{\"first_name\":\"Victoria\",\"last_name\":\"van Eyk\",\"title\":\"VP of Community Development\",\"skype\":\"toriborealis\",\"phone\":\"6138988674\",\"image_24\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-10-26\\/2875427600_24.jpg\",\"image_32\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-10-26\\/2875427600_32.jpg\",\"image_48\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-10-26\\/2875427600_48.jpg\",\"image_72\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-10-26\\/2875427600_72.jpg\",\"image_192\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-10-26\\/2875427600_192.jpg\",\"image_original\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-10-26\\/2875427600_original.jpg\",\"real_name\":\"Victoria van Eyk\",\"real_name_normalized\":\"Victoria van Eyk\",\"email\":\"victoria@changetip.com\"},\"is_admin\":true,\"is_owner\":false,\"is_primary_owner\":false,\"is_restricted\":false,\"is_ultra_restricted\":false,\"is_bot\":false},{\"id\":\"U033N951H\",\"name\":\"zara\",\"deleted\":false,\"status\":null,\"color\":\"5a4592\",\"real_name\":\"Zara Rufo\",\"skype\":\"zaxit14\",\"phone\":\"\",\"tz\":\"Asia\\/Ulaanbaatar\",\"tz_label\":\"Ulaanbaatar Time\",\"tz_offset\":28800,\"profile\":{\"first_name\":\"Zara\",\"last_name\":\"Rufo\",\"title\":\"\",\"skype\":\"zaxit14\",\"phone\":\"\",\"image_24\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-03\\/3132559268_66df6e835c0d59a50a56_24.jpg\",\"image_32\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-03\\/3132559268_66df6e835c0d59a50a56_32.jpg\",\"image_48\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-03\\/3132559268_66df6e835c0d59a50a56_48.jpg\",\"image_72\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-03\\/3132559268_66df6e835c0d59a50a56_72.jpg\",\"image_192\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-03\\/3132559268_66df6e835c0d59a50a56_192.jpg\",\"image_original\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-03\\/3132559268_66df6e835c0d59a50a56_original.jpg\",\"real_name\":\"Zara Rufo\",\"real_name_normalized\":\"Zara Rufo\",\"email\":\"support@changetip.com\"},\"is_admin\":false,\"is_owner\":false,\"is_primary_owner\":false,\"is_restricted\":false,\"is_ultra_restricted\":false,\"is_bot\":false},{\"id\":\"USLACKBOT\",\"name\":\"slackbot\",\"deleted\":false,\"status\":null,\"color\":\"757575\",\"real_name\":\"Slack Bot\",\"skype\":null,\"phone\":null,\"tz\":null,\"tz_label\":\"Pacific Standard Time\",\"tz_offset\":-28800,\"profile\":{\"first_name\":\"Slack\",\"last_name\":\"Bot\",\"image_24\":\"https:\\/\\/slack-assets2.s3-us-west-2.amazonaws.com\\/10068\\/img\\/slackbot_24.png\",\"image_32\":\"https:\\/\\/slack-assets2.s3-us-west-2.amazonaws.com\\/10068\\/img\\/slackbot_32.png\",\"image_48\":\"https:\\/\\/slack-assets2.s3-us-west-2.amazonaws.com\\/10068\\/img\\/slackbot_48.png\",\"image_72\":\"https:\\/\\/slack-assets2.s3-us-west-2.amazonaws.com\\/10068\\/img\\/slackbot_72.png\",\"image_192\":\"https:\\/\\/slack-assets2.s3-us-west-2.amazonaws.com\\/10068\\/img\\/slackbot_192.png\",\"real_name\":\"Slack Bot\",\"real_name_normalized\":\"Slack Bot\",\"email\":null},\"is_admin\":false,\"is_owner\":false,\"is_primary_owner\":false,\"is_restricted\":false,\"is_ultra_restricted\":false,\"is_bot\":false}],\"bots\":[{\"id\":\"B0325P542\",\"name\":\"asana\",\"deleted\":false,\"icons\":{\"image_48\":\"https:\\/\\/slack.global.ssl.fastly.net\\/31009\\/plugins\\/asana\\/assets\\/bot_48.png\"}},{\"id\":\"B038VHD25\",\"name\":\"changetip-bot\",\"deleted\":false,\"icons\":{\"image_36\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-29\\/3303814293_4ce0ab49a741fad995f5_36.jpg\",\"image_48\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-29\\/3303814293_4ce0ab49a741fad995f5_48.jpg\",\"image_72\":\"https:\\/\\/s3-us-west-2.amazonaws.com\\/slack-files2\\/avatars\\/2014-12-29\\/3303814293_4ce0ab49a741fad995f5_72.jpg\"}},{\"id\":\"B02KEE835\",\"name\":\"circleci\",\"deleted\":false,\"icons\":{\"image_48\":\"https:\\/\\/slack.global.ssl.fastly.net\\/20653\\/img\\/services\\/circleci_48.png\"}},{\"id\":\"B038LK1EC\",\"name\":\"giphy\",\"deleted\":false,\"icons\":{\"image_48\":\"https:\\/\\/slack.global.ssl.fastly.net\\/24853\\/plugins\\/giphy\\/assets\\/bot_48.png\"}},{\"id\":\"B02KEEARX\",\"name\":\"github\",\"deleted\":false,\"icons\":{\"image_48\":\"https:\\/\\/slack.global.ssl.fastly.net\\/30301\\/plugins\\/github\\/assets\\/bot_48.png\"}},{\"id\":\"B02KEEDTP\",\"name\":\"hangouts\",\"deleted\":false,\"icons\":{\"image_48\":\"https:\\/\\/slack.global.ssl.fastly.net\\/11591\\/img\\/services\\/hangouts_48.png\"}},{\"id\":\"B02KEEEQH\",\"name\":\"mailchimp\",\"deleted\":false,\"icons\":{\"image_48\":\"https:\\/\\/slack.global.ssl.fastly.net\\/20653\\/img\\/services\\/mailchimp_48.png\"}},{\"id\":\"B02KZNH88\",\"name\":\"mailchimp\",\"deleted\":false,\"icons\":{\"image_48\":\"https:\\/\\/slack.global.ssl.fastly.net\\/20653\\/img\\/services\\/mailchimp_48.png\"}},{\"id\":\"B0396JLNG\",\"name\":\"outgoing-webhook\",\"deleted\":false,\"icons\":{\"image_48\":\"https:\\/\\/slack.global.ssl.fastly.net\\/12078\\/img\\/services\\/outgoing-webhook_48.png\"}},{\"id\":\"B02KEEF6K\",\"name\":\"Pingdom\",\"deleted\":false,\"icons\":{\"image_48\":\"https:\\/\\/slack.global.ssl.fastly.net\\/20653\\/img\\/services\\/pingdom_48.png\"}},{\"id\":\"B0325V7PG\",\"name\":\"Sentry\",\"deleted\":false,\"icons\":{\"image_48\":\"https:\\/\\/slack.global.ssl.fastly.net\\/17635\\/img\\/services\\/sentry_48.png\"}},{\"id\":\"B038QT5PV\",\"name\":\"Sentry\",\"deleted\":false,\"icons\":{\"image_48\":\"https:\\/\\/slack.global.ssl.fastly.net\\/17635\\/img\\/services\\/sentry_48.png\"}},{\"id\":\"B038NHSF5\",\"name\":\"slackbot\",\"deleted\":false,\"icons\":{\"image_48\":\"https:\\/\\/slack.global.ssl.fastly.net\\/20492\\/plugins\\/slackbot\\/assets\\/bot_48.png\"}},{\"id\":\"B032CBQPF\",\"name\":\"slash-commands\",\"deleted\":false,\"icons\":{\"image_48\":\"https:\\/\\/slack.global.ssl.fastly.net\\/23267\\/plugins\\/slash_commands\\/assets\\/bot_48.png\"}},{\"id\":\"B032DUK0Y\",\"name\":\"slash-commands\",\"deleted\":false,\"icons\":{\"image_48\":\"https:\\/\\/slack.global.ssl.fastly.net\\/23267\\/plugins\\/slash_commands\\/assets\\/bot_48.png\"}},{\"id\":\"B0389EGEW\",\"name\":\"twitter\",\"deleted\":false,\"icons\":{\"image_48\":\"https:\\/\\/slack.global.ssl.fastly.net\\/20653\\/img\\/services\\/twitter_48.png\"}},{\"id\":\"B038PJUAF\",\"name\":\"twitter\",\"deleted\":false,\"icons\":{\"image_48\":\"https:\\/\\/slack.global.ssl.fastly.net\\/20653\\/img\\/services\\/twitter_48.png\"}},{\"id\":\"B02KG0ST8\",\"name\":\"asana\",\"deleted\":true,\"icons\":{\"image_48\":\"https:\\/\\/slack.global.ssl.fastly.net\\/20653\\/img\\/services\\/asana_48.png\"}},{\"id\":\"B02KG1S0Y\",\"name\":\"twitter\",\"deleted\":true,\"icons\":{\"image_48\":\"https:\\/\\/slack.global.ssl.fastly.net\\/20653\\/img\\/services\\/twitter_48.png\"}},{\"id\":\"B02KQ7HR1\",\"name\":\"twitter\",\"deleted\":true,\"icons\":{\"image_48\":\"https:\\/\\/slack.global.ssl.fastly.net\\/20653\\/img\\/services\\/twitter_48.png\"}},{\"id\":\"B038VAR8T\",\"name\":\"incoming-webhook\",\"deleted\":true,\"icons\":{\"image_48\":\"https:\\/\\/slack.global.ssl.fastly.net\\/12078\\/img\\/services\\/incoming-webhook_48.png\"}},{\"id\":\"B02PHDDTU\",\"name\":\"slash-commands\",\"deleted\":true,\"icons\":{\"image_48\":\"https:\\/\\/slack.global.ssl.fastly.net\\/23267\\/plugins\\/slash_commands\\/assets\\/bot_48.png\"}},{\"id\":\"B0377JE5E\",\"name\":\"slash-commands\",\"deleted\":true,\"icons\":{\"image_48\":\"https:\\/\\/slack.global.ssl.fastly.net\\/23267\\/plugins\\/slash_commands\\/assets\\/bot_48.png\"}},{\"id\":\"B0377FAE1\",\"name\":\"slash-commands\",\"deleted\":true,\"icons\":{\"image_48\":\"https:\\/\\/slack.global.ssl.fastly.net\\/23267\\/plugins\\/slash_commands\\/assets\\/bot_48.png\"}},{\"id\":\"B038YNPAX\",\"name\":\"outgoing-webhook\",\"deleted\":true,\"icons\":{\"image_48\":\"https:\\/\\/slack.global.ssl.fastly.net\\/12078\\/img\\/services\\/outgoing-webhook_48.png\"}}],\"svn_rev\":\"32015\",\"min_svn_rev\":31589,\"cache_version\":\"v1-dog\"}');
	
	// client boot data
		

//-->
</script>	
			
	
	<!-- output_js "core" -->
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/28007/js/libs_jquery-2.1.1_1414000604.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/28787/js/libs_bootstrap_plastic_1415154507.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/10860/js/libs_flash_detect_1381167216.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/13459/js/libs_fastclick_1386624392.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/26610/js/libs_headroom_1412189418.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/31109/js/plastic_1418348819.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/11842/js/libs_soundmanager2_1383085430.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/30695/js/libs_bowser_1417799155.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/503/js/libs_signals_1361923852.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/1305/js/libs_history_1361923867.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/4406/js/libs_cookie_1366239918.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/31531/js/libs_emoji_1419025899.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/26879/js/libs_jquery.chosen_1412620264.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/27520/js/libs_jquery.lazyload_1413386396.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/18990/js/libs_handlebars-v2.0.0_1398281367.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/31541/js/libs_codemirror_1419026077.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/31541/js/codemirror_load_1419026344.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/32003/js/TS_1420238079.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/28512/js/TS.ui_1414701522.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/31913/js/TS.model_1419975787.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/11998/js/libs_spin_1383256342.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/11998/js/libs_ladda_1383256337.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/28235/js/libs_jquery.scrollintoview_1414193366.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/9884/js/libs_jquery.transit_1378853780.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/26505/js/libs_jquery.monkeyScroll_1412031480.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/26627/js/libs_jquery.assorted_1412200589.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/5060/js/libs_jquery.draghover_1367639920.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/28953/js/libs_jquery.autosize_1415386916.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/25627/js/libs_jquery.TS_tabComplete_1410969496.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/31287/js/libs_jquery.TS_tabComplete2_1418756387.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/1389/js/libs_stacktrace_1361923906.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/10445/js/libs_truncate_1380213559.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/504/js/libs_swfobject_1361923915.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/12503/js/libs_web_socket_1384203154.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/5148/js/libs_jquery.imagesloaded_1367960402.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/27271/js/libs_jquery-ui-widget_1412982803.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/31913/js/TS.web_1419975794.js" crossorigin="anonymous"></script>

			<!-- output_js "secondary" -->
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/32013/js/rollup-secondary_required_1420243170.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/31732/js/TS.storage_1419371502.js" crossorigin="anonymous"></script>

		<!-- output_js "regular" -->
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/32004/js/TS.web.comments_1420239036.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/31708/js/TS.web.file_1419356572.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/31541/js/libs_codemirror_1419026077.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://slack.global.ssl.fastly.net/31541/js/codemirror_load_1419026344.js" crossorigin="anonymous"></script>

		<script type="text/javascript">
	<!--
		boot_data.page_needs_custom_emoji = true;
		
		boot_data.file = JSON.parse('{\"id\":\"F039LN0LE\",\"created\":1420255065,\"timestamp\":1420255065,\"name\":\"gistfile1.txt\",\"title\":\"gistfile1.txt\",\"mimetype\":\"text\\/plain\",\"filetype\":\"text\",\"pretty_type\":\"Plain Text\",\"user\":\"U02KFFY7G\",\"editable\":true,\"size\":2726,\"mode\":\"snippet\",\"is_external\":true,\"external_type\":\"unknown\",\"is_public\":false,\"public_url_shared\":false,\"url\":\"https:\\/\\/gist.github.com\\/273fed2e9c0d75a7ec5b#file-gistfile1-txt\",\"url_download\":\"https:\\/\\/gist.github.com\\/273fed2e9c0d75a7ec5b#file-gistfile1-txt\",\"url_private\":\"https:\\/\\/gist.github.com\\/273fed2e9c0d75a7ec5b#file-gistfile1-txt\",\"url_private_download\":\"https:\\/\\/gist.github.com\\/273fed2e9c0d75a7ec5b#file-gistfile1-txt\",\"permalink\":\"https:\\/\\/changecoin.slack.com\\/files\\/jimlyndon\\/F039LN0LE\\/gistfile1.txt\",\"edit_link\":\"https:\\/\\/changecoin.slack.com\\/files\\/jimlyndon\\/F039LN0LE\\/gistfile1.txt\\/edit\",\"preview\":\"\\/\\/ setup casper, and listeners\\nvar base = \\\"https:\\/\\/soundcloud.com\\/\\\";\\nvar x = require(\\\"casper\\\").selectXPath;\\nvar utils = require(\\\"utils\\\");\\nvar c = require(\\\"casper\\\").Casper({\\n    verbose: false,\\n    logLevel: \\\"debug\\\",\\n    pageSettings: {\\n        userAgent: \\\"Mozilla\\/5.0 (X11; Linux x86_64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/28.0.1500.71 Safari\\/537.36\\\",\\n        loadImages: true,\",\"preview_highlight\":\"<div class=\\\"sssh-code\\\"><div class=\\\"sssh-line\\\"><pre>\\/\\/ setup casper, and listeners<\\/pre><\\/div>\\n<div class=\\\"sssh-line\\\"><pre>var base = &quot;https:\\/\\/soundcloud.com\\/&quot;;<\\/pre><\\/div>\\n<div class=\\\"sssh-line\\\"><pre>var x = require(&quot;casper&quot;).selectXPath;<\\/pre><\\/div>\\n<div class=\\\"sssh-line\\\"><pre>var utils = require(&quot;utils&quot;);<\\/pre><\\/div>\\n<div class=\\\"sssh-line\\\"><pre>var c = require(&quot;casper&quot;).Casper({<\\/pre><\\/div>\\n<div class=\\\"sssh-line\\\"><pre>    verbose: false,<\\/pre><\\/div>\\n<div class=\\\"sssh-line\\\"><pre>    logLevel: &quot;debug&quot;,<\\/pre><\\/div>\\n<div class=\\\"sssh-line\\\"><pre>    pageSettings: {<\\/pre><\\/div>\\n<div class=\\\"sssh-line\\\"><pre>        userAgent: &quot;Mozilla\\/5.0 (X11; Linux x86_64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/28.0.1500.71 Safari\\/537.36&quot;,<\\/pre><\\/div>\\n<div class=\\\"sssh-line\\\"><pre>        loadImages: true,<\\/pre><\\/div>\\n<\\/div>\",\"lines\":91,\"lines_more\":81,\"channels\":[],\"groups\":[],\"ims\":[\"D03982HUY\"],\"comments_count\":0}');
		boot_data.file.comments = JSON.parse('[]');

		

		var g_editor;

		$(function(){

			var wrap_long_lines = !!TS.model.code_wrap_long_lines;

			g_editor = CodeMirror(function(elt){
				var content = document.getElementById("file_contents");
				content.parentNode.replaceChild(elt, content);
			}, {
				value: $('#file_contents').text(),
				lineNumbers: true,
				matchBrackets: true,
				indentUnit: 4,
				indentWithTabs: true,
				enterMode: "keep",
				tabMode: "shift",
				viewportMargin: Infinity,
				readOnly: true,
				lineWrapping: wrap_long_lines
			});

			$('#file_preview_wrap_cb').bind('change', function(e) {
				TS.model.code_wrap_long_lines = $(this).prop('checked');
				g_editor.setOption('lineWrapping', TS.model.code_wrap_long_lines);
			})

			$('#file_preview_wrap_cb').prop('checked', wrap_long_lines);

			CodeMirror.switchSlackMode(g_editor, 'text');
		});

		
		$('#file_comment').css('overflow', 'hidden').autogrow();
	//-->
	</script>

			<script type="text/javascript">TS.boot(boot_data);</script>
	<!-- slack-www164 / 2015-01-02 21:28:59 / v32015 -->

</body>
</html>