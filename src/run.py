from bot import SoundCloudBot

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