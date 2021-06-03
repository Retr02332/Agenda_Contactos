from django.shortcuts import render

# Create your views here.

def handler404(request, exception):
    return render(request, "404.html")
