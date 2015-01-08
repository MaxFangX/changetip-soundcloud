import subprocess, time

from changetip.bots.base import BaseBot


class SoundCloudBot(BaseBot):
	def check_for_new_tips(self):
		pass

#TESTING AREA BELOW

out = ''

def testbot():
	p = subprocess.Popen(['casperjs', 'scripts/soundcloud_login.js'],
				stdout=subprocess.PIPE,
				stderr=subprocess.PIPE)
	print("starting sleep")
	time.sleep(10)
	print("ending sleep")
	global out
	out, err = p.communicate()
	
	print(out)



