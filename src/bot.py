import json
import subprocess
import os
import re
import soundcloud

from changetip.bots.base import BaseBot
class CommentFailedException(Exception):
    pass

class DuplicateTipException(Exception):
    pass

class HTTPError(Exception):
    pass

class TipAlreadyProcessedException(Exception):
    pass

class OwnCommentException(Exception):
    pass

class SoundCloudBot(BaseBot):
    # CHECK FOR ENVIRONMENT VARIABLES
    changetip_api_key = os.getenv("CHANGETIP_API_KEY", "fake_key")
    SOUNDCLOUD_CLIENT_ID = os.getenv("SOUNDCLOUD_CLIENT_ID", "fake_client_id")
    SOUNDCLOUD_CLIENT_SECRET = os.getenv("SOUNDCLOUD_CLIENT_SECRET", "fake_client_secret")
    CHANGETIP_BOT_USER = os.getenv("CHANGETIP_BOT_USER", "fake_bot_user")
    CHANGETIP_BOT_PASS = os.getenv("CHANGETIP_BOT_PASS", "fake_bot_pass")
    assert changetip_api_key != "fake_key", "Need to set CHANGETIP_API_KEY environment variable"
    assert SOUNDCLOUD_CLIENT_ID != "fake_client_id", "Need to set SOUNDCLOUD_CLIENT_ID environment variable"
    assert SOUNDCLOUD_CLIENT_SECRET != "fake_client_secret", "Need to set SOUNDCLOUD_CLIENT_SECRET environment variable"
    assert CHANGETIP_BOT_USER != "fake_bot_user", "Need to set CHANGETIP_BOT_USER environment variable"
    assert CHANGETIP_BOT_PASS != "fake_bot_pass", "Need to set CHANGETIP_BOT_PASS environment variable"

    channel = "soundcloud"
    username = "maxtipbot"  # username on the site
    prefix = "@"
    last_context_uid = None
    proxy = None

    #Initialize the single SoundCloud client
    client = soundcloud.Client(
        client_id=SOUNDCLOUD_CLIENT_ID,
        client_secret=SOUNDCLOUD_CLIENT_SECRET,
        username=CHANGETIP_BOT_USER,
        password=CHANGETIP_BOT_PASS,
    )
    soundcloud_id = json.loads(client.get('/users/%s' % username).raw_data)['id']
    print("SoundCloud API client initialized")

    # How many seconds the bot runner should wait before checking for new tips
    new_tip_check_delay = 30

    def dupecheck(self, context_uid):
        """ Check locally for duplicates before submitting
        Should raise a DuplicateTipException if duplicate is found
        """
        if self.last_context_uid == None:
            return # Is not duplicate if last_context_uid not initialized
        elif int(context_uid) <= self.last_context_uid:
            raise DuplicateTipException

    def check_for_new_tips(self, last):
        """ Poll the site for new tips. Expected to return an array of tips, in the format passed to send_tip """
        # TODO actually return an array
        print("====Running check_for_new_tips(self, last)") #test
        p = subprocess.Popen(['casperjs', 
                            '../scripts/soundcloud_login.js'],
                            stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE)
        out, err = p.communicate()
        tips = json.loads(out.decode('utf-8'))
        print("Successfully scraped notifications")
        
        remove_tips = [] #Array of indexes of tips to remove if they are invalid
        
        for index in tips: #Convert str index to ints
            tips[int(index)] = tips.pop(index)
        
        print("Making SoundCloud API calls")
        for index in tips:
            try: #Error handling to catch if notification shows up on bot's feed but the comment doesn't actually exist, or simply if API call fails
                
                context_url = tips[index]['meta']['context_url']

                #String parsing for additional values
                context_uid = int(context_url[context_url.rfind('/')+9:])
                track_url = context_url[:context_url.rfind('/')][context_url[:context_url.rfind('/')].rfind('/')+1:]

                #Prevent SoundCloud API calls if tip has already been processed
                if self.last_context_uid != None and context_uid <= self.last_context_uid:
                    raise TipAlreadyProcessedException

                #API Calls + get other values
                comment = self.client.get('/comments/%s' % context_uid)
                comment.raw_data = json.loads(comment.raw_data)

                message = comment.raw_data['body']
                sender = comment.raw_data['user']['permalink']
                sender_avatar = comment.raw_data['user']['avatar_url']
                sender_id = comment.raw_data['user']['id']
                timestamp = comment.raw_data['created_at']
                track_id = comment.raw_data['track_id']
                track_index = comment.raw_data['timestamp']

                #Check if comment is own comment
                if sender_id == self.soundcloud_id:
                    raise OwnCommentException

                track = self.client.get('/tracks/%s' % track_id)
                track.raw_data = json.loads(track.raw_data)
                receiver_id = track.raw_data['user_id']

                #Decide if tip was intended for artist or other user
                regex_output = re.search("\B@([A-Za-z0-9_\-]+)", message.replace(self.prefix + self.username, ""))
                if regex_output == None: #If no other user was mentioned
                    receiver = context_url[23:][:context_url[23:].index('/')]
                else: #If another user was mentioned
                    receiver = regex_output.group(0)[len(self.prefix):]

                #Fill in information
                tips[index].update({
                    'context_uid': context_uid,
                    #ChangeTip API call must have parameters named 'sender' and 'receiver'
                    'sender': sender_id,
                    'receiver': receiver_id,
                    'message': message,
                })
                tips[index]['meta'].update({
                    'sender_display': sender,
                    'receiver_display': receiver,
                    'sender_avatar': sender_avatar,
                    'track_url': track_url,
                    'timestamp': timestamp,
                    'track_id': track_id,
                    #The millisecond index at which the comment was placed
                    'track_index': track_index, 
                })
                print("=Processing comment %s successful" % context_uid)
            except(HTTPError):
                print("********Alert: HTTP request to SoundCloud API for tip %s failed. It may be a deleted tip" % context_uid)
                remove_tips.append(index)
            except(TipAlreadyProcessedException):
                print("Tip %s on %s already processed." % (context_uid, track_url))
                remove_tips.append(index)
            except(OwnCommentException):
                print("Own comment %s detected" % context_uid)
                remove_tips.append(index)

        for index in remove_tips:
            tips.pop(index) #Remove invalid tips

        print("Finished tip data gathering")
        print("Finished check_for_new_tips()")
        return tips
    
    # def send_tip(self, sender, receiver, message, context_uid, meta):

    def deliver_tip_response(self, tx, comment_text):
        """ Does the work to post the response to the thread on the site. Returns True or Exception """
        try:
            comment = self.client.post('/tracks/%s/comments' % tx['meta']['track_id'], 
                comment={
                    'body': comment_text,
                    'timestamp': tx['meta']['track_index']
                })
            return True
        except(Exception):
            raise CommentFailedException

    #def deliver_tip_confirmation(self, tx):

    def invite_new_user(self, sender, **kwargs):
        """ Invite the sender to create an account on ChangeTip
        :param **kwargs:
        """
        pass #TODO

    def missing_amount_message(self, tx, tiplike_text, process=True):
        """ How to interact with the user when there is no amount parsed
        """
        pass #TODO

    def send_tip_reminder(self, tx):
        """ A reminder to the receiver that their tip is about to expire """
        pass #TODO

    def on_over_tip_limit(self, tx, limit, process=True):
        """ How to interact with the user when there is an tip attempt over the limit
        """
        pass #TODO

    # def get_api_url(self, path):

    # def get_mentions(self, message):

    # def get_sibling_tips(self, parent_id):

    def on_self_send(self, tx, tiplike_text, process=True):
        """ Unique method specifying how to interact with the user when they try to send a tip to themselves
        """
        pass #TODO






