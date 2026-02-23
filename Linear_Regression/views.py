from django.shortcuts import render

def homePage(request):
    return render(request,'index.html')

def about_model(request):
    return render(request,'about.html')