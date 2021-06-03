from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render
from django.http import JsonResponse

from contacts.validations.validate import validateDataNewContact
from contacts.models import Contact
import json
import re

@login_required(login_url="login")
def newContact(request):
    if request.method == "POST":
        contact = json.loads(request.body)

        email    = contact["email"]
        phone    = contact["phone"]
        username = contact["username"]

        if validateDataNewContact(username, email, phone):
            contact = Contact(owner=request.user,email=email, phone=phone, username=username)
            try:
                contact.save()
            except:
                # Error, dato/datos existentes
                return HttpResponse('', status=403)
            else:
                # Contacto creado
                return HttpResponse('', status=201)
        else:
            # Datos maliciosos/invalidos
            return HttpResponse('', status=500)

@login_required(login_url="login")
def getContacts(request):
    if request.method == "GET":
        allContacts = Contact.objects.filter(owner=request.user).values("username", "email", "phone")
        return JsonResponse(list(allContacts), safe=False)

@login_required(login_url="login")
def deleteContact(request):
    if request.method == "POST":
        users = json.loads(request.body)["users"]
        [Contact.objects.filter(username=user).delete() for user in users]
        return HttpResponse('')
