import os
from bot import SoundCloudBot
from bot import CommentFailedException
from bot import DuplicateTipException

bot = SoundCloudBot() # Global variables for easier debugging
tips = None

def run():
    global bot, tips # Global variables for easier debugging

    #Reference values
    info_url = "https://www.changetip.com/tip-online/soundcloud" 
    #TODO make sure this is supported by the site

    # GET TIPS
    print("========Initializing script")
    tips = bot.check_for_new_tips(None)
    print("Number of tips found: %s\n" % len(tips)) #test

    #Loop through dictionary of tips and submit each if it is not a duplicate
    for index in tips:
        tip = tips[index]
        print("===Processing tip %s from %s to %s with message\n'%s'" % (tip['context_uid'], tip['sender'], tip['receiver'], tip['message']))

        out = "" #The output for the comment reply and the console

        try:
            #Will raise DuplicateTipException if duplicate, and rest of suite won't run
            bot.dupecheck(tip['context_uid'])
            print("Submitting tip")
            response = bot.send_tip(**tip)
            #If sender hasn't connected their SoundCloud account
            if response.get("error_code") == "invalid_sender":
                out = "Invalid sender %s" % tip['sender']
                bot.invite_new_user(tip['sender']) #TODO implement
                print("Replying via comment")
                try:
                    bot.deliver_tip_response(tip, out)
                except(CommentFailedException):
                    out += "\nComment reply failed"
            #If duplicate tip was sent to ChangeTip API
            elif response.get("error_code") == "duplicate_context_uid":
                out = "Duplicate tip %s handled by ChangeTip API" % tip['context_uid']
                print("No comment made")

               #If tip was accepted
            elif response.get("state") in ["ok", "accepted"]: #TODO 
                response_tip = response['tip']
                #print("Response Tip: " + str(response['tip'])) #test

                #If receiver hasn't connected their SoundCloud account
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

                # If tip was successful
                elif response_tip['status'] == "finished":
                    out = "The tip has been delivered, %s has been added to @%s's ChangeTip wallet." % (response_tip['amount_display'],
                                            response_tip['receiver'])
                    print("Replying via comment")
                    try:
                        bot.deliver_tip_response(tip, out)
                    except(CommentFailedException):
                        out += "\nComment reply failed"
            # If tip is a special/unknown case
            else:
                # If sender == receiver
                if tip['sender'] == tip['receiver']:
                    bot.on_self_send(tip['context_uid'], tip['message'])
                    out = "You cannot tip yourself!"
                    print("Replying via comment")
                    try:
                        bot.deliver_tip_response(tip, out)
                    except(CommentFailedException):
                        out += "\n****Comment reply failed"
                # If the output is not recognized
                else:
                    out = "Tip format unrecognized"
                    print("No comment made")
                    # TODO ********* Prevent this from commenting every time
                    # print("Replying via comment")
                    # try:
                    #     bot.deliver_tip_response(tip, out)
                    # except(CommentFailedException):
                    #     out += "\nComment reply failed"
            print("==Tip processed. Output: ") #test
            print(out) #TODO make this a return value for Celery
        except(DuplicateTipException):
            out = "Duplicate tip handled locally"
            print(out)

        print()

    #Update last_context_uid with highest value
    highest_context_uid = 0
    for index in tips:
        tip = tips[index]
        if int(tip['context_uid']) > highest_context_uid:
            highest_context_uid = int(tip['context_uid'])
    if bot.last_context_uid == None or highest_context_uid > bot.last_context_uid:
        bot.last_context_uid = highest_context_uid
    print("==Updated bot.last_context_uid")

run()

# Comment this out if you only want the script to run once
# while True:
#     run()