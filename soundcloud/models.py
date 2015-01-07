from django.db import models


class SoundCloudUser(models.Model):

    name = models.CharField(max_length=50, db_index=True)
    email = models.CharField(max_length=254)
    #TODO verify the max_length of SoundCloud urls
    url = models.CharField(max_length=30, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
    	return "User '"+self.name+"' at soundcloud.com/" + self.url + " with email'"+ self.email + "', created at: " + self.created_at
    	