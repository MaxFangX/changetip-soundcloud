import json
import subprocess
import os
import re
import soundcloud

from changetip.bots.base import BaseBot


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

    #Initialize the single SoundCloud client
    client = soundcloud.Client(
        client_id=SOUNDCLOUD_CLIENT_ID,
        client_secret=SOUNDCLOUD_CLIENT_SECRET,
        username=CHANGETIP_BOT_USER,
        password=CHANGETIP_BOT_PASS,
    )
    print("SoundCloud API client initialized")

    channel = "soundcloud"
    username = "maxtipbot"  # username on the site
    prefix = "@"
    last_context_uid = None
    proxy = None

    # How many seconds the bot runner should wait before checking for new tips
    new_tip_check_delay = 30

    def dupecheck(self, context_uid):
        """ Check locally for duplicates before submitting
        Should raise a DuplicateTipException if duplicate is found
        """
        pass #TODO

    def check_for_new_tips(self, last):
        """ Poll the site for new tips. Expected to return an array of tips, in the format passed to send_tip """
        print("Running check_for_new_tips(self, last)") #test
        #TODO better, less breakable data parsing
        p = subprocess.Popen(['casperjs', 
                            '../scripts/soundcloud_login.js'],
                            stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE)
        out, err = p.communicate()
        tips = json.loads(out.decode('utf-8'))
        print("Scraped tips")
        for index in tips:
            print("Processing tip")
            comment = self.client.get('/comments/' + tips[index]['context_uid'])
            comment.raw_data = json.loads(comment.raw_data)
            tips[index].update({
                'sender': comment.raw_data['user']['permalink'],
                'message': comment.raw_data['body'],
            })
            print("Updating meta")
            tips[index]['meta'].update({
                'timestamp': comment.raw_data['created_at'],
                #The millisecond index at which the comment was placed
                'track_index': comment.raw_data['timestamp'],
            })
            #Convert str indexes to ints
            print("Converting str indexes to ints")
            tips[int(index)] = tips.pop(index) 
        print("Finishing check_for_new_tips")
        return tips
    
    # def send_tip(self, sender, receiver, message, context_uid, meta):

    def deliver_tip_response(self, tx):
        """ Does the work to post the response to the thread on the site. Returns True or Exception """
        raise NotImplementedError

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






