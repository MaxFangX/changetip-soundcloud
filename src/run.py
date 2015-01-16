import os
from bot import SoundCloudBot
from bot import DuplicateTipException

#Reference values
info_url = "https://www.changetip.com/tip-online/soundcloud" 
#TODO make sure this is supported by the site

# GET TIPS
print("========Initializing script")
bot = SoundCloudBot()
tips = bot.check_for_new_tips(None)
print("Number of tips found: " + str(len(tips))) #test

#Loop through dictionary of tips and submit each if it is not a duplicate
for index in tips:
	tip = tips[index]
	print("==Processing tip from %s to %s with message'%s'" % (tip['sender'], tip['receiver'], tip['message']))

	out = ""
	try:
		bot.dupecheck(tip['context_uid'])
		print("Submitting tip")
		response = bot.send_tip(**tip)
		if response.get("error_code") == "invalid_sender":
			out = "Handling invalid sender %s" % tip['sender']
			bot.invite_new_user(tip['sender']) #TODO implement
		elif response.get("error_code") == "duplicate_context_uid":
			out = "Duplicate tip %s handled by ChangeTip API" % tip['context_uid']
		elif response.get("state") in ["ok", "accepted"]: #TODO 
			response_tip = response['tip']
			#print("Response Tip: " + str(response['tip'])) #test
			if response_tip['status'] == "out for delivery":
				out = "The tip for %s is out for delivery. %s needs to collect their tip by connecting their ChangeTip account to SoundCloud at %s" % (response_tip['amount_display'], 
											response_tip['receiver'], 
											info_url)
			elif response_tip['status'] == "finished":
				out = "The tip has been delivered, %s has been added to %s's ChangeTip wallet." % (response_tip['amount_display'],
										response_tip['receiver'])
		else:
			# Gets to this if sender == receiver
			# Also gets to this if the output is not recognized.
			#TODO Handle the above cases
			if tip['sender'] == tip['receiver']:
				bot.on_self_send(tip['context_uid'], tip['message'])
				out = "You cannot tip yourself!"
			else:
				out = "Tip format unrecognized"
	except(DuplicateTipException):
		out = "Duplicate tip handled locally"
	print("Tip processed. Output: ") #test
	print(out) #TODO make this a return value for Celery
	print("Replying via comment")
	bot.deliver_tip_response(None)
	print()

