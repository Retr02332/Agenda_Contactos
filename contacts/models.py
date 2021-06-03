from django.contrib.auth.models import User
from django.db import models
import json

# Create your models here.

class Contact(models.Model):

    owner    = models.ForeignKey(User, on_delete=models.CASCADE)
    email    = models.EmailField(unique=True, blank=True, null=True)
    phone    = models.CharField(unique=True, max_length=10, blank=True, null=True)
    username = models.CharField(unique=True, max_length=15, blank=True, null=True)

    def __str__(self):
        contact = {"email":self.email,"phone":self.phone,"username":self.username}
        return json.dumps(contact)