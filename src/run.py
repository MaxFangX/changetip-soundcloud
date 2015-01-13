from bot import SoundCloudBot
print("Running script")
s = SoundCloudBot()
data = s.check_for_new_tips(None)
print("Data: " + str(data))