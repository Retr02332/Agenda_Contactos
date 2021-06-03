from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.models import User

from users.models import Profile
from login.validations.validate import validate_signup

# checar el schema de la solicitud

@csrf_exempt
def login_page(request):
    if(request.method == "GET"):
        return render(request, "login/login.html", {"action":"login/"})
    else:
        username = request.POST["username"]
        password = request.POST["password"]
        
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return redirect("home")
        else:
            return render(request, "login/login.html", {"action":"login/",
                "error":"Error, usuario o contraseña invalidos"
            })

@csrf_exempt
def register_page(request):
    if(request.method == "GET"):
        return render(request, "login/signup.html", {"action":"signup/"})
    else:
        username = request.POST["username"]
        email = request.POST["email"]
        password = request.POST["password"]
        confirm_password = request.POST["confirm_password"]

        status = validate_signup(username, password, confirm_password)

        if(status == "ok"):
            user = User.objects.create_user(username=username, email=email, password=password)
            profile = Profile(user=user)
            profile.save()
            return redirect("login")
        else:
            if(status == "invalid_password"):
                return render(request, "login/signup.html", {"action":"signup/", 
                "error":"Error, confirmación de contraseña invalida"
            })
            elif(status == "invalid_username"):
                return render(request, "login/signup.html", {"action":"signup/", 
                "error":"Error, el usuario debe tener una longitud entre [1-10]"
            })

@login_required(login_url="login")
def logout_page(request):
    logout(request)
    return redirect("login")