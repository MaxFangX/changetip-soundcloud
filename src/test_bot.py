import unittest
from bot import SoundCloudBot

class ScrapingTests(unittest.TestCase):

    def TipFormat(self):
    	bot = SoundCloudBot()
    	data = bot.check_for_new_tips(None)
    	#Check to return dictionary
    	self.failIf(type(data) != dict)
    	#Check not blocked by captcha
        self.failIf(data[0]['message'] == 'captcha')

def main():
    unittest.main()

if __name__ == '__main__':
    main()


