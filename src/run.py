import os
from bot import SoundCloudBot
# CHECK FOR ENVIRONMENT VARIABLES
SOUNDCLOUD_CLIENT_ID = os.getenv("SOUNDCLOUD_CLIENT_ID", "fake_client_id")
assert SOUNDCLOUD_CLIENT_ID != "fake_client_id", "Need to set SOUNDCLOUD_CLIENT_ID environment variable"
SOUNDCLOUD_CLIENT_SECRET = os.getenv("SOUNDCLOUD_CLIENT_SECRET", "fake_client_secret")
assert SOUNDCLOUD_CLIENT_SECRET != "fake_client_secret", "Need to set SOUNDCLOUD_CLIENT_SECRET environment variable"


# GET TIPS
print("Running script")
bot = SoundCloudBot()
tips = bot.check_for_new_tips(None)
print("Tips: " + str(tips))

# SUBMIT TIPS
print("Submitting tips")

#Loop through dictionary of tips and submit each
for index in tips:
	tip = tips[index]
	tip_data = {
		"sender": tip['sender']
		"receiver": tip['receiver']
		"message": tip['message']
		"context_uid": tip['id']
		"meta": {} #TODO add time stamp + other relevant information		
	}
	print(str(tip_data)) #test

	response = bot.send_tip(**tip_data)
	out = ""
	if response.get("error_code") == "invalid_sender":
		out = "Handling invalid_sender"
		bot.invite_new_user(tip_data["sender"])

	print(out)

response = bot.send_tip(**tip_data)
out = ""