from django.db import models


class UserInfo(models.Model):
    name = models.TextField(default="")
    username = models.CharField(default="", max_length=11, unique=True)
    bio = models.TextField(default="")
    password = models.TextField(default="")
    profile_image = models.ImageField(upload_to="user_profile_images")


class Secrets(models.Model):
    secret = models.TextField(default="")
    by = models.TextField(default="")
    at = models.DateTimeField(auto_now=True, blank=True)
