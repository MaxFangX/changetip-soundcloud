Linkage between SoundCloud and ChangeCoin technicalities

Connecting to Changetip: 

-User1 logs into Changetip with their SoundCloud account. We will save the email address they have associated with that account as well as their SoundCloud URL, say soundcloud.com/foo

-Thereafter, any tips made on tracks under /foo will automatically be credited to this user

-Suppose User1 decides to change their url to /bar

-Under 99.9% of circumstances this will be okay, because if any new tips are made under their new URL /bar, the url will be unrecognized and the tip prompt User1 to prove that they own the URL by reconnecting to Changetip. The URL saved on Changetip will be updated from /foo to /bar.

-However, if User2 has the URL /bar saved on their account on ChangeTip (even if they have an actual different URL on SoundCloud), they will automatically receive all the tips for User1's tracks automatically, if User1 doesn't refresh their info with Changetip. This could be a problem, since Changetip will have no way to know that the money is going to the wrong account.

-Similarly, if User3 changes their URL to /foo after User1 has changed theirs to bar (while User1 has not updated their information with ChangeTip), User1 will automatically receive the tips intended for User3 if User3 fails to update their information with ChangeTip

Solutions:
1) Have some way to detect if users have changed their URL and make them update with ChangeTip if so
2) Make users verify with ChangeTip for every tip they attempt to collect