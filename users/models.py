from django.contrib.auth.models import User
from django.db import models

# http://django-book.blogspot.com/2012/11/modelos-un-modelo-es-la-fuente-unica-y.html
# https://blog.crunchydata.com/blog/extending-djangos-user-model-with-onetoonefield
# https://codigofacilito.com/articulos/django-user-model

class Profile(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    biography = models.TextField(blank=True, null=True)
    phone_number = models.CharField(unique=True, max_length=15, blank=True, null=True)
    profile_picture = models.ImageField(
        upload_to="users/pictures", 
        blank=True, 
        null=True
    )
    created  = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username