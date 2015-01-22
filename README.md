# ChangeTip SoundCloud Bot

[ChangeTip](https://www.changetip.com) is a micropayment infrastructure for the web, enabling tips to be sent over social media. This code allows users to *tip* eachother with [SoundCloud](https://SoundCloud.com/) by making SoundCloud comments.


This repo is currently managed by Max Fang, but is open source for transparency and educational purposes. Pull requests welcomed!

## Tipping
Type `changetip:` at the *beginning* of a message, then mention a @username and an amount.

Examples:

```
@changetip Give @victoria $5 for paying for my lunch
```

```
@changetip Give @jim a high five for the great work he just did
```


Before using ChangeTip, you simply need to connect your SoundCloud account to ChangeTip. It's as simple as saying Hi.


```
@changetip: hi!
```

ChangeTip will respond with instructions on how to hook up your ChangeTip account to SoundCloud.

Note: It only works on public linkes, because the tipping bot must be able to read your comment!

### Support

If you have any questions, or recommendations for new features, we'd like to hear from you - maxfangx@berkeley.edu for now, support@changetip.com once this code is released.

## Contributing

We love pull requests!

#### Installation to run your own copy
Using a python [virtualenv](http://docs.python-guide.org/en/latest/dev/virtualenvs/) is recommended.

This is simple script. It pulls in the [changetip python library](https://pypi.python.org/pypi/changetip). To install the dependencies:

```
$ pip install -r requirements.txt
```

### License
TBA
