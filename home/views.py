from django.contrib.auth.decorators import login_required
from django.shortcuts import render

@login_required(login_url="login", redirect_field_name="next")
def home(request):
    if request.method == "GET":
        return render(request, "home.html")