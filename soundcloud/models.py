from django.db import models


class SoundCloudUser(models.Model):

    name = models.CharField(max_length=50, db_index=True)
    user_email = models.CharField(max_length=254)
    #TODO verify the max_length of SoundCloud urls
    user_url = models.CharField(max_length=30, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

