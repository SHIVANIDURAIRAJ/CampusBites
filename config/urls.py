from django.contrib import admin
from django.urls import path, include
from .views import home, login_page

urlpatterns = [
    path('', home, name='home'),
    path('login/', login_page, name='login'),
    path('admin/', admin.site.urls),
    path('api/', include('menu.urls')),
]