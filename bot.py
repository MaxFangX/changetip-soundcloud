import json
import subprocess
import os

from changetip.bots.base import BaseBot
from django.utils.html import strip_tags


class SoundCloudBot(BaseBot):
	changetip_api_key = os.getenv("CHANGETIP_API_KEY", "fake_key")
	assert changetip_api_key != "fake_key", "Need to set CHANGETIP_API_KEY environment variable"

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
        print("running testbot()")
        p = subprocess.Popen(['casperjs', 
                            'scripts/soundcloud_login.js'],
                            stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE)
        out, err = p.communicate()
        info = json.loads(out.decode('utf-8'))
        for index in info:
            info[index]['text'] = strip_tags(info[index]['text']).replace('\n', '')
            info[int(index)] = info.pop(index)
        return info
    
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


#TESTING AREA BELOW

info = {}
out = ''

def testbot():
	print("running testbot()")
	p = subprocess.Popen(['casperjs', 'scripts/soundcloud_login.js'],
				stdout=subprocess.PIPE,
				stderr=subprocess.PIPE)
	global info, out
	out, err = p.communicate()
	info = json.loads(out.decode('utf-8'))
	for index in info:
        #Remove HTML tags from soundcloud text
		info[index]['text'] = strip_tags(info[index]['text']).replace('\n', '')
        #Changes str int indexes to int indexes
		info[int(index)] = info.pop(index) 

	print("Out: ")
	print(out)
	print("Info: ")
	print(info)



