from django.shortcuts import render

def home(request):
    return render(request, 'index.html')

def login_page(request):
    return render(request, 'login.html')