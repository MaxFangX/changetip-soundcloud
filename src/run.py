import os
from bot import SoundCloudBot
from bot import CommentFailedException
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
		#Will raise Exception if duplicate, and rest of suite won't run
		bot.dupecheck(tip['context_uid'])
		print("Submitting tip")
		response = bot.send_tip(**tip)
		if response.get("error_code") == "invalid_sender":
			out = "Invalid sender %s" % tip['sender']
			bot.invite_new_user(tip['sender']) #TODO implement
			print("Replying via comment")
			try:
				bot.deliver_tip_response(tip, out)
			except(CommentFailedException):
				out += "\nComment reply failed"
		elif response.get("error_code") == "duplicate_context_uid":
			out = "Duplicate tip %s handled by ChangeTip API" % tip['context_uid']
		elif response.get("state") in ["ok", "accepted"]: #TODO 
			response_tip = response['tip']
			#print("Response Tip: " + str(response['tip'])) #test
			if response_tip['status'] == "out for delivery":
				out = "The tip for %s from @%s is out for delivery. @%s needs to collect their tip by connecting their ChangeTip account to SoundCloud at %s" % (
						response_tip['amount_display'], 
						response_tip['sender'], 
						response_tip['receiver'], 
						info_url)
				print("Replying via comment")
				try:
					bot.deliver_tip_response(tip, out)
				except(CommentFailedException):
					out += "\nComment reply failed"
			elif response_tip['status'] == "finished":
				out = "The tip has been delivered, %s has been added to @%s's ChangeTip wallet." % (response_tip['amount_display'],
										response_tip['receiver'])
				print("Replying via comment")
				try:
					bot.deliver_tip_response(tip, out)
				except(CommentFailedException):
					out += "\nComment reply failed"
		else:
			# Gets to this if sender == receiver
			# Also gets to this if the output is not recognized.
			#TODO Handle the above cases
			if tip['sender'] == tip['receiver']:
				bot.on_self_send(tip['context_uid'], tip['message'])
				out = "You cannot tip yourself!"
				print("Replying via comment")
				try:
					bot.deliver_tip_response(tip, out)
				except(CommentFailedException):
					out += "\n****Comment reply failed"
			else:
				out = "Tip format unrecognized"
				print("Replying via comment")
				# TODO ********* Prevent this from commenting every time
				# try:
				# 	bot.deliver_tip_response(tip, out)
				# except(CommentFailedException):
				# 	out += "\nComment reply failed"
	except(DuplicateTipException):
		out = "Duplicate tip handled locally"
	print("Tip processed. Output: ") #test
	print(out) #TODO make this a return value for Celery

	print()

