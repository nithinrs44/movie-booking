from django.urls import path
from . import views

urlpatterns = [
    path('register',views.register,name='register'),
    path('login', views.login, name='login'),
    path('create',views.add_movie,name='addmovie'),
    path('list',views.list_movies,name='listmoie'),
    path('update/<int:pk>',views.update_movie,name='updatemovie'),
    path('<int:pk>/delete', views.delete_movie, name='deletemovie'),
    path('search/<str:query_date>',views.search,name='search'),
    path('book',views.book_ticket,name='book_ticket'),
    path('logout', views.logout, name='logout'),
    path('disable/<int:pk>', views.disable_movie_show, name='disable'),
    path('view/<int:pk>', views.view_movie, name='view'),
    path('viewuser', views.view, name='viewuser'),
    path('api/initiate-payment/', views.initiate_payment, name='initiate_payment'),
    path('api/handle-payment/', views.handle_payment, name='handle_payment'),
    path('booking',views.my_bookings,name='booking'),
    path('email/<int:pk>',views.send_email,name='email'),
    path('showtimes/<int:movie_id>/', views.get_showtimes_for_movie, name='get_showtimes_for_movie'),
]