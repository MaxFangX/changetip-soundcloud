import json
import subprocess

from changetip.bots.base import BaseBot


class SoundCloudBot(BaseBot):
	def check_for_new_tips(self):
		pass

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
	print("Out: ")
	print(out)
	print("Info: ")
	print(info)



