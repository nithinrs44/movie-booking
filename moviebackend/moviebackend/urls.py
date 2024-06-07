
from django.contrib import admin
from django.urls import path,include
from movie import views

urlpatterns = [
    path('',views.index,name='home'),
    path('admin/', admin.site.urls),
    path('movie/',include('movie.urls')),
    
]



